export type OpenverseImage = {
  thumbnail: string;
  title?: string;
  creator?: string;
  license?: string;
  foreign_landing_url?: string;
};

type OpenverseResult = {
  thumbnail?: string;
  title?: string;
  creator?: string;
  license?: string;
  foreign_landing_url?: string;
};

type OpenverseResponse = {
  results?: OpenverseResult[];
};

const imageSearchCache = new Map<string, Promise<OpenverseImage | null>>();
const requestQueue: Array<() => void> = [];
const MAX_CONCURRENT_REQUESTS = 2;
const MAX_QUEUED_REQUESTS = 8;
let activeRequests = 0;

function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function runNextRequest(): void {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) return;
  const next = requestQueue.shift();
  if (next) next();
}

/**
 * Searches are shared across component instances and concurrency-limited.
 * A slow or unavailable public image service never blocks the product UI.
 */
export function findOpenverseImage(query: string): Promise<OpenverseImage | null> {
  const cacheKey = query.trim().toLowerCase();
  if (!cacheKey) return Promise.resolve(null);

  const cached = imageSearchCache.get(cacheKey);
  if (cached) return cached;

  const request = new Promise<OpenverseImage | null>((resolve) => {
    const startRequest = () => {
      activeRequests += 1;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8500);
      const url = "https://api.openverse.org/v1/images/?q="
        + encodeURIComponent(query)
        + "&category=photograph&license_type=commercial&size=medium&page_size=4";

      fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Image search unavailable");
          return response.json() as Promise<OpenverseResponse>;
        })
        .then((payload) => {
          const candidates = Array.isArray(payload.results) ? payload.results : [];
          const match = candidates.find((item) => safeHttpsUrl(item.thumbnail) !== null);
          const thumbnail = safeHttpsUrl(match?.thumbnail);
          if (!match || !thumbnail) return null;

          return {
            thumbnail,
            title: match.title,
            creator: match.creator,
            license: match.license,
            foreign_landing_url: safeHttpsUrl(match.foreign_landing_url) ?? undefined,
          } satisfies OpenverseImage;
        })
        .catch(() => null)
        .then((result) => {
          window.clearTimeout(timeoutId);
          resolve(result);
          activeRequests = Math.max(0, activeRequests - 1);
          runNextRequest();
        });
    };

    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      startRequest();
    } else if (requestQueue.length < MAX_QUEUED_REQUESTS) {
      requestQueue.push(startRequest);
    } else {
      resolve(null);
    }
  });

  imageSearchCache.set(cacheKey, request);
  return request;
}
