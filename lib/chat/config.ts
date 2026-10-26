/**
 * Concierge chat configuration. Every value that affects cost lives here.
 * Override the model and the global budget via environment variables.
 */
export const CHAT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5-5";

export const CHAT_LIMITS = {
  /** Hard ceiling on each reply. Concierge answers are short; this bounds output cost. */
  maxOutputTokens: 1024,
  /** Lower effort = fewer thinking tokens. Plenty for grounded Q&A. */
  effort: "low" as const,
  /** Only the most recent turns are sent upstream. */
  maxHistoryMessages: 12,
  maxMessageChars: 1000,
  maxConversationChars: 8000,
  /** Requests per visitor (IP) per window. */
  rateLimit: { limit: 15, windowMs: 10 * 60 * 1000 },
  /** Tokens (input + output, all kinds) one visitor may spend per UTC day. */
  perVisitorDailyTokens: 60_000,
  /** Spend ceiling across all visitors per UTC day, per server instance. */
  globalDailyUsd: Number(process.env.CHAT_DAILY_BUDGET_USD ?? 5),
};

/** Server-side refusal fallback is supported on these model families (not Haiku). */
export const supportsServerFallback = (model: string): boolean => /^claude-(opus|sonnet|fable)-/.test(model);

/**
 * "scripted" (default): predefined answers from lib/chat/scripted.ts — no API key, no LLM calls, no cost.
 * "ai": Claude-powered concierge via the Anthropic API. Opt in with CHAT_MODE=ai.
 * Read per request so the mode can be flipped with an env change alone.
 */
export type ChatMode = "scripted" | "ai";
export const chatMode = (): ChatMode => (process.env.CHAT_MODE === "ai" ? "ai" : "scripted");
