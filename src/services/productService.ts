import { categories, collections, findCategory, findProduct, products } from '@/data/products';
import { reviews } from '@/data/content';
import type { Category, Product, SearchResult } from '@/types';
import { delay } from '@/utils';

/**
 * Catalogue access.
 *
 * All reads are async and deliberately delayed so every screen's loading state
 * is exercised in development rather than only in production.
 */

export const productService = {
  async listAll(): Promise<Product[]> {
    return delay(products);
  },

  async listFeatured(): Promise<Product[]> {
    return delay(products.filter((p) => p.featured));
  },

  async listByCategory(categoryId: string): Promise<Product[]> {
    const category = findCategory(categoryId);
    if (!category) return delay([]);
    return delay(products.filter((p) => p.category === category.name));
  },

  async listByCollection(collectionId: string): Promise<Product[]> {
    return delay(products.filter((p) => p.collection === collectionId));
  },

  async getById(id: string): Promise<Product | null> {
    return delay(findProduct(id));
  },

  async getCategories(): Promise<Category[]> {
    return delay(categories);
  },

  async getCollections() {
    return delay(collections);
  },

  async getRelated(product: Product): Promise<Product[]> {
    return delay(
      products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4),
    );
  },

  async getReviews(productId: string) {
    return delay(reviews[productId] ?? []);
  },

  /** Text search across name, tagline and category. */
  async search(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return delay([]);
    return delay(
      products.filter((p) =>
        [p.name, p.tagline, p.category, p.description].some((field) =>
          field.toLowerCase().includes(q),
        ),
      ),
    );
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