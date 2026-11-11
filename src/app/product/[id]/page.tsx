import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { products } from "@/data/products";

export const dynamicParams = false;

// Backward-compatible IDs used by earlier catalogue links.
const PRODUCT_ID_ALIASES: Record<string, string> = {
  "awpl-sniss-elite-salicylic-acid-face-sheet-mask": "awpl-elite-salicylic-sheet-mask",
};

function getProductByRouteId(id: string) {
  const canonicalId = PRODUCT_ID_ALIASES[id] ?? id;
  return products.find((item) => item.id === canonicalId);
}

type PageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return [
    ...products.map((product) => ({ id: product.id })),
    ...Object.keys(PRODUCT_ID_ALIASES).map((id) => ({ id })),
  ];
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductByRouteId(params.id);
  if (!product) return { title: "Product not found | Hari Ram AWPL Store" };

  return {
    title: product.name + " | Hari Ram AWPL Store",
    alternates: {
      canonical: "https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/product/" + encodeURIComponent(product.id) + "/",
    },
    description: product.description
      || product.name + " — listed MRP, pack size and store availability details.",
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductByRouteId(params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
