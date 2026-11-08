"use client";

import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@zakisheriff/liquid-glass";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/i18n/useLanguage";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const productName = lang === "hi" && product.nameHi ? product.nameHi : product.name;
  const description = lang === "hi" && product.descriptionHi ? product.descriptionHi : product.description;

  return (
    <div className="featured-glass-shell">
      <GlassCard
        padding="16px"
        radius="22px"
        intensity={7}
        thickness={3}
        tint="rgba(255,179,0,0.10)"
        className="liquid-glass-featured"
      >
        <div className="grid gap-5 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-center">
          <div className="relative aspect-square overflow-hidden rounded-[20px] border border-white/10 bg-[#031A1C]/70">
            {product.image ? (
              <Image
                src={product.image}
                alt={productName + " product image"}
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 100vw, 180px"
                className="object-contain p-4"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-white/75">
                {t("imageUnavailable")}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#FFCA55]">
              {t("featuredPick")}
            </p>
            <h2 className="mt-2 text-lg font-extrabold leading-snug text-[#EAF6F5] sm:text-xl">{productName}</h2>
            <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#C2D8D8]/85">
              {description || "उत्पाद विवरण के लिए उत्पाद पृष्ठ देखें।"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-[11px] text-[#C2D8D8]/85">{t("pack")} {product.qty || "—"}</span>
              <strong className="text-base font-black text-[#FFB300]">{formatPrice(product.mrp)}</strong>
            </div>
            <Link href={"/product/" + encodeURIComponent(product.id) + "/"} className="focus-visible:amber mt-4 inline-flex min-h-11 items-center rounded-xl border border-[#FFB300]/40 bg-[#FFB300]/10 px-4 text-xs font-extrabold text-[#FFD166] transition-colors hover:bg-[#FFB300]/20">
              {t("viewProduct")}
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
