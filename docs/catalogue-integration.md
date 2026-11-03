# AWPL catalogue integration

## Current implementation

- 15 AWPL category filters are available.
- 126 parent-product records are wired to the storefront.
- The 13 apparel listing rows that could be read from the official page are grouped into 5 parent products with selectable colour/size variants.
- Product records use MRP only. DP and SP are not part of the product type, catalogue data or cart calculations.
- Product descriptions and ingredient claims are left blank unless separately verified.
- Product image URLs are null and the UI reserves a square image area with an "Image pending" placeholder.
- Cart lines preserve the selected variant, and WhatsApp order text includes the variant label.
- Existing persisted cart data is migrated to the current catalogue and stale/unsupported products are dropped.

## Source coverage

The AWPL selector showed 374 category entries in the latest indexed view checked on 2026-11-03. Those entries are not guaranteed to represent 374 unique parent products.

The current imported data covers 134 source listing rows, grouped into 126 parent-product records. Categories with partial extraction remain visibly flagged in `catalogueCollectionCoverage`. Incomplete categories are not padded with invented products.

Categories marked HELD_FOR_REVIEW have category filters but no orderable product records. Product lines whose intended use/classification or required label information was not sufficiently established are intentionally not imported into the storefront.

## Price and data statuses

- `VERIFIED`: the name, listed MRP and pack information were transcribed from an AWPL official category listing.
- `PRICE_REVIEW_REQUIRED`: an AWPL listing price conflicts with the February 2026 catalogue data supplied in the project brief. The card is visible but cannot be added to cart.
- `MISSING_DATA`: the official listing contains a title or pack-size anomaly. The card is visible for review but cannot be added to cart.

The AWPL page snippets do not expose a formal page-update timestamp. The date in `checkedAt` is the date the indexed official listing was inspected; it is not a claim that the company issued a fresh price circular that day. Confirm current MRP on the labelled pack or current company-issued price list before accepting orders.

## Images

No images were supplied. Every imported record begins with:

```ts
image: { url: null, status: "MISSING" }
```

Only authentic company-provided or otherwise verified images should replace the placeholder.

## Product family / variant rules

Size and colour combinations that clearly belong to the same apparel parent item are stored as child variants. Do not infer additional sizes, shades, quantities or flavours from the category count.

## Data still required

The project file `Asclepius_Wellness_Product_Catalog_Analysis.md` was not available in the Library at the time of this work. The full SKU-level list is still needed to reconcile the partial categories and to validate the remaining source rows against the company's original product master.
