/**
 * KYNTRA domain types.
 *
 * These mirror the data the Figma screens actually render. There is no backend
 * — `src/services/*` returns local mock data with an artificial delay, so the
 * screens exercise their loading and error states for real.
 */

export type ColorOption = {
  /** Human-readable name shown in the selector, e.g. "Onyx". */
  name: string;
  /** Hex used for the swatch. Restricted to the Figma palette in practice. */
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  /** Short subtitle shown under the name on cards, e.g. "Everyday trainer". */
  tagline: string;
  description: string;
  price: number;
  /** Original price, when the item is discounted. */
  compareAtPrice?: number;
  category: string;
  /** Local require() asset or remote URI. */
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  rating: number;
  reviewCount: number;
  stock: number;
  /** Appears in the Home featured carousel. Optional — absence means false. */
  featured?: boolean;
  isNew?: boolean;
  collection?: string;
};

export type Category = {
  id: string;
  name: string;
  /** Number of products, used for the tile subtitle. */
  count: number;
  image: string;
};

export type CartItem = {
  /** Stable key: productId + size + color. */
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type Totals = {
  subtotal: number;
  shipping: number;
  /** No tax field: Figma shows only Subtotal / Delivery / Total, and PHP
   *  retail prices are VAT-inclusive. */
  discount: number;
  total: number;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefault: boolean;
};

export type PaymentMethod = {
  id: string;
  /** "Visa", "Mastercard", "Apple Pay". */
  brand: string;
  /** Last four digits only — no full card numbers are stored. */
  last4: string;
  /** Unix ms. */
  expiry: number;
  isDefault: boolean;
};

export type OrderStatus =
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type Order = {
  id: string;
  items: CartItem[];
  totals: Totals;
  status: OrderStatus;
  /** Unix ms. */
  placedAt: number;
  address: Address;
  payment: PaymentMethod;
  /** Carrier + tracking, present once shipped. */
  tracking?: { carrier: string; number: string };
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  membership: MembershipTier;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: Preferences;
};

export type MembershipTier = 'guest' | 'member' | 'plus';

export type Preferences = {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderSms: boolean;
};

export type NotificationKind = 'order' | 'promotion' | 'account' | 'support';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Unix ms. */
  createdAt: number;
  read: boolean;
  /** In-app destination when tapped. */
  href?: string;
};

export type SearchResult = {
  products: Product[];
  /** Rendered under "AI picked for you" on the search screen. */
  suggestions: string[];
};

/** Async/loading shape used by data hooks. */
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};