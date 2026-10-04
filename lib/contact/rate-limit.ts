import "server-only";

export interface RateLimiter {
  /** Returns true when the request is allowed. */
  allow(key: string): Promise<boolean>;
}

/**
 * Per-instance sliding-window limiter. Adequate for a single server; on
 * serverless or multi-instance hosting, replace with a shared store
 * (for example Upstash Redis) implementing the same interface.
 */
class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  async allow(key: string) {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) this.hits.clear();
    return true;
  }
}

export const contactRateLimiter: RateLimiter = new MemoryRateLimiter(5, 10 * 60 * 1000);
