import { useCallback, useEffect, useRef, useState } from 'react';

type Entry<T> = {
  /** The cache key this result belongs to. A mismatch means "still loading". */
  key: string;
  data: T | null;
  error: string | null;
};

/**
 * Runs an async loader and tracks its state.
 *
 * Two failure modes matter for a navigation-based app, and both are handled
 * here:
 *
 * 1. Setting state after unmount — the cleanup flag and request id guard that.
 * 2. A slow first request overwriting a fast second one when the user
 *    navigates back and forth quickly — each request takes a ticket and only
 *    the newest one is allowed to commit.
 *
 * Loading is *derived* from the entry's cache key rather than stored. That
 * means a key change re-enters the loading state without the effect body ever
 * calling `setState` synchronously, which is what causes cascading renders.
 *
 * @param deps re-runs the loader when these change — pass route params here.
 *   Values must be JSON-serialisable primitives; the list is serialised into a
 *   single cache key because a computed dependency array is not statically
 *   analysable.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [reloadToken, setReloadToken] = useState(0);
  const [entry, setEntry] = useState<Entry<T>>({ key: '', data: null, error: null });

  const cacheKey = `${JSON.stringify(deps)}|${reloadToken}`;

  // The caller passes an inline closure, so its identity changes every render.
  // Holding it in a ref lets the fetch effect depend on `cacheKey` alone —
  // the declared trigger — without re-running on every render.
  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    let cancelled = false;

    loaderRef.current().then(
      (data) => {
        if (cancelled || id !== requestId.current) return;
        setEntry({ key: cacheKey, data, error: null });
      },
      (err: unknown) => {
        if (cancelled || id !== requestId.current) return;
        setEntry({
          key: cacheKey,
          data: null,
          error: err instanceof Error ? err.message : 'Something went wrong.',
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  const settled = entry.key === cacheKey;

  return {
    data: settled ? entry.data : null,
    loading: !settled,
    error: settled ? entry.error : null,
    reload,
  };
}