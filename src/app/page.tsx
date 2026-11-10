import { products, categories } from "@/data/products";
import StorefrontClient from "@/components/StorefrontClient";

const INITIAL_PRODUCTS = 12;
const featuredProduct = products.find((product) =>
  product.status === "VERIFIED" &&
  product.imageStatus === "VERIFIED" &&
  Boolean(product.image)
);
const populatedCategoryCount = new Set(products.map((product) => product.category)).size;
const featuredCategories = Array.from(new Set(products.map((product) => product.category))).slice(0, 3);

export default function HomePage() {
  return (
    <StorefrontClient
      initialProducts={products.slice(0, INITIAL_PRODUCTS)}
      featuredProduct={featuredProduct ?? null}
      productCount={products.length}
      categories={categories}
      categoryCount={categories.filter((category) => category !== "All").length}
      populatedCategoryCount={populatedCategoryCount}
      featuredCategories={featuredCategories}
    />
  );
}
