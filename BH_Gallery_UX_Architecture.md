# bh-gallery.com — UX Architecture Blueprint
## The structural foundation. Structure first, pixels second.

---

## 0. The UX-First Gate

### Business Problem
**Not** "we need a website." The real problem:
Robbie Lee's Black Heritage Gallery needs a revenue-generating e-commerce presence that converts cultural community members into buyers, starting with Christmas seasonal products, while building the infrastructure for a full art gallery and collector platform.

### Primary Business Goal
Generate Christmas season revenue through ornament and wrapping paper sales while building a user base of heritage art collectors who will become recurring customers as gallery and art inventory expand.

### Primary User Journey (Phase 1)
1. Visitor lands on homepage (organic, social, or direct)
2. Sees Christmas seasonal feature → clicks "Shop Christmas Collection"
3. Browses ornaments or wrapping paper with cultural context
4. Adds items to cart
5. Creates account (or continues as guest)
6. Completes Stripe checkout
7. Purchase auto-populates their "My Collection"
8. Receives confirmation email with community invite

### Success Metrics
- Conversion rate: homepage visit → purchase (target: 2.5%+)
- Average order value (target: $45+)
- Account creation rate at checkout (target: 60%+)
- Return visit rate within 30 days (target: 25%+)

### Who Is the User?
**Primary (Phase 1):** Black art enthusiasts, ages 30-65, predominantly women, shopping for culturally meaningful Christmas gifts. Moderate to high comfort with online shopping. Often browsing on mobile (iPhone/iPad). Values authenticity and cultural connection over price.

**Secondary:** Existing BHG community members and social media followers who already trust the brand and need a reason to buy online.

**Admin User:** Robbie Lee. iPad primary device. Needs large touch targets, simple workflows, minimal jargon. If she can't figure out how to add a product or update the hero image in under 2 minutes without help, the admin UX has failed.

### Failure Modes
1. **Homepage bounce:** Visitor doesn't understand what this is or that they can buy things here. FIX: Clear "Shop" navigation, seasonal product feature above the fold, visible cart.
2. **Cart abandonment:** Required account creation before checkout. FIX: Guest checkout with optional account creation post-purchase.
3. **Admin confusion:** Too many fields, unclear save states, no image preview. FIX: Progressive disclosure in admin, instant image previews, explicit "Published" / "Draft" states.
4. **Mobile friction:** Small tap targets, horizontal scroll, unreadable text. FIX: Mobile-first design, 44px minimum touch targets, responsive images.
5. **Trust gap:** New online presence for an established physical gallery. FIX: Reviews section, Robbie Lee's credentials, "16,469 Verified Reviews" badge, cultural authenticity messaging.

---

## 1. Information Architecture

### Sitemap (User Mental Model)

```
HOME
├── Shop
│   ├── Christmas Collection
│   │   ├── Ornaments
│   │   └── Wrapping Paper
│   ├── Shop by Occasion (Christmas, Mother's Day, etc.)
│   ├── Shop by Theme (Religious, Black History, Family, etc.)
│   └── Shop by Type (Artwork, Home Décor, Stationery, etc.)
├── Gallery (Phase 2)
│   └── [Collection Detail]
├── Artists
│   └── [Artist Gallery Page]
├── About
├── Appraisal Services
│   └── Request Form
├── My Account
│   ├── Orders
│   ├── My Collection (portfolio)
│   └── Settings
└── Cart → Checkout → Confirmation
```

### Navigation Pattern
**Top nav (6 items max):** Home, About, Gallery, Artists, Shop, Appraisal Services
**Right actions:** Sign In, Cart (with badge), Join Community CTA
**Mobile:** Hamburger expands to full-screen overlay (not slide-out)

This matches the screenshots exactly and follows Jakob's Law: users expect e-commerce nav to work like every other online shop they've used.

---

## 2. Primary Task Flows

### Flow 1: Browse → Purchase (Critical Path)

```
Homepage
  → [Click seasonal feature OR "Shop" nav]
Product Listing (filtered by category)
  → [Browse, filter by occasion/theme/type]
Product Detail
  → [View images, read description, check reviews]
  → [Add to Cart] → Cart drawer slides open
Cart Drawer
  → [Review items, adjust quantity]
  → [Proceed to Checkout]
Checkout (2 steps max)
  → Step 1: Shipping info (pre-fill if logged in)
  → Step 2: Payment (Stripe Elements)
  → [Pay Now]
Confirmation
  → Order summary
  → "Create Account to Track Orders" (if guest)
  → Auto-add items to Collection (if logged in)
```

**Edge cases designed:**
- Guest checkout: no account required, offer account creation post-purchase
- Empty cart: "Your cart is empty" with "Continue Shopping" CTA
- Payment failure: "Payment didn't go through. Your items are still in your cart. Try again or use a different payment method."
- Out of stock: Disable "Add to Cart", show "Sold Out" badge, offer "Notify When Available"

### Flow 2: Admin Content Update (Robbie Lee)

```
/admin (Dashboard)
  → [Click "Site Content" in sidebar]
Content Editor
  → [Select section: Hero, Seasonal, Collections, etc.]
Section Editor
  → [See current live content as preview]
  → [Edit text fields, drag-drop new images]
  → [See instant preview of changes]
  → [Click "Publish Changes"]
  → Toast: "Hero section updated! Changes are live."
```

**Key UX rules for admin:**
- Every edit shows before/after preview
- Images show thumbnail immediately on upload (optimistic)
- Save state is explicit: "Draft" vs "Published"
- No destructive action without undo capability
- Large buttons, large text, generous spacing (iPad-first)

### Flow 3: Collection Portfolio (Collector Engagement)

```
Post-Purchase
  → Item auto-appears in My Collection
My Collection (/account/collection)
  → Grid of all owned pieces (purchased + manually added)
  → Total collection value (appraised + estimated)
  → [Click piece] → Detail view with provenance
  → [Add a Piece] → Manual entry form for existing art
  → [Request Appraisal] → Links to appraisal form for unvalued pieces
  → [Share Collection] → Generate public link
```

---

## 3. Conversion Architecture

### Homepage Conversion Flow (Screenshot Sequence)
The 8 screenshots define a narrative arc, not just a page:

1. **Hero** (screenshot 1): CLARITY. "What is this?" — Black Heritage Gallery, celebrating Black art. Two CTAs: Learn Our Story (emotional) + Appraisal Services (utility). Carousel shows the art.

2. **Seasonal Feature** (screenshot 2): RELEVANCE. "Is this for me?" — Christmas products that honor Black traditions. One CTA: Shop Christmas Collection.

3. **Featured Collections** (screenshot 3): CREDIBILITY. "Is this real?" — Curated art collections prove depth and seriousness.

4. **Featured Artists** (screenshot 4): CREDIBILITY + COMMUNITY. Named artists with real galleries. D.D. Ike, Ted Ellis, Ernie Barnes — these names carry weight in the community.

5. **Shop by Category** (screenshot 5): VALUE + ACTION. Three paths into the shop. "Here's how to find what you want."

6. **Appraisal Services** (screenshot 6): EXPERTISE. Robbie Lee's credentials. The trust anchor for the entire platform.

7. **Reviews + Top Products** (screenshot 7): SOCIAL PROOF. 16,469 verified reviews. Real customer photos and names. "Other people like you bought and loved these."

8. **Community + Footer** (screenshot 8): COMMITMENT. Newsletter signup, social links, contact info. "Stay connected."

### CTA Hierarchy Per Viewport
- **ONE primary CTA per section.** No competing buttons.
- Primary CTAs use `btn-primary` (copper background)
- Secondary CTAs use `btn-secondary` (outlined)
- Dark section CTAs use `btn-dark` (black/white on dark cards)

### Trust Sequence
1. Cultural authenticity (hero messaging, artist names)
2. Social proof (review count badge, customer reviews)
3. Expert credentials (Robbie Lee's qualifications)
4. Transaction safety (Stripe, clear return policy in footer)

---

## 4. Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Hero image preloaded, SSR for above-fold content |
| INP | < 200ms | Client components only where interactive |
| CLS | < 0.1 | Explicit width/height on all images, skeleton screens |
| JS Bundle | < 200KB initial | Code split by route group, lazy load below fold |
| TTI on 3G | < 3.5s | Server components default, minimal client JS |

### Rendering Strategy
- Homepage sections: Server Components (static content from Firestore, cached)
- Cart drawer: Client Component (interactive state)
- Product grid filters: Client Component (interactive)
- Admin pages: Client Components (heavy interaction)
- Product detail: Server Component with Client islands (add to cart button, reviews)

---

## 5. Mobile-First Priorities

Robbie Lee's customers are predominantly on iPhone. The admin user (Robbie Lee) is on iPad. Mobile-first is not optional.

- Bottom sheet for cart (not a drawer that slides from the right — harder to reach on large phones)
- Touch targets: 44px minimum, 56px for primary actions
- Swipe gestures: swipe left to remove cart items
- Sticky "Add to Cart" bar on product detail (bottom of viewport on mobile)
- Admin sidebar collapses to bottom tab bar on tablet

---

## 6. Empty, Loading, and Error States

Every screen has three states designed:

| Screen | Empty | Loading | Error |
|--------|-------|---------|-------|
| Product grid | "No products match your filters. Try broadening your search." | Skeleton grid (4 cards) | "Couldn't load products. Pull to refresh." |
| Cart | "Your cart is empty" + "Continue Shopping" | N/A (instant, local state) | N/A |
| My Collection | "Start your collection! Browse the shop or add pieces you already own." + illustration | Skeleton grid | "Couldn't load your collection. Try again." |
| Admin orders | "No orders yet. Share your shop link to get started!" | Skeleton table rows | "Couldn't load orders. Check your connection." |
| Reviews | "No reviews yet. Be the first!" | Skeleton cards | "Couldn't load reviews." |

---

## 7. Handoff to Visual Design (elite-design)

### What's locked (non-negotiable):
- Page hierarchy and section order (8 screenshots = the flow)
- CTA placement and hierarchy per section
- Navigation structure (6 items + right actions)
- Checkout: 2-step max, guest checkout supported
- Admin: sidebar nav, section-based content editing, image preview before publish
- Mobile: bottom-sheet cart, sticky add-to-cart, 44px touch targets
- Performance: Server Components default, < 200KB initial JS

### What's flexible for elite-design:
- Animation choreography (stagger timing, scroll triggers)
- Micro-interactions (hover states, button feedback)
- Typography refinement within the established type scale
- Spatial rhythm fine-tuning (section padding, card gaps)
- Background treatments (dot pattern density, gradient mesh tuning)
- Image treatment (hover overlays, zoom effects)

---

## 8. Elite Design Brief

### Business Problem This Site Solves
Revenue generation through culturally authentic e-commerce, building trust for a physical gallery's digital expansion.

### Emotional Response (ONE)
**Warm authority.** The feeling of walking into a curated gallery where the owner knows your name and the story behind every piece on the wall. Not cold luxury. Not casual marketplace. Warm, knowledgeable, welcoming authority.

### Reference Universe
"Aesop's editorial warmth meets Shopify's transactional clarity." The copper-and-cream palette already signals this. Rich materials, clean typography, breathing room between elements — but with clear paths to purchase.

### Signature Memorable Detail
The **copper accent as a thread** that runs through every interaction: copper underlines on hover, copper progress bars, copper toast notifications, the copper fork logo mark. When someone describes this site to a friend, they say "the one with the copper accents and the art."

### Design Direction
**Editorial/Organic hybrid.** Sophisticated and intellectual (the art gallery side) meets warm and approachable (the community shop side). NOT brutalist, NOT neo-memphis, NOT industrial. This is a heritage institution, not a startup.
