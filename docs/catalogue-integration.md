# AWPL catalogue integration

## Source and taxonomy

- Primary source: the official Asclepius Wellness website and its category listing pages.
- Source snapshot checked: 6 November 2026.
- The storefront uses the same 15 category names and navigation order as the official product menu.
- The official category selector reports 374 entries. This is stored as a selector snapshot only; it is not treated as 374 unique products or as proof that every variant is a separate product card.

## Current data state

- Catalogue master: 163 records.
- Public storefront projection: 151 records.
- Records use MRP only. DP and SP are intentionally not imported, shown, or used in cart totals.
- Pack sizes, apparel colours and apparel sizes are kept as separate records only where the official listing exposes separate rows.
- Categories with a product count different from the official selector counter are not padded with assumed variants.
- The second item shown in the official Others page is not imported because its contents could not be verified from the captured listing.
- Wellness, Wellroot and Veterinary records are withheld from the public order flow pending appropriate product classification and label review.
- Agriculture records show the source-listed name, MRP and pack size, but remain blocked from cart while composition and label information are unavailable.
- A nutrition product in Baby Care remains outside the public order flow; the ordinary baby-care product rows remain separate.

See `catalogueCollectionCoverage` and `catalogueDataStatus` in `src/data/catalogue.ts` for the captured-row and review state by category.

## Price and data statuses

- `VERIFIED`: listed name, MRP and pack size were transcribed from the official category listing.
- `PRICE_REVIEW_REQUIRED`: the record has a price discrepancy requiring pack-label or current company confirmation. The card cannot be added to cart.
- `MISSING_DATA`: one or more product details, such as composition/classification, still require verification. The card cannot be added to cart.

The official site does not provide a dependable page-update timestamp in the captured listing. The checked date records when the page was inspected; it is not a claim that the company issued a new price circular on that date. Confirm current printed MRP and stock before accepting any order.

## Images

- The master currently contains 8 exact official AWPL product-image URLs.
- Only those verified official image URLs are rendered as product photographs.
- Other products display an explicit image-pending placeholder. Unrelated stock photos and inferred image-to-product matches are not used.
- Add an image URL only after confirming that it belongs to the exact product and pack/variant.

## Product SKU rules

Never merge different pack sizes, apparel sizes, colours or cosmetic shades into one selector when the company page lists them separately. Each confirmed SKU is its own product card and cart line. Do not infer extra variants from category selector counters.

## Public order flow

The catalogue is a storefront prototype, not an inventory or medical-advice system. Category rows with incomplete classification or label information must remain non-orderable. Do not publish unverified health claims, ingredients, usage directions, stock status, certifications or delivery promises.
