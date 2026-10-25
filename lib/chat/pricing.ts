/** USD per 1M tokens. Cache writes are 1.25× input (5-minute TTL). */
interface ModelPricing {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

const price = (input: number, output: number, cacheRead = input * 0.1): ModelPricing => ({
  input,
  output,
  cacheRead,
  cacheWrite: input * 1.25,
});

export const PRICING: Record<string, ModelPricing> = {
  "claude-opus-5-5": price(4, 20, 0.2),
  "claude-sonnet-5-5": price(2, 10, 0.2),
  "claude-haiku-5-5": price(0.1, 0.5),
  "claude-fable-5-1": price(10, 50, 0.25),
};

// Unknown models are priced at the most expensive tier so budgets fail safe.
const FALLBACK_PRICING = PRICING["claude-fable-5-1"];

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}

export const totalTokens = (u: TokenUsage): number =>
  u.input_tokens + u.output_tokens + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);

export function estimateCostUsd(model: string, u: TokenUsage): number {
  const p = PRICING[model] ?? FALLBACK_PRICING;
  return (
    (u.input_tokens * p.input +
      u.output_tokens * p.output +
      (u.cache_read_input_tokens ?? 0) * p.cacheRead +
      (u.cache_creation_input_tokens ?? 0) * p.cacheWrite) /
    1_000_000
  );
}
