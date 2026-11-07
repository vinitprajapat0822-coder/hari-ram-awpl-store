# Hari Ram AWPL Store

A Next.js storefront prototype with a Liquid Glass interface and a category-wise AWPL catalogue.

## Catalogue

- 15 category filters arranged in the same order as the official AWPL product navigation.
- 147 verified consumer-product records are currently in the public catalogue.
- The official category selector showed 374 entries on 6 November 2026. These are selector counters, not confirmed unique product-card totals.
- MRP only. DP and SP are not stored or displayed.
- Pack sizes, apparel colours/sizes and cosmetic shades remain separate records when the official listing exposes separate SKUs.
- 10 exact official AWPL product-image URLs are enabled. Products without a confirmed image-to-SKU match show an explicit image-pending placeholder.
- Records with MRP conflicts or incomplete product-label data remain blocked from cart.
- Wellness, Wellroot, Agriculture and Veterinary product listings are withheld from the public order flow. Baby nutrition and supplement-like products are not orderable.
- Category-selector counts are kept separate from actual captured product-card rows. Missing products are not fabricated to match a counter.

The public catalogue is limited to source-matched consumer-product rows. It is not represented as a complete copy of all 374 selector entries. See [catalogue integration notes](docs/catalogue-integration.md) and [QA plan](docs/qa-test-plan.md).

## Store flows

- Public catalogue browsing; customer login and registration at `/login/`.
- Supabase email/password authentication, Google OAuth, and password reset (requires the setup in [customer authentication setup](docs/customer-auth-setup.md)).
- Search and category filtering.
- SKU-specific cart with MRP totals.
- Local customer profile.
- WhatsApp order-enquiry message with each product's exact pack size.
- Cart migration from the previous persisted store version.

Stock, current pack-label MRP and delivery must be confirmed before an order is accepted. The prototype does not process payments or confirm inventory.

## Deployment (GitHub Pages only)

This project is configured for GitHub Pages static hosting. Push the reviewed production branch `main` to trigger `.github/workflows/deploy-pages.yml`.

Live URL: https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/ (available after the Pages workflow succeeds).

No Vercel service or account is used.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

GitHub Actions runs the same quality gates on catalogue branch pushes and pull requests targeting `main`.
