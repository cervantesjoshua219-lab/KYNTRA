import type { Category, Product } from '@/types';
import { campaignImages, productPhotos } from './images';

/**
 * Mock catalogue.
 *
 * There is no backend. `productService` serves this data with a short delay so
 * screens exercise their loading states honestly.
 *
 * **These six products are the complete set Figma actually depicts.** Every
 * name, tagline, peso price, original price, badge and rating below was read
 * off a price-bearing frame in the file, and every product has real exported
 * photography. An earlier revision padded this out to thirteen entries with
 * invented products and generated placeholder tiles; that was filler standing
 * in for content the design does not have, so it is gone. Six real products
 * with real imagery is closer to the design than thirteen with half of them
 * fake.
 *
 * The two products Figma shoots twice (Contour 02, Airweave Cap) carry both
 * angles so the detail gallery has more than one page to swipe.
 *
 * Colour options are deliberately restricted to the neutral Figma palette â€” the
 * design system defines no saturated product colours.
 */

/** Colourway shown on the product page: Figma's `Pearl / Graphite`. */
const NEUTRALS = [
  { name: 'Pearl', hex: '#F5F5F5' },
  { name: 'Graphite', hex: '#6B6B6B' },
  { name: 'Onyx', hex: '#111111' },
];

export const products: Product[] = [
  {
    id: 'paceform-01',
    name: 'Paceform 01',
    tagline: 'Road running shoes',
    description:
      'A lighter way forward. Responsive dual-density cushioning and breathable engineered mesh bring effortless comfort to daily miles and everything after.',
    price: 5490,
    category: 'Shoes',
    sport: 'Running',
    images: [productPhotos.paceform01],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: NEUTRALS,
    rating: 4.8,
    reviewCount: 128,
    stock: 12,
    featured: true,
    isNew: true,
  },
  {
    id: 'formknit-tee',
    name: 'Formknit Tee',
    tagline: 'Training essentials',
    description:
      'Dense jersey that holds its shape through repeated washes. Wide neck opening, straight body, sold singly.',
    price: 1790,
    category: 'Apparel',
    sport: 'Training',
    images: [productPhotos.formknitTee],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: NEUTRALS,
    rating: 4.5,
    reviewCount: 212,
    stock: 40,
    featured: true,
  },
  {
    id: 'driftline-short',
    name: 'Driftline Short',
    tagline: 'Running Â· Men',
    description:
      'Lightweight running short with a bonded waistband and a zip pocket. Lined brief, quick-dry finish.',
    price: 2290,
    compareAtPrice: 2890,
    category: 'Apparel',
    sport: 'Running',
    images: [productPhotos.driftlineShort],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: NEUTRALS,
    rating: 4.2,
    reviewCount: 133,
    stock: 24,
    featured: true,
  },
  {
    id: 'transit-crossbody',
    name: 'Transit Crossbody',
    tagline: 'Everyday accessories',
    description:
      'Compact crossbody with a magnetic front pocket and an adjustable webbing strap. Water-resistant recycled nylon.',
    price: 1490,
    category: 'Accessories',
    sport: 'Lifestyle',
    images: [productPhotos.transitCrossbody],
    sizes: ['One size'],
    colors: NEUTRALS,
    rating: 4.5,
    reviewCount: 42,
    stock: 18,
  },
  {
    id: 'contour-02',
    name: 'Contour 02',
    tagline: 'Lifestyle shoes',
    description:
      'A sculpted everyday trainer with a padded collar and a cupsole built for long days on your feet.',
    price: 4990,
    category: 'Shoes',
    sport: 'Lifestyle',
    images: [productPhotos.contour02, productPhotos.contour02Alt],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: NEUTRALS,
    rating: 4.6,
    reviewCount: 96,
    stock: 16,
    featured: true,
  },
  {
    id: 'airweave-cap',
    name: 'Airweave Cap',
    tagline: 'Running accessories',
    description:
      'Featherweight five-panel cap with a moisture-wicking band. Packs flat for days when the weather turns.',
    price: 990,
    category: 'Accessories',
    sport: 'Running',
    images: [productPhotos.airweaveCap, productPhotos.airweaveCapAlt],
    sizes: ['One size'],
    colors: NEUTRALS,
    rating: 4.4,
    reviewCount: 64,
    stock: 50,
  },
];

/**
 * Sport filters, exactly as Figma's Home selection group spells them
 * (nodes `9:777`-`9:783`). These are text chips in the design â€” there is no
 * category artwork anywhere in the file â€” so they carry no image.
 *
 * `image` stays in the type as `string | null` because the design system page
 * defines a category tile component; nothing on the live screens uses it yet.
 */
export const SPORT_FILTERS = ['Running', 'Training', 'Lifestyle', 'Basketball'] as const;

export const categories: Category[] = SPORT_FILTERS.map((name) => ({
  id: name.toLowerCase(),
  name,
  // Counted from the catalogue rather than typed in. The hand-maintained
  // numbers drifted out of step with the products and mislabelled the chips.
  count: products.filter((p) => p.sport === name).length,
  image: null,
}));

/**
 * Home editorial campaigns, in Figma's stacking order. Copy is verbatim from
 * the campaign message blocks at `9:737`, `9:787` and `9:880`.
 */
export const collections = [
  {
    id: 'paceform',
    eyebrow: 'THE PACEFORM COLLECTION',
    name: 'Find your\nforward.',
    blurb: 'A lighter way forward. Responsive dual-density cushioning for daily miles and everything after.',
    image: campaignImages[0],
  },
  {
    id: 'everyday',
    eyebrow: 'FORM / FUNCTION / FREEDOM',
    name: 'Everyday.\nExtraordinary.',
    blurb: 'Built for the everyday mile. Wipe clean, air dry, keep moving.',
    image: campaignImages[1],
  },
  {
    id: 'built-to-do-more',
    eyebrow: 'BUILT TO DO MORE',
    name: 'Train with\nintention.',
    blurb: 'Kit that works for the training and the hours after.',
    image: campaignImages[2],
  },
];

export function findProduct(id: string) {
  return products.find((p) => p.id === id) ?? null;
}

export function findCategory(id: string) {
  return categories.find((c) => c.id === id) ?? null;
}
