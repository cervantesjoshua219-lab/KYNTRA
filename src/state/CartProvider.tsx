import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';

import { findProduct } from '@/data/products';
import { readJson, storageKeys, writeJson } from '@/services/storage';
import type { CartItem, Product, Totals } from '@/types';
import { cartLineId } from '@/utils';

/**
 * Free delivery threshold and flat delivery fee, in pesos.
 *
 * Figma's bag frames show `₱7,280 + ₱150 = ₱7,430` and the Home promo card
 * reads "Free shipping on orders over ₱8,000", so those are the numbers used
 * here. Bag and checkout both display this threshold.
 */
export const FREE_SHIPPING_THRESHOLD = 8000;
export const DELIVERY_FEE = 150;

type CartAction =
  | { type: 'hydrate'; items: CartItem[] }
  | { type: 'add'; item: CartItem }
  | { type: 'setQuantity'; id: string; quantity: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'hydrate':
      return action.items;

    case 'add': {
      const existing = state.find((i) => i.id === action.item.id);
      if (!existing) return [...state, action.item];
      return state.map((i) =>
        i.id === action.item.id ? { ...i, quantity: i.quantity + action.item.quantity } : i,
      );
    }

    case 'setQuantity': {
      if (action.quantity <= 0) return state.filter((i) => i.id !== action.id);
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: Math.min(action.quantity, 10) } : i,
      );
    }

    case 'remove':
      return state.filter((i) => i.id !== action.id);

    case 'clear':
      return [];
  }
}

/** Cart line joined to its product, which is what every view actually needs. */
export type CartLine = CartItem & { product: Product };

type CartValue = {
  items: CartItem[];
  /** Items joined to their products. Hydration is async, so this starts empty. */
  lines: CartLine[];
  /** Sum of unit prices × quantity. */
  subtotal: number;
  count: number;
  totals: Totals;
  isEmpty: boolean;
  /** Set while persisted items are still being joined to products. */
  hydrating: boolean;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await readJson<CartItem[]>(storageKeys.cart, []);
      if (cancelled) return;
      // Drop lines whose product no longer exists in the catalogue.
      const valid = stored.filter((i) => findProduct(i.productId) !== null);
      dispatch({ type: 'hydrate', items: valid });
      setHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change, but never before hydration finishes or the stored
  // cart would be overwritten with an empty one.
  useEffect(() => {
    if (hydrating) return;
    void writeJson(storageKeys.cart, items);
  }, [items, hydrating]);

  const addItem = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      dispatch({
        type: 'add',
        item: {
          id: cartLineId(product.id, size, color),
          productId: product.id,
          size,
          color,
          quantity,
        },
      });
    },
    [],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'setQuantity', id, quantity });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'remove', id });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'clear' });
  }, []);

  const value = useMemo<CartValue>(() => {
    const lines: CartLine[] = items.flatMap((item) => {
      const product = findProduct(item.productId);
      return product ? [{ ...item, product }] : [];
    });

    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = Number((subtotal + shipping).toFixed(2));

    return {
      items,
      lines,
      subtotal: Number(subtotal.toFixed(2)),
      count: items.reduce((n, i) => n + i.quantity, 0),
      totals: { subtotal: Number(subtotal.toFixed(2)), shipping, discount: 0, total },
      isEmpty: lines.length === 0,
      hydrating,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [items, hydrating, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export type { CartAction, CartDispatch };
type CartDispatch = Dispatch<CartAction>;