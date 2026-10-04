# KYNTRA — COMPLETE MOBILE APP DEVELOPMENT MASTER PROMPT

You are the lead senior React Native / Expo mobile engineer responsible for implementing my KYNTRA mobile e-commerce application.

Your job is to turn my existing Figma design into a fully functional, production-quality Android mobile application using React Native + Expo + TypeScript.

==================================================
1. PROJECT INFORMATION
==================================================

Application name:
KYNTRA

Platform:
Android

Framework:
React Native

Development framework:
Expo

Language:
TypeScript

Runtime:
Expo Go during development

Primary development environment:
Windows + VS Code + OpenCode

Project directory:
The current directory where OpenCode is running.

Figma design:
https://www.figma.com/design/lci4QpXkmuC1Bs8M98r9OV/Untitled?node-id=0-1&t=rYhMfgZ1pgO1FPMJ-1

The Figma file is the PRIMARY VISUAL SOURCE OF TRUTH.

Do not redesign the application.

Do not replace the visual design with your own interpretation.

Do not create a generic e-commerce template.

The final application must visually and structurally follow the existing KYNTRA Figma design as closely as technically possible.

==================================================
2. PRIMARY OBJECTIVE
==================================================

Build the complete KYNTRA mobile application from the existing Figma design.

The application must:

- Run successfully with Expo
- Run successfully in Expo Go
- Work on Android
- Be responsive across common Android screen sizes
- Follow the Figma design closely
- Have working navigation
- Have working buttons
- Have working product browsing
- Have working search
- Have working categories
- Have working product details
- Have working favorites
- Have working shopping bag/cart
- Have working quantity controls
- Have working checkout
- Have working order flow
- Have working profile
- Have working settings
- Have working notifications where represented
- Have working membership features where represented
- Have working help/support screens where represented
- Persist important local data
- Have loading, empty and error states
- Use reusable components
- Use TypeScript properly
- Avoid unnecessary dependencies
- Avoid hardcoded fragile layouts
- Maintain the visual language of the Figma design

This is an implementation project, not a design-generation project.

==================================================
3. IMPORTANT RULE: INSPECT BEFORE CODING
==================================================

DO NOT immediately start generating code.

First inspect the existing repository.

Determine:

1. Whether this is already an Expo project
2. Expo version
3. React Native version
4. TypeScript configuration
5. Expo Router configuration
6. Existing dependencies
7. Existing source files
8. Existing assets
9. Existing navigation
10. Existing components
11. Existing state management
12. Existing configuration files
13. Existing package.json scripts

Do not unnecessarily recreate the project if a working Expo project already exists.

Preserve useful existing code.

Only modify or replace files when necessary.

==================================================
4. FIGMA SOURCE OF TRUTH
==================================================

The Figma design is the source of truth for:

- Screen structure
- Layout
- Spacing
- Typography
- Font sizes
- Font weights
- Colors
- Border radius
- Buttons
- Cards
- Navigation
- Icons
- Product presentation
- Images
- Component appearance
- Bottom navigation
- Header structure
- Search UI
- Product details
- Cart
- Profile
- Empty states
- Forms
- Modals
- Sheets
- Visual hierarchy
- Interaction patterns
- Dark/light appearance if present

Do not invent a different visual design unless the Figma design does not specify something necessary for functionality.

When a Figma value is available, use the Figma value instead of guessing.

==================================================
5. FIGMA INSPECTION
==================================================

Before implementing screens, inspect the Figma file as thoroughly as possible.

Identify:

- Pages
- Frames
- Screen names
- Components
- Component variants
- Variables
- Colors
- Typography
- Spacing
- Icons
- Images
- Assets
- Buttons
- Cards
- Navigation
- Interactive states
- Prototype connections
- Mobile screen dimensions

Create an internal implementation map such as:

SCREEN
- Figma frame
- React Native screen
- Route
- Components required
- Data required
- Interactions required

Example:

Home
→ app/(tabs)/index.tsx

Shop
→ app/(tabs)/shop.tsx

Search
→ app/(tabs)/search.tsx

Bag
→ app/(tabs)/bag.tsx

Profile
→ app/(tabs)/profile.tsx

Product Details
→ app/product/[id].tsx

Do not assume these exact routes if the Figma structure suggests a better structure.

Use the Figma structure as the basis.

==================================================
6. IF FIGMA MCP IS AVAILABLE
==================================================

If a Figma MCP connection is available in the current OpenCode environment:

USE IT.

Inspect the design directly.

Use Figma design context, metadata, screenshots, variables and assets where available.

Do not claim that a Figma MCP connection exists unless it is actually available.

If Figma MCP is NOT available:

Do not stop the entire project.

Use the provided Figma URL and any available exported design information, screenshots, assets or existing project resources.

Do not invent Figma specifications that you cannot verify.

==================================================
7. CREATE A DESIGN SYSTEM
==================================================

Before implementing all screens, create a centralized KYNTRA design system.

Create appropriate files such as:

src/theme/colors.ts
src/theme/typography.ts
src/theme/spacing.ts
src/theme/radius.ts
src/theme/shadows.ts
src/theme/index.ts

Do not scatter arbitrary visual values throughout the application.

For example:

colors
- background
- surface
- text
- secondaryText
- border
- accent
- error
- success
- warning

typography
- display
- heading
- title
- body
- caption
- button
- price

spacing
- xs
- sm
- md
- lg
- xl
- xxl

radius
- small
- medium
- large
- pill

Use the actual Figma values whenever they are available.

==================================================
8. REUSABLE COMPONENT ARCHITECTURE
==================================================

Build reusable components instead of duplicating UI.

Potential components include:

Button
PrimaryButton
SecondaryButton
IconButton
ProductCard
ProductGrid
ProductCarousel
CategoryCard
SearchBar
FilterChip
SortButton
SizeSelector
ColorSelector
QuantitySelector
Price
Rating
Badge
SectionHeader
Header
BottomNavigation
TabBar
InputField
PasswordInput
Checkbox
RadioButton
Toggle
Avatar
ListItem
ProductImageGallery
FavoriteButton
CartItem
OrderCard
AddressCard
PaymentMethodCard
EmptyState
LoadingState
ErrorState
Skeleton
Modal
BottomSheet
ConfirmationDialog
Toast
Divider

Only create components that are actually useful.

Do not create unnecessary abstractions.

Components must be configurable through props.

==================================================
9. NAVIGATION
==================================================

Use Expo Router if the existing project supports it or if introducing it is appropriate.

Create a clean navigation structure.

Potential structure:

app/
├── _layout.tsx
├── index.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
│
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── shop.tsx
│   ├── search.tsx
│   ├── bag.tsx
│   └── profile.tsx
│
├── product/
│   └── [id].tsx
│
├── category/
│   └── [id].tsx
│
├── checkout/
│   ├── index.tsx
│   ├── address.tsx
│   ├── payment.tsx
│   └── review.tsx
│
├── orders/
│   ├── index.tsx
│   └── [id].tsx
│
├── settings/
│   └── index.tsx
│
└── help/
    └── index.tsx

Adjust this structure to the actual Figma design.

Do not force screens that don't exist in the design.

==================================================
10. BOTTOM NAVIGATION
==================================================

If the Figma design uses bottom navigation, reproduce it accurately.

The navigation should:

- Match Figma positioning
- Match icon sizes
- Match active state
- Match inactive state
- Match spacing
- Respect Android safe areas
- Work across screen widths
- Navigate correctly
- Preserve navigation state

Do not use arbitrary icons when the Figma design provides specific icons.

==================================================
11. RESPONSIVE DESIGN
==================================================

The application must work on:

- 360px Android devices
- 375px devices
- 390px devices
- 412px devices
- Larger Android devices

Do not build the UI around one fixed screen size.

Avoid excessive absolute positioning.

Use:

- Flexbox
- Dimensions
- useWindowDimensions when appropriate
- ScrollView
- FlatList
- SectionList
- Safe area handling

Layouts must adapt naturally.

Images should resize correctly.

Text should not overflow.

Buttons should remain usable.

Cards should not break at smaller widths.

==================================================
12. HOME SCREEN
==================================================

Implement the KYNTRA home screen according to Figma.

Possible elements may include:

- Header
- Greeting
- Promotional content
- Hero section
- Featured products
- Categories
- Collections
- Product cards
- Product carousel
- Recommended products
- Membership/promotional content
- Bottom navigation

DO NOT invent sections that are not in the Figma design.

Match:

- Image ratios
- Typography
- Margins
- Padding
- Card shapes
- Button appearance
- Section spacing

==================================================
13. SHOP / CATEGORY
==================================================

Implement product browsing.

Users should be able to:

- Browse products
- Open categories
- View product grids
- View product lists where appropriate
- Filter
- Sort
- Open product details

Implement filtering and sorting locally using mock product data.

==================================================
14. SEARCH
==================================================

Implement functional search.

Users should be able to:

- Enter a search term
- Search products
- See matching products
- Clear search
- View recent searches if represented
- Open product results
- Use category/filter controls if represented

Search should update dynamically.

Use debouncing if appropriate.

If the Figma design contains an AI search/Ask AI feature:

Create a service abstraction for it.

Example:

src/services/aiSearchService.ts

Do not put API keys in the mobile application.

For now, implement a mock response or local search behavior.

==================================================
15. PRODUCT DETAILS
==================================================

Product detail screens must include whatever is present in Figma.

Potential functionality:

- Product images
- Image gallery
- Product name
- Price
- Description
- Rating
- Available colors
- Available sizes
- Size selection
- Quantity
- Favorite
- Add to bag
- Buy now
- Product information
- Delivery information

All buttons must actually work.

Validate required selections before adding to bag.

==================================================
16. FAVORITES
==================================================

Implement favorite functionality.

Users should be able to:

- Favorite products
- Remove favorites
- View favorites
- Navigate to product details

Persist favorites locally.

==================================================
17. SHOPPING BAG
==================================================

Implement a fully functional cart.

Users should be able to:

- Add products
- Remove products
- Change quantity
- Select size/color
- View subtotal
- View totals
- Proceed to checkout
- Handle an empty bag

Persist cart locally.

Prevent invalid quantities.

Update totals automatically.

Use proper currency formatting.

==================================================
18. CHECKOUT
==================================================

Implement the checkout flow represented by the Figma design.

Potential steps:

1. Bag
2. Delivery address
3. Shipping
4. Payment
5. Order review
6. Confirmation

All navigation must work.

For payment:

Do NOT implement real payment processing unless credentials and a backend are explicitly provided.

Use a safe mock payment flow.

Never store real card information in local storage.

==================================================
19. ORDERS
==================================================

Implement local mock order management.

Users should be able to:

- Complete a mock order
- See order confirmation
- View order history
- Open order details
- See product information
- See order totals
- See order status

Persist orders locally.

==================================================
20. PROFILE
==================================================

Implement the profile screen according to Figma.

Potential features:

- Profile image
- Name
- Email
- Account settings
- Orders
- Favorites
- Membership
- Notifications
- Help
- Settings
- Logout

Only include what exists in the design.

==================================================
21. SETTINGS
==================================================

Implement settings shown in Figma.

Potential settings:

- Notifications
- Appearance
- Language
- Privacy
- Account
- Help
- About
- Logout

Use real functional toggles where applicable.

Persist settings locally.

==================================================
22. DATA ARCHITECTURE
==================================================

Do not hardcode product information directly inside screen components.

Create structured mock data.

Example:

src/data/products.ts

Product type should include appropriate fields such as:

id
name
description
price
category
images
sizes
colors
rating
reviewCount
isFavorite
stock
featured
collection

Use TypeScript interfaces/types.

==================================================
23. STATE MANAGEMENT
==================================================

Use a simple architecture appropriate for this application.

Possible domains:

auth
user
products
search
filters
favorites
cart
checkout
orders
notifications
membership
settings

Do not introduce Redux or another large state library unless it is genuinely necessary.

For a medium-sized Expo app, Context + hooks or a lightweight state library is acceptable.

Keep state predictable.

Avoid unnecessary global state.

==================================================
24. LOCAL STORAGE
==================================================

Use an Expo-compatible persistence solution.

Persist:

- Authentication state
- User profile
- Favorites
- Cart
- Orders
- Addresses
- Settings
- Recent searches
- Notifications if appropriate

The application should retain important information after restarting Expo.

Do not store passwords or sensitive payment information insecurely.

==================================================
25. SERVICES
==================================================

Separate business logic from UI.

Create service modules such as:

src/services/productService.ts
src/services/cartService.ts
src/services/orderService.ts
src/services/authService.ts
src/services/userService.ts
src/services/notificationService.ts
src/services/membershipService.ts
src/services/aiSearchService.ts

Initially use local/mock data.

Design these services so a real backend can be added later without rewriting the UI.

==================================================
26. ASSETS
==================================================

Use the actual assets from the design whenever possible.

Do not use random stock images simply to fill space if the actual design assets are available.

Organize assets:

assets/
├── images/
├── icons/
└── fonts/

Do not leave temporary remote Figma URLs in production code.

If an asset cannot be retrieved automatically:

1. Identify it clearly.
2. Create an appropriate local placeholder.
3. Make the asset easy to replace later.
4. Do not break the layout.

Do not invent brand logos or copyrighted assets that aren't supplied.

==================================================
27. TYPOGRAPHY
==================================================

Typography must closely match Figma.

Check:

- Font family
- Font weight
- Font size
- Line height
- Letter spacing
- Text alignment
- Text transformation

If the exact font is unavailable, select the closest legally available font and document the substitution.

Do not randomly change font sizes to make screens fit.

==================================================
28. COLORS
==================================================

Centralize all colors.

Do not repeatedly write values such as:

#000000
#FFFFFF

throughout components.

Use theme tokens.

Example:

colors.background
colors.surface
colors.primary
colors.text
colors.secondaryText
colors.border

Use exact Figma colors whenever available.

==================================================
29. ICONS
==================================================

Use the correct icon style from the Figma design.

Do not mix unrelated icon families.

If icons are provided as assets, use them.

If they are standard icons, use an Expo-compatible icon library already installed or an appropriate Expo-compatible package.

Avoid adding a dependency when the existing project already provides suitable icons.

==================================================
30. ANIMATIONS
==================================================

Use animations only where they improve the experience or match Figma.

Examples:

- Navigation transitions
- Product image transitions
- Bottom sheets
- Favorite animation
- Cart updates
- Loading states

Do not add excessive animations.

Performance is more important than unnecessary visual effects.

==================================================
31. ACCESSIBILITY
==================================================

Implement basic accessibility.

Interactive elements should have:

- accessibilityLabel
- accessibilityRole
- appropriate accessible states

Touch targets should be sufficiently large.

Do not rely only on color to communicate state.

Text should remain readable.

==================================================
32. LOADING / ERROR / EMPTY STATES
==================================================

Every asynchronous or data-dependent screen should have appropriate states.

Implement:

LoadingState
ErrorState
EmptyState
Skeleton where appropriate

Examples:

Empty bag
No search results
No favorites
No orders
Product loading
Product error

These states should follow the KYNTRA visual system.

==================================================
33. PERFORMANCE
==================================================

Optimize the application.

Use:

FlatList for large lists
SectionList where appropriate
Memoization when useful
Stable callbacks where useful
Image sizing
Lazy rendering
Avoid unnecessary re-renders

Do not optimize prematurely.

Prioritize clean, maintainable code.

==================================================
34. ERROR HANDLING
==================================================

Handle errors gracefully.

Never allow an uncaught error to crash the entire application.

Use:

try/catch
fallback states
user-friendly error messages

Do not expose technical errors directly to users.

During development, log useful debugging information.

==================================================
35. ANDROID / EXPO REQUIREMENTS
==================================================

The project must work with Expo Go.

Before installing packages, check whether they are compatible with the installed Expo SDK.

Do not blindly install native packages that cannot run inside Expo Go.

For any feature requiring native code:

1. Check Expo Go compatibility.
2. If compatible, implement it.
3. If incompatible, provide an Expo-compatible fallback.
4. Explain any limitation.

==================================================
36. BARCODE SCANNER
==================================================

If the Figma design includes barcode scanning:

Check Expo Go compatibility first.

If supported, implement it.

If not supported in the current Expo Go environment:

Create a clean fallback UI such as:

"Scan barcode"

with a mock/demo scanner flow.

Do not break the application because of unsupported native functionality.

==================================================
37. AI FEATURES
==================================================

If the design includes an AI assistant or Ask AI feature:

Implement the UI and interaction flow.

Create:

src/services/aiService.ts

Use a mock/local implementation initially.

Do not put:

API keys
private tokens
secret credentials

inside the mobile app.

The service should be replaceable with a real backend later.

==================================================
38. AUTHENTICATION
==================================================

If authentication screens exist:

Implement:

Login
Register
Forgot Password
Logout

using a local/mock authentication service.

Do not pretend this is secure production authentication.

Clearly separate mock authentication from the UI.

Design it so a real backend can replace it later.

==================================================
39. CODE QUALITY
==================================================

Use TypeScript.

Avoid `any`.

Use meaningful names.

Avoid giant components.

Split complex screens into reusable components.

Avoid duplicate code.

Keep business logic outside UI when possible.

Use comments only where they provide real value.

Do not write unnecessary comments explaining obvious code.

==================================================
40. FILE STRUCTURE
==================================================

Use a maintainable structure similar to:

app/
components/
src/
  components/
  theme/
  data/
  services/
  state/
  hooks/
  utils/
  types/
  constants/
assets/

Adapt the structure to the existing repository rather than blindly replacing it.

==================================================
41. DO NOT BREAK EXISTING PROJECT
==================================================

Before changing configuration:

Inspect package.json.

Inspect app.json/app.config.ts.

Inspect tsconfig.json.

Inspect existing Expo Router configuration.

Inspect existing dependencies.

Do not downgrade packages unnecessarily.

Do not randomly upgrade all packages.

Do not delete working files without understanding their purpose.

==================================================
42. DEVELOPMENT PROCESS
==================================================

Follow this exact development process.

PHASE 1 — PROJECT AUDIT

Inspect:

- package.json
- Expo configuration
- source code
- assets
- navigation
- dependencies

Report your findings.

PHASE 2 — FIGMA AUDIT

Inspect the Figma design.

Identify:

- Screens
- Components
- Design tokens
- Assets
- Navigation
- Interactions
- Screen dimensions

Create an implementation map.

PHASE 3 — ARCHITECTURE

Create:

- Theme
- Types
- Data
- Services
- State
- Navigation structure

PHASE 4 — FOUNDATION

Implement:

- Root layout
- Theme
- Safe area
- Navigation
- Bottom navigation
- Common components

PHASE 5 — MAIN SCREENS

Implement screens in priority order:

1. Home
2. Shop
3. Search
4. Product Details
5. Bag
6. Checkout
7. Profile

Then implement secondary screens.

PHASE 6 — FUNCTIONALITY

Implement:

- Search
- Filtering
- Favorites
- Cart
- Quantity
- Checkout
- Orders
- Profile
- Settings
- Notifications
- Membership
- Help

PHASE 7 — PERSISTENCE

Implement local persistence.

PHASE 8 — VISUAL QA

Compare implementation against Figma.

Fix:

- spacing
- font sizes
- colors
- alignment
- card dimensions
- image proportions
- navigation
- padding
- margins
- border radius
- shadows
- icon sizes

PHASE 9 — TESTING

Run:

npm install

Then:

npx expo start

Check:

- Android
- Expo Go
- Navigation
- Buttons
- Search
- Cart
- Checkout
- Profile
- Persistence

PHASE 10 — CLEANUP

Remove:

- unused imports
- unused files
- debugging code
- temporary assets
- temporary URLs
- unnecessary dependencies

Run lint/type checks.

==================================================
43. VISUAL QA RULE
==================================================

Do not declare the app finished simply because it compiles.

The application must be visually compared against the Figma design.

For each important screen verify:

- overall layout
- header
- typography
- colors
- spacing
- image sizes
- buttons
- cards
- navigation
- safe areas
- scrolling behavior

If something does not match Figma, fix it.

==================================================
44. TESTING CHECKLIST
==================================================

Test all of the following:

[ ] App launches
[ ] Splash/start screen works
[ ] Navigation works
[ ] Home works
[ ] Shop works
[ ] Categories work
[ ] Search works
[ ] Product details work
[ ] Favorites work
[ ] Bag works
[ ] Quantity controls work
[ ] Checkout works
[ ] Mock order works
[ ] Order history works
[ ] Profile works
[ ] Settings work
[ ] Notifications work if present
[ ] Membership works if present
[ ] Help works if present
[ ] Local persistence works
[ ] Empty states work
[ ] Error states work
[ ] Android layout works
[ ] Small screens work
[ ] Larger screens work
[ ] No TypeScript errors
[ ] No obvious runtime errors
[ ] No unnecessary dependencies
[ ] No secrets in source code
[ ] No temporary Figma URLs in final code

==================================================
45. IMPORTANT DEVELOPMENT BEHAVIOR
==================================================

Do not generate the entire project blindly in one step.

Work incrementally.

After each major phase:

1. Inspect the files you created.
2. Check imports.
3. Check routes.
4. Check TypeScript.
5. Check dependencies.
6. Check whether the implementation still matches Figma.
7. Fix problems before continuing.

When something is ambiguous:

Prefer the existing Figma design over your own assumptions.

When Figma does not specify something:

Choose the simplest implementation consistent with the existing KYNTRA design language.

==================================================
46. NEVER DO THESE THINGS
==================================================

DO NOT:

- Replace the Figma design with a generic template
- Invent random UI
- Use unrelated colors
- Use unrelated typography
- Hardcode one device's dimensions
- Put all code into one file
- Use `any` everywhere
- Store secrets in the app
- Add unnecessary libraries
- Break Expo Go compatibility
- Delete the existing project without inspection
- Create fake backend APIs that pretend to be real
- Claim features work when they have not been tested
- Leave broken navigation
- Leave placeholder buttons that do nothing
- Leave temporary development URLs
- Use random stock imagery when the actual design asset is available

==================================================
47. FINAL ACCEPTANCE CRITERIA
==================================================

The project is considered complete only when:

1. It starts successfully with Expo.
2. It opens successfully in Expo Go.
3. Main navigation works.
4. The major Figma screens are implemented.
5. The UI closely matches the Figma design.
6. Products can be browsed.
7. Search works.
8. Product details work.
9. Favorites work.
10. Cart works.
11. Checkout works using mock/local functionality.
12. Orders work.
13. Profile works.
14. Settings work where present.
15. Data persists locally.
16. The UI responds correctly across Android screen sizes.
17. TypeScript is clean.
18. There are no obvious runtime errors.
19. There are no exposed secrets.
20. There are no unnecessary placeholder screens.
21. The implementation is maintainable.
22. The application can later be connected to a real backend.

==================================================
48. FIRST ACTION
==================================================

DO NOT start by writing random screens.

Your FIRST response/action must be a PROJECT AUDIT.

Inspect the current repository and report:

1. Current Expo version
2. Current React Native version
3. Current TypeScript setup
4. Current navigation setup
5. Existing dependencies
6. Existing source structure
7. Existing assets
8. Whether Expo Router is already installed
9. Whether the project currently runs
10. What must be changed

Then inspect the KYNTRA Figma design and create a concise:

KYNTRA IMPLEMENTATION PLAN

containing:

- Screen list
- Route list
- Component list
- Design tokens
- Data models
- Services
- State management
- Implementation phases

DO NOT begin large-scale implementation until this audit and plan are complete.

After the audit and plan, proceed with implementation phase by phase.

The final objective is a polished, responsive, functional KYNTRA Android application that faithfully implements the existing Figma design using React Native + Expo + TypeScript.