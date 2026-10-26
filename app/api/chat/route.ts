import Anthropic from "@anthropic-ai/sdk";
import { createRateLimiter } from "@/lib/rate-limit";
import { createUsageBudget } from "@/lib/chat/budget";
import { CHAT_LIMITS, CHAT_MODEL, chatMode, supportsServerFallback } from "@/lib/chat/config";
import { REDIRECT_REPLY, screenMessage } from "@/lib/chat/guard";
import { estimateCostUsd, totalTokens } from "@/lib/chat/pricing";
import { SYSTEM_PROMPT } from "@/lib/chat/prompt";
import { scriptedReply } from "@/lib/chat/scripted";
import { recordChatUsage } from "@/lib/chat/usage-log";
import { parseChatRequest, toMessageParams } from "@/lib/chat/validation";

const limiter = createRateLimiter(CHAT_LIMITS.rateLimit);
const budget = createUsageBudget({
  perVisitorTokens: CHAT_LIMITS.perVisitorDailyTokens,
  globalUsd: CHAT_LIMITS.globalDailyUsd,
});

let client: Anthropic | null = null;
const getClient = (): Anthropic | null => {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
};

const UNAVAILABLE_NOTE = "\n\nSorry — the concierge is unavailable right now. Please reach us via the contact page.";

const json = (status: number, error: string) =>
  Response.json({ success: false, data: null, error }, { status, headers: { "Cache-Control": "no-store" } });

const textResponse = (body: ReadableStream<Uint8Array> | string) =>
  new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });

const clientIp = (req: Request): string =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export async function POST(req: Request): Promise<Response> {
  const ip = clientIp(req);
  if (!limiter.check(ip)) return json(429, "You're sending messages quickly — please wait a few minutes.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, "Invalid chat request.");
  }
  const parsed = parseChatRequest(body);
  if (!parsed.success) return json(400, parsed.error);

  // Default mode: predefined answers only. The Anthropic API is never called.
  if (chatMode() === "scripted") return textResponse(scriptedReply(parsed.data.at(-1)!.content).reply);

  // Free local screen first: no tokens spent on obvious manipulation attempts.
  const verdict = screenMessage(parsed.data.at(-1)!.content);
  if (!verdict.allowed) return textResponse(verdict.reply);

  const spend = budget.check(ip);
  if (!spend.ok) {
    return json(
      429,
      spend.reason === "global"
        ? "The concierge is resting for today. Please contact a specialist directly."
        : "You've reached today's concierge limit. A specialist is happy to help via the contact page.",
    );
  }

  const anthropic = getClient();
  if (!anthropic) {
    console.error("[chat] ANTHROPIC_API_KEY is not configured");
    return json(503, "The concierge is temporarily unavailable.");
  }

  const useFallback = supportsServerFallback(CHAT_MODEL);
  const stream = anthropic.beta.messages.stream(
    {
      model: CHAT_MODEL,
      max_tokens: CHAT_LIMITS.maxOutputTokens,
      output_config: { effort: CHAT_LIMITS.effort },
      // Stable system prompt as the cached prefix; only the conversation varies.
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: toMessageParams(parsed.data),
      // A classifier decline is retried server-side on Anthropic's recommended model.
      ...(useFallback ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    },
    // Visitor closes the chat → upstream generation is cancelled, so we stop paying for it.
    { signal: req.signal },
  );

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let emitted = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            emitted = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !emitted) controller.enqueue(encoder.encode(REDIRECT_REPLY));
        if (final.stop_reason === "max_tokens") controller.enqueue(encoder.encode("…"));

        const tokens = totalTokens(final.usage);
        const costUsd = estimateCostUsd(CHAT_MODEL, final.usage);
        budget.record(ip, { tokens, costUsd });
        recordChatUsage({ ip, model: final.model, usage: final.usage, costUsd, stopReason: final.stop_reason });
      } catch (error) {
        if (!req.signal.aborted) {
          console.error("[chat] stream failed", error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
          controller.enqueue(encoder.encode(UNAVAILABLE_NOTE));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return textResponse(readable);
}
