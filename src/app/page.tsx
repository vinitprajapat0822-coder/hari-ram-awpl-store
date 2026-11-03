"use client";

import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <section className="px-4 pt-6 pb-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 pointer-events-none" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            <span className="text-white">HARI RAM</span>
          </h1>
          <p className="text-cyan-400 text-lg md:text-xl tracking-[0.3em] font-medium mb-4">
            AWPL STORE
          </p>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Premium Ayurvedic & Wellness Products. Order directly on WhatsApp.
          </p>
        </motion.div>
      </section>

      <section className="px-4 max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
