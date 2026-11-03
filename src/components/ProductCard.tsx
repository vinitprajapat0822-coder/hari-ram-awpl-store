"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import GlassCard from "./GlassCard";
import { Plus, Check, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? ""
  );

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId
  );

  const inCart = useStore((state) =>
    state.cart.some(
      (item) =>
        item.product.id === product.id &&
        (item.variant?.id ?? null) === (selectedVariant?.id ?? null)
    )
  );

  const canOrder = product.status === "VERIFIED";
  const reviewLabel =
    product.status === "PRICE_REVIEW_REQUIRED" ? "MRP review" : "Details review";

  const handleAdd = () => {
    if (!canOrder || (product.variants.length > 0 && !selectedVariant)) return;
    addToCart(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <GlassCard className="p-4 flex flex-col h-full">
      <div className="aspect-square rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/5 mb-4 flex items-center justify-center relative overflow-hidden">
        {product.image && product.imageStatus === "VERIFIED" ? (
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-contain p-3"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-cyan-300/45">
            <ImageIcon size={34} strokeWidth={1.4} />
            <span className="text-[10px] tracking-[0.16em] uppercase">
              Image pending
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 text-[10px] bg-black/50 px-2 py-0.5 rounded-full text-white/70">
          {product.qty || "Pack size pending"}
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
          {product.description || "Product details will be added after source verification."}
        </p>

        {product.variants.length > 0 && (
          <label className="block mb-3">
            <span className="block text-[11px] text-white/50 mb-1">
              Select size / colour
            </span>
            <select
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400/50"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id} className="bg-slate-950">
                  {variant.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            {product.status === "PRICE_REVIEW_REQUIRED" ? (
              <p className="text-sm font-semibold text-amber-300">MRP under review</p>
            ) : (
              <p className="text-lg font-bold text-white">
                {formatPrice(product.mrp)}
              </p>
            )}
            <p className="text-[10px] text-white/40">MRP</p>
          </div>

          <motion.button
            whileTap={canOrder ? { scale: 0.9 } : undefined}
            onClick={handleAdd}
            aria-label={canOrder ? `Add ${product.name} to cart` : reviewLabel}
            disabled={!canOrder || (product.variants.length > 0 && !selectedVariant)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              added || inCart
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : canOrder
                  ? "bg-cyan-500 text-black hover:bg-cyan-400"
                  : "bg-white/10 text-white/60 border border-white/10"
            }`}
          >
            {canOrder ? (
              added || inCart ? (
                <>
                  <Check size={16} /> Added
                </>
              ) : (
                <>
                  <Plus size={16} /> Add
                </>
              )
            ) : (
              reviewLabel
            )}
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
