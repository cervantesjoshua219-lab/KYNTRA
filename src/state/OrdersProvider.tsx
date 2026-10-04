import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { notifications as seedNotifications } from '@/data/content';
import { readJson, storageKeys, writeJson } from '@/services/storage';
import type { Address, AppNotification, CartItem, Order, OrderStatus, PaymentMethod, Totals } from '@/types';

/** Two seeded orders so the Orders screen isn't empty on first run. */
const DAY = 24 * 60 * 60 * 1000;

const DEFAULT_ADDRESS = {
  id: 'addr-1',
  label: 'Home',
  line1: '18 Beaumont Rise',
  line2: 'Flat 3',
  city: 'Bristol',
  postcode: 'BS1 4TR',
  country: 'United Kingdom',
  isDefault: true,
} as const;

const DEFAULT_PAYMENT = {
  id: 'pay-1',
  brand: 'Visa',
  last4: '4242',
  expiry: Date.now() + 1000 * 60 * 60 * 24 * 365 * 3,
  isDefault: true,
} as const;

/**
 * Seed orders.
 *
 * `KY-10482` reproduces the Figma Orders frame `9:2533` exactly: Paceform 01
 * (₱5,490) plus Formknit Tee (₱1,790) is a ₱7,280 subtotal, which is under the
 * ₱8,000 free-delivery threshold, so ₱150 delivery gives the ₱7,430 total the
 * design shows. Note there is no tax line — PHP retail prices are VAT-inclusive.
 */
const SEED_ORDERS: Order[] = [
  {
    id: 'KY-10482',
    items: [
      { id: 'paceform-01__UK 9__Onyx', productId: 'paceform-01', size: 'UK 9', color: 'Onyx', quantity: 1 },
      { id: 'formknit-tee__M__Chalk', productId: 'formknit-tee', size: 'M', color: 'Chalk', quantity: 1 },
    ],
    totals: { subtotal: 7280, shipping: 150, discount: 0, total: 7430 },
    status: 'shipped',
    placedAt: Date.now() - 3 * DAY,
    address: DEFAULT_ADDRESS,
    payment: DEFAULT_PAYMENT,
    tracking: { carrier: 'DPD', number: 'JD0046000038274512' },
  },
  {
    id: 'KY-10319',
    items: [
      { id: 'terra-hood__M__Stone', productId: 'terra-hood', size: 'M', color: 'Stone', quantity: 1 },
      { id: 'relay-sock__S/M__Chalk', productId: 'relay-sock', size: 'S/M', color: 'Chalk', quantity: 2 },
    ],
    totals: { subtotal: 5970, shipping: 150, discount: 0, total: 6120 },
    status: 'delivered',
    placedAt: Date.now() - 26 * DAY,
    address: DEFAULT_ADDRESS,
    payment: DEFAULT_PAYMENT,
    tracking: { carrier: 'DPD', number: 'JD0046000038299114' },
  },
];

type OrdersValue = {
  orders: Order[];
  /** Newest first. */
  unreadCount: number;
  hydrating: boolean;
  placeOrder: (input: {
    items: CartItem[];
    totals: Totals;
    address: Address;
    payment: PaymentMethod;
  }) => Order;
  getById: (id: string) => Order | null;
  cancelOrder: (id: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const OrdersContext = createContext<OrdersValue | null>(null);

/** Human-facing reference, e.g. KY-10483. Monotonic across app launches. */
function nextOrderId(existing: Order[]) {
  const highest = existing.reduce((max, o) => {
    const n = Number(o.id.replace(/^KY-/, ''));
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 10000);
  return `KY-${highest + 1}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await readJson<Order[]>(storageKeys.orders, SEED_ORDERS);
      if (cancelled) return;
      setOrders(stored);
      setHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrating) return;
    void writeJson(storageKeys.orders, orders);
  }, [orders, hydrating]);

  const placeOrder = useCallback<OrdersValue['placeOrder']>(
    ({ items, totals, address, payment }) => {
      // Read via the setter so concurrent placements cannot collide on id.
      let created: Order = {
        id: 'KY-10001',
        items,
        totals,
        status: 'confirmed',
        placedAt: Date.now(),
        address,
        payment,
      };
      setOrders((prev) => {
        created = { ...created, id: nextOrderId(prev) };
        return [created, ...prev];
      });
      return created;
    },
    [],
  );

  const getById = useCallback((id: string) => orders.find((o) => o.id === id) ?? null, [orders]);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id && o.status !== 'delivered' ? { ...o, status: 'cancelled' } : o)),
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<OrdersValue>(
    () => ({
      orders,
      unreadCount: notifications.filter((n) => !n.read).length,
      hydrating,
      placeOrder,
      getById,
      cancelOrder,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      orders,
      notifications,
      hydrating,
      placeOrder,
      getById,
      cancelOrder,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside <OrdersProvider>');
  return ctx;
}

export { SEED_ORDERS };
export type { OrderStatus };