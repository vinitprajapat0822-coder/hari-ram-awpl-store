"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import type { Product } from "@/data/products";
import { catalogueCategories } from "@/data/catalogue";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import StorefrontHero from "@/components/StorefrontHero";
import VelocityTicker from "@/components/VelocityTicker";
import CategorySurfer from "@/components/CategorySurfer";
import { ArrowRight, Search, X } from "lucide-react";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import { useLanguage } from "@/i18n/useLanguage";
import { rankProducts } from "@/lib/product-search";
import { formatPrice } from "@/lib/utils";

type Props = {
  initialProducts: Product[];
  featuredProduct: Product | null;
  productCount: number;
  categories: string[];
  categoryCount: number;
  populatedCategoryCount: number;
  featuredCategories: string[];
};

const PAGE_SIZE = 24;

export default function StorefrontClient({
  initialProducts,
  featuredProduct,
  productCount,
  categories,
  categoryCount,
  populatedCategoryCount,
  featuredCategories,
}: Props) {
  const [catalogue, setCatalogue] = useState<Product[]>(initialProducts);
  const [catalogueReady, setCatalogueReady] = useState(false);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const cataloguePromise = useRef<Promise<Product[]> | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { t, categoryLabel, formatNumber } = useLanguage();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  async function ensureCatalogue(): Promise<Product[]> {
    if (catalogueReady) return catalogue;
    if (!cataloguePromise.current) {
      setCatalogueLoading(true);
      cataloguePromise.current = import("@/data/products")
        .then((module) => module.products)
        .catch((error) => {
          cataloguePromise.current = null;
          throw error;
        })
        .finally(() => setCatalogueLoading(false));
    }
    const fullCatalogue = await cataloguePromise.current;
    setCatalogue(fullCatalogue);
    setCatalogueReady(true);
    return fullCatalogue;
  }

  const filtered = useMemo(() => {
    const list = activeCategory === "All" ? catalogue : catalogue.filter((product) => product.category === activeCategory);
    return rankProducts(list, debouncedSearch);
  }, [catalogue, activeCategory, debouncedSearch]);

  const suggestionResults = useMemo(() => {
    if (search.trim().length < 2) return [];
    const list = activeCategory === "All" ? catalogue : catalogue.filter((product) => product.category === activeCategory);
    return rankProducts(list, search).slice(0, 5);
  }, [catalogue, activeCategory, search]);

  const visibleProducts = filtered.slice(0, page * PAGE_SIZE);
  const categoryPending = !search.trim() && ["Wellness", "Wellroot", "Agriculture", "Veterinary"].includes(activeCategory);
  const selectedCategory = catalogueCategories.find((category) => category.name === activeCategory);
  const resultCount = catalogueReady || search.trim() || activeCategory !== "All" ? filtered.length : productCount;
  const hasMore = visibleProducts.length < filtered.length || (!catalogueReady && !search.trim() && activeCategory === "All");

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSuggestionsOpen(false);
    setActiveSuggestion(0);
    setActiveCategory("All");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    setActiveSuggestion(0);
    setSuggestionsOpen(value.trim().length >= 2);
    if (value.trim()) void ensureCatalogue().catch(() => undefined);
  };

  const selectSuggestion = (product: Product) => {
    setSearch(product.name);
    setDebouncedSearch(product.name);
    setSuggestionsOpen(false);
    setActiveSuggestion(0);
    router.push("/product/" + encodeURIComponent(product.id) + "/");
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen || suggestionResults.length === 0) {
      if (event.key === "Escape") setSuggestionsOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) => Math.min(current + 1, suggestionResults.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectSuggestion(suggestionResults[activeSuggestion] ?? suggestionResults[0]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setSuggestionsOpen(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setPage(1);
    if (category !== "All") void ensureCatalogue().catch(() => undefined);
  };

  const handleLoadMore = () => {
    if (!catalogueReady) {
      void ensureCatalogue().catch(() => undefined);
      return;
    }
    setPage((current) => current + 1);
  };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <section className="content-auto mx-auto max-w-6xl px-4 pb-5 pt-5 sm:px-6 sm:pt-7">
        <StorefrontHero productCount={productCount} categoryCount={categoryCount} populatedCategoryCount={populatedCategoryCount} featuredCategories={featuredCategories} />
      </section>
      <section className="content-auto mx-auto max-w-6xl px-4 pb-5 pt-1 sm:px-6" aria-label={t("featuredPick")}>
        {featuredProduct && <FeaturedProductCard product={featuredProduct} />}
      </section>
      <section id="catalogue" className="content-auto mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6">
        <VelocityTicker productCount={productCount} categoryCount={categoryCount} />
        <div className="catalogue-heading mb-4 mt-8 sm:mb-5">
          <div>
            <p className="catalogue-heading__eyebrow">{t("fullRange")}</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{t("productCatalogue")}</h2>
            <p className="mt-1.5 text-xs text-white/75">{t("clearView")}</p>
          </div>
          <span className="catalogue-heading__hint"><Search size={14} aria-hidden="true" />{t("searchFilter")}</span>
        </div>
        <div className="relative mb-4">
          <div className="search-shell flex min-h-14 items-center gap-3 px-4">
            <Search size={18} className="shrink-0 text-teal-100/75" aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => handleSearchChange(event.target.value)} onFocus={() => setSuggestionsOpen(search.trim().length >= 2)} onKeyDown={handleSearchKeyDown} role="combobox" aria-autocomplete="list" aria-expanded={suggestionsOpen && search.trim().length >= 2 && suggestionResults.length > 0} aria-controls={suggestionsOpen && suggestionResults.length > 0 ? "catalogue-search-suggestions" : undefined} aria-activedescendant={suggestionsOpen && suggestionResults[activeSuggestion] ? "catalogue-search-option-" + activeSuggestion : undefined} placeholder={t("searchProducts")} aria-label={t("searchProducts")} className="min-w-0 flex-1 py-3 text-sm" />
            {search && <button type="button" onClick={() => { setSearch(""); setDebouncedSearch(""); setSuggestionsOpen(false); }} aria-label={t("clearSearch")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:amber"><X size={16} aria-hidden="true" /></button>}
          </div>
          {suggestionsOpen && search.trim().length >= 2 && suggestionResults.length > 0 && (
            <div id="catalogue-search-suggestions" role="listbox" aria-label={t("searchSuggestions")} className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#07111d]/[0.98] p-2 shadow-2xl backdrop-blur-2xl">
              {suggestionResults.map((product, index) => (
                <button id={"catalogue-search-option-" + index} key={product.id} type="button" role="option" aria-selected={activeSuggestion === index} onMouseDown={(event) => event.preventDefault()} onClick={() => selectSuggestion(product)} className={"flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:amber " + (activeSuggestion === index ? "bg-teal-200/10 text-white" : "text-white/85 hover:bg-white/[0.06]")}>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{product.name}</span>
                    <span className="mt-1 block truncate text-[10px] text-white/55">{categoryLabel(product.category)} · {product.qty || t("notListed")}</span>
                  </span>
                  <span className="shrink-0 text-xs font-extrabold text-teal-100">{formatPrice(product.mrp)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <CategorySurfer categories={categories} activeCategory={activeCategory} onSelect={handleCategorySelect} />
        {selectedCategory && (
          <div className="mb-4 flex justify-end">
            <Link href={"/category/" + selectedCategory.slug + "/"} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-100/20 bg-teal-100/[0.06] px-4 text-xs font-bold text-teal-100 transition-colors hover:bg-teal-100/[0.11] focus-visible:amber">
              {t("openCategoryPage")} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}
        <div className="mb-4 flex min-h-11 items-center justify-between gap-3">
          <p className="text-xs font-medium text-white/75" aria-live="polite">
            {formatNumber(resultCount)} {t("resultCount")}{activeCategory !== "All" ? " · " + categoryLabel(activeCategory) : ""}
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
            {hasMore && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs text-white/75">{t("showingProducts")} {formatNumber(visibleProducts.length)} {t("of")} {formatNumber(catalogueReady ? filtered.length : productCount)}</p>
                <button type="button" onClick={handleLoadMore} disabled={catalogueLoading} className="btn-cyan min-h-11 rounded-xl px-6 text-sm focus-visible:amber disabled:opacity-60">
                  {catalogueLoading ? t("loading") : t("loadMore")}
                </button>
              </div>
            )}
          </>
        )}
        <p className="mx-auto mt-8 max-w-2xl pb-2 text-center text-[10px] leading-5 text-white/65">{t("listedMrpNotice")}</p>
      </section>
    </main>
  );
}
