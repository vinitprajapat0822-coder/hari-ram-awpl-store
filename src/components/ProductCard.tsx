"use client";

import Link from "next/link";
import { useState } from "react";
import type { PointerEvent } from "react";
import type { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import ProductArtwork from "./ProductArtwork";
import { Check, Plus } from "lucide-react";

type Props = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product }: Props) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const inCart = useStore((state) => state.cart.some((item) => item.product.id === product.id));

  const canOrder = product.status === "VERIFIED";
  const reviewLabel = product.status === "PRICE_REVIEW_REQUIRED" ? "MRP review" : "Details review";
  const listedMrp = Number.isFinite(product.mrp) && product.mrp > 0 ? product.mrp : 0;
  const configuredSellingPrice = product.sellingPrice;
  const hasDiscount = typeof configuredSellingPrice === "number"
    && Number.isFinite(configuredSellingPrice)
    && configuredSellingPrice >= 0
    && configuredSellingPrice < listedMrp;
  const sellingPrice = hasDiscount ? configuredSellingPrice : listedMrp;
  const discountPercent = hasDiscount && listedMrp > 0
    ? Math.round(((listedMrp - sellingPrice) / listedMrp) * 100)
    : 0;

  const handleAdd = () => {
    if (!canOrder) return;
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 100;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 100;
    event.currentTarget.style.setProperty("--ripple-x", x + "%");
    event.currentTarget.style.setProperty("--ripple-y", y + "%");
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    handlePointerMove(event);
    const element = event.currentTarget.querySelector<HTMLElement>(".product-media");
    if (!element) return;
    element.classList.remove("is-rippling");
    void element.offsetWidth;
    element.classList.add("is-rippling");
    window.setTimeout(() => element.classList.remove("is-rippling"), 560);
  };

  return (
    <article
      role="group"
      aria-label={"Product " + product.name}
      className="glass-card product-card flex h-full flex-col rounded-[21px] p-2.5 sm:p-3.5"
    >
      <Link
        href={"/product/" + encodeURIComponent(product.id) + "/"}
        className="product-card__details block min-w-0 flex-1 rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-200"
      >
        <div onPointerMove={handlePointerMove} onPointerDown={handlePointerDown}>
          <ProductArtwork product={product} showAttribution={false} />
        </div>

        <div className="flex min-w-0 flex-col px-0.5 pb-2">
          <p className="mb-1.5 truncate text-[9px] font-bold uppercase tracking-[0.16em] text-teal-200/75">
            {product.category}
          </p>
          <h3 className="mb-2 line-clamp-2 min-h-[2.6em] text-[12px] font-bold leading-[1.3] text-white sm:text-sm">
            {product.name}
          </h3>
          <p className="line-clamp-2 min-h-[2.7em] text-[10px] leading-relaxed text-slate-200/45 sm:text-[11px]">
            {product.description || "Open product for available details and store confirmation."}
          </p>
        </div>

        <div className="mb-3 border-t border-white/[0.075] px-0.5 pt-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            {product.status === "PRICE_REVIEW_REQUIRED" ? (
              <p className="text-xs font-bold text-amber-200">MRP under review</p>
            ) : (
              <span className="price-architecture__selling">{formatPrice(sellingPrice)}</span>
            )}
            {hasDiscount && (
              <>
                <del className="price-architecture__mrp">{formatPrice(listedMrp)}</del>
                <span className="price-architecture__discount">{discountPercent}% OFF</span>
              </>
            )}
          </div>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-white/35">
            {hasDiscount ? "Offer price · Listed MRP crossed out" : "Listed MRP"}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAdd}
        aria-label={
          canOrder
            ? (added ? "Added to cart" : inCart ? "Add another" : "Add to cart") + " — Add " + product.name + " to cart"
            : reviewLabel
        }
        disabled={!canOrder}
        className={
          "flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-extrabold transition-all active:scale-[0.98] sm:text-xs "
          + (added || inCart
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
      </button>
    </article>
  );
}
