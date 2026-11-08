"use client";

import Link from "next/link";
import { memo, useState } from "react";
import type { PointerEvent } from "react";
import type { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import ProductArtwork from "./ProductArtwork";
import { Check, Plus } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

type Props = { product: Product; index?: number };

function ProductCard({ product }: Props) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const inCart = useStore((state) => state.cart.some((item) => item.product.id === product.id));
  const { lang, t, categoryLabel } = useLanguage();
  const productName = lang === "hi" && product.nameHi ? product.nameHi : product.name;
  const productDescription = lang === "hi" && product.descriptionHi ? product.descriptionHi : product.description;
  const canOrder = product.status === "VERIFIED";
  const reviewLabel = product.status === "PRICE_REVIEW_REQUIRED" ? "एमआरपी समीक्षा" : "विवरण की समीक्षा";
  const listedMrp = Number.isFinite(product.mrp) && product.mrp > 0 ? product.mrp : 0;

  const handleAdd = () => {
    if (!canOrder) return;
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 100;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 100;
    event.currentTarget.style.setProperty("--ripple-x", x + "%");
    event.currentTarget.style.setProperty("--ripple-y", y + "%");
  };

  return (
    <article role="group" aria-label={"Product " + productName} className="catalogue-card product-card flex h-full flex-col rounded-[22px] p-3 sm:p-4">
      <Link href={"/product/" + encodeURIComponent(product.id) + "/"} className="product-card__details block min-w-0 flex-1 rounded-xl focus-visible:amber">
        <div onPointerMove={handlePointerMove}>
          <ProductArtwork product={product} showAttribution={false} />
        </div>
        <div className="flex min-w-0 flex-col px-1 pb-2">
          <p className="mb-2 truncate text-[9px] font-bold uppercase tracking-[0.16em] text-teal-100/85">{categoryLabel(product.category)}</p>
          <h3 className="mb-2 line-clamp-2 min-h-[2.6em] text-[12px] font-bold leading-[1.3] text-white sm:text-sm">{productName}</h3>
          <p className="line-clamp-2 min-h-[2.7em] text-[11px] leading-relaxed text-slate-200/85">{productDescription || (lang === "hi" ? "उत्पाद विवरण के लिए उत्पाद खोलें।" : "Open product for available details and store confirmation.")}</p>
        </div>
        <div className="mb-3 border-t border-white/[0.075] px-1 pt-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            {product.status === "PRICE_REVIEW_REQUIRED" ? <p className="text-xs font-bold text-amber-200">{lang === "hi" ? "एमआरपी समीक्षा में" : "MRP under review"}</p> : <span className="price-architecture__selling">{formatPrice(listedMrp)}</span>}
          </div>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-white/75">{lang === "hi" ? "केवल सूचीबद्ध एमआरपी" : "Listed MRP only"}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={handleAdd}
        aria-label={canOrder ? (added ? t("addedToCart") : inCart ? t("addAnother") : t("addToCart")) + " — " + productName : reviewLabel}
        disabled={!canOrder}
        className={"flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold transition-all active:scale-[0.98] focus-visible:amber " + (added || inCart ? "border border-teal-200/25 bg-teal-200/[0.10] text-teal-100" : canOrder ? "btn-cyan" : "cursor-not-allowed border border-white/10 bg-white/[0.045] text-white/75")}
      >
        {canOrder ? added ? <><Check size={14} aria-hidden="true" />{t("addedToCart")}</> : inCart ? <><Plus size={14} aria-hidden="true" />{t("addAnother")}</> : <><Plus size={14} aria-hidden="true" />{t("addToCart")}</> : reviewLabel}
      </button>
    </article>
  );
}

export default memo(ProductCard);
