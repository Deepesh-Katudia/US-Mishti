interface BudgetOptions {
  perVisitorTokens: number;
  globalUsd: number;
}

export type BudgetVerdict = { ok: true } | { ok: false; reason: "visitor" | "global" };

export interface UsageBudget {
  check: (visitor: string, day?: string) => BudgetVerdict;
  record: (visitor: string, spend: { tokens: number; costUsd: number }, day?: string) => void;
}

export const utcDay = (date = new Date()): string => date.toISOString().slice(0, 10);

/**
 * Daily spend caps, in memory. Best-effort per server instance — the hard
 * backstop is the monthly spend limit set on the Anthropic Console.
 */
export function createUsageBudget({ perVisitorTokens, globalUsd }: BudgetOptions): UsageBudget {
  let currentDay = "";
  let visitors = new Map<string, number>();
  let globalSpend = 0;

  const roll = (day: string) => {
    if (day === currentDay) return;
    currentDay = day;
    visitors = new Map();
    globalSpend = 0;
  };

  return {
    check(visitor, day = utcDay()) {
      roll(day);
      if (globalSpend >= globalUsd) return { ok: false, reason: "global" };
      if ((visitors.get(visitor) ?? 0) >= perVisitorTokens) return { ok: false, reason: "visitor" };
      return { ok: true };
    },
    record(visitor, { tokens, costUsd }, day = utcDay()) {
      roll(day);
      visitors.set(visitor, (visitors.get(visitor) ?? 0) + tokens);
      globalSpend += costUsd;
    },
  };
}
