interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Upper bound on tracked keys, so a flood of unique keys can't exhaust memory. */
  maxKeys?: number;
}

export interface RateLimiter {
  /** Returns true when the request is allowed. */
  check: (key: string, now?: number) => boolean;
  size: () => number;
}

interface Entry {
  count: number;
  resetAt: number;
}

/**
 * Fixed-window, in-memory limiter. Best-effort only: each serverless instance
 * keeps its own counts, which is enough to blunt casual form spam.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, Entry>();

  // Drop expired entries first; if still full, evict the oldest (Map keeps insertion order).
  const makeRoom = (now: number) => {
    if (hits.size < maxKeys) return;
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key);
    }
    while (hits.size >= maxKeys) {
      const oldest = hits.keys().next().value;
      if (oldest === undefined) break;
      hits.delete(oldest);
    }
  };

  return {
    check(key, now = Date.now()) {
      const entry = hits.get(key);
      if (!entry || now > entry.resetAt) {
        hits.delete(key);
        makeRoom(now);
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (entry.count >= limit) return false;
      hits.set(key, { ...entry, count: entry.count + 1 });
      return true;
    },
    size: () => hits.size,
  };
}
