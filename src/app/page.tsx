"use client";

import { useEffect, useMemo, useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import StorefrontHero from "@/components/StorefrontHero";
import VelocityTicker from "@/components/VelocityTicker";
import CategorySurfer from "@/components/CategorySurfer";
import { ArrowRight, Search, X } from "lucide-react";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import { useLanguage } from "@/i18n/useLanguage";

const featuredProduct = products.find((product) => product.status === "VERIFIED" && product.imageStatus === "VERIFIED" && Boolean(product.image));
const PAGE_SIZE = 24;

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { lang, t, categoryLabel, formatNumber } = useLanguage();

  useEffect(() => setPage(1), [search, activeCategory]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") list = list.filter((product) => product.category === activeCategory);
    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.nameHi.toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query) ||
        product.descriptionHi.toLowerCase().includes(query) ||
        (product.qty ?? "").toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        categoryLabel(product.category).toLowerCase().includes(query)
      );
    }
    return list;
  }, [activeCategory, search, categoryLabel]);

  const visibleProducts = filtered.slice(0, page * PAGE_SIZE);
  const categoryCount = categories.filter((category) => category !== "All").length;
  const populatedCategoryCount = new Set(products.map((product) => product.category)).size;
  const categoryPending = !search.trim() && ["Wellness", "Wellroot", "Agriculture", "Veterinary"].includes(activeCategory);

  const clearFilters = () => { setSearch(""); setActiveCategory("All"); setPage(1); };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <section className="content-auto mx-auto max-w-6xl px-4 pb-5 pt-5 sm:px-6 sm:pt-7">
        <StorefrontHero productCount={products.length} categoryCount={categoryCount} populatedCategoryCount={populatedCategoryCount} featuredCategories={Array.from(new Set(products.map((product) => product.category))).slice(0, 3)} />
      </section>
      <section className="content-auto mx-auto max-w-6xl px-4 pb-5 pt-1 sm:px-6" aria-label={t("featuredPick")}>
        {featuredProduct && <FeaturedProductCard product={featuredProduct} />}
      </section>
      <section id="catalogue" className="content-auto mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6">
        <VelocityTicker productCount={products.length} categoryCount={categoryCount} />
        <div className="catalogue-heading mb-4 mt-8 sm:mb-5">
          <div>
            <p className="catalogue-heading__eyebrow">{t("fullRange")}</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{t("productCatalogue")}</h2>
            <p className="mt-1.5 text-xs text-white/75">{t("clearView")}</p>
          </div>
          <span className="catalogue-heading__hint"><Search size={14} aria-hidden="true" />{t("searchFilter")}</span>
        </div>
        <div className="search-shell mb-4 flex min-h-14 items-center gap-3 px-4">
          <Search size={18} className="shrink-0 text-teal-100/75" aria-hidden="true" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchProducts")} aria-label={t("searchProducts")} className="min-w-0 flex-1 py-3 text-sm" />
          {search && <button type="button" onClick={() => setSearch("")} aria-label={t("clearSearch")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:amber"><X size={16} aria-hidden="true" /></button>}
        </div>
        <CategorySurfer categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        <div className="mb-4 flex min-h-11 items-center justify-between gap-3">
          <p className="text-xs font-medium text-white/75" aria-live="polite">
            {formatNumber(filtered.length)} {t("resultCount")}{activeCategory !== "All" ? " · " + categoryLabel(activeCategory) : ""}
          </p>
          {(search || activeCategory !== "All") && <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-teal-100 hover:text-teal-50 focus-visible:amber">{t("clearFilters")} <X size={13} aria-hidden="true" /></button>}
        </div>
        {filtered.length === 0 ? (
          <div className="catalogue-card rounded-[22px] px-5 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.06] text-teal-100/85"><Search size={22} aria-hidden="true" /></span>
            <h3 className="mt-4 text-base font-bold text-white">{categoryPending ? t("categoryDisabled") : t("noMatches")}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/75">{categoryPending ? t("categoryDisabledHelp") : t("noMatchesHelp")}</p>
            <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-100/20 bg-teal-100/[0.08] px-4 text-xs font-bold text-teal-100 focus-visible:amber">{t("resetCatalogue")} <ArrowRight size={14} aria-hidden="true" /></button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5" data-testid="product-grid">
              {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
            </div>
            {visibleProducts.length < filtered.length && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs text-white/75">{t("showingProducts")} {formatNumber(visibleProducts.length)} {t("of")} {formatNumber(filtered.length)}</p>
                <button type="button" onClick={() => setPage((current) => current + 1)} className="btn-cyan min-h-11 rounded-xl px-6 text-sm focus-visible:amber">{t("loadMore")}</button>
              </div>
            )}
          </>
        )}
        <p className="mx-auto mt-8 max-w-2xl pb-2 text-center text-[10px] leading-5 text-white/65">{t("listedMrpNotice")}</p>
      </section>
    </main>
  );
}
