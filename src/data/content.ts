import type { AppNotification } from '@/types';

/**
 * Mock editorial content: reviews, notifications, help centre, size guide.
 *
 * See src/data/products.ts for why this is local rather than fetched.
 */

export type Review = {
  id: string;
  author: string;
  rating: number;
  /** "2 weeks ago" — Figma renders relative time, not absolute dates. */
  relativeDate: string;
  title: string;
  body: string;
  /** Star rating the reviewer gave for fit / quality / value. */
  aspects: { fit: number; quality: number; value: number };
  verified: boolean;
  helpfulCount: number;
};

export const reviews: Record<string, Review[]> = {
  'paceform-01': [
    {
      id: 'r1',
      author: 'Jordan A.',
      rating: 5,
      relativeDate: '2 weeks ago',
      title: 'Sizing runs true',
      body: 'Bought my usual size and the fit is spot on. Wore them straight out of the box for a week, no heel slip. Cushioning is firmer than I expected in a good way.',
      aspects: { fit: 5, quality: 5, value: 4 },
      verified: true,
      helpfulCount: 24,
    },
    {
      id: 'r2',
      author: 'Priya S.',
      rating: 4,
      relativeDate: '1 month ago',
      title: 'Great, narrow through the midfoot',
      body: 'Comfortable for long sessions. If you have a wide foot, size up — the midfoot is snug. Delivery took four days.',
      aspects: { fit: 3, quality: 5, value: 5 },
      verified: true,
      helpfulCount: 11,
    },
    {
      id: 'r3',
      author: 'Marcus T.',
      rating: 5,
      relativeDate: '6 weeks ago',
      title: 'Second pair',
      body: 'First pair lasted about eight months of daily wear. Bought another because nothing else fit this well.',
      aspects: { fit: 5, quality: 5, value: 5 },
      verified: false,
      helpfulCount: 8,
    },
  ],
  'terra-hood': [
    {
      id: 'r4',
      author: 'Alex R.',
      rating: 5,
      relativeDate: '3 days ago',
      title: 'Warm without bulk',
      body: 'Lined hood actually stays up, which is rare. Fits over a base layer without feeling crowded.',
      aspects: { fit: 5, quality: 4, value: 5 },
      verified: true,
      helpfulCount: 6,
    },
  ],
};

/** Shown on the product page when a product has no reviews yet. */
export const emptyReviews: Review[] = [];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'order',
    title: 'Order KY-10482 shipped',
    body: 'Your order left the depot and should arrive tomorrow.',
    createdAt: Date.now() - 4 * HOUR,
    read: false,
    href: '/orders',
  },
  {
    id: 'n2',
    kind: 'promotion',
    title: 'Early access: Strada Jacket',
    body: 'Two days before everyone else. Sizes are limited.',
    createdAt: Date.now() - 26 * HOUR,
    read: false,
    href: '/product/strada-jacket',
  },
  {
    id: 'n3',
    kind: 'account',
    title: 'Sign-in from a new device',
    body: 'A sign-in was detected from an Android device you have not used before.',
    createdAt: Date.now() - 3 * DAY,
    read: true,
    href: '/settings',
  },
  {
    id: 'n4',
    kind: 'support',
    title: 'How are we doing?',
    body: 'Rate your last order to help the team improve.',
    createdAt: Date.now() - 6 * DAY,
    read: true,
  },
];

/** Rows on the Help Center screen. */
export const helpTopics = [
  {
    id: 'orders',
    title: 'Orders & delivery',
    body: 'Track, change or cancel an order.',
    articleCount: 6,
  },
  {
    id: 'returns',
    title: 'Returns & exchanges',
    body: '30-day returns, free within the UK.',
    articleCount: 5,
  },
  {
    id: 'sizing',
    title: 'Sizing & fit',
    body: 'Measurements and fit guidance per product.',
    articleCount: 4,
  },
  {
    id: 'payment',
    title: 'Payment & billing',
    body: 'Cards, invoices and refund timing.',
    articleCount: 7,
  },
  {
    id: 'account',
    title: 'Account & membership',
    body: 'KYNTRA Plus benefits and account security.',
    articleCount: 8,
  },
];

export const sizeGuideRows = {
  Footwear: {
    columns: ['UK', 'EU', 'US', 'Foot length (cm)'],
    rows: [
      ['UK 6', 'EU 38', 'US 5', '23.5'],
      ['UK 7', 'EU 39', 'US 6', '24.4'],
      ['UK 8', 'EU 41', 'US 7', '25.4'],
      ['UK 9', 'EU 43', 'US 8', '26.5'],
      ['UK 10', 'EU 44', 'US 9', '27.5'],
      ['UK 11', 'EU 45', 'US 10', '28.5'],
    ],
  },
  Apparel: {
    columns: ['Size', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)'],
    rows: [
      ['XS', '86–91', '71–76', '84–89'],
      ['S', '91–96', '76–81', '89–94'],
      ['M', '97–102', '82–87', '95–100'],
      ['L', '103–108', '88–94', '101–107'],
      ['XL', '109–116', '95–102', '108–115'],
    ],
  },
} as const;

/**
 * KYNTRA Plus tiers on the Membership screen.
 *
 * NOTE — divergence from the design. Figma's Membership page (`9:4763`) models
 * membership as a points-and-rewards scheme, not subscriptions: "KYNTRA Pass",
 * a live point balance, "Earn 1 point per ₱10 spent", a ₱500 shopping reward
 * redeemable for 1,000 points on orders over ₱2,500, and member run-club events.
 * It defines no monthly price at all, so the two tiers below are invented to
 * give the screen something to render. Reworking the screen onto the points
 * model is a real design change and is deliberately left as a follow-up —
 * see the open questions in `IMPLEMENTATION_PLAN.md`.
 */
export const membershipTiers = [
  {
    id: 'member',
    name: 'Member',
    price: 'Free',
    period: null as string | null,
    benefits: [
      'Early access to launches',
      'Free returns within 30 days',
      'Order tracking',
    ],
  },
  {
    id: 'plus',
    name: 'KYNTRA Plus',
    price: '₱499',
    period: 'per month',
    benefits: [
      'Free next-day delivery',
      '15% off everything',
      'Member-only colourways',
      'Extended 60-day returns',
    ],
  },
];