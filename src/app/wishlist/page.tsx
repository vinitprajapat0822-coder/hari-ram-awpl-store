"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import GlassCard from "@/components/GlassCard";
import { products } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useLanguage } from "@/i18n/useLanguage";

export default function WishlistPage() {
  const wishlistIds = useStore((state) => state.wishlistIds);
  const { t, formatNumber } = useLanguage();
  const savedProducts = products.filter((product) => wishlistIds.includes(product.id));

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/85">{t("storefrontName")}</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{t("wishlist")}</h1>
            <p className="mt-2 text-xs text-white/75" aria-live="polite">{formatNumber(savedProducts.length)} {t("wishlistSavedCount")}</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100">
            <Heart size={21} aria-hidden="true" />
          </span>
        </div>

        {savedProducts.length === 0 ? (
          <GlassCard className="rounded-[22px] px-6 py-12 text-center sm:py-16">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100/85">
              <Heart size={27} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-bold text-white">{t("wishlistEmptyTitle")}</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/75">{t("wishlistEmptyHelp")}</p>
            <Link href="/#catalogue" className="hero-cta focus-visible:amber mt-6 min-h-11">
              {t("browseProducts")} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5" data-testid="wishlist-grid">
            {savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </main>
  );
}
