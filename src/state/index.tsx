import type { ReactNode } from 'react';

import { AuthProvider, useAuth } from './AuthProvider';
import { CartProvider, useCart } from './CartProvider';
import { FavoritesProvider, useFavorites } from './FavoritesProvider';
import { OrdersProvider, useOrders } from './OrdersProvider';
import { UserProvider, useUser } from './UserProvider';

export { useAuth } from './AuthProvider';
export { AuthError } from './AuthProvider';
export { useCart } from './CartProvider';
export type { CartLine } from './CartProvider';
export { useFavorites } from './FavoritesProvider';
export { useOrders } from './OrdersProvider';
export { useUser } from './UserProvider';

/**
 * Single composition point for app-wide state.
 *
 * Order matters: auth sits outermost so a sign-out can reset everything below
 * it, and cart/favorites/orders are independent of each other.
 *
 * `hydrating` from each provider is combined here so the root layout can hold
 * a splash screen until persisted state is loaded, instead of rendering an
 * empty bag or "no favourites" list for a frame.
 */
function useIsHydrating() {
  const auth = useAuth();
  const cart = useCart();
  const favorites = useFavorites();
  const orders = useOrders();
  const user = useUser();

  return auth.status === 'loading' || cart.hydrating || favorites.hydrating || orders.hydrating || user.hydrating;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrdersProvider>{children}</OrdersProvider>
          </FavoritesProvider>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export { useIsHydrating };