import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import ProductImage from "@/components/ProductImage";
import ProductDetailActions from "@/components/ProductDetailActions";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_PRICE_BASIS, getUnitPrice } from "@/lib/order";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) notFound();

  const displayPrice = getUnitPrice(product, DEFAULT_PRICE_BASIS);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pt-5">
        <Link href="/" className="text-sm text-cyan-300/80 hover:text-cyan-200">
          ← Back to store
        </Link>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <GlassCard className="p-4 sm:p-6">
            <div className="aspect-square max-h-[520px] overflow-hidden rounded-2xl">
              <ProductImage
                key={product.id}
                src={product.image}
                alt={product.name}
                fallbackText={product.name.charAt(0).toUpperCase()}
                className="h-full w-full rounded-2xl"
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5 sm:p-7 flex flex-col">
            <p className="text-sm font-medium text-cyan-300">{product.category}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              {product.name}
            </h1>
            <p className="mt-1 text-base text-white/55">{product.nameHi}</p>
            <p className="mt-5 text-sm leading-6 text-white/70">
              {product.description}
            </p>

            <div className="mt-6">
              <p className="text-3xl font-bold text-white">
                {formatPrice(displayPrice)}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {DEFAULT_PRICE_BASIS.toUpperCase()} · {product.qty}
              </p>
            </div>

            <div className="mt-7">
              <ProductDetailActions product={product} />
            </div>

            <p className="mt-5 text-xs leading-5 text-white/40">
              Product information is for general reference. Check the product
              label for ingredients, directions and warnings. For health-related
              questions, consult a qualified healthcare professional. This
              storefront does not replace medical advice.
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
