# Catalogue integration QA plan

Scope: Hari Ram AWPL Store on branch `catalogue/category-master-foundation`.

## Automated flows

| ID | Flow | Test coverage |
|---|---|---|
| F01 | Browse catalogue | Home title, current product count, image placeholders, all category filters visible |
| F02 | Search | Exact product search, result count, clear-search action |
| F03 | Category navigation | Category filter isolation, held category empty-state |
| F04 | Standalone SKU products | Each apparel colour/size and pack size is a separate card and cart line; no variant selector |
| F05 | Cart | MRP total, SKU name and pack size, local persistence after reload |
| F06 | Price review | Conflicting MRP item is visibly flagged and cannot be added |
| F07 | Customer profile | Profile route, visible fields, accessible labels |
| F08 | Accessibility/runtime | WCAG 2.1 A/AA axe scan on home/cart/profile; browser errors and HTTP 5xx fail tests |

## Edge cases

- Search empty value and clearing: F02.
- Search for a single exact SKU phrase: F02.
- Category with products vs held category: F03.
- Apparel colour/size SKUs render as separate products with no selector: F04.
- Same base product with different pack sizes (e.g. Hairdoc Oil 100 ML / 200 ML) remains separate: F04.
- Cart refresh and persisted local state: F05.
- Product requiring price review: F06.
- Direct load of profile with the checkout query parameter: F07.
- Keyboard and label semantics are checked through accessible roles/names and axe scan: F08.

## Negative cases

- Price-conflict product cannot be added to cart: F06.
- Categories held for classification review show no items as orderable: F03.
- Browser-side runtime errors and HTTP 5xx responses fail the suite: F08.

## Manual checks still required

- Test on a narrow physical Android viewport and a desktop viewport.
- Confirm WhatsApp opens the intended adult/authorized business contact before any live use.
- Confirm real-world stock, pack label and current MRP before accepting any order.
- Review privacy notice, data retention and consent around locally stored customer name, phone and address.
- Upload official images later and verify image authenticity/rights, alt text and crop.
- Review all held or incomplete source categories with appropriate adult/authorized business and compliance support.

## Release gate

Do not merge or deploy until typecheck, lint, production build and Playwright tests are green. Deployment remains blocked pending explicit user approval.
