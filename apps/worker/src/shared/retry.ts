/**
 * Exponential backoff with jitter for retrying failed operations.
 * @param attempt - The current attempt number (0-indexed)
 * @param baseDelayMs - Base delay in milliseconds (default: 1000ms)
 * @param maxDelayMs - Maximum delay cap in milliseconds (default: 30000ms)
 */
export function exponentialBackoff(
  attempt: number,
  baseDelayMs = 1000,
  maxDelayMs = 30000,
): number {
  const exponential = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
  // Add ±25% jitter to prevent thundering herd
  const jitter = exponential * 0.25 * (Math.random() * 2 - 1);
  return Math.round(exponential + jitter);
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function up to maxAttempts times with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxAttempts - 1) {
        const delay = exponentialBackoff(attempt, baseDelayMs);
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error("All retry attempts failed");
}

/**
 * BullMQ backoff config for queue retry policies.
 */
export const QUEUE_BACKOFF = {
  ai: { type: "exponential" as const, delay: 2000 },
  email: { type: "exponential" as const, delay: 1000 },
  enrich: { type: "exponential" as const, delay: 2000 },
  scan: { type: "fixed" as const, delay: 5000 },
  report: { type: "fixed" as const, delay: 10000 },
  sync: { type: "exponential" as const, delay: 3000 },
};
