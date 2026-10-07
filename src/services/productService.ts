import { collections, SPORT_FILTERS } from '@/data/products';
import { reviews } from '@/data/content';
import { findProduct, listCategories, listProducts, searchProducts } from '@/services/db';
import type { Category, Product, SearchResult } from '@/types';
import { delay } from '@/utils';

/**
 * Catalogue access.
 *
 * Every read below resolves against SQLite (`src/services/db.ts`), not against
 * the seed array — `seedProducts` is INSERTed on first launch and then never
 * consulted again. The artificial `delay` is kept on purpose so screens still
 * exercise their loading states honestly.
 */

function sportsList(): Category[] {
  const live = listProducts();
  return SPORT_FILTERS.map((name) => ({
    id: name.toLowerCase(),
    name,
    // Counted from the live table, not typed in: the hand-maintained numbers
    // drifted out of step with the products and mislabelled the chips, and now
    // an item added in the lab updates the count too.
    count: live.filter((p) => p.sport === name).length,
    image: null,
  }));
}

export const productService = {
  async listAll(): Promise<Product[]> {
    return delay(listProducts());
  },

  async listFeatured(): Promise<Product[]> {
    return delay(listProducts().filter((p) => p.featured));
  },

  /** `id` is a sport chip id (`running`), so it filters on `sport`. */
  async listByCategory(categoryId: string): Promise<Product[]> {
    const match = SPORT_FILTERS.find((name) => name.toLowerCase() === categoryId);
    if (!match) return delay([]);
    return delay(listProducts().filter((p) => p.sport === match));
  },

  async listByCollection(collectionId: string): Promise<Product[]> {
    return delay(listProducts().filter((p) => p.collection === collectionId));
  },

  async getById(id: string): Promise<Product | null> {
    return delay(findProduct(id));
  },

  async getCategories(): Promise<Category[]> {
    return delay(sportsList());
  },

  /** Categories actually present in the table, for the Add Item form. */
  async getMerchCategories(): Promise<string[]> {
    return delay(listCategories());
  },

  async getCollections() {
    return delay(collections);
  },

  async getRelated(product: Product): Promise<Product[]> {
    return delay(
      listProducts()
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4),
    );
  },

  async getReviews(productId: string) {
    return delay(reviews[productId] ?? []);
  },

  /** SQL search — parameterised `LIKE` across name, tagline and category. */
  async search(query: string): Promise<Product[]> {
    return delay(searchProducts(query));
  },

  /** Sort options shown in the Sort bottom sheet (Figma 9:1437). */
  async searchSorted(
    query: string,
    sort: 'relevance' | 'price-asc' | 'price-desc' | 'rating',
  ): Promise<SearchResult> {
    const found = await this.search(query);
    const sorted = [...found];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);

    return delay({
      products: sorted,
      suggestions: suggestionsFor(query, sorted),
    });
  },
};

/**
 * Trending terms shown before the user types, and as AI suggestions.
 *
 * `Under ₱2,000` matches Figma's peso price band — the cheapest catalogue
 * entries are ₱990 and ₱1,290.
 */
export const trendingSearches = ['Everyday trainer', 'Rain shell', 'Wide fit', 'Under ₱2,000'];

function suggestionsFor(query: string, results: Product[]): string[] {
  const categories = [...new Set(results.map((p) => p.category))];
  const q = query.trim();
  return [
    ...(q ? [`${q} on sale`] : []),
    ...categories.map((c) => `More in ${c}`),
    `Similar to ${results[0]?.name ?? 'this'}`,
    'Under ₱2,000',
  ].slice(0, 4);
}