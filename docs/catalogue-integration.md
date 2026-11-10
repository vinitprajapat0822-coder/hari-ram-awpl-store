# AWPL catalogue integration

## Source and taxonomy

- Primary source: official Asclepius Wellness homepage and its category listing pages.
- Source snapshot checked: 6 November 2026.
- The storefront uses the same 15 category names and navigation order as the official product menu.
- The official selector showed 374 entries. This is a selector snapshot only; it is not a verified total of unique product-card SKUs.

## Public catalogue state

- 147 source-matched consumer-product records are present in the public catalogue.
- All displayed prices are MRP only. DP and SP are not stored, rendered, or used in cart totals.
- Pack sizes, apparel colours/sizes and cosmetic shades remain separate SKUs where the official listing exposes separate rows.
- All 147 of the 147 current product records contain an image URL. The store owner manually inspected every image against its product, variant and pack on 10 November 2026 and confirmed all matches.
- MRP-conflict and missing-data records are not orderable.
- Wellness, Wellroot, Agriculture and Veterinary product listings are withheld from the public order catalogue.
- Baby nutrition/supplement-like items are withheld; three ordinary Baby Care consumer-product rows remain.
- The second Others listing is not added to the public store because it is a supplement-like product rather than a general lifestyle SKU.
- The four SNISS Herbal items requiring medical/chemical classification are not added to the public store.

See `catalogueCollectionCoverage` and `catalogueDataStatus` in `src/data/catalogue.ts` for source-selector counters and captured-row coverage by category.

## Source reconciliation

Selector counters and visible page rows are tracked separately. A category's selector count is not used to invent product variants or missing records. The public data reflects only exact, source-matched consumer product rows that can be responsibly listed. Category filters for withheld categories remain present but display a review-state message rather than orderable product cards.

## Price and data statuses

- `VERIFIED`: listed product name, MRP and pack size were transcribed from an official listing.
- `PRICE_REVIEW_REQUIRED`: a listed price conflicts with an earlier source snapshot; the record cannot be added to cart.
- `MISSING_DATA`: product label/classification details still need verification; the record cannot be added to cart.

The date in `checkedAt` records when the category page was inspected, not the date of a company-issued price circular. Confirm current printed MRP and stock before accepting any order.

## Product images

- All 147 product records have a non-empty image URL.
- On 10 November 2026, the store owner manually inspected each product image one by one and confirmed that the pictured product, variant/colour and pack match its catalogue record.
- All 147 image records are therefore stored with `image.status: VERIFIED`; the previous `UPLOADED_UNVERIFIED` and `MISMATCH` labels were automated/obsolete classifications and have been superseded by this manual review.
- The storefront now displays the owner-confirmed images and reports the SKU/pack match as verified instead of showing a pending-review label or hiding those images.
- HTTP/MIME audits remain transport checks only and do not replace visual review.
- Image-match verification is separate from copyright/licensing or other image-use permissions; those rights must be confirmed independently.

## SKU and storefront rules

Never merge separate pack sizes, apparel sizes/colours, or cosmetic shades where AWPL lists them as individual SKUs. Each confirmed SKU is its own product card and cart line. Do not infer extra variants from selector counters.

The storefront is a product catalogue and order-enquiry prototype, not a live inventory system. Do not invent ingredients, medical claims, usage directions, stock status, certifications, customer reviews, or delivery promises.
