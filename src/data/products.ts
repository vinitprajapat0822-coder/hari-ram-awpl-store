import { awplProducts } from "./awpl-products";
import { catalogueCategories, catalogueCategoryFilters } from "./catalogue";
import type {
  ProductImageStatus,
  ProductMasterStatus,
  ProductVariant,
} from "./catalogue";

export type Product = {
  id: string;
  name: string;
  nameHi?: string | null;
  category: string;
  description?: string | null;
  mrp: number;
  qty: string;
  image: string | null;
  imageStatus: ProductImageStatus;
  variants: ProductVariant[];
  status: ProductMasterStatus;
};

const categoryNameBySlug = new Map(
  catalogueCategories.map((category) => [category.slug, category.name])
);

/**
 * Storefront-safe view of the MRP-only master catalogue.
 * Records without MRP are not orderable and are omitted from the grid.
 * Review-status records remain visible for transparency but cannot be added
 * to the cart until their source data is resolved.
 */
export const products: Product[] = awplProducts.flatMap((record) => {
  if (record.mrp === null) return [];
  const category = categoryNameBySlug.get(record.category);
  if (!category) return [];

  return [{
    id: record.id,
    name: record.name,
    nameHi: record.nameHi,
    category,
    description: record.description,
    mrp: record.mrp,
    qty: record.packSize ?? "",
    image: record.image.url,
    imageStatus: record.image.status,
    variants: record.variants,
    status: record.status,
  }];
});

export const categories = [...catalogueCategoryFilters];
