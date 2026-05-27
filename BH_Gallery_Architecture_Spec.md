# bh-gallery.com Architecture Spec
## Phase 1: Christmas Shop + Foundation for Art Gallery
### Last updated: Sprint 1.5 complete

**Stack:** Next.js 14 (App Router) | pnpm | Firebase (Auth, Firestore, Storage, AI Logic, App Check) | Stripe | Genkit JS (Google AI) | Claude SDK (Phase 2) | Google Model Viewer (Phase 2)

---

## Tech Decisions Summary

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 App Router | SSR/ISR for SEO, scales to gallery/art phase, React ecosystem |
| Package Manager | pnpm | Disk efficient across multiple ventures, strict deps, Vercel supported |
| Auth | Firebase Auth (Email/Password + Google + Apple Sign-In) | Single auth across bh-gallery and Heritage Art Gallery PWA |
| Database | Firestore | Real-time listeners, nested subcollections for user portfolios |
| File Storage | Firebase Cloud Storage | Product images, artwork photos, user uploads |
| Payments | Stripe | PaymentIntents, webhooks, supports subscriptions later |
| AI (Client) | Firebase AI Logic (Gemini Developer API) | Jules assistant, artwork image analysis, multimodal input, streaming chat |
| AI (Server) | Genkit JS v1.29+ (Google AI plugin) | Product description generation, collection value estimates, recommendations |
| AI (Appraisals) | Claude SDK (Phase 2) | Premium appraisal report generation, authentication narratives |
| AR | Google Model Viewer (Phase 2) | Web component, works iOS + Android, no native app needed |
| Security | Firebase App Check + reCAPTCHA Enterprise | Required for AI Logic, prevents API quota abuse |
| Styling | Tailwind CSS | Custom design system with BHG brand tokens (copper, cream, DM Serif + DM Sans) |
| State Management | Zustand | Cart persistence with localStorage, lightweight |
| Hosting | Vercel | Next.js optimized deployment |

---

## Design System (Extracted from Screenshots)

### Color Tokens
```
--bhg-copper: #C17F3E          (Primary brand, CTAs, headings)
--bhg-copper-light: #D4A574    (Hover states, accents)
--bhg-copper-dark: #A06830     (Active states)
--bhg-black: #1A1A1A           (Text, dark cards, shop cards)
--bhg-cream: #F7F3EE           (Page background)
--bhg-cream-warm: #FAF6F1      (Section alternates)
--bhg-white: #FFFFFF            (Card backgrounds)
--bhg-gray-600: #6B6B6B        (Body text, subtitles)
--bhg-gray-400: #9B9B9B        (Placeholder text, labels)
--bhg-gray-200: #E5E5E5        (Borders, dividers)
--bhg-dot-pattern: #E8DFD3     (Decorative circle pattern)
--bhg-success: #2D7A4F         (Verified badges, success states)
--bhg-error: #C13030           (Form errors)
```

### Typography
```
Display/Headings: DM Serif Display (400 weight)
  Hero: 3.5rem (56px), "Returns" in copper italic
  Section headings: 2.25rem (36px)
  Card titles: 1.125rem (18px)

Body: DM Sans (400, 500, 600, 700)
  Body: 1rem (16px)
  Captions/labels: 0.75rem (12px), uppercase tracking for section labels
```

### Signature Design Elements
- Copper (#C17F3E) as singular accent threading every interaction
- Decorative dot/circle pattern (cream-on-cream) as section backgrounds
- Dark cards with backdrop for Shop by Occasion/Theme/Type
- Gradient mesh backgrounds on Shop category section
- Design direction: Editorial/Organic hybrid ("Aesop meets Shopify")
- Emotional target: Warm authority

---

## Firestore Data Model

### `products`
```
products/{productId}
  name: string
  slug: string
  description: string
  price: number (cents)
  compareAtPrice: number | null (cents, for sale display)
  category: "ornaments" | "wrapping_paper" | "cards" | "figurines" | "decor" | "apparel" | "artwork"
  subcategory: string | null
  tags: string[]
  occasion: string[] ("christmas", "mothers_day", "fathers_day", "wedding")
  theme: string[] ("religious", "black_history", "family", "organizations", "professionals")
  type: string[] ("artwork", "home_decor", "stationery", "fashion", "african_decor")
  images: string[] (Firebase Storage URLs)
  artist: string | null
  artistId: string | null
  inventory: number
  isActive: boolean
  isFeatured: boolean
  featuredOrder: number              ← deterministic homepage sort
  rating: { average: number, count: number }
  createdAt: timestamp
  updatedAt: timestamp
```

### `artists`
```
artists/{artistId}
  name: string
  slug: string
  bio: string
  style: string
  profileImage: string
  galleryImages: string[]
  isFeatured: boolean
  featuredOrder: number              ← deterministic homepage sort
  isActive: boolean
  sortOrder: number                  ← general listing sort
  createdAt: timestamp
```

### `reviews`
```
reviews/{reviewId}
  productId: string
  userId: string
  userName: string
  rating: number (1-5)
  title: string
  body: string
  isVerifiedBuyer: boolean
  productName: string
  productImage: string
  createdAt: timestamp               ← homepage sorts by createdAt desc
  isApproved: boolean
```

### `orders`
```
orders/{orderId}
  userId: string (Firebase Auth UID)
  stripePaymentIntentId: string
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  items: [{ productId, name, price, quantity, image }]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: { name, line1, line2, city, state, zip }
  createdAt: timestamp
  updatedAt: timestamp
```

### `users` (extends Firebase Auth profile)
```
users/{uid}
  displayName: string
  email: string
  phone: string | null
  role: "customer" | "artist" | "admin"
  shippingAddresses: [{ ... }]
  interests: string[]
  createdAt: timestamp
  lastActive: timestamp
```

### `user_collections` (the collector portfolio)
```
user_collections/{uid}/items/{itemId}
  source: "purchase" | "manual" | "appraisal"
  productId: string | null
  name: string
  artist: string
  artistId: string | null
  images: string[]
  category: string
  medium: string | null
  dimensions: string | null
  yearAcquired: number | null
  purchasePrice: number | null
  appraisedValue: number | null
  estimatedValue: number | null
  appraisalId: string | null
  appraisalDate: timestamp | null
  notes: string | null
  isPublic: boolean
  addedAt: timestamp
  updatedAt: timestamp
```

### `site_content` (CMS for editable sections)
```
site_content/hero           → HeroSection component
site_content/seasonal       → SeasonalFeature component
site_content/featured_collections → FeaturedCollections component
site_content/shop_categories → ShopByCategory component
site_content/about          → About page (Phase 2)
site_content/footer         → SiteFooter component
```

Each document schema matches the TypeScript interfaces in `src/types/index.ts`.

### `appraisal_requests`
```
appraisal_requests/{requestId}
  clientName, clientEmail, clientPhone, userId, artworkDescription,
  purpose, images[], urgency, status, assignedTo,
  appraisalReport (PDF URL), estimatedValue,
  createdAt, updatedAt
```

### `newsletter_subscribers`
```
newsletter_subscribers/{subscriberId}
  email: string
  interests: string[]
  source: "website" | "checkout" | "popup"
  isActive: boolean
  createdAt: timestamp
```

---

## Composite Indexes (firestore.indexes.json)

| Collection | Fields | Homepage Query |
|-----------|--------|---------------|
| products | isActive + isFeatured + featuredOrder ASC | Featured products, top rated |
| products | isActive + category + createdAt DESC | Shop category pages |
| artists | isActive + isFeatured + featuredOrder ASC | Featured artists row |
| reviews | isApproved + createdAt DESC | Recent reviews carousel |
| reviews | productId + isApproved + createdAt DESC | Product detail reviews |
| orders | userId + createdAt DESC | User order history |
| appraisal_requests | status + createdAt DESC | Admin appraisal queue |

---

## Security Rules Summary

### Firestore
- Products, artists, site_content: public read, admin-only write
- Orders: owner read own, admin read/write all, no delete
- Users: owner read/write own (cannot change role), admin read all
- User collections: owner CRUD, admin read, public read if isPublic
- Reviews: public read approved only, authenticated create (starts unapproved), admin moderates
- Appraisal requests: unauthenticated create allowed (reduces friction), owner read own, admin read/write
- Newsletter subscribers: **create-only** for unauthenticated (validates email + isActive + createdAt fields), admin read/update/delete

### Storage
- Product/artist/content images: public read, admin write
- Appraisal images: authenticated read/write
- Collection images: owner write, authenticated read
- All uploads: 10MB max, images only

### App Check
- reCAPTCHA Enterprise for production, debug tokens for dev
- Required before any Firebase AI Logic calls

---

## Homepage Data Pipeline (Sprint 1.5 — Built)

### Architecture
- Homepage is a **Next.js Server Component** (not client-side)
- `export const revalidate = 60` (ISR: regenerates every 60 seconds)
- Single `fetchHomepageData()` call runs 9 Firestore queries in `Promise.all`
- Uses **Firebase Admin SDK** (server-side, no auth context)
- Each fetcher has try/catch returning null/[] on failure (graceful degradation)

### Firestore → Component Mapping

| Firestore Source | Component | Null/Empty Behavior |
|-----------------|-----------|-------------------|
| site_content/hero | HeroSection | Renders with hardcoded fallback defaults |
| site_content/seasonal | SeasonalFeature | Skips section entirely if null or isActive=false |
| site_content/featured_collections | FeaturedCollections | Skips section if no items |
| artists (isFeatured + featuredOrder) | FeaturedArtists | Skips section if empty |
| site_content/shop_categories | ShopByCategory | Renders with fallback defaults |
| reviews (isApproved + createdAt desc) | ReviewsSection | Skips section if empty |
| products (isFeatured + featuredOrder) | TopRatedProducts | Skips section if empty |
| newsletter_subscribers (write-only) | CommunitySignup | Always renders (client-side write) |
| site_content/footer | SiteFooter | Renders with fallback defaults |

### Seed Script
`pnpm seed` (scripts/seed-firestore.ts) populates:
- 5 site_content documents (hero, seasonal, featured_collections, shop_categories, footer)
- 5 featured artists with featuredOrder 1-5
- 8 featured products with featuredOrder 1-8 (includes 3 Christmas items)
- 6 approved reviews with realistic timestamps

---

## AI Architecture

### Client-Side: Firebase AI Logic (src/lib/firebase/ai-logic.ts)
- Uses `firebase/ai` SDK with `GoogleAIBackend` (Gemini Developer API, free tier)
- Default model: `gemini-flash-latest` (use Remote Config for production model swapping)
- Jules functions: `julesDescribeArtwork` (multimodal), `julesStartChat` (multi-turn), `julesStreamResponse` (streaming), `julesAnalyzeForAppraisal` (structured JSON)
- **Requires**: `npx -y firebase-tools@latest init ailogic` before first use

### Server-Side: Genkit JS (src/lib/ai/genkit-flows.ts)
- Genkit v1.29+ with `@genkit-ai/google-genai` plugin
- Three flows defined: `generateProductDescription`, `estimateCollectionValue`, `generateRecommendations`
- Exposed via `/api/ai/flows` route
- Dev: `pnpm dev:ai` starts Genkit Dev UI alongside Next.js

### Phase 2: Claude SDK
- Premium appraisal report generation (revenue-generating service)
- Stubbed in genkit-flows.ts, will use Anthropic plugin or direct SDK

---

## Site Page Map

### Public Pages
```
/                           Homepage (8 sections, ISR 60s)
/shop                       All products with filters
/shop/christmas             Christmas collection
/shop/christmas/ornaments   Ornaments subcategory
/shop/christmas/wrapping-paper  Wrapping paper subcategory
/shop/[category]            Dynamic category pages
/product/[slug]             Product detail page
/artists                    Featured artists (Phase 2 expansion)
/artists/[slug]             Artist gallery page (Phase 2)
/gallery                    Art collections browser (Phase 2)
/about                      About BHG + Robbie Lee
/appraisal                  Appraisal services + request form
/cart                       Shopping cart
/checkout                   Stripe checkout
/account                    User dashboard
/account/orders             Order history
/account/collection         My Collection portfolio
/account/collection/[id]    Collection item detail
/account/settings           Profile, addresses, preferences
```

### Admin Pages
```
/admin                      Dashboard (KPIs, recent orders)
/admin/products             Product CRUD
/admin/products/new         Add product
/admin/products/[id]        Edit product
/admin/orders               Order management
/admin/orders/[id]          Order detail
/admin/content              Site content CMS
/admin/content/hero         Edit hero section
/admin/content/seasonal     Edit seasonal feature
/admin/content/collections  Edit featured collections
/admin/content/shop-categories  Edit shop categories
/admin/content/footer       Edit footer
/admin/artists              Manage artists
/admin/reviews              Review moderation
/admin/appraisals           Appraisal queue
/admin/customers            Customer list + segments
/admin/newsletter           Subscriber management
```

---

## Component Architecture

### Layout (Built)
```
<SiteHeader />              Sticky nav, cart badge, auth, mobile menu
<SiteFooter />              5-column footer, accepts Firestore content prop
<AdminLayout />             Sidebar nav, role-gated, iPad-optimized
```

### Homepage Sections (Built, wired to Firestore)
```
<HeroSection />             Firestore → props, carousel with a11y, fallback defaults
<SeasonalFeature />         Firestore → props, null = hidden
<FeaturedCollections />     Firestore → props, empty = hidden
<FeaturedArtists />         Firestore query → props, horizontal scroll
<ShopByCategory />          Firestore → props, fallback defaults
<ReviewsSection />          Firestore query → props, empty = hidden
<TopRatedProducts />        Firestore query → props, empty = hidden
<CommunitySignup />         Client-side write to newsletter_subscribers
```

### E-Commerce (Sprint 2-3)
```
<ProductCard />             <ProductGrid />             <ProductDetail />
<CartDrawer />              <CartItem />                <CheckoutForm />
<OrderConfirmation />
```

### Collection (Sprint 4)
```
<CollectionGrid />          <CollectionItem />          <CollectionDetail />
<CollectionStats />         <AddToCollection />         <CollectionShare />
```

### Admin (Sprint 2+)
```
<AdminDashboard />          <ProductEditor />           <ContentEditor />
<ImageUploader />           <OrderManager />            <AppraisalQueue />
<CustomerTable />
```

---

## Stripe Integration

### Checkout Flow
1. Cart in localStorage (Zustand store with persist middleware)
2. Cart drawer shows running total
3. Checkout page renders Stripe Elements
4. API route creates PaymentIntent
5. On success: create Firestore order, clear cart, auto-add items to user collection
6. Webhook confirms payment, triggers confirmation

### API Routes (Built)
```
/api/stripe/create-payment-intent    POST
/api/stripe/webhook                  POST (auto-adds purchases to user collection)
/api/ai/flows                        POST (Genkit flow execution)
```

---

## Admin Auth & Permissions

Firebase Auth custom claims:
```
admin: true     → Full access (Josh)
editor: true    → Content + products + orders (Robbie Lee)
```

Admin UX priorities for Robbie Lee (iPad):
- 56px primary action touch targets
- Drag-and-drop image upload with instant preview
- Preview before publish on content changes
- Explicit "Published" / "Draft" states

---

## Build Sequence

### Sprint 1: Foundation ✅
- [x] Next.js project setup with App Router + pnpm
- [x] Firebase config (Auth, Firestore, Storage, App Check, AI Logic)
- [x] Firestore rules, Storage rules, composite indexes
- [x] Design system (Tailwind tokens, global CSS, component classes)
- [x] SiteHeader + SiteFooter + AdminLayout
- [x] Firebase Auth (email/password + Google + Apple)
- [x] Zustand cart store with localStorage persistence
- [x] Auth context provider with admin role detection
- [x] Stripe API routes (PaymentIntent + webhook)
- [x] Genkit flows scaffolded (3 server-side AI flows)
- [x] Firebase AI Logic client integration (Jules)

### Sprint 1.5: Wire Homepage to Firestore ✅
- [x] Server-side data fetchers (homepage-data.ts, Admin SDK, parallel Promise.all)
- [x] ISR config (revalidate = 60)
- [x] All 8 homepage components accept Firestore data as props
- [x] Fallback defaults for hero, shop categories, footer
- [x] Null/empty handling: sections hide gracefully
- [x] Seed script (scripts/seed-firestore.ts)
- [x] `featuredOrder` field on products and artists
- [x] Composite indexes updated for homepage queries
- [x] Newsletter security: create-only for unauth, validates required fields
- [x] Community signup writes directly to Firestore client-side

### Sprint 2: Admin Product Editor (Next)
- [ ] Product list page with search/filter
- [ ] Product create/edit form (images, pricing, categorization, tags)
- [ ] Image upload to Firebase Storage with preview
- [ ] Content editor for hero, seasonal, collections, categories, footer
- [ ] Admin dashboard with order count, revenue, product stats

### Sprint 3: Shop + Checkout
- [ ] Product listing page with occasion/theme/type filters
- [ ] Product detail page (images, description, reviews, add to cart)
- [ ] Cart drawer (slide-out, quantity controls, remove)
- [ ] Checkout page with Stripe Elements
- [ ] Order creation and confirmation
- [ ] Guest checkout with post-purchase account creation

### Sprint 4: Collection + Reviews
- [ ] User collection portfolio (auto-populated from purchases)
- [ ] Manual "Add to Collection" for existing pieces
- [ ] Collection value tracking and stats
- [ ] Review submission and moderation
- [ ] Category pages for Christmas subcategories

### Sprint 5: Polish + Launch
- [ ] Order management admin
- [ ] Customer list and segments
- [ ] Appraisal request form + admin queue
- [ ] Newsletter subscriber management
- [ ] Mobile responsiveness pass
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Deploy to production

### Phase 2 (Post-Launch)
- [ ] Artist gallery pages
- [ ] Full art collection browsing
- [ ] AR "View in Room" via Google Model Viewer
- [ ] Jules AI chat (Firebase AI Logic streaming)
- [ ] Claude SDK appraisal reports
- [ ] Advanced collection analytics and sharing
- [ ] Gemma 4 E4B evaluation for offline iPad artwork analysis

---

## Environment Variables

```env
# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (Server)
FIREBASE_ADMIN_SERVICE_ACCOUNT=

# App Check (Required for AI Logic)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Google AI / Genkit
GEMINI_API_KEY=

# Claude (Phase 2)
# ANTHROPIC_API_KEY=
```

---

## Firebase CLI Commands

Per firebase-basics skill: always use `npx -y firebase-tools@latest`, never bare `firebase`.

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use YOUR_PROJECT_ID
npx -y firebase-tools@latest init ailogic          # Provision Gemini API
npx -y firebase-tools@latest deploy --only firestore:rules,storage
npx -y firebase-tools@latest deploy --only firestore:indexes
npx -y firebase-tools@latest emulators:start
```

---

## Key Architecture Decisions

**Why Firestore over relational DB?** Small catalog (hundreds of products). Real-time listeners for instant admin updates. Nested subcollections for user collection portfolios. Single Firebase billing console.

**Why not Shopify/WooCommerce?** Control. Collection portfolio, appraisal integration, and AI features need custom data flows a hosted platform would fight. Stripe gives full payment control.

**Why Next.js Server Components + ISR?** SEO for product pages. 60-second revalidation means Robbie Lee sees her changes reflected quickly without a full rebuild. Server-side Firestore reads avoid exposing Admin SDK credentials to the client.

**Why dual AI (Gemini + Claude)?** Google handles perception (image recognition, cataloging, customer-facing Jules). Claude handles reasoning (premium appraisal narratives, authentication analysis). Maps to revenue: Gemini powers engagement, Claude powers paid services.

**Cart strategy:** localStorage first (Zustand persist), Firestore sync when logged in. Guest checkout supported. Post-purchase account creation upsell.

**Newsletter write pattern:** Client-side `addDoc` directly to Firestore with create-only security rule. No server round-trip needed for a simple email capture. Validates required fields at the rule level.
