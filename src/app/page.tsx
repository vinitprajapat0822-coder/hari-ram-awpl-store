"use client";

import { useState, useMemo } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products;

    if (activeCategory !== "All") {
      list = list.filter((product) => product.category === activeCategory);
    }

    const query = search.trim().toLocaleLowerCase("en-IN");
    if (query) {
      list = list.filter(
        (product) =>
          product.name.toLocaleLowerCase("en-IN").includes(query) ||
          product.nameHi.includes(query) ||
          product.description.toLocaleLowerCase("en-IN").includes(query) ||
          product.category.toLocaleLowerCase("en-IN").includes(query)
      );
    }

    return list;
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <section className="px-4 pt-4 pb-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 pointer-events-none" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
            <span className="text-white">HARI RAM</span>
          </h1>
          <p className="text-cyan-400 text-base md:text-lg tracking-[0.25em] font-medium mb-2">
            AWPL STORE
          </p>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Premium Ayurvedic & Wellness Products · Order on WhatsApp
          </p>
        </motion.div>
      </section>

      <section className="px-4 max-w-6xl mx-auto mb-4" role="search">
        <div className="relative">
          <label className="sr-only" htmlFor="product-search">
            Search products
          </label>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            size={18}
            aria-hidden="true"
          />
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            autoComplete="off"
            className="input-glass w-full pl-11 pr-12 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear product search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      <section className="px-4 max-w-6xl mx-auto mb-5">
        <div
          className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 max-w-6xl mx-auto mb-3">
        <p
          className="text-white/40 text-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? " in " + activeCategory : ""}
        </p>
      </section>

      <section className="px-4 max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/40" role="status">
            No products found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.25) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
