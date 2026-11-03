# Test plan: Hari Ram AWPL Store

Build: current standalone-SKU storefront on main
Date: 2026-11-03
Environment: GitHub Actions, Next.js production build, Chromium / Playwright

## Flows and test cases

### F01 — Catalogue home and category catalogue

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F01-H1 | Happy | Open / | Store heading, 135 independent product cards, image placeholders and category filters are visible | E2E |
| F01-E1 | Edge | Select a category held for classification review | Honest empty state; no held item is orderable | E2E |
| F01-E2 | Edge | Open at 390px and scroll the category rail | No page-level horizontal overflow; bottom navigation remains usable | E2E |
| F01-E3 | Edge | Open home with empty browser storage | Page loads without hydration or runtime errors | E2E |

### F02 — Product search and filters

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F02-H1 | Happy | Search exact product name | Matching standalone product and correct result count | E2E |
| F02-E1 | Edge | Clear a populated search query | Full active-category result set returns | E2E |
| F02-E2 | Edge | Search by pack size | Matching pack-size listings appear | E2E candidate |
| F02-E3 | Edge | Search with long text, emoji or mixed case | No crash; safe no-results or matching state | Manual |

### F03 — Standalone SKU cart

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F03-H1 | Happy | Add Olive / S apparel listing | Exact SKU appears as its own cart line | E2E |
| F03-H2 | Happy | Add Hairdoc Oil 100 ML and 200 ML | Both are separate lines with their own pack sizes and MRP | E2E |
| F03-E1 | Edge | Reload cart after adding standalone SKU | Product, quantity and MRP total persist | E2E |
| F03-E2 | Edge | Increase/decrease quantity | Only the selected product line changes | Manual |
| F03-N1 | Negative | Attempt to add product under MRP review | Add action stays disabled | E2E |

### F04 — Customer profile and checkout

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F04-H1 | Happy | Open /profile?from=checkout | Clearly labelled name, phone and address fields appear | E2E |
| F04-E1 | Edge | Enter invalid mobile number | Inline validation prevents saving | E2E candidate |
| F04-E2 | Edge | Save valid details from checkout | Details persist locally and user returns to cart | Manual |
| F04-E3 | Edge | Open WhatsApp order message | Product name, pack size, quantity and total are included | Manual |

### F05 — Navigation and accessibility

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F05-H1 | Happy | Use mobile bottom navigation | Explore, Cart and Profile routes are visible and labelled | E2E |
| F05-H2 | Happy | Open home, cart and profile | WCAG 2.1 A/AA automated scan has no violations | E2E |
| F05-E1 | Edge | Navigate with keyboard | Focus indicator is visible and controls have meaningful names | Manual |
| F05-E2 | Edge | Use reduced-motion preference | Motion is reduced without hiding content or controls | CSS / manual |
| F05-E3 | Edge | Use screen reader | Navigation and cart controls expose useful accessible names | Manual |

## CI release gate

Before merging a UI change into main:
- TypeScript typecheck passes.
- ESLint passes without warnings or errors.
- Production static build passes.
- Playwright catalogue/cart/profile checks pass.
- Axe WCAG 2.1 A/AA scan passes on home, cart and profile.

GitHub Pages deployment is checked after the approved merge to main. Manual device, keyboard and screen-reader checks remain explicitly marked as manual until performed.
