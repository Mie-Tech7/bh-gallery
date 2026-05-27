# bh-gallery.com

The rebuilt gallery and shop site for Black Heritage Gallery (Houston, TX). A Next.js commerce front end on a Firebase backend, launching in phases: seasonal product sections first, art and gallery content later.

This is a phased commerce launch, not a single big-bang release. Phase 1 ships a working Christmas ornament and wrapping paper shop. The gallery and art catalog land in a later phase once the commerce foundation is proven. The stack is chosen for that second act: Next.js so the art phase scales without a rewrite.

## Status

Active rebuild. Phase 1 (seasonal shop) is the current build target.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Data | Cloud Firestore |
| Storage | Firebase Cloud Storage |
| Auth | Firebase Authentication |
| Payments | Stripe or Square — see Payments below (decision open) |
| Hosting | Firebase Hosting / Next.js runtime |

Next.js is a deliberate choice over a lighter static stack. Phase 1 is a small seasonal shop that a simpler tool could handle, but the art and gallery phase needs server rendering, dynamic catalog routes, and room to grow. Building on Next.js now avoids a migration later. The cost of carrying a slightly heavier framework through Phase 1 is paid back the moment the gallery phase starts.

## Why a rebuild

The previous site does not carry forward. The rebuild starts from a provided template and design, then layers Firebase data and commerce on top. The template defines the visual system; this repo owns structure, data, and checkout.

## Architecture

```
Next.js App Router (bh-gallery.com)
  ├── Storefront        seasonal product browsing, product detail
  ├── Cart / Checkout   client cart state, payment provider handoff
  ├── Gallery (later)   art catalog, artist pages — Phase 2+
  └── Firebase backend  Firestore (catalog, orders), Storage (images), Auth
```

The site is organized around two product domains that share one backend:

- **Shop** — physical seasonal goods (ornaments, wrapping paper). Live in Phase 1.
- **Gallery** — art and collection content. Built in a later phase.

Both read from Firestore and store images in Cloud Storage. They are separate route groups so the gallery phase can be developed without touching live shop code.

### Rendering strategy

- Product listing and product detail pages: server-rendered or statically generated with revalidation, so the catalog is fast and indexable.
- Cart and checkout: client components, since cart state is per-session and interactive.
- Gallery pages (later phase): server-rendered for the same SEO reasons as the shop.

## Data model

Firestore is the system of record. Phase 1 collections:

### `products`

A sellable item in the seasonal shop.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Document ID |
| `slug` | string | URL segment, unique |
| `title` | string | Display name |
| `description` | string | Product copy |
| `category` | string | `ornament`, `wrapping-paper` |
| `priceCents` | number | Integer cents, never floats |
| `currency` | string | `USD` |
| `imagePaths` | array<string> | Cloud Storage paths |
| `inventory` | number | Units available |
| `active` | boolean | Hidden from storefront when false |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `orders`

A completed or in-progress purchase.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Document ID |
| `lineItems` | array<object> | `{ productId, title, priceCents, quantity }` snapshot at purchase time |
| `subtotalCents` | number | |
| `shippingCents` | number | |
| `totalCents` | number | |
| `currency` | string | `USD` |
| `status` | string | `pending`, `paid`, `fulfilled`, `cancelled`, `refunded` |
| `paymentProvider` | string | `stripe` or `square` |
| `paymentRef` | string | Provider transaction ID |
| `customer` | object | `{ name, email, ... }` |
| `shippingAddress` | object | |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

Two data rules worth stating plainly. Money is stored as integer cents, never as a floating point dollar amount, to avoid rounding drift. Line items are snapshotted onto the order at purchase time, so a later price or title change on a `products` document never alters historical orders.

### Later-phase collections

`artworks`, `collections`, and `artists` arrive with the gallery phase. They are intentionally not modeled here yet, to avoid speculative schema that the build does not need.

## Payments

The payment provider is not yet locked. Stripe and Square are both under evaluation. To keep that decision reversible, payments go through a thin provider interface rather than provider-specific code scattered through checkout.

```
checkout flow → PaymentProvider interface → { StripeProvider | SquareProvider }
```

Checkout calls the interface. Only the concrete provider module knows the SDK specifics. Switching providers, or supporting both, is a matter of swapping the implementation, not rewriting checkout.

Until the decision is final, set `PAYMENT_PROVIDER` in the environment and implement against the interface.

## Getting started

### Prerequisites

- Node.js 20+
- Firebase CLI — verify with `npx -y firebase-tools@latest --version`
- A Firebase project with Firestore, Storage, and Auth enabled
- A Stripe or Square account (test mode) for checkout work

### Setup

```bash
git clone <repo-url>
cd bh-gallery
npm install
cp .env.example .env.local   # then fill in values
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment variables

```
# Firebase web config — public identifiers, not secrets
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Payments — pick the active provider
PAYMENT_PROVIDER=stripe        # or: square

# Stripe (server-side secret — never prefixed NEXT_PUBLIC)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Square (server-side secret)
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
```

Anything prefixed `NEXT_PUBLIC_` is shipped to the browser. Payment secret keys and webhook secrets must never carry that prefix. The Firebase web config values are public by design; the real access boundary is Firestore Security Rules, not config secrecy.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |
| `npm run typecheck` | TypeScript check, no emit |
| `firebase emulators:start` | Run Firestore, Auth, Storage locally |

## Deployment

### Firestore rules and indexes

Storefront reads are public; writes are restricted. Deploy rules before the first production catalog load.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### Application

```bash
npm run build
firebase deploy --only hosting
```

If deploying the Next.js server runtime rather than a static export, deploy the associated functions or hosting backend together with hosting so server-rendered routes resolve.

### Payment webhooks

Whichever provider is active, register its webhook endpoint against the deployed URL and store the signing secret in the environment. Orders move to `paid` on a verified webhook, never on a client-side success redirect alone. A redirect can be spoofed or interrupted; the webhook is the trustworthy signal.

### Release checklist

- [ ] Firestore rules deployed and reviewed
- [ ] `PAYMENT_PROVIDER` set, provider keys in place (live keys, not test)
- [ ] Webhook endpoint registered and signing secret stored
- [ ] Product images uploaded to Cloud Storage, `imagePaths` correct
- [ ] Test order placed end to end in production
- [ ] Inventory values seeded for live products

## Contributing

### Branching

- `main` is deployable at all times.
- Branch per change: `feat/...`, `fix/...`, `chore/...`.
- Open a PR into `main`. Keep PRs scoped to one concern.

### Before opening a PR

```bash
npm run lint
npm run typecheck
npm run build
```

All three must pass.

### Conventions

- TypeScript throughout. No new `.js` files in `src`.
- Monetary values are integer cents. Never introduce float dollar amounts.
- New environment variables: add to `.env.example` with a placeholder and document them in this README.
- Keep shop and gallery route groups separate. Gallery-phase code should not modify live shop paths.
- Payment work goes through the `PaymentProvider` interface, never directly against a provider SDK in checkout components.

### Project structure

```
src/
  app/            App Router routes (shop, checkout, gallery)
  components/     Shared UI
  lib/
    firebase/     Firestore + Storage clients
    payments/     PaymentProvider interface and implementations
  styles/         Design system from the provided template
```

## Roadmap

- **Phase 1** — Seasonal shop: Christmas ornaments and wrapping paper, cart, checkout, orders
- **Phase 2** — Gallery and art catalog: `artworks`, `collections`, `artists`, artist pages
- **Later** — Deeper integration with the Heritage Art Gallery platform (shared Firebase backend)

## Related

The Heritage Art Gallery platform is a separate repository: a PWA for artwork appraisal, authentication, and cataloging with the Jules AI assistant. It shares the same Firebase project but is its own deployable.

## License

Proprietary. All rights reserved.
