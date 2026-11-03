"use client";

import { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import GlassCard from "./GlassCard";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);
  const [added, setAdded] = useState(false);

  const inCart = cart.some((i) => i.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <GlassCard className="p-4 flex flex-col h-full">
      <div className="aspect-square rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/5 mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="text-4xl font-bold text-cyan-400/30 tracking-tighter">
          {product.name.charAt(0)}
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-white/70">
          {product.qty}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <p className="text-xs text-cyan-400/80 font-medium mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-white leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-white/50 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-white">
              {formatPrice(product.mrp)}
            </p>
            <p className="text-[10px] text-white/40">MRP</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              added || inCart
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : "bg-cyan-500 text-black hover:bg-cyan-400"
            }`}
          >
            {added || inCart ? (
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
      </div>
    </GlassCard>
  );
}
