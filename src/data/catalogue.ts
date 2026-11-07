/**
 * AWPL catalogue foundation.
 *
 * Official selector counters are preserved as source metadata. They are not
 * treated as verified unique product-card counts; some may represent variants.
 */

export const catalogueCategories = [
  { slug: "wellness", name: "Wellness", sourceSelectorCount: 48 },
  { slug: "wellroot", name: "Wellroot", sourceSelectorCount: 47 },
  { slug: "agriculture", name: "Agriculture", sourceSelectorCount: 4 },
  { slug: "jeeveda", name: "Jeeveda", sourceSelectorCount: 36 },
  { slug: "sniss-cosmetic", name: "SNISS Cosmetic", sourceSelectorCount: 88 },
  { slug: "sniss-herbal", name: "SNISS Herbal", sourceSelectorCount: 35 },
  { slug: "baby-care", name: "Baby Care", sourceSelectorCount: 4 },
  { slug: "sniss-fragrances", name: "SNISS Fragrances", sourceSelectorCount: 4 },
  { slug: "others", name: "Others", sourceSelectorCount: 2 },
  { slug: "food", name: "Food", sourceSelectorCount: 2 },
  { slug: "home-care", name: "Home Care", sourceSelectorCount: 15 },
  { slug: "apparels", name: "Apparels", sourceSelectorCount: 62 },
  { slug: "veterinary", name: "Veterinary", sourceSelectorCount: 2 },
  { slug: "sniss-elite", name: "SNISS Elite", sourceSelectorCount: 24 },
  { slug: "oral-care", name: "Oral Care", sourceSelectorCount: 1 },
] as const;

export type CatalogueCategorySlug =
  (typeof catalogueCategories)[number]["slug"];

export type ProductImageStatus =
  | "MISSING"
  | "UPLOADED_UNVERIFIED"
  | "MISMATCH"
  | "VERIFIED";

export type ProductMasterStatus =
  | "VERIFIED"
  | "PRICE_REVIEW_REQUIRED"
  | "MISSING_DATA";

export type ProductMasterRecord = {
  id: string;
  name: string;
  nameHi?: string | null;
  brand?: string | null;
  category: CatalogueCategorySlug;
  subcategory?: string | null;
  /** MRP only. Keep unresolved values null; never guess a price. */
  mrp: number | null;
  packSize?: string | null;
  /** Descriptions must be sourced and reviewed before publication. */
  description?: string | null;
  ingredients?: string[] | null;
  image: {
    url: string | null;
    status: ProductImageStatus;
    altText?: string | null;
  };
  availability: "UNKNOWN" | "AVAILABLE" | "UNAVAILABLE" | "REVIEW_REQUIRED";
  status: ProductMasterStatus;
  priceEvidence: {
    sourceLabel: string | null;
    sourceUrl: string | null;
    checkedAt: string | null;
    previousMrp?: number | null;
    reviewNote?: string | null;
  };
  productSource: {
    sourceLabel: string | null;
    sourceUrl: string | null;
    checkedAt: string | null;
  };
  lastVerifiedAt: string | null;
};

/**
 * Official AWPL selector snapshot checked on 2026-11-06.
 * Counts are shown as the company selector presents them and are not assumed
 * to equal the number of unique product cards or orderable SKUs.
 */
export const userProvidedCategorySnapshot = {
  capturedAt: "2026-11-06",
  totalListedEntries: 374,
  countMeaning: "official category-selector counters; not verified unique product counts",
  categories: catalogueCategories.map(({ slug, name, sourceSelectorCount }) => ({
    slug,
    name,
    listedEntries: sourceSelectorCount,
  })),
} as const;

export const latestObservedSelectorSnapshot = {
  observedAt: "2026-11-06",
  totalListedEntries: 374,
  observationStatus: "DIRECTLY_CHECKED_ON_OFFICIAL_SITE",
  observedVia: "Official AWPL product navigation and category selectors",
  sourceUrl: "https://www.asclepiuswellness.com/index.aspx",
  categoryCounts: {
    agriculture: 4,
    apparels: 62,
    babyCare: 4,
    food: 2,
    homeCare: 15,
    jeeveda: 36,
    oralCare: 1,
    others: 2,
    snissCosmetic: 88,
    snissElite: 24,
    snissFragrances: 4,
    snissHerbal: 35,
    veterinary: 2,
    wellness: 48,
    wellroot: 47,
  },
} as const;

/** Customer-facing filters follow the official AWPL navigation order. */
export const catalogueCategoryFilters = [
  "All",
  ...catalogueCategories.map((category) => category.name),
] as const;

/**
 * Visible product rows captured from the official category pages.
 * Selector counts and visible page rows are kept separate to avoid inflating
 * the catalogue with assumed variants or products not present in source data.
 */
export const catalogueCollectionCoverage = [
  { slug: "wellness", selectorEntries: 48, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "wellroot", selectorEntries: 47, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "agriculture", selectorEntries: 4, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "jeeveda", selectorEntries: 36, capturedRows: 30, coverage: "PARTIAL" },
  { slug: "sniss-cosmetic", selectorEntries: 88, capturedRows: 24, coverage: "PARTIAL" },
  { slug: "sniss-herbal", selectorEntries: 35, capturedRows: 30, coverage: "PARTIAL" },
  { slug: "baby-care", selectorEntries: 4, capturedRows: 3, coverage: "PARTIAL" },
  { slug: "sniss-fragrances", selectorEntries: 4, capturedRows: 4, coverage: "COMPLETE" },
  { slug: "others", selectorEntries: 2, capturedRows: 1, coverage: "PARTIAL" },
  { slug: "food", selectorEntries: 2, capturedRows: 2, coverage: "COMPLETE" },
  { slug: "home-care", selectorEntries: 15, capturedRows: 15, coverage: "COMPLETE" },
  { slug: "apparels", selectorEntries: 62, capturedRows: 13, coverage: "PARTIAL" },
  { slug: "veterinary", selectorEntries: 2, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "sniss-elite", selectorEntries: 24, capturedRows: 24, coverage: "COMPLETE" },
  { slug: "oral-care", selectorEntries: 1, capturedRows: 1, coverage: "COMPLETE" },
] as const;

export const catalogueDataStatus = {
  capturedAt: "2026-11-06",
  selectorEntryCountObserved: 374,
  rawListingRowsCaptured: 147,
  individualProductRecordsAfterVariantSplit: 147,
  completeCategories: 5,
  partialCategories: 6,
  heldCategories: 4,
  note: "147 consumer-product records are in the public catalogue. Wellness, Wellroot, Agriculture and Veterinary source categories are withheld; selector counters are not unique product totals.",
} as const;
