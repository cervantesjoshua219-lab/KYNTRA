import { listProducts } from '@/services/db';
import type { Product } from '@/types';
import { delay } from '@/utils';

/**
 * The Search screen in Figma (page 06) offers two non-text entry points: an
 * "Ask KYNTRA" AI prompt and a barcode scan. Neither has a real backend here.
 *
 * Barcode scanning specifically needs a native module, so it is not available in
 * Expo Go — `scanBarcode` resolves to a deterministic mock result and the UI
 * says so plainly rather than pretending to scan.
 */

export type AiAnswer = {
  /** Short natural-language reply rendered above the product list. */
  text: string;
  products: Product[];
};

export const aiSearchService = {
  async ask(query: string): Promise<AiAnswer> {
    await delay(null, 700);
    const q = query.trim().toLowerCase();

    // Intents that need a specific answer rather than a product list.
    if (/(ship|deliver|how long|arrive)/.test(q)) {
      return {
        text: 'Standard delivery is 2–3 working days. KYNTRA Plus members get next-day on orders placed before 8pm.',
        products: [],
      };
    }
    if (/(return|refund|exchange)/.test(q)) {
      return {
        text: 'You can return anything within 30 days, free in the UK. Refunds land within 5 working days of the parcel scanning in.',
        products: [],
      };
    }

    const all = listProducts();
    const matched = all.filter((p) =>
      [p.name, p.tagline, p.category].some((f) => f.toLowerCase().includes(q)),
    );
    const results = matched.length ? matched : all.filter((p) => p.featured).slice(0, 4);

    return {
      text: matched.length
        ? `Found ${matched.length} match${matched.length === 1 ? '' : 'es'}.`
        : `I could not find that exactly. Here is what people buy instead.`,
      products: results.slice(0, 4),
    };
  },

  /**
   * Mock scanner. Requires a native module, so this is unavailable in Expo Go
   * — the caller is responsible for telling the user that.
   */
  async scanBarcode(): Promise<Product | null> {
    await delay(null, 900);
    return listProducts()[0] ?? null;
  },
};