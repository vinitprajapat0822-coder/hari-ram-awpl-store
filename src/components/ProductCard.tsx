"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import GlassCard from "./GlassCard";
import { Check, Image as ImageIcon, Plus, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const inCart = useStore((state) => state.cart.some((item) => item.product.id === product.id));

  const canOrder = product.status === "VERIFIED";
  const reviewLabel = product.status === "PRICE_REVIEW_REQUIRED" ? "MRP review" : "Details review";

  const handleAdd = () => {
    if (!canOrder) return;
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };

  return (
    <GlassCard role="group" aria-label={"Product " + product.name} className="product-card flex h-full flex-col rounded-[21px] p-2.5 sm:p-3.5">
      <div className="product-media mb-3">
        {product.image && product.imageStatus === "VERIFIED" ? (
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 240px"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="img-placeholder flex h-full w-full flex-col items-center justify-center gap-2 text-teal-100/55">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.06]">
              <ImageIcon size={23} strokeWidth={1.35} aria-hidden="true" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.16em]">Image pending</span>
          </div>
        )}

        <span className="absolute bottom-2 right-2 max-w-[75%] truncate rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-[9px] font-semibold text-white/75 backdrop-blur-xl">
          {product.qty || "Pack size pending"}
        </span>
        {canOrder && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-teal-100/15 bg-slate-950/65 px-2 py-1 text-[9px] font-semibold text-teal-100/85 backdrop-blur-xl">
            <ShieldCheck size={11} aria-hidden="true" /> Listed
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pb-0.5">
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-teal-200/75">{product.category}</p>
        <h3 className="mb-1.5 line-clamp-2 min-h-[2.6em] text-[12px] font-bold leading-[1.3] text-white sm:text-sm">{product.name}</h3>
        <p className="mb-3 line-clamp-2 min-h-[2.7em] text-[10px] leading-relaxed text-slate-200/45 sm:text-[11px]">
          {product.description || "Product details will be added after source verification."}
        </p>

        <div className="mt-auto border-t border-white/[0.075] pt-3">
          <div className="mb-3 flex min-h-9 items-end justify-between gap-2">
            <div className="min-w-0">
              {product.status === "PRICE_REVIEW_REQUIRED" ? (
                <p className="text-xs font-bold text-amber-200">MRP under review</p>
              ) : (
                <p className="truncate text-base font-extrabold tracking-tight text-white sm:text-lg">{formatPrice(product.mrp)}</p>
              )}
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.13em] text-white/35">Listed MRP</p>
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={canOrder ? { scale: 0.97 } : undefined}
            onClick={handleAdd}
            aria-label={canOrder ? "Add " + product.name + " to cart" : reviewLabel}
            disabled={!canOrder}
            className={
              "flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-extrabold transition-all sm:text-xs " +
              (added || inCart
                ? "border border-teal-200/25 bg-teal-200/[0.10] text-teal-100"
                : canOrder
                  ? "btn-cyan"
                  : "cursor-not-allowed border border-white/10 bg-white/[0.045] text-white/45")
            }
          >
            {canOrder ? (
              added ? (
                <><Check size={14} aria-hidden="true" /> Added to cart</>
              ) : inCart ? (
                <><Plus size={14} aria-hidden="true" /> Add another</>
              ) : (
                <><Plus size={14} aria-hidden="true" /> Add to cart</>
              )
            ) : reviewLabel}
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
