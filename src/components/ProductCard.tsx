"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_PRICE_BASIS, getUnitPrice } from "@/lib/order";
import GlassCard from "./GlassCard";
import ProductImage from "./ProductImage";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((state) => state.addToCart);
  const quantityInCart = useStore(
    (state) =>
      state.cart.find((item) => item.product.id === product.id)?.quantity ?? 0
  );
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const isInCart = quantityInCart > 0;
  const displayPrice = getUnitPrice(product, DEFAULT_PRICE_BASIS);

  return (
    <GlassCard className="p-3 sm:p-4 flex flex-col h-full">
      <Link
        href={`/products/${encodeURIComponent(product.id)}`}
        className="block"
        aria-label={`View ${product.name} details`}
      >
        <div className="aspect-square rounded-xl mb-3 sm:mb-4 overflow-hidden relative">
          <ProductImage
            key={product.id}
            src={product.image}
            alt={product.name}
            fallbackText={product.name.charAt(0).toUpperCase()}
            className="h-full w-full rounded-xl"
          />
          <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 px-2 py-0.5 rounded-full text-white/80">
            {product.qty}
          </span>
        </div>

        <p className="text-xs text-cyan-400/80 font-medium mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-white leading-tight mb-1 line-clamp-2 hover:text-cyan-200 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-white/50 line-clamp-2 mb-3">
          {product.description}
        </p>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2">
        <div>
          <p className="text-lg font-bold text-white">
            {formatPrice(displayPrice)}
          </p>
          <p className="text-[10px] text-white/40">
            {DEFAULT_PRICE_BASIS.toUpperCase()}
          </p>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${(
            added || isInCart
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
              : "bg-cyan-500 text-black hover:bg-cyan-400"
          )}`}
        >
          {added || isInCart ? (
            <>
              <Check size={16} /> Added
            </>
          ) : (
            <>
              <Plus size={16} /> Add
            </>
          )}
        </motion.button>
      </div>
    </GlassCard>
  );
}
