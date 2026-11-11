import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryLandingClient from "@/components/CategoryLandingClient";
import { catalogueCategories, catalogueCollectionCoverage } from "@/data/catalogue";
import { products } from "@/data/products";

const SITE_URL = "https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store";

type PageProps = { params: { slug: string } };

function getCategory(slug: string) {
  return catalogueCategories.find((category) => category.slug === slug);
}

function getCategoryProducts(slug: string) {
  const category = getCategory(slug);
  if (!category) return [];
  return products.filter((product) => product.category === category.name);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogueCategories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategory(params.slug);
  if (!category) return { title: "Category not found | Hari Ram AWPL Store" };

  const coverage = catalogueCollectionCoverage.find((entry) => entry.slug === params.slug);
  const count = getCategoryProducts(params.slug).length;
  const held = coverage?.coverage === "HELD_FOR_REVIEW";
  const description = held
    ? category.name + " products are not currently listed for public ordering while product classification and label details are reviewed."
    : "Browse " + count + " currently published " + category.name + " product records, with listed MRP and pack information. Confirm availability before ordering.";

  return {
    title: category.name + " Products | Hari Ram AWPL Store",
    description,
    alternates: {
      canonical: SITE_URL + "/category/" + category.slug + "/",
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const coverage = catalogueCollectionCoverage.find((entry) => entry.slug === params.slug);
  return (
    <CategoryLandingClient
      categoryName={category.name}
      products={getCategoryProducts(params.slug)}
      heldForReview={coverage?.coverage === "HELD_FOR_REVIEW"}
    />
  );
}
