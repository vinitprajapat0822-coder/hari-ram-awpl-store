# AWPL catalogue integration notes

## What is integrated

- The 15 AWPL category names and the category-selector counts supplied in the project brief.
- A canonical future product record type with **MRP only**.
- A parent-product / variant structure for pack size, quantity, colour, shade and flavour.
- Separate image URL and image verification status fields. New products start with a missing image slot.
- Separate source, price-evidence, last-verified and availability fields.
- The existing storefront category filters now use all 15 category names.

## Count reconciliation

The user-provided selector snapshot totals 367 entries. A newer indexed view of the AWPL selector observed on 2026-11-03 showed 374 entries:
- SNISS Cosmetic: 84 -> 88
- SNISS Herbal: 34 -> 35
- Wellroot: 45 -> 47

The later view has not been fetched directly and is marked NEEDS_DIRECT_CONFIRMATION in `src/data/catalogue.ts`. Neither snapshot is a count of unique parent products. Do not create empty/fake product cards to make the storefront reach either total.

## Current product-data boundary

The current `src/data/products.ts` still contains 12 legacy seed records. They are not the complete catalogue and are not converted into the new master model in this change. The supplied catalogue analysis Markdown file was not available in the project files, and category totals do not contain enough information to populate product names, variants, source evidence or MRP.

The new `ProductMasterRecord` is the target model for verified records. It intentionally has no DP or SP fields. Product records should only be imported when their identity, category and MRP evidence are available. Price conflicts remain `PRICE_REVIEW_REQUIRED`; incomplete records remain `MISSING_DATA`.

## Image handling

No image files were supplied. The existing product-card image area remains a placeholder. New master records should use:

```ts
image: {
  url: null,
  status: "MISSING",
}
```

Replace the placeholder only after an authentic company-provided or otherwise verified product image is uploaded.

## Parent and variant rules

A product family is one parent record. Size, pack size, quantity, colour, shade and flavour are child variants. Do not create separate parent cards when the only difference is a verified variant. Do not infer variants.

## Next data dependency

The full SKU-level product list (names, categories, variant labels and current MRP evidence) is still required before the actual products can be populated. Until then, category totals remain reference metadata only.
