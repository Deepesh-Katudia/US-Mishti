import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { totalTokens, type TokenUsage } from "./pricing";

interface ChatUsageEntry {
  ip: string;
  model: string;
  usage: TokenUsage;
  costUsd: number;
  stopReason: string | null;
}

/** Visitors are tracked by a one-way hash, never by raw IP. */
const hashVisitor = (ip: string) =>
  createHash("sha256")
    .update(`${process.env.CHAT_VISITOR_SALT ?? "us-mishti"}:${ip}`)
    .digest("hex")
    .slice(0, 32);

/**
 * Logs per-request token usage and cost. Always writes a structured server log;
 * also persists to Supabase (`chat_usage`) when it is configured. Never throws.
 */
export function recordChatUsage({ ip, model, usage, costUsd, stopReason }: ChatUsageEntry): void {
  const row = {
    visitor_hash: hashVisitor(ip),
    model,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    cache_read_tokens: usage.cache_read_input_tokens ?? 0,
    cache_write_tokens: usage.cache_creation_input_tokens ?? 0,
    cost_usd: Number(costUsd.toFixed(6)),
    stop_reason: stopReason,
  };
  console.info("[chat] usage", JSON.stringify({ ...row, total_tokens: totalTokens(usage) }));

  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  void supabase
    .from("chat_usage")
    .insert(row)
    .then(({ error }) => {
      if (error) console.error("[chat] usage insert failed", error.message);
    });
}
