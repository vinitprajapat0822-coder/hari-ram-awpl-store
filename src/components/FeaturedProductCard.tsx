"use client";

import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@zakisheriff/liquid-glass";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <GlassCard
      padding="16px"
      radius="28px"
      intensity={5}
      thickness={2}
      tint="rgba(255, 179, 0, 0.10)"
      className="liquid-glass-featured"
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-center">
        <div className="relative aspect-square overflow-hidden rounded-[20px] border border-white/10 bg-[#031A1C]/70">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name + " product image"}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-contain p-4"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-white/45">
              Product image unavailable
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#FFCA55]">
            Featured catalogue pick
          </p>
          <h2 className="mt-2 text-lg font-extrabold leading-snug text-[#EAF6F5] sm:text-xl">
            {product.name}
          </h2>
          <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#C2D8D8]/75">
            {product.description || "Open the product page for its listed details."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[11px] text-[#C2D8D8]/70">
              Pack: {product.qty || "See product details"}
            </span>
            <strong className="text-base font-black text-[#FFB300]">
              {formatPrice(product.mrp)}
            </strong>
          </div>
          <Link
            href={"/product/" + encodeURIComponent(product.id) + "/"}
            className="mt-4 inline-flex min-h-10 items-center rounded-xl border border-[#FFB300]/40 bg-[#FFB300]/10 px-4 text-xs font-extrabold text-[#FFD166] transition-colors hover:bg-[#FFB300]/20"
          >
            View product
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
