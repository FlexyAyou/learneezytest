/**
 * Utilitaire générique de retry avec backoff exponentiel.
 * @param fn Fonction asynchrone à exécuter
 * @param opts Options de configuration
 */
export interface RetryOptions<T = any> {
  maxRetries?: number; // nombre total de tentatives (hors tentative initiale)
  baseDelayMs?: number; // délai initial en ms (défaut 1000)
  factor?: number; // facteur multiplicateur (défaut 2)
  shouldRetry?: (error: any, attempt: number) => boolean; // décide si on retente
  onRetry?: (attempt: number, delayMs: number, error: any) => void; // hook debug
  timeoutMs?: number; // timeout total par tentative
  signal?: AbortSignal; // pour annuler le cycle de retry
}

export async function retryWithBackoff<T>(fn: () => Promise<T>, opts: RetryOptions<T> = {}): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    factor = 2,
    shouldRetry = defaultShouldRetry,
    onRetry,
    timeoutMs,
    signal,
  } = opts;

  let attempt = 0;
  let delay = baseDelayMs;

  while (true) {
    if (signal?.aborted) throw new Error('Aborted');
    try {
      const result = await (timeoutMs ? withTimeout(fn, timeoutMs) : fn());
      return result;
    } catch (err: any) {
      if (attempt >= maxRetries || !shouldRetry(err, attempt)) {
        throw err;
      }
      if (onRetry) onRetry(attempt + 1, delay, err);
      await sleep(delay, signal);
      attempt += 1;
      delay = delay * factor; // exponentiel
      continue;
    }
  }
}

function defaultShouldRetry(error: any): boolean {
  const status = error?.response?.status;
  const retryableStatus = status === 503 || status === 502 || status === 504;
  const isTimeout = error?.code === 'ECONNABORTED' || error?.message?.includes('timeout');
  return retryableStatus || isTimeout;
}

async function sleep(ms: number, signal?: AbortSignal) {
  if (signal?.aborted) return;
  await new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(id);
        reject(new Error('Aborted'));
      }, { once: true });
    }
  });
}

async function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    fn(),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}