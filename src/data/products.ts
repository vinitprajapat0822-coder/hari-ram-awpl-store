import { awplProducts } from "./awpl-products";
import { catalogueCategories, catalogueCategoryFilters } from "./catalogue";
import type {
  ProductImageStatus,
  ProductMasterRecord,
  ProductMasterStatus,
} from "./catalogue";
import { translateProductDescriptionToHindi, translateProductNameToHindi } from "@/i18n/productHindi";

export type Product = {
  id: string;
  name: string;
  nameHi: string;
  brand?: string | null;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  descriptionHi: string;
  ingredients?: string[] | null;
  mrp: number;
  qty: string;
  image: string | null;
  imageStatus: ProductImageStatus;
  status: ProductMasterStatus;
  availability: ProductMasterRecord["availability"];
  priceEvidence: ProductMasterRecord["priceEvidence"];
  productSource: ProductMasterRecord["productSource"];
  lastVerifiedAt: string | null;
};

const categoryNameBySlug = new Map(catalogueCategories.map((category) => [category.slug, category.name]));

/** Storefront-safe MRP-only catalogue; Hindi fields are populated for every displayed record. */
export const products: Product[] = awplProducts.flatMap((record) => {
  if (record.mrp === null) return [];
  if (record.category === "wellness" || record.category === "wellroot" || record.category === "agriculture" || record.category === "veterinary" || record.id === "awpl-baby-protein") return [];
  const category = categoryNameBySlug.get(record.category);
  if (!category) return [];

  const nameHi = record.nameHi?.trim() || translateProductNameToHindi(record.name);
  const descriptionHi = record.descriptionHi?.trim() || translateProductDescriptionToHindi(nameHi, record.category, record.packSize ?? "");

  return [{
    id: record.id,
    name: record.name,
    nameHi,
    brand: record.brand ?? null,
    category,
    subcategory: record.subcategory ?? null,
    description: record.description ?? null,
    descriptionHi,
    ingredients: record.ingredients ?? null,
    mrp: record.mrp,
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
