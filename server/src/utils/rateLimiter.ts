export class TmdbRateLimiter {
  private queue: (() => void)[] = [];
  private timestamps: number[] = [];
  private readonly maxRequests = 35; // Cap safely under TMDB's 40 per 10s
  private readonly windowMs = 10000;

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquireToken();
    try {
      return await fn();
    } catch (err: any) {
      if (err?.response?.status === 429) {
        const retryAfter = (parseInt(err.response?.headers?.['retry-after'], 10) || 2) * 1000;
        await new Promise(res => setTimeout(res, retryAfter));
        return this.schedule(fn);
      }
      throw err;
    }
  }

  private async acquireToken(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return;
    }
    const oldest = this.timestamps[0];
    const waitTime = this.windowMs - (now - oldest) + 50;
    await new Promise(res => setTimeout(res, waitTime));
    return this.acquireToken();
  }
}

export const tmdbRateLimiter = new TmdbRateLimiter();
