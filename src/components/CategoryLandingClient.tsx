"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, PackageSearch } from "lucide-react";
import type { Product } from "@/data/products";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/i18n/useLanguage";

type Props = {
  categoryName: string;
  products: Product[];
  heldForReview: boolean;
};

const PAGE_SIZE = 24;

export default function CategoryLandingClient({ categoryName, products, heldForReview }: Props) {
  const { t, categoryLabel, formatNumber } = useLanguage();
  const [page, setPage] = useState(1);
  const visibleProducts = products.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProducts.length < products.length;

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-7 sm:px-6 sm:pt-9">
        <Link href="/#catalogue" className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-teal-100 focus-visible:amber">
          <ArrowLeft size={15} aria-hidden="true" /> {t("pageBackToCatalogue")}
        </Link>

        <header className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/85">{t("browseCategories")}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{categoryLabel(categoryName)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
            {heldForReview ? t("categoryDisabledHelp") : t("categoryPageDescription")}
          </p>
          {!heldForReview && (
            <p className="mt-3 text-xs font-semibold text-teal-100/85" aria-live="polite">
              {formatNumber(products.length)} {t("resultCount")}
            </p>
          )}
        </header>

        {heldForReview ? (
          <section className="glass-card rounded-[24px] p-6 sm:p-8" aria-live="polite">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200/15 bg-amber-200/[0.06] text-amber-100/85">
              <PackageSearch size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-white">{t("categoryDisabled")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">{t("categoryNoPublicProductsHelp")}</p>
          </section>
        ) : products.length === 0 ? (
          <section className="glass-card rounded-[24px] p-6 sm:p-8" aria-live="polite">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75">
              <PackageSearch size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-white">{t("categoryNoPublicProducts")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">{t("categoryNoPublicProductsHelp")}</p>
          </section>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5" data-testid="category-product-grid" aria-label={categoryLabel(categoryName) + " " + t("productCatalogue")}>
              {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
            </div>
            {hasMore && (
              <div className="mt-7 flex flex-col items-center gap-2">
                <p className="text-xs text-white/75">{t("showingProducts")} {formatNumber(visibleProducts.length)} {t("of")} {formatNumber(products.length)}</p>
                <button type="button" onClick={() => setPage((current) => current + 1)} className="btn-cyan inline-flex min-h-11 items-center gap-2 rounded-xl px-6 text-sm focus-visible:amber">
                  {t("loadMore")} <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}

        <p className="mx-auto mt-9 max-w-2xl text-center text-[10px] leading-5 text-white/70">{t("listedMrpNotice")}</p>
      </div>
    </main>
  );
}
