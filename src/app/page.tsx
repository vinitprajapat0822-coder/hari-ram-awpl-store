"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, PackageCheck, Search, Sparkles, X } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") list = list.filter((product) => product.category === activeCategory);

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

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-5 sm:px-6 sm:pt-7">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="hero-panel relative overflow-hidden rounded-[27px] p-5 sm:rounded-[34px] sm:p-9 lg:p-11"
        >
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-2xl">
              <span className="hero-eyebrow">A simpler way to shop</span>
              <h1 className="mt-5 text-[clamp(2.1rem,7vw,4.1rem)] font-black leading-[0.98] tracking-[-0.055em] text-white">
                <span className="block text-[0.34em] font-extrabold tracking-[0.22em] text-teal-100/75">HARI RAM</span>
                <span className="mt-3 block">AWPL essentials,</span>
                <span className="hero-title-accent mt-1 block">beautifully organised.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200/60 sm:text-[15px]">
                Explore everyday care, wellness and home categories in one calm, easy-to-browse catalogue.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link href="#catalogue" className="hero-cta">Explore catalogue <ArrowDownRight size={17} aria-hidden="true" /></Link>
                <span className="inline-flex items-center gap-2 text-[11px] font-medium text-white/45">
                  <PackageCheck size={15} className="text-teal-200/75" aria-hidden="true" />
                  Pack sizes listed separately
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="hero-orbit">
                <div className="hero-orbit__core"><Sparkles size={42} strokeWidth={1.25} aria-hidden="true" /></div>
                <span className="absolute left-0 top-[24%] rounded-full border border-white/10 bg-slate-950/65 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-teal-100/80 backdrop-blur-xl">Daily care</span>
                <span className="absolute bottom-[12%] right-0 rounded-full border border-white/10 bg-slate-950/65 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-100/80 backdrop-blur-xl">Home & living</span>
                <span className="absolute right-[1%] top-[17%] rounded-full border border-white/10 bg-slate-950/65 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/65 backdrop-blur-xl">Wellness</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid max-w-md grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:mt-10">
            <div><p className="text-2xl font-black tracking-tight text-white">{products.length}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">Individual listings</p></div>
            <div><p className="text-2xl font-black tracking-tight text-white">{categoryCount}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">Catalogue categories</p></div>
          </div>
        </motion.div>
      </section>

      <section id="catalogue" className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-200/65">Discover the range</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">Product catalogue</h2>
          </div>
          <p className="text-xs text-white/40">Browse by category or search by name and pack size.</p>
        </div>

        <div className="search-shell mb-4 flex min-h-[54px] items-center gap-3 px-4">
          <Search size={18} className="shrink-0 text-teal-100/55" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, pack sizes or categories..."
            aria-label="Search products"
            className="min-w-0 flex-1 py-3 text-sm outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white">
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <nav aria-label="Product categories" className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className="category-chip">
              {category}
            </button>
          ))}
        </nav>

        <div className="mb-4 flex min-h-8 items-center justify-between gap-3">
          <p className="text-xs font-medium text-white/45">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}{activeCategory !== "All" ? " in " + activeCategory : ""}
          </p>
          {(search || activeCategory !== "All") && (
            <button type="button" onClick={() => { setSearch(""); setActiveCategory("All"); }} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-100/75 transition-colors hover:text-teal-50">
              Clear filters <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl px-5 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.06] text-teal-100/70"><Search size={22} aria-hidden="true" /></span>
            <h3 className="mt-4 text-base font-bold text-white">No matches found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">Try another product name, pack size or category.</p>
            <button type="button" onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-100/20 bg-teal-100/[0.08] px-4 py-2.5 text-xs font-bold text-teal-100">
              Reset catalogue <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {filtered.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.012, 0.2), duration: 0.3 }}>
                <ProductCard product={product} />
              </motion.div>
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
