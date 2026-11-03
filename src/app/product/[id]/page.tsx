import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { products } from "@/data/products";

export const dynamicParams = false;

type PageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = products.find((item) => item.id === params.id);
  if (!product) return { title: "Product not found | Hari Ram AWPL Store" };

  return {
    title: product.name + " | Hari Ram AWPL Store",
    description: product.description
      || product.name + " — listed MRP, pack size and store availability details.",
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = products.find((item) => item.id === params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
