# Hari Ram AWPL Store

A Next.js storefront prototype with a Liquid Glass interface and a category-wise AWPL catalogue.

## Catalogue

- 15 category filters arranged in the same order as the official AWPL product navigation.
- 163 product records in the catalogue master; 151 are currently passed to the public storefront.
- The official category selector currently shows 374 entries. These are selector counters, not confirmed unique product-card totals.
- MRP only. DP and SP are not stored or displayed.
- Pack sizes and apparel variants remain separate SKU records when the official listing supplies separate rows.
- Only exact, verified official AWPL image URLs are displayed as product photos. The current master has 8 exact official image URLs; other records show an explicit image-pending placeholder instead of unrelated stock photos.
- Price-review and missing-label records remain blocked from cart.
- Wellness, Wellroot and Veterinary product records are withheld from the public order flow pending appropriate product classification and label review. Their category names remain in the source-aligned category navigation.
- Agriculture entries are visible for reference but blocked from cart until composition and label information are verified. The ambiguous second item in Others is not guessed or imported.

The master catalogue is not represented as a fully reconciled copy of every source-site SKU. The category-selector counters and source-page product rows are tracked separately. See [catalogue integration notes](docs/catalogue-integration.md) and [QA plan](docs/qa-test-plan.md).

## Store flows

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
