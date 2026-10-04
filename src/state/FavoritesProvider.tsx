import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { readJson, storageKeys, writeJson } from '@/services/storage';

type FavoritesValue = {
  /** Product ids, most-recently added first. */
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  hydrating: boolean;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await readJson<string[]>(storageKeys.favorites, []);
      if (cancelled) return;
      setIds(stored);
      setHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrating) return;
    void writeJson(storageKeys.favorites, ids);
  }, [ids, hydrating]);

  // Keeping a Set alongside the array makes `has` O(1) inside list renders.
  const set = useMemo(() => new Set(ids), [ids]);

  const has = useCallback((productId: string) => set.has(productId), [set]);

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const value = useMemo<FavoritesValue>(
    () => ({ ids, count: ids.length, has, toggle, remove, hydrating }),
    [ids, has, toggle, remove, hydrating],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}