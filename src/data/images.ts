/**
 * Image registry.
 *
 * This is the only module that references artwork, so it is the single swap
 * point for imagery.
 *
 * **Every file referenced here is real photography exported from the Figma
 * file.** There are no generated placeholders left in the app. The whole file
 * was audited node by node and contains exactly 16 image fills:
 *
 * | Export                          | Figma node(s)                        |
 * | ------------------------------- | ------------------------------------ |
 * | 8 product photos                | Shop, Search, Favorites, Product     |
 * | 3 editorial campaigns           | Home `9:735`, `9:785`, `9:878`       |
 * | 2 membership editorials         | Membership `9:3010`, `9:3033`        |
 * | 2 profile photographs           | Profile `9:2343`, `9:2431`           |
 * | 1 order thumbnail               | Orders `9:2571`                      |
 *
 * The eight product photos are six distinct products — Contour 02 and
 * Airweave Cap are each shot twice, and both angles are kept so the product
 * gallery has something to page through. Keys are named after the product
 * rather than numbered, because the numbering drifted every time a product was
 * added and the mapping was the single easiest thing to get wrong.
 *
 * There are deliberately **no category images.** Earlier revisions rendered a
 * row of 120x120 category tiles from generated placeholders, but Figma has no
 * category artwork anywhere in the file — Home filters with text chips
 * (Running / Training / Lifestyle / Basketball, nodes `9:777`-`9:783`) and Shop
 * filters with a text list. The placeholders were invented content and have
 * been removed rather than replaced.
 *
 * Extensions are honest: Figma stores these as JPEG and the files are named
 * `.jpg`. The `download_figma_images` MCP tool only accepts a `.png`/`.svg`/
 * `.gif` filename but writes the source bytes, so it hands back JPEG data under
 * a `.png` name. Android's image decoder rejects that mismatch outright while
 * web browsers silently render it, which is why `scripts/check-assets.js`
 * validates every asset's magic bytes against its extension.
 */

/**
 * Product photography, keyed by product.
 *
 * Contour 02 and Airweave Cap carry two angles each; the rest are single-shot.
 */
export const productPhotos = {
  paceform01: require('@/assets/images/products/product-1.jpg'),
  contour02: require('@/assets/images/products/product-2.jpg'),
  airweaveCap: require('@/assets/images/products/product-3.jpg'),
  formknitTee: require('@/assets/images/products/product-4.jpg'),
  driftlineShort: require('@/assets/images/products/product-5.jpg'),
  contour02Alt: require('@/assets/images/products/product-6.jpg'),
  transitCrossbody: require('@/assets/images/products/product-7.jpg'),
  airweaveCapAlt: require('@/assets/images/products/product-8.jpg'),
} as const;

/** Ordered product photos, for callers that just need "the next one". */
export const productImages = [
  productPhotos.paceform01,
  productPhotos.contour02,
  productPhotos.airweaveCap,
  productPhotos.formknitTee,
  productPhotos.driftlineShort,
  productPhotos.contour02Alt,
  productPhotos.transitCrossbody,
  productPhotos.airweaveCapAlt,
] as const;

/**
 * The three Home editorial campaigns, in the order Figma stacks them:
 * `9:735` THE PACEFORM COLLECTION, `9:785` FORM / FUNCTION / FREEDOM,
 * `9:878` BUILT TO DO MORE.
 */
export const campaignImages = [
  require('@/assets/images/campaign-1.jpg'),
  require('@/assets/images/campaign-2.jpg'),
  require('@/assets/images/campaign-3.jpg'),
] as const;

/** Membership page editorial art (`9:3010`, `9:3033`). */
export const membershipImages = [
  require('@/assets/images/membership/membership-1.jpg'),
  require('@/assets/images/membership/membership-2.jpg'),
] as const;

/** Profile page photography (`9:2343`, `9:2431`). */
export const profileImages = [
  require('@/assets/images/profile/profile-1.jpg'),
  require('@/assets/images/profile/profile-2.jpg'),
] as const;

/** Order line-item thumbnail (`9:2571`). */
export const orderThumb = require('@/assets/images/orders/order-1.jpg');

/** Back-compat aliases for the pre-audit names. */
export const collectionImages = campaignImages;

/** Circular index so a caller can page through a set without bounds checks. */
function wrap<T>(list: readonly T[], index: number): T {
  return list[((index % list.length) + list.length) % list.length];
}

export function productImage(index: number) {
  return wrap(productImages, index);
}

export function collectionImage(index: number) {
  return wrap(campaignImages, index);
}

export function membershipImage(index: number) {
  return wrap(membershipImages, index);
}

export function profileImage(index: number) {
  return wrap(profileImages, index);
}
