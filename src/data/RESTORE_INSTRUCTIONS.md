# Product Catalogue Restore

## What happened
`src/data/awpl-products.ts` was temporarily overwritten. Restore it from the last good commit:

```bash
cd ~/hari-ram-awpl-store
git fetch origin
git show 73d576c9df34588efb4674944652104434019e8e:src/data/awpl-products.ts > src/data/awpl-products.ts
```

## Add Wellness + Wellroot (95 products, MRP only)

After restore, either:
1. Replace with the full 230-product file from Grok artifacts (`awpl-products-FULL-230.ts`), or
2. Keep original 135 and add `awpl-products-wellness-wellroot.ts` then merge in `products.ts`.

## Official source
https://www.asclepiuswellness.com/

Categories on site: Wellness, Wellroot, Agriculture, Spices/Jeeveda, Baby Care, Cosmetics, Herbal, Elite, Fragrances, Oral Care, Veterinary, Apparels, Home Care, Food, Others.

Storefront uses **MRP only** (no DP/SP shown to customers).
