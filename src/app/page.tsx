"use client";

import { useMemo, useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import StorefrontHero from "@/components/StorefrontHero";
import VelocityTicker from "@/components/VelocityTicker";
import CategorySurfer from "@/components/CategorySurfer";
import { useSearchMorphPlaceholder } from "@/components/SearchMorph";
import { ArrowRight, Search, X } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const searchPlaceholder = useSearchMorphPlaceholder();

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") {
      list = list.filter((product) => product.category === activeCategory);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (product.nameHi ?? "").toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query) ||
        (product.qty ?? "").toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    return list;
  }, [activeCategory, search]);

  const categoryCount = categories.filter((category) => category !== "All").length;
  const categoryPending = !search.trim() && ["Wellness", "Wellroot", "Agriculture", "Veterinary"].includes(activeCategory);

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 pb-5 pt-5 sm:px-6 sm:pt-7">
        <StorefrontHero
          productCount={products.length}
          categoryCount={categoryCount}
          featuredCategories={Array.from(new Set(products.map((product) => product.category))).slice(0, 3)}
        />
      </section>

      <section id="catalogue" className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6">
        <VelocityTicker productCount={products.length} categoryCount={categoryCount} />

        <div className="catalogue-heading mb-4 mt-8 sm:mb-5">
          <div>
            <p className="catalogue-heading__eyebrow">THE FULL RANGE</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">Product catalogue</h2>
            <p className="mt-1.5 text-xs text-white/45">A clear view of products, pack sizes and listed MRP.</p>
          </div>
          <span className="catalogue-heading__hint">
            <Search size={14} aria-hidden="true" />
            Search or filter to explore
          </span>
        </div>

        <div className="search-shell mb-4 flex min-h-[54px] items-center gap-3 px-4">
          <Search size={18} className="shrink-0 text-teal-100/55" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search products"
            className="min-w-0 flex-1 py-3 text-sm outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
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
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}{activeCategory !== "All" ? " in " + activeCategory : ""}
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
              Clear filters <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl px-5 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.06] text-teal-100/70">
              <Search size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-white">{categoryPending ? "Category not enabled for ordering" : "No matches found"}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">{categoryPending ? "This category is not part of the public order catalogue while product classification and label details are reviewed." : "Try another product name, pack size or category."}</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-100/20 bg-teal-100/[0.08] px-4 py-2.5 text-xs font-bold text-teal-100"
            >
              Reset catalogue <ArrowRight size={14} aria-hidden="true" />
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
          Displayed MRP and availability are subject to confirmation before an order is accepted.
        </p>
      </section>
    </main>
  );
}
