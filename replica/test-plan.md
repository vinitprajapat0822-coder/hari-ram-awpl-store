# Commerce and order system test plan

Baseline: PR #7 head, Next.js static export, Chromium / Playwright.

## Catalogue and existing storefront
- Preserve 135 distinct SKU records, including price-review and missing-data restrictions.
- Verify category filtering, product image fallback, existing calm teal theme and responsive navigation.
- Verify MRP is sourced from the catalogue and an unknown selling price remains unlisted.

## Customer identity and checkout
- Customer can create an account and sign in through Supabase Auth.
- Invalid or unauthenticated tracked-order creation is rejected.
- A multi-item cart creates one order and one order_items row per distinct SKU.
- Order number is returned only after the database transaction succeeds.
- If the Supabase public configuration is absent, WhatsApp checkout is explicitly labelled enquiry-only and must not claim tracking exists.

## Customer order history
- A signed-in customer can read only their own orders through RLS.
- Orders display item snapshots, MRP subtotal and current owner-updated status.
- Realtime order and order-update events refresh the customer order list.
- Delivery delay history displays revised date, time window and owner message.

## Owner security and operations
- An authenticated user not present in store_admins receives Access denied.
- Owner access is checked using authenticated user UUID, never display name.
- Availability must be confirmed before accepting an order.
- Order state transitions are sequential and invalid transitions are rejected by the database RPC.
- The owner can set an initial ETA, add a revised ETA/delay notice, and update product availability.
- Only the owner can moderate reviews or update product availability.

## Purchase-verified reviews
- Review creation is rejected unless the signed-in customer owns a delivered order item.
- One review per order item is enforced by a unique database constraint.
- Public feeds return APPROVED reviews only.
- Customer images are compressed to WebP, limited to three images, and stored in a private bucket.
- Public signed image URLs are available only for approved reviews.

## Release gates
- TypeScript, ESLint, production static export, Playwright and axe WCAG 2.1 A/AA.
- Physical-device camera and screen-reader verification remain manual acceptance checks.
- GitHub Pages deployment is considered complete only after its deployment workflow succeeds on main.
