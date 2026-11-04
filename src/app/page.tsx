"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import PromoCarousel from "@/components/PromoCarousel";
import VelocityTicker from "@/components/VelocityTicker";
import CategorySurfer from "@/components/CategorySurfer";
import { useSearchMorphPlaceholder } from "@/components/SearchMorph";
import { ArrowRight, Search, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const searchPlaceholder = useSearchMorphPlaceholder();
  const { locale, t, categoryLabel } = useLanguage();

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") {
      list = list.filter((product) => product.category === activeCategory);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        productName(product).toLowerCase().includes(query) ||
        (product.nameHi ?? "").toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query) ||
        (product.qty ?? "").toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        categoryLabel(product.category).toLowerCase().includes(query)
      );
    }

    return list;
  }, [activeCategory, search, locale, categoryLabel, productName]);

  const categoryCount = categories.filter((category) => category !== "All").length;

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 pb-5 pt-5 sm:px-6 sm:pt-7">
        <PromoCarousel productCount={products.length} categoryCount={categoryCount} />
      </section>

      <section id="catalogue" className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6">
        <VelocityTicker />

        <div className="mb-4 mt-7 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-200/65">{t("discoverRange")}</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{t("productCatalogue")}</h2>
          </div>
          <p className="text-xs text-white/40">{t("browseByCategory")}</p>
        </div>

        <div className="search-shell mb-4 flex min-h-[54px] items-center gap-3 px-4">
          <Search size={18} className="shrink-0 text-teal-100/55" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={t("searchProducts")}
            className="min-w-0 flex-1 py-3 text-sm outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={t("clearSearch")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <CategorySurfer
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="mb-4 flex min-h-8 items-center justify-between gap-3">
          <p className="text-xs font-medium text-white/45" aria-live="polite">
            {filtered.length} {locale === "hi" ? t("products") : filtered.length === 1 ? t("product") : t("products")}{activeCategory !== "All" ? (locale === "hi" ? " · " + categoryLabel(activeCategory) : " in " + categoryLabel(activeCategory)) : ""}
          </p>
          {(search || activeCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-100/75 transition-colors hover:text-teal-50"
            >
              {t("clearFilters")} <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl px-5 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.06] text-teal-100/70">
              <Search size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-white">{t("noMatches")}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">{t("tryAnother")}</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-100/20 bg-teal-100/[0.08] px-4 py-2.5 text-xs font-bold text-teal-100"
            >
              {t("resetCatalogue")} <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
            data-testid="product-grid"
          >
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <p className="mx-auto mt-8 max-w-2xl pb-2 text-center text-[10px] leading-5 text-white/30">
          {t("displayedMrpNotice")}
        </p>
      </section>
    </main>
  );
}
