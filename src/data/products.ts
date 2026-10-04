import type { Category, Product } from '@/types';
import { productImage, categoryImage, collectionImage } from './images';

/**
 * Mock catalogue.
 *
 * There is no backend. `productService` serves this data with a short delay so
 * screens exercise their loading states honestly.
 *
 * The first four entries are taken verbatim from the Figma Shop grid
 * (`9:967`) — name, category line, peso price, sale/original price, New/Sale
 * badge — and use the real photography exported from that file. Prices are
 * matched to `productImage(0..3)` in `./images`; do not reorder one without
 * the other. The remaining eight are invented to fill out the grid, because
 * Figma only photographs four products, and use the neutral placeholders.
 *
 * Colour options are deliberately restricted to the neutral Figma palette — the
 * design system defines no saturated product colours.
 */

const SIZES_APPAREL = ['XS', 'S', 'M', 'L', 'XL'];
const SIZES_SHOE = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

const NEUTRALS = [
  { name: 'Onyx', hex: '#111111' },
  { name: 'Slate', hex: '#6B6B6B' },
  { name: 'Stone', hex: '#E5E5E5' },
  { name: 'Bone', hex: '#F5F5F5' },
  { name: 'Chalk', hex: '#FFFFFF' },
];

export const products: Product[] = [
  // --- Figma-documented, real photography (Shop grid 9:970 - 9:993) ---
  {
    id: 'paceform-01',
    name: 'Paceform 01',
    tagline: 'Road running shoes',
    description:
      'A low-profile road running shoe built for daily mileage. Foam midsole with a rubber outsole for grip on hard surfaces, and a breathable knit upper that softens with wear.',
    price: 5490,
    category: 'Footwear',
    images: [productImage(0), productImage(4), productImage(2)],
    sizes: SIZES_SHOE,
    colors: NEUTRALS,
    rating: 4.6,
    reviewCount: 218,
    stock: 12,
    featured: true,
    isNew: true,
    collection: 'Everyday',
  },
  {
    id: 'formknit-tee',
    name: 'Formknit Tee',
    tagline: 'Training essentials',
    description:
      'Dense 240gsm jersey that holds its shape through repeated washes. Wide neck opening, straight body, sold singly.',
    price: 1790,
    category: 'Apparel',
    images: [productImage(1), productImage(5)],
    sizes: SIZES_APPAREL,
    colors: NEUTRALS,
    rating: 4.5,
    reviewCount: 512,
    stock: 40,
    featured: true,
    collection: 'Everyday',
  },
  {
    id: 'driftline-short',
    name: 'Driftline Short',
    tagline: 'Running · Men',
    description:
      'Lightweight 5-inch running short with a bonded waistband and a zip pocket. Lined brief, quick-dry finish.',
    price: 2290,
    compareAtPrice: 2890,
    category: 'Apparel',
    images: [productImage(2), productImage(6)],
    sizes: SIZES_APPAREL,
    colors: NEUTRALS,
    rating: 4.2,
    reviewCount: 133,
    stock: 24,
    featured: true,
    collection: 'Road',
  },
  {
    id: 'transit-crossbody',
    name: 'Transit Crossbody',
    tagline: 'Everyday accessories',
    description:
      'Compact crossbody with a magnetic front pocket and an adjustable webbing strap. Water-resistant recycled nylon.',
    price: 1490,
    category: 'Accessories',
    images: [productImage(3)],
    sizes: ['One size'],
    colors: [NEUTRALS[0], NEUTRALS[1], NEUTRALS[2]],
    rating: 4.5,
    reviewCount: 42,
    stock: 18,
    collection: 'Everyday',
  },

  // --- Invented to fill out the grid (neutral placeholders) ---
  {
    id: 'paceform-02',
    name: 'Paceform 02',
    tagline: 'Road runner',
    description:
      'Lighter than the 01 with a rockered geometry that rolls forward. Built for tempo runs and long distances on hard surfaces.',
    price: 6190,
    category: 'Footwear',
    images: [productImage(4), productImage(0)],
    sizes: SIZES_SHOE,
    colors: [NEUTRALS[0], NEUTRALS[1], NEUTRALS[2]],
    rating: 4.4,
    reviewCount: 96,
    stock: 8,
    featured: true,
    collection: 'Road',
  },
  {
    id: 'axis-trouser',
    name: 'Axis Trouser',
    tagline: 'Tapered everyday',
    description:
      'Stretch twill with a tapered leg and a clean waistband. Holds shape through the day without creasing.',
    price: 3290,
    category: 'Apparel',
    images: [productImage(5), productImage(1)],
    sizes: SIZES_APPAREL,
    colors: NEUTRALS,
    rating: 4.6,
    reviewCount: 189,
    stock: 22,
    collection: 'Everyday',
  },
  {
    id: 'axis-short',
    name: 'Axis Short',
    tagline: '5-inch running short',
    description:
      'Lightweight short with a bonded waistband and a zip pocket. Lined brief.',
    price: 1940,
    category: 'Apparel',
    images: [productImage(6)],
    sizes: SIZES_APPAREL,
    colors: [NEUTRALS[0], NEUTRALS[1], NEUTRALS[3]],
    rating: 4.2,
    reviewCount: 133,
    stock: 30,
    collection: 'Road',
  },
  {
    id: 'strada-jacket',
    name: 'Strada Jacket',
    tagline: 'Packable shell',
    description:
      'Water-resistant shell that folds into its own chest pocket. Seam-taped shoulders and a two-way zip.',
    price: 5990,
    category: 'Outerwear',
    images: [productImage(7), productImage(4)],
    sizes: SIZES_APPAREL,
    colors: [NEUTRALS[0], NEUTRALS[1], NEUTRALS[4]],
    rating: 4.7,
    reviewCount: 64,
    stock: 6,
    featured: true,
    isNew: true,
    collection: 'All-weather',
  },
  {
    id: 'strada-vest',
    name: 'Strada Vest',
    tagline: 'Insulated layer',
    description:
      'Lightweight synthetic fill with a wind-resistant face. Packs flat, layers under the Strada Jacket.',
    price: 3430,
    category: 'Outerwear',
    images: [productImage(4)],
    sizes: SIZES_APPAREL,
    colors: NEUTRALS.slice(0, 4),
    rating: 4.3,
    reviewCount: 77,
    stock: 15,
    collection: 'All-weather',
  },
  {
    id: 'terra-hood',
    name: 'Terra Hood',
    tagline: 'Midweight sweatshirt',
    description:
      'Brushed cotton-blend fleece with a lined hood and ribbed cuffs. Sits comfortably over a base layer without bulk.',
    price: 3990,
    category: 'Apparel',
    images: [productImage(5)],
    sizes: SIZES_APPAREL,
    colors: NEUTRALS,
    rating: 4.8,
    reviewCount: 341,
    stock: 24,
    collection: 'Everyday',
  },
  {
    id: 'relay-sock',
    name: 'Relay Sock',
    tagline: 'Cushioned crew',
    description:
      'Cushioned crew sock with a reinforced heel and arch support. Three pairs.',
    price: 990,
    category: 'Accessories',
    images: [productImage(6)],
    sizes: ['S/M', 'L/XL'],
    colors: NEUTRALS,
    rating: 4.0,
    reviewCount: 260,
    stock: 60,
    collection: 'Road',
  },
  {
    id: 'circuit-sling',
    name: 'Circuit Sling',
    tagline: 'Compact sling',
    description:
      'Compact sling with a magnetic front pocket and an adjustable webbing strap. Water-resistant nylon.',
    price: 2500,
    category: 'Accessories',
    images: [productImage(7)],
    sizes: ['One size'],
    colors: [NEUTRALS[0], NEUTRALS[2]],
    rating: 4.5,
    reviewCount: 42,
    stock: 18,
    isNew: true,
    collection: 'Everyday',
  },
  {
    id: 'circuit-cap',
    name: 'Circuit Cap',
    tagline: 'Six-panel cap',
    description:
      'Unstructured six-panel cap with a metal adjuster. Cotton twill.',
    price: 1290,
    category: 'Accessories',
    images: [productImage(3)],
    sizes: ['One size'],
    colors: NEUTRALS,
    rating: 4.1,
    reviewCount: 87,
    stock: 50,
    collection: 'Everyday',
  },
];

export const categories: Category[] = [
  { id: 'footwear', name: 'Footwear', count: 2, image: categoryImage(0) },
  { id: 'apparel', name: 'Apparel', count: 5, image: categoryImage(1) },
  { id: 'outerwear', name: 'Outerwear', count: 2, image: categoryImage(2) },
  { id: 'accessories', name: 'Accessories', count: 4, image: categoryImage(3) },
];

export const collections = [
  {
    id: 'everyday',
    name: 'Everyday',
    blurb: 'Built for the hours between training and everything else.',
    image: collectionImage(0),
  },
  {
    id: 'road',
    name: 'Road',
    blurb: 'Lightweight kit for distance work.',
    image: collectionImage(1),
  },
  {
    id: 'all-weather',
    name: 'All-weather',
    blurb: 'Protection that packs down small.',
    image: collectionImage(2),
  },
];

export function findProduct(id: string) {
  return products.find((p) => p.id === id) ?? null;
}

export function findCategory(id: string) {
  return categories.find((c) => c.id === id) ?? null;
}