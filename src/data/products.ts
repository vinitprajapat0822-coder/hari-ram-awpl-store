import { awplProducts } from "./awpl-products";
import { catalogueCategories, catalogueCategoryFilters } from "./catalogue";
import type {
  ProductImageStatus,
  ProductMasterRecord,
  ProductMasterStatus,
} from "./catalogue";

export type Product = {
  id: string;
  name: string;
  nameHi?: string | null;
  brand?: string | null;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  ingredients?: string[] | null;
  mrp: number;
  sellingPrice?: number | null;
  qty: string;
  image: string | null;
  imageStatus: ProductImageStatus;
  status: ProductMasterStatus;
  availability: ProductMasterRecord["availability"];
  priceEvidence: ProductMasterRecord["priceEvidence"];
  productSource: ProductMasterRecord["productSource"];
  lastVerifiedAt: string | null;
};

const categoryNameBySlug = new Map(
  catalogueCategories.map((category) => [category.slug, category.name])
);

/**
 * Storefront-safe view of the MRP-only master catalogue.
 * Optional detail fields are preserved so product pages can show verified
 * information without fabricating stock, discounts, ingredients or reviews.
 */
export const products: Product[] = awplProducts.flatMap((record) => {
  if (record.mrp === null) return [];
  const category = categoryNameBySlug.get(record.category);
  if (!category) return [];

  return [{
    id: record.id,
    name: record.name,
    nameHi: record.nameHi ?? null,
    brand: record.brand ?? null,
    category,
    subcategory: record.subcategory ?? null,
    description: record.description ?? null,
    ingredients: record.ingredients ?? null,
    mrp: record.mrp,
    sellingPrice: null,
    qty: record.packSize ?? "",
    image: record.image.url,
    imageStatus: record.image.status,
    status: record.status,
    availability: record.availability,
    priceEvidence: record.priceEvidence,
    productSource: record.productSource,
    lastVerifiedAt: record.lastVerifiedAt,
  }];
});

export const categories = [...catalogueCategoryFilters];
