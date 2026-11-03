# Test plan: Hari Ram AWPL Store

Build: `2959a1110336d5230b996f3932febe3ae6b76638`
Date: 2026-11-03
Environment: GitHub Actions, Next.js production build, Chromium / Playwright

## Flows and test cases

### F01 — Catalogue home and category catalogue

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F01-H1 | Happy | Open `/` | Store heading, 126 parent-product cards, image placeholders and category filters are visible | E2E / PASS |
| F01-E1 | Edge | Select a category currently held for classification review | Honest empty state; no held item is orderable | E2E / PASS |
| F01-E2 | Edge | Open on a 390px mobile viewport and scroll the category rail | No horizontal page overflow; filters remain usable | Manual / NOT RUN |
| F01-E3 | Edge | Open home with browser storage empty | Page loads with an empty cart and no runtime errors | Covered by E2E home load / PASS |

### F02 — Product search

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F02-H1 | Happy | Search for an exact imported product name | Matching product and correct result count | E2E / PASS |
| F02-E1 | Edge | Clear a populated search query | Full category result set returns | E2E / PASS |
| F02-E2 | Edge | Search with blank input | Full active-category result set remains visible | Manual / NOT RUN |
| F02-E3 | Edge | Search with a very long string, emoji, accents or mixed case | No crash; safe no-results or matching state | Manual / NOT RUN |
| F02-E4 | Edge | Search in two tabs with independent input state | No page crash or cross-tab input corruption | Manual / NOT RUN |

### F03 — Category filtering

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F03-H1 | Happy | Select Home Care | Only Home Care products appear; category count is correct | E2E / PASS |
| F03-E1 | Edge | Select Wellness, which is held for review | No product is presented as orderable | E2E / PASS |
| F03-E2 | Edge | Change category, then use browser back | Navigation remains stable | Manual / NOT RUN |

### F04 — Variant selection and cart

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F04-H1 | Happy | Select the Olive / S T-shirt variant and add it | Cart line carries the parent product and exact selected variant | E2E / PASS |
| F04-E1 | Edge | Reload the cart after adding the variant | Variant, quantity and MRP total remain correct | E2E / PASS |
| F04-E2 | Edge | Change a variant after adding another variant of the same parent | Each variant remains a separate cart line | Manual / NOT RUN |
| F04-E3 | Edge | Double-click Add quickly | Quantity changes only according to actual click count; no duplicate malformed line | Manual / NOT RUN |
| F04-N1 | Negative | Attempt to add a product with an unknown variant ID | Store rejects the invalid variant | Store guard present; direct automated test / NOT RUN |

### F05 — MRP review guard

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F05-N1 | Negative | Find Jeeveda Rice Bran Oil 2 LTR with conflicting source MRP and click its action | Card states MRP under review; add action stays disabled | E2E / PASS |
| F05-E1 | Edge | Increase quantity for an already persisted product whose status later changes to review | Stale line should be reconciled before checkout | Manual / NOT RUN |

### F06 — Customer profile

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F06-H1 | Happy | Open `/profile?from=checkout` | Profile heading and correctly labelled name, phone and address fields appear | E2E / PASS |
| F06-E1 | Edge | Submit empty or malformed contact details | Checkout should not proceed with invalid data | Manual / NOT RUN |
| F06-E2 | Edge | Use browser back from profile to cart | Cart contents remain intact | Manual / NOT RUN |

### F07 — Persisted cart and hydration

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F07-H1 | Happy | Add an apparel variant, navigate to cart, reload | Persisted product and variant render without React hydration errors | E2E / PASS |
| F07-E1 | Edge | Open a second tab after adding an item | Persisted state is consistent after rehydration | Manual / NOT RUN |
| F07-E2 | Edge | Clear or corrupt old persisted cart data | Unsupported or invalid old rows are discarded safely | Migration guard present; browser test / NOT RUN |

### F08 — Accessibility and runtime quality

| Case | Type | Steps | Expected | Automation / result |
|---|---|---|---|---|
| F08-H1 | Happy | Open home, cart and profile; scan WCAG 2.1 A/AA rules | No axe violations on the tested screens | E2E / PASS |
| F08-E1 | Edge | Exercise tested browser flows | No browser console/page errors and no HTTP 5xx responses | E2E / PASS |
| F08-E2 | Edge | Keyboard-only navigation and screen-reader walkthrough | Focus is visible and controls have meaningful names | Manual / NOT RUN |

## CI release gate

Latest GitHub Actions run:
- Run: [41580351093](https://github.com/vinitprajapat0822-coder/hari-ram-awpl-store/actions/runs/41580351093)
- TypeScript: PASS
- ESLint: PASS — no warnings or errors
- Production build: PASS
- Playwright / Chromium: 8 passed, 0 failed
- Axe scan on home, cart and profile: PASS

The manual cases above have not been executed and are not represented as passing.
