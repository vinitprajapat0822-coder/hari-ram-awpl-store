# Hari Ram AWPL Store

A Next.js storefront prototype with a Liquid Glass interface and a category-wise AWPL catalogue.

## Catalogue

- 15 AWPL category filters.
- 126 source-backed parent-product records currently imported.
- MRP only; DP and SP are not stored or displayed.
- Verified size/colour variants are grouped under parent products.
- Official image URLs are supported without storing image files in this repository. Only exact verified matches are enabled; unmatched products retain placeholders. One official image is currently verified, and the remaining 125 need exact asset mapping.
- Records with conflicting prices or incomplete source data are blocked from cart.
- Agriculture, Veterinary, Wellness and Wellroot categories remain held for classification review.
- Category-selector counts are listing-entry counts, not unique parent-product totals. Several categories are only partially collected.

The current imported subset is not the complete AWPL product catalogue. See [catalogue integration notes](docs/catalogue-integration.md) and [QA plan](docs/qa-test-plan.md).

## Store flows

- Search and category filtering.
- Variant-aware cart with MRP totals.
- Local customer profile.
- WhatsApp order-enquiry message with customer-selected variants.
- Cart migration from the previous persisted store version.

Stock, current pack-label MRP and delivery must be confirmed before accepting any real order. The prototype does not process payments or confirm inventory.

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
