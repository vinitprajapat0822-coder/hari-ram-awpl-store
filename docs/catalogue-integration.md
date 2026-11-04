# AWPL catalogue integration

## Current implementation

- 15 AWPL category filters are available.
- 135 individual product records are wired to the storefront.
- The captured apparel listing rows are separate product records (for example, each shirt colour/size is its own SKU).
- Product records use MRP only. DP and SP are not part of the product type, catalogue data or cart calculations.
- Product descriptions and ingredient claims are left blank unless separately verified.
- Official AWPL image URLs are enabled for 115 exact product matches; 20 unresolved products retain the square "Image pending" placeholder.
- Cart lines are SKU-specific and WhatsApp order text includes the product's pack size.
- Existing persisted cart data is migrated to the current catalogue and stale/unsupported products are dropped.

## Source coverage

The AWPL selector showed 374 category entries in the latest indexed view checked on 2026-11-03. Those entries are not guaranteed to represent 374 unique parent products.

The current imported data contains 135 individual product records. The set remains partial against the 374-entry category selector. Categories with partial extraction remain visibly flagged in `catalogueCollectionCoverage`. Incomplete categories are not padded with invented products.

Categories marked HELD_FOR_REVIEW have category filters but no orderable product records. Product lines whose intended use/classification or required label information was not sufficiently established are intentionally not imported into the storefront.

## Price and data statuses

- `VERIFIED`: the name, listed MRP and pack information were transcribed from an AWPL official category listing.
- `PRICE_REVIEW_REQUIRED`: an AWPL listing price conflicts with the February 2026 catalogue data supplied in the project brief. The card is visible but cannot be added to cart.
- `MISSING_DATA`: the official listing contains a title or pack-size anomaly. The card is visible for review but cannot be added to cart.

The AWPL page snippets do not expose a formal page-update timestamp. The date in `checkedAt` is the date the indexed official listing was inspected; it is not a claim that the company issued a fresh price circular that day. Confirm current MRP on the labelled pack or current company-issued price list before accepting orders.

## Images

No images were supplied. Images are mapped to exact official AWPL product-image links where the product name and image alt text match. Current verified coverage is 115 of 135 records (85.2%). The remaining 20 records retain placeholders until their exact official image links are identified. Five additional exact official AWPL image URLs have been verified and synchronized into the TypeScript catalogue and SQL seed during the current work. Do not reuse a related product's image.

## Product SKU rules

Never group different pack sizes, sizes, colours or shades under one product selector. Each official listing SKU is its own product record, card and cart line. For example, 100 ML and 200 ML packs remain separate records even when the base product name is the same. Only create a new SKU when the official listing or product page confirms it; do not infer additional sizes or variants.

## Data still required

The project file `Asclepius_Wellness_Product_Catalog_Analysis.md` was not available in the Library at the time of this work. The full SKU-level list is still needed to reconcile the partial categories and to validate the remaining source rows against the company's original product master.
