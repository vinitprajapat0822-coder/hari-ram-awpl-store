import { awplProducts } from "./awpl-products";
import { catalogueCategories, catalogueCategoryFilters } from "./catalogue";
import type {
  ProductImageStatus,
  ProductMasterStatus,
} from "./catalogue";

export type Product = {
  id: string;
  name: string;
  nameHi?: string | null;
  category: string;
  description?: string | null;
  mrp: number;
  sellingPrice?: number | null;
  qty: string;
  image: string | null;
  imageStatus: ProductImageStatus;
  status: ProductMasterStatus;
};

const categoryNameBySlug = new Map(
  catalogueCategories.map((category) => [category.slug, category.name])
);

/**
 * Storefront-safe view of the MRP-only master catalogue.
 * Discounted selling prices are optional and are shown only after verification.
 * Records without MRP are not orderable and are omitted from the grid.
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
    sellingPrice: null,
    qty: record.packSize ?? "",
    image: record.image.url,
    imageStatus: record.image.status,
    status: record.status,
  }];
});

export const categories = [...catalogueCategoryFilters];
