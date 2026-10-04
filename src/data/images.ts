/**
 * Image registry.
 *
 * This is the only module that references product/category artwork, so it is
 * the single swap point for imagery.
 *
 * What is real and what is not:
 *
 * - `productImages[0..3]` — **real photography**, exported from the Figma Shop
 *   grid `9:967`. In order: Paceform 01, Formknit Tee, Driftline Short,
 *   Transit Crossbody. Matched to the first four entries in `./products`.
 * - `productImages[4..7]` — neutral placeholders (`scripts/make-placeholders.js`).
 *   Figma only photographs four products, so the other catalogue entries have
 *   no source artwork. Replace the files to fix them; no code changes needed.
 * - `categoryImages` — all placeholders. Figma's category tiles are text-only,
 *   so there is nothing to export.
 * - `collectionImages` — **real photography**, the three editorial campaign
 *   banners from Figma's Home page (`9:612`, `9:785`, `9:878`).
 *
 * `productImage(index)` wraps modulo the array length so callers can pass any
 * index; indices `0..3` are the real photographs.
 */

export const productImages = [
  require('@/assets/images/products/product-1.png'),
  require('@/assets/images/products/product-2.png'),
  require('@/assets/images/products/product-3.png'),
  require('@/assets/images/products/product-4.png'),
  require('@/assets/images/products/product-5.png'),
  require('@/assets/images/products/product-6.png'),
  require('@/assets/images/products/product-7.png'),
  require('@/assets/images/products/product-8.png'),
] as const;

export const categoryImages = [
  require('@/assets/images/categories/category-1.png'),
  require('@/assets/images/categories/category-2.png'),
  require('@/assets/images/categories/category-3.png'),
  require('@/assets/images/categories/category-4.png'),
  require('@/assets/images/categories/category-5.png'),
  require('@/assets/images/categories/category-6.png'),
];

export const collectionImages = [
  require('@/assets/images/collection/collection-1.png'),
  require('@/assets/images/collection/collection-2.png'),
  require('@/assets/images/collection/collection-3.png'),
];

/** How many `productImages` entries are real photography (see notes above). */
export const REAL_PRODUCT_IMAGE_COUNT = 4;

/** Circular index so a product gets a stable image for its primary slot. */
export function productImage(index: number) {
  return productImages[index % productImages.length];
}

export function categoryImage(index: number) {
  return categoryImages[index % categoryImages.length];
}

export function collectionImage(index: number) {
  return collectionImages[index % collectionImages.length];
}