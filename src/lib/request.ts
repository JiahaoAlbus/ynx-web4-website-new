export type JsonRequestOptions = {
  timeoutMs?: number;
  cache?: RequestCache;
  signal?: AbortSignal;
};

export async function fetchJsonWithTimeout<T>(
  url: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const { timeoutMs = 5000, cache = "no-store", signal } = options;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`${url} ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`${url} timeout`);
    }
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
    window.clearTimeout(timer);
  }
}
