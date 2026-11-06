/**
 * AWPL catalogue foundation.
 *
 * Category counts are listing-entry counts from snapshots, not verified
 * unique parent-product counts. Do not generate ProductMasterRecord rows
 * from category totals.
 */

export const catalogueCategories = [
  { slug: "agriculture", name: "Agriculture", userSnapshotCount: 4 },
  { slug: "apparels", name: "Apparels", userSnapshotCount: 62 },
  { slug: "baby-care", name: "Baby Care", userSnapshotCount: 4 },
  { slug: "food", name: "Food", userSnapshotCount: 2 },
  { slug: "home-care", name: "Home Care", userSnapshotCount: 15 },
  { slug: "jeeveda", name: "Jeeveda", userSnapshotCount: 36 },
  { slug: "oral-care", name: "Oral Care", userSnapshotCount: 1 },
  { slug: "others", name: "Others", userSnapshotCount: 2 },
  { slug: "sniss-cosmetic", name: "SNISS Cosmetic", userSnapshotCount: 88 },
  { slug: "sniss-elite", name: "SNISS Elite", userSnapshotCount: 24 },
  { slug: "sniss-fragrances", name: "SNISS Fragrances", userSnapshotCount: 4 },
  { slug: "sniss-herbal", name: "SNISS Herbal", userSnapshotCount: 35 },
  { slug: "veterinary", name: "Veterinary", userSnapshotCount: 2 },
  { slug: "wellness", name: "Wellness", userSnapshotCount: 48 },
  { slug: "wellroot", name: "Wellroot", userSnapshotCount: 47 },
] as const;

export type CatalogueCategorySlug =
  (typeof catalogueCategories)[number]["slug"];

export type ProductImageStatus =
  | "MISSING"
  | "UPLOADED_UNVERIFIED"
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
 * Snapshot supplied in the project brief. These are category-selector
 * entry counts, not confirmed unique product counts.
 */
export const userProvidedCategorySnapshot = {
  capturedAt: null,
  totalListedEntries: 374,
  countMeaning: "category-selector entries; variants may be separate entries",
  categories: catalogueCategories.map(({ slug, name, userSnapshotCount }) => ({
    slug,
    name,
    listedEntries: userSnapshotCount,
  })),
} as const;

/**
 * A newer indexed view of the AWPL category selector was observed on
 * 2026-11-03. It showed 374 entries (SNISS Cosmetic 88, SNISS Herbal 35,
 * Wellroot 47). Treat this as a refresh signal only until the selector can
 * be fetched and checked directly; it is deliberately not used for UI counts.
 */
export const latestObservedSelectorSnapshot = {
  observedAt: "2026-11-03",
  totalListedEntries: 374,
  observationStatus: "NEEDS_DIRECT_CONFIRMATION",
  observedVia: "indexed official AWPL Wellness listing",
  sourceUrl: "https://www.asclepiuswellness.com/product/wellness/",
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

/** Customer-facing filters use the canonical AWPL category taxonomy. */
export const catalogueCategoryFilters = [
  "All",
  ...catalogueCategories.map((category) => category.name),
] as const;


/**
 * Product rows captured from official AWPL category-listing page snapshots.
 * "captured" counts extracted listing rows, not unique parent-product cards.
 */
export const catalogueCollectionCoverage = [
  { slug: "agriculture", selectorEntries: 4, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "apparels", selectorEntries: 62, capturedRows: 13, coverage: "PARTIAL" },
  { slug: "baby-care", selectorEntries: 4, capturedRows: 3, coverage: "PARTIAL" },
  { slug: "food", selectorEntries: 2, capturedRows: 2, coverage: "COMPLETE" },
  { slug: "home-care", selectorEntries: 15, capturedRows: 15, coverage: "COMPLETE" },
  { slug: "jeeveda", selectorEntries: 36, capturedRows: 30, coverage: "PARTIAL" },
  { slug: "oral-care", selectorEntries: 1, capturedRows: 1, coverage: "COMPLETE" },
  { slug: "others", selectorEntries: 2, capturedRows: 1, coverage: "PARTIAL" },
  { slug: "sniss-cosmetic", selectorEntries: 88, capturedRows: 21, coverage: "PARTIAL" },
  { slug: "sniss-elite", selectorEntries: 24, capturedRows: 24, coverage: "COMPLETE" },
  { slug: "sniss-fragrances", selectorEntries: 4, capturedRows: 4, coverage: "COMPLETE" },
  { slug: "sniss-herbal", selectorEntries: 35, capturedRows: 34, coverage: "PARTIAL" },
  { slug: "veterinary", selectorEntries: 2, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "wellness", selectorEntries: 48, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
  { slug: "wellroot", selectorEntries: 47, capturedRows: 0, coverage: "HELD_FOR_REVIEW" },
] as const;

export const catalogueDataStatus = {
  capturedAt: "2026-11-03",
  selectorEntryCountObserved: 374,
  rawListingRowsCaptured: 148,
  individualProductRecordsAfterVariantSplit: 148,
  completeCategories: 5,
  partialCategories: 6,
  heldCategories: 4,
  note: "Selector counts are not unique product counts. Pack sizes and apparel size/colour options are separate product records, never grouped into variant selectors. Partial categories must not be labelled complete. Product types with unresolved medical, animal-health, agricultural-input or unclear classification are held out of the orderable storefront pending an appropriate review.",
} as const;
