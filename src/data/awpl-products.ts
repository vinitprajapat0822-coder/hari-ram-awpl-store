import type { ProductMasterRecord } from "./catalogue";

/**
 * EMERGENCY partial restore after accidental overwrite.
 * Full 230-product catalogue is in Grok artifacts / restore from git:
 *   git show 73d576c9df34588efb4674944652104434019e8e:src/data/awpl-products.ts > src/data/awpl-products.ts
 * Then merge Wellness+Wellroot from official site scrape (2026-11-06).
 */
export const awplProducts: ProductMasterRecord[] = [
  {
    id: "awpl-wellness-immunodoc-ras",
    name: "IMMUNODOC RAS",
    nameHi: null,
    brand: null,
    category: "wellness",
    subcategory: null,
    mrp: 2073,
    packSize: "1000.00 ML",
    description: null,
    ingredients: null,
    image: { url: null, status: "MISSING" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  },
  {
    id: "awpl-wellness-livodoc-ras",
    name: "LIVODOC RAS",
    nameHi: null,
    brand: null,
    category: "wellness",
    subcategory: null,
    mrp: 1494,
    packSize: "500.00 ML",
    description: null,
    ingredients: null,
    image: { url: null, status: "MISSING" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  },
  {
    id: "awpl-wellness-thunderblast-ras",
    name: "THUNDERBLAST RAS",
    nameHi: null,
    brand: null,
    category: "wellness",
    subcategory: null,
    mrp: 2248,
    packSize: "500.00 ML",
    description: null,
    ingredients: null,
    image: { url: null, status: "MISSING" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  },
  {
    id: "awpl-wellroot-ashwagandha-tablet",
    name: "ASHWAGANDHA TABLET",
    nameHi: null,
    brand: null,
    category: "wellroot",
    subcategory: null,
    mrp: 1311,
    packSize: "60.00 NUMBER",
    description: null,
    ingredients: null,
    image: { url: null, status: "MISSING" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellroot/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellroot/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  },
  {
    id: "awpl-wellroot-spiradoc-tablet",
    name: "SPIRADOC TABLET",
    nameHi: null,
    brand: null,
    category: "wellroot",
    subcategory: null,
    mrp: 1289,
    packSize: "60.00 NUMBER",
    description: null,
    ingredients: null,
    image: { url: null, status: "MISSING" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellroot/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/wellroot/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  }
];
