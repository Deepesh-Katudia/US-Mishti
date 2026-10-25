import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { CHAT_LIMITS } from "./config";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(CHAT_LIMITS.maxMessageChars),
});

const requestSchema = z.object({
  // Generous upper bound on what the client may send; we trim further below.
  messages: z.array(messageSchema).min(1).max(60),
});

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export type ChatRequestResult = { success: true; data: ChatTurn[] } | { success: false; error: string };

/** Keep the newest turns within count and character budgets, starting on a user turn. */
function trimHistory(messages: ChatTurn[]): ChatTurn[] {
  const kept: ChatTurn[] = [];
  let chars = 0;
  for (let i = messages.length - 1; i >= 0 && kept.length < CHAT_LIMITS.maxHistoryMessages; i--) {
    const next = chars + messages[i].content.length;
    if (next > CHAT_LIMITS.maxConversationChars) break;
    chars = next;
    kept.unshift(messages[i]);
  }
  while (kept.length > 0 && kept[0].role !== "user") kept.shift();
  return kept;
}

export function parseChatRequest(body: unknown): ChatRequestResult {
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return { success: false, error: "Invalid chat request." };

  const messages = parsed.data.messages;
  if (messages.at(-1)?.role !== "user") return { success: false, error: "The last message must be from the user." };

  const trimmed = trimHistory(messages);
  if (trimmed.length === 0) return { success: false, error: "Message is too long." };
  return { success: true, data: trimmed };
}

export const toMessageParams = (turns: ChatTurn[]): Anthropic.Beta.BetaMessageParam[] =>
  turns.map((t) => ({ role: t.role, content: t.content }));
