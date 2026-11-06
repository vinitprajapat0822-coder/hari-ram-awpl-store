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
- Official product image URLs from AWPL sources are mapped where present; the storefront only treats an image as official when `imageStatus === "VERIFIED"` and the asset loads successfully.
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

## Product images (Phase 1 rules)

Display rules enforced in `ProductArtwork`:

1. Show an official image only when:
   - `image.url` is present, and
   - `image.status === "VERIFIED"`, and
   - the remote asset loads without error.
2. If a verified URL fails to load (404 / network), fall back to the monogram placeholder and label it **Official image unavailable**.
3. If there is no verified mapping, show the monogram placeholder and label it **Official image pending**.
4. Never substitute unrelated stock photos, AI-invented packaging, or images from a different SKU.
5. Add or keep an image URL only after confirming the exact SKU / pack-size match against the official source.

Product detail pages surface image status as a catalogue fact and do not invent ingredients, medical claims, stock counts, or customer reviews.

## Product detail page

- Structured facts: category, brand, pack size, image status, product code, last verified date.
- Description and ingredients only when present on the catalogue record (no fabricated content).
- Related products: up to 6 other `VERIFIED` items from the same category.
- Price evidence / review notes shown when present on the record.
- WhatsApp enquiry remains the order path until a backend order system exists.

## SKU and storefront rules

Never merge separate pack sizes, apparel sizes/colours, or cosmetic shades where AWPL lists them as individual SKUs. Each confirmed SKU is its own product card and cart line. Do not infer extra variants from selector counters.

The storefront is a product catalogue and order-enquiry prototype, not a live inventory system. Do not invent ingredients, medical claims, usage directions, stock status, certifications, customer reviews, or delivery promises.
