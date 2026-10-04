# KYNTRA — IMPLEMENTATION PLAN

Derived from Figma file `lci4QpXkmuC1Bs8M98r9OV` ("KYNTRA", 16 pages, 60 frames).
All values below are **extracted from Figma**, not invented.

---

## PHASE 1 — PROJECT AUDIT

| Check | Result |
|---|---|
| `package.json` | **absent** |
| `app.json` / `app.config.ts` | **absent** |
| `tsconfig.json` | **absent** |
| `babel.config.js` / `metro.config.js` | **absent** |
| `node_modules` | **absent** |
| `.git` | **absent** |
| Expo Router installed | No |
| Existing source files | **none** |
| Existing assets | **none** |

**Verdict: greenfield.** Nothing to preserve, nothing to break. Scaffold from scratch.

Directory currently holds only `.gitignore`, `opencode.json`, `plan.md`.

---

## PHASE 2 — FIGMA AUDIT

### Page map

| # | Page | Node | Frames |
|---|---|---|---|
| 01 | Design System | `0:1` | foundations, color, type, rhythm, a11y |
| 02 | Components | `9:4751` | editable inventory + native library |
| 03 | Onboarding & Authentication | `9:4752` | 11 |
| 04 | **Home** | `9:4753` | 4 |
| 05 | Shop | `9:4754` | 5 |
| 06 | Search | `9:4755` | 5 |
| 07 | Product Details | `9:4756` | 7 |
| 08 | Bag & Checkout | `9:4757` | 9 |
| 09 | Orders | `9:4758` | 3 |
| 10 | Favorites | `9:4759` | 3 |
| 11 | Profile | `9:4760` | 5 |
| 12 | Settings | `9:4761` | 2 |
| 13 | Notifications | `9:4762` | 3 |
| 14 | Membership | `9:4763` | 4 |
| 15 | Help Center | `9:4764` | 2 |
| 16 | Prototype Flow | `9:4765` | — |

Target viewport: **360–412dp** (Android). Reference frames are `412×915` and `360×800`.

### Design tokens (authoritative)

**Color — 7 tokens, monochrome-first**

| Token | Value |
|---|---|
| `primary` (text) | `#111111` |
| `background` | `#FFFFFF` |
| `secondary` (surface) | `#F5F5F5` |
| `secondaryText` | `#6B6B6B` |
| `border` | `#E5E5E5` |
| `success` | `#26734D` |
| `error` | `#B73535` |

**Typography — Inter**

| Role | Size | Weight | Line height |
|---|---|---|---|
| `display` | 40 | 800 | — |
| `headline` | 28 | 700 | 1.12 |
| `section` | 22 | 700 | 1.12 |
| `title` (app bar) | 20 | 700 | — |
| `body` | 15 | 400 | 1.5 |
| `label` | 13 | 600 | — |
| `caption` | 11 | 400 | — |

**Spacing — 8dp grid**

- 24dp page margins
- 16dp between cards
- 32dp between sections
- 48dp minimum interactive target
- Observed in layouts: 4, 8, 12, 16, 20, 24, 32, 40, 48

**Radius**

| Token | Value | Use |
|---|---|---|
| `handle` | 4 | gesture handle |
| `input` | 16 | inputs |
| `card` | 20 | product cards |
| `nav` | 36 | floating navigation |
| `pill` | 40 | pill actions / icon buttons (fully round) |

**Chrome**

- Android status bar `h32`, padding `0 24`
- App bar `h64`, padding `0 16`, gap 8
- Nav safe area `h28`, gesture handle `108×4` radius 4

### Reusable component templates found in Figma

| ID | Description | Spec |
|---|---|---|
| `EL-d4a9289a` | Card | column, padding 16, gap 12, `#F5F5F5`, radius 20 |
| `EL-8fda660c` | Icon action | 48×48, row centered, radius 40 |
| `EL-12e2d7a9` | Section heading | row, gap 12, center |
| `EL-03e637ae` | Stack | column, gap 24 |
| `EL-ec900ebf` | Stack tight | column, gap 12 |

---

## Screen → Route Map

| Figma screen | Route |
|---|---|
| Splash `9:303` | `app/index.tsx` |
| Onboarding `9:318` `9:343` `9:368` | `app/(auth)/onboarding.tsx` |
| Welcome `9:393` | `app/(auth)/welcome.tsx` |
| Sign In `9:413` `9:451` `9:560` | `app/(auth)/sign-in.tsx` |
| Create Account `9:489` | `app/(auth)/create-account.tsx` |
| Forgot Password `9:533` | `app/(auth)/forgot-password.tsx` |
| **Home** `9:593` `9:655` `9:717` | `app/(tabs)/index.tsx` |
| Shop `9:928` `9:1008` | `app/(tabs)/shop.tsx` |
| Filters `9:1338` | `app/(tabs)/shop.tsx` (sheet) |
| Sort `9:1437` | `app/(tabs)/shop.tsx` (sheet) |
| Search `9:1108` `9:1173` `9:1226` `9:1297` | `app/(tabs)/search.tsx` |
| Bag `9:1837` `9:1865` | `app/(tabs)/bag.tsx` |
| Favorites `9:2242` `9:2302` | `app/(tabs)/favorites.tsx` |
| Profile `9:2332` `9:2420` `9:2460` `9:2498` | `app/(tabs)/profile.tsx` |
| Product Details `9:1496` `9:1547` `9:1598` `9:1708` `9:3095` `9:3180` | `app/product/[id].tsx` |
| Checkout 1 Address `9:1932` | `app/checkout/address.tsx` |
| Checkout 2 Delivery `9:1986` | `app/checkout/delivery.tsx` |
| Checkout 3 Payment `9:2030` | `app/checkout/payment.tsx` |
| Add Payment `9:2080` | `app/checkout/add-payment.tsx` |
| Checkout 4 Review `9:2132` | `app/checkout/review.tsx` |
| Order Success `9:2201` | `app/checkout/success.tsx` |
| Orders `9:2533` | `app/orders/index.tsx` |
| Order Detail `9:2635` | `app/orders/[id].tsx` |
| Settings `9:2745` | `app/settings/index.tsx` |
| Notifications `9:2835` `9:2905` | `app/notifications/index.tsx` |
| Membership `9:2941` `9:3024` `9:3061` | `app/membership/index.tsx` |
| Help Center `9:3226` | `app/help/index.tsx` |

**Tabs (6):** Home · Shop · Search · Favorites · Bag · Profile

Favorites is a top-level tab (Figma page `9:4759` gives it a full page, not just
a Profile row). Auth is gated: root routes to onboarding until signed in.

**Chrome:** Figma frames include Android status bar (`h32`) and navigation safe
area (`h28`) as *design* elements. In Expo these come from
`react-native-safe-area-context` — do **not** hand-build them, or you'll
double-pad on real devices.

---

## Component List

Build only what Figma evidences:

`Text` (variant-driven) · `Button` (primary/secondary/pill) · `IconButton` ·
`Card` · `ProductCard` · `ProductGrid` · `ProductCarousel` · `CategoryTile` ·
`SearchBar` · `FilterChip` · `SizeSelector` · `ColorSelector` · `QuantitySelector` ·
`Price` · `Rating` · `Badge` · `SectionHeader` · `Header` · `TabBar` ·
`InputField` · `PasswordField` · `Toggle` · `Avatar` · `ListItem` ·
`ProductImageGallery` · `FavoriteButton` · `CartItem` · `OrderCard` ·
`AddressCard` · `PaymentMethodCard` · `BottomSheet` · `EmptyState` ·
`LoadingState` · `ErrorState` · `Divider`

Icons: Figma uses **Inter** glyph shapes and generic Android chrome. Use
`@expo/vector-icons` (ships with Expo — no extra dependency) rather than
inventing brand icons.

---

## Data Models

```ts
type Product = {
  id: string; name: string; description: string; price: number;
  category: string; images: string[]; sizes: string[]; colors: ColorOption[];
  rating: number; reviewCount: number; stock: number;
  featured: boolean; collection?: string;
};

type CartItem = { productId: string; size: string; color: string; quantity: number };
type Order = { id: string; items: CartItem[]; totals: Totals; status: OrderStatus;
              placedAt: string; address: Address; payment: PaymentMethod };
type Address = { id: string; label: string; line1: string; line2?: string;
                 city: string; postcode: string; isDefault: boolean };
type PaymentMethod = { id: string; brand: string; last4: string; isDefault: boolean };
```

## Services

`productService` · `cartService` · `orderService` · `authService` · `userService` ·
`notificationService` · `membershipService` · `aiSearchService`

Figma includes an **AI / barcode search** entry (`9:1108`) → implement
`aiSearchService` as a local mock. No API keys in the app.

## State

React Context + hooks, one context per domain. No Redux.

## Persistence

`@react-native-async-storage/async-storage` (Expo Go compatible).
Persist: auth, profile, favorites, cart, orders, addresses, settings, recent searches.

---

## Implementation Phases

| # | Phase | Status |
|---|---|---|
| 1 | Project audit | ✅ done |
| 2 | Figma audit + this plan | ✅ done |
| 3 | Scaffold Expo + TS + Router; theme; types; mock data; services; state | ✅ done |
| 4 | Root layout, safe areas, TabBar, base components | ✅ done |
| 5 | Screens in order: Home → Shop → Search → Product → Bag → Checkout → Profile | ✅ done |
| 6 | Secondary screens (Orders, Favorites, Settings, Notifications, Membership, Help) | ✅ done |
| 7 | Persistence (all state AsyncStorage-backed) | ✅ done |
| 8 | Typecheck + lint + bundle + runtime smoke test | ✅ done |
| 9 | Export real photography from Figma into `assets/images/**` | ⬜ pending |
| 10 | Visual QA against Figma, frame by frame | ⬜ pending |
| 11 | Cleanup + commit | ⬜ in progress |

### Verified (phase 8)

```
npx tsc --noEmit                 exit 0
npx expo lint                    exit 0  (0 errors, 0 warnings)
npx expo export --platform android  ok
npx expo export --platform web      ok
```

All 30 routes were loaded in a browser against the web export with a seeded
session: every route renders, zero console errors. Verified working — Shop lists
all 12 products, Home renders categories + Featured + New in, Bag renders its
empty state, Product detail renders gallery/rating/size/colour selectors,
Order detail renders items and totals, Review renders the checkout summary.

### Deviations from the plan above

- **Route paths are `src/app/**`, not `app/**`** (Expo Router is configured with
  `src` as the router root via `tsconfig.json` `paths`).
- **No `src/app/index.tsx`.** The tabs group already owns `/`, so a root index
  would be a duplicate route. The auth gate is an `<AuthGate/>` sibling of
  `<Stack/>` in `src/app/_layout.tsx` instead.
- **No Splash route.** Expo's native splash (`app.json` → `splash`) covers it;
  a JS splash route would double-flash. Figma's `9:303` is represented by
  `assets/images/splash-icon.png`.
- **No `ios/` or `android/` directories** are committed. Continuous Native
  Generation produces them; native behaviour is configured in `app.json`.
- **Icons are a hand-built typed registry**, not `@expo/vector-icons`. Figma uses
  Inter glyph shapes, so a generic icon font would not match the design.
- **`Toggle` reuses RN `Switch`** rather than a Figma component — Figma shows no
  dedicated switch spec.
- **Six tabs, not five.** Figma's bottom-nav component `EL-3611a7a6` is a
  `repeat(5, 1fr)` grid, but page `9:4759` gives Favorites a full screen. Favorites
  was promoted to a tab.

---

## Currency — corrected to Philippine pesos

The design is priced in **₱ (PHP)** throughout. Every price-bearing frame was
checked (Home, Shop, Product Details, Search, Bag, Orders, Membership) and contains
**zero** `£` or `$` glyphs. An earlier pass had used GBP, which was wrong.

Corrected to match the file:

| | Was | Now | Figma source |
|---|---|---|---|
| Symbol | `£` | `₱` | all price frames |
| Grouping | none | thousands separator | `₱5,490`, `₱7,430` |
| Decimals | `.00` on totals | none | Figma shows integers only |
| Tax line | 20% VAT on bag/checkout/orders | **removed** | `₱7,280 + ₱150 = ₱7,430` — no tax row |
| Delivery fee | `4.95` | `₱150` | Bag frame `9:1837` |
| Free delivery over | `75` | `₱8,000` | Home promo card `9:912` |

`Totals` no longer has a `tax` field, which is also correct for the market — PHP
retail prices are VAT-inclusive.

The first four catalogue entries are now taken verbatim from the Shop grid
(`9:967`) and use the real exported photography:

| Product | Category line | Price | Badge | Image |
|---|---|---|---|---|
| Paceform 01 | Road running shoes | ₱5,490 | New | `product-1.jpg` (real) |
| Formknit Tee | Training essentials | ₱1,790 | — | `product-2.jpg` (real) |
| Driftline Short | Running · Men | ₱2,290 (was ₱2,890) | Sale | `product-3.jpg` (real) |
| Transit Crossbody | Everyday accessories | ₱1,490 | — | `product-4.jpg` (real) |

Seed order `KY-10482` reproduces frame `9:2533` exactly: those two products are a
₱7,280 subtotal, under the ₱8,000 threshold, so ₱150 delivery gives ₱7,430.

---

## Open questions

1. **Membership model.** Figma's Membership page (`9:4763`) is a points-and-rewards
   scheme — "KYNTRA Pass", a live balance, "Earn 1 point per ₱10 spent", a ₱500
   reward redeemable for 1,000 points on orders over ₱2,500, plus run-club events.
   It defines **no subscription tiers or monthly price**. The current screen renders
   two invented tiers (Member / KYNTRA Plus ₱499). Reworking it onto the points
   model is a genuine design change, so it is flagged rather than done unasked.
2. **Product and category imagery is only partly real.** Figma photographs just
   four products and no category tiles. `product-5..8.png` and all six
   `category-*.png` remain generated placeholders — see `src/data/images.ts`.
   The real files are `.jpg` because Figma stores them as JPEG; `npm run
   check:assets` fails the build if any extension disagrees with its bytes.
3. **Catalogue is 13 products; Figma's Shop grid shows 12.** The extra entries are
   invented to fill the grid.
4. **Figma PAT in `opencode.json`** is plaintext (gitignored). It was exposed in
   session logs and should be treated as compromised and rotated.

---

## Constraints & Risks

| Issue | Impact | Mitigation |
|---|---|---|
| **Figma student plan API rate limit** | 429 on rapid calls | Batch Figma reads; cache results to disk |
| **PAT missing `file_variables:read`** | No Figma Variables API | Not a blocker — Design System page documents all tokens |
| **Official Figma MCP OAuth fails** | No write-to-canvas | PAT server is read-only; acceptable for this build |
| Expo Go native limits | Barcode scanner | Mock scanner flow, no native module |
