/**
 * In-memory cache for remote requests.
 *
 * A single factory call demonstrates four core JavaScript features:
 *
 * - **Lexical scoping** — `store` / `inFlight` live inside
 *   `createCachedRequest`, so every wrapper gets its own private state that
 *   no caller can reach or corrupt.
 * - **Closures** — the returned function keeps reading `store`, `inFlight`,
 *   `fn`, `ttl` and `maxEntries` long after the factory returned.
 * - **Promises** — resolved values are cached, and *in-flight* promises are
 *   shared: N concurrent identical calls produce exactly one network request,
 *   and every caller observes the same settlement.
 * - **The `arguments` object** — the cache key is built from every argument
 *   the caller passed, without the wrapper having to know the wrapped
 *   function's signature (the classic pre-ES6 memoization idiom).
 *
 * Rejections are never cached: a failed request retries on the next call.
 *
 * @module lib/cache
 */

const DEFAULT_TTL_MS = 60_000;
const DEFAULT_MAX_ENTRIES = 100;

/**
 * Wrap a function so identical calls are de-duplicated and cached.
 *
 * @param {(...args: any[]) => Promise<any>|any} fn function to memoize
 * @param {{ ttl?: number, maxEntries?: number }} [options]
 * @param {number} [options.ttl=60000] how long a resolved value stays valid (ms)
 * @param {number} [options.maxEntries=100] FIFO cap on cached entries
 * @returns {(...args: any[]) => Promise<any>} cached wrapper (always async)
 */
export default function createCachedRequest(
  fn,
  { ttl = DEFAULT_TTL_MS, maxEntries = DEFAULT_MAX_ENTRIES } = {},
) {
  /* Lexically scoped private state: one cache per wrapper. */
  const store = new Map();
  const inFlight = new Map();

  /** Insert (or refresh) an entry, evicting the oldest beyond the cap. */
  function remember(key, value) {
    store.delete(key); // re-insert so Map order reflects recency
    store.set(key, { value, at: Date.now() });
    while (store.size > maxEntries) {
      store.delete(store.keys().next().value);
    }
  }

  return function cachedRequest() {
    /* The `arguments` object: works for any arity / any parameter names. */
    const args = Array.from(arguments);
    const key = JSON.stringify(args);

    const hit = store.get(key);
    if (hit && Date.now() - hit.at <= ttl) {
      return Promise.resolve(hit.value);
    }

    const running = inFlight.get(key);
    if (running) return running; // share the promise instead of re-fetching

    const request = Promise.resolve()
      .then(() => fn(...args))
      .then(
        (value) => {
          inFlight.delete(key);
          remember(key, value);
          return value;
        },
        (error) => {
          inFlight.delete(key); // failures stay retryable
          throw error;
        },
      );

    inFlight.set(key, request);
    return request;
  };
}
