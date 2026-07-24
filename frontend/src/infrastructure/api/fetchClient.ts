export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  retries = 3,
  delays = [0, 2000, 3000]
): Promise<T> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0 && delays[attempt]) {
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      }

      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}
