# QA findings

## Current automated coverage

The catalogue uses standalone SKU records: pack sizes and apparel size/colour combinations are separate product cards and separate cart lines.

- Home: category catalogue, search, result counts and empty state.
- Cart: standalone product identity, pack-size display, quantity controls and persisted cart.
- Profile: labelled customer fields and checkout return flow.
- Navigation: mobile bottom dock with Explore, Cart and Profile routes.
- Accessibility: axe scan against WCAG 2.1 A/AA tags on home, cart and profile.
- Runtime: Playwright captures browser console errors, uncaught page errors and HTTP 5xx responses.

## Previously fixed defects

- **QAF-001 — Profile static-render boundary (fixed):** Profile client content is wrapped in Suspense for useSearchParams().
- **QAF-002 — Product image lint path (fixed):** Next.js Image is used for remote product imagery.
- **QAF-003 — Unassociated profile labels (fixed):** Form labels are linked to stable input IDs.
- **QAF-004 — Cart line identity (fixed):** Cart line identity is the individual SKU product ID; variant selectors are not used.
- **QAF-005 — MRP conflict orderability (fixed):** Products with unresolved MRP remain visible for review but cannot be added to cart.
- **QAF-006 — Hairdoc pack-size locator (fixed):** The E2E locator uses exact matching so HAIRDOC OIL cannot also match HAIRDOC OIL 200 ML.

## Manual verification still required

Physical Android viewport checks, keyboard-only walkthrough, screen-reader walkthrough, multi-tab persistence and malformed local-storage recovery are not represented as passing until performed.
