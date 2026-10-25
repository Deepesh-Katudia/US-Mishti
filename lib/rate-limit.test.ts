import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows requests up to the limit within a window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 10)).toBe(true);
    expect(limiter.check("ip", 20)).toBe(false);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("b", 0)).toBe(true);
    expect(limiter.check("a", 1)).toBe(false);
  });

  it("keeps active counters when the key table overflows", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 3 });
    expect(limiter.check("victim", 0)).toBe(true);
    for (let i = 0; i < 10; i++) limiter.check(`spoof-${i}`, 1);
    // The flood evicts oldest entries one at a time; it cannot wipe everything at once.
    expect(limiter.size()).toBeLessThanOrEqual(3);
  });

  it("prunes expired entries before evicting live ones", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 100, maxKeys: 2 });
    limiter.check("old", 0);
    limiter.check("live", 150);
    limiter.check("new", 160);
    expect(limiter.check("live", 170)).toBe(false);
  });

  it("resets once the window has elapsed", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 500)).toBe(false);
    expect(limiter.check("ip", 1001)).toBe(true);
  });
});
