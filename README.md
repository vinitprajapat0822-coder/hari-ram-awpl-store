# Hari Ram AWPL Store

A Next.js storefront prototype with a Liquid Glass interface and a category-wise AWPL catalogue.

## Catalogue

- 15 AWPL category filters.
- 158 individual SKU records currently in the master file (not a claim of complete AWPL coverage), including separate pack-size and apparel SKU entries.
- MRP only; DP and SP are not stored or displayed.
- No size, colour or pack-size variant selector is used; each captured SKU is a separate product card and cart line.
- Official image URLs are supported without storing image files in this repository. Only exact verified matches are enabled; unmatched products retain placeholders. 8 of the 144 newly added records currently have exact official image URLs; most products still show placeholders until an exact image-to-SKU match is confirmed.
- Records with conflicting prices or incomplete source data are blocked from cart.
- Agriculture and Veterinary remain held for classification review. Wellness and Wellroot records are excluded from the public orderable catalogue pending product-claim and classification review.
- Category-selector counts are listing-entry counts, not necessarily unique products. Several categories are only partially collected.

The current master file is still a partial catalogue: 158 SKU records are present, while Agriculture and Veterinary are held for review and several consumer categories remain partial. See [catalogue integration notes](docs/catalogue-integration.md) and [QA plan](docs/qa-test-plan.md).

## Store flows

- Search and category filtering.
- SKU-specific cart with MRP totals.
- Local customer profile.
- WhatsApp order-enquiry message with each product's exact pack size.
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
