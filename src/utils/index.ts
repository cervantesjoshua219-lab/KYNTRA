/**
 * Formatting helpers shared across screens.
 */

/** Mock services resolve through this so loading states are actually visible. */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Money.
 *
 * The Figma file prices everything in Philippine pesos with a thousands
 * separator — `₱5,490`, `₱1,790`, `₱150` — and shows no separate tax line on
 * bag, checkout or order detail, which is consistent with PHP retail prices
 * being VAT-inclusive. `Totals` therefore has no `tax` field either.
 *
 * Grouping is done by hand rather than via `toLocaleString` so the output is
 * identical on Hermes regardless of which `Intl` data is bundled.
 */
function groupThousands(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPrice(value: number) {
  const rounded = Math.round(value);
  if (Number.isInteger(value)) return `₱${groupThousands(String(rounded))}`;

  // Keep the fraction only where it carries information (e.g. 4.5 -> 4.50).
  const [whole, fraction] = value.toFixed(2).split('.');
  return `₱${groupThousands(whole)}.${fraction}`;
}

/** Figma renders review timestamps relatively ("2 weeks ago"), not as dates. */
export function relativeTime(unixMs: number, now = Date.now()): string {
  const diff = Math.max(0, now - unixMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'Just now';
  if (diff < hour) {
    const n = Math.floor(diff / minute);
    return `${n} minute${n === 1 ? '' : 's'} ago`;
  }
  if (diff < day) {
    const n = Math.floor(diff / hour);
    return `${n} hour${n === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(diff / day);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/** Stable cart-line identity: same product, size and colour is one line. */
export function cartLineId(productId: string, size: string, color: string) {
  return `${productId}__${size}__${color}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}