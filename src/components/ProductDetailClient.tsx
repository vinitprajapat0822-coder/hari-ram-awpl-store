"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductArtwork from "@/components/ProductArtwork";
import ProductReviewsFeed from "@/components/ProductReviewsFeed";
import GlassCard from "@/components/GlassCard";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl, useStore } from "@/store/useStore";
import { getSupabaseClient } from "@/lib/supabase";
import {
  ArrowLeft,
  Check,
  CircleHelp,
  ExternalLink,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
} from "lucide-react";

type Props = {
  product: Product;
};

function displayDate(value: string | null | undefined): string {
  if (!value) return "Not recorded";
  const parsed = new Date(value + "T00:00:00+05:30");
  if (Number.isNaN(parsed.getTime())) return "Not recorded";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export default function ProductDetailClient({ product }: Props) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const [storeSellingPrice, setStoreSellingPrice] = useState<number | null>(product.sellingPrice ?? null);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return undefined;
    let active = true;
    void client.from("store_products").select("selling_price").eq("id", product.id).maybeSingle()
      .then(({ data, error }) => {
        if (!active || error) return;
        const value = data?.selling_price === null || data?.selling_price === undefined
          ? null
          : Number(data.selling_price);
        setStoreSellingPrice(value !== null && Number.isFinite(value) && value >= 0 ? value : null);
      });
    return () => { active = false; };
  }, [product.id]);

  const canOrder = product.status === "VERIFIED";
  const hasSellingPrice = typeof storeSellingPrice === "number"
    && Number.isFinite(storeSellingPrice)
    && storeSellingPrice >= 0;
  const hasDiscount = hasSellingPrice && (storeSellingPrice as number) < product.mrp;
  const shownPrice = hasSellingPrice ? storeSellingPrice as number : product.mrp;

  const enquiryMessage = [
    "Hello Hariram Prajapat,\nHari Ram AWPL Store",
    "I want to enquire about this product:",
    "Product: " + product.name,
    "Pack size: " + (product.qty || "Not listed"),
    "Listed MRP: " + formatPrice(product.mrp),
    "Please confirm the final selling price and delivery details.",
  ].join("\n");

  const sellerContactUrl = getWhatsAppUrl(enquiryMessage);
  const verifiedDate = displayDate(product.lastVerifiedAt);
  const officialSource = product.productSource?.sourceUrl
    || product.priceEvidence?.sourceUrl
    || null;

  const recommendationCategories: Record<string, string[]> = {
    "SNISS Cosmetic": ["SNISS Elite", "SNISS Herbal", "SNISS Fragrances"],
    "SNISS Elite": ["SNISS Cosmetic", "SNISS Herbal", "SNISS Fragrances"],
    "SNISS Herbal": ["SNISS Elite", "SNISS Cosmetic", "SNISS Fragrances"],
    "SNISS Fragrances": ["SNISS Elite", "SNISS Cosmetic"],
    "Jeeveda": ["Food"],
    "Food": ["Jeeveda"],
    "Baby Care": ["SNISS Herbal", "SNISS Elite"],
    "Oral Care": ["SNISS Herbal", "SNISS Elite"],
    "Apparels": ["Others"],
    "Others": ["Apparels", "Home Care"],
    "Home Care": ["Others"],
  };
  const relatedProducts = [
    product.category,
    ...(recommendationCategories[product.category] ?? []),
  ]
    .flatMap((category) =>
      products.filter((item) => item.id !== product.id && item.category === category)
    )
    .filter((item, index, list) =>
      list.findIndex((candidate) => candidate.id === item.id) === index
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!canOrder) return;
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        <Link
          href="/#catalogue"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/50 transition-colors hover:text-teal-100"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to catalogue
        </Link>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-white/35">
          <Link href="/" className="transition-colors hover:text-teal-100">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/#catalogue" className="transition-colors hover:text-teal-100">Catalogue</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[58vw] truncate text-teal-100/75">{product.category}</span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.92fr)] lg:gap-7">
          <div className="space-y-4">
            <GlassCard className="rounded-[28px] p-3 sm:p-5">
              <ProductArtwork product={product} />
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100/15 bg-teal-100/[0.06] px-3 py-1.5 text-[10px] font-bold text-teal-100/80">
                  <ShieldCheck size={13} aria-hidden="true" />
                  {product.image && product.imageStatus === "VERIFIED" ? "Official product image" : "Illustrative image / artwork fallback"}
                </span>
                <span className="text-[10px] font-medium text-white/35">Pack: {product.qty || "Not listed"}</span>
              </div>
            </GlassCard>

            <GlassCard className="rounded-[25px] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Package size={17} className="text-teal-100/75" aria-hidden="true" />
                <h2 className="text-sm font-extrabold text-white">Product information</h2>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <div className="detail-fact">
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                </div>
                <div className="detail-fact">
                  <dt>Brand</dt>
                  <dd>{product.brand || "Not specified"}</dd>
                </div>
                <div className="detail-fact">
                  <dt>Pack size</dt>
                  <dd>{product.qty || "Not listed"}</dd>
                </div>
                <div className="detail-fact">
                  <dt>Product code</dt>
                  <dd className="break-all text-[10px]">{product.id}</dd>
                </div>
                <div className="detail-fact">
                  <dt>Added date</dt>
                  <dd>Not recorded</dd>
                </div>
                <div className="detail-fact">
                  <dt>Last verified</dt>
                  <dd>{verifiedDate}</dd>
                </div>
              </dl>
            </GlassCard>
          </div>

          <div className="space-y-4">
            <GlassCard className="rounded-[28px] p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-teal-100/15 bg-teal-100/[0.06] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-teal-100/75">
                  {product.category}
                </span>
                {product.status === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-2.5 py-1.5 text-[9px] font-bold text-emerald-100/75">
                    <Check size={11} aria-hidden="true" /> Catalogue record verified
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-2.5 py-1.5 text-[9px] font-bold text-amber-100/80">
                    Details under review
                  </span>
                )}
              </div>

              <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black leading-tight tracking-[-0.04em] text-white">
                {product.name}
              </h1>
              {product.nameHi && <p className="mt-2 text-sm text-white/55">{product.nameHi}</p>}

              <div className="my-5 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">Price information</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-black tracking-tight text-white">{formatPrice(shownPrice)}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                    {hasSellingPrice ? "Current selling price" : "Listed MRP"}
                  </span>
                  {hasDiscount && (
                    <>
                      <del className="text-xs text-white/40">{formatPrice(product.mrp)}</del>
                      <span className="price-architecture__discount">
                        {Math.round(((product.mrp - shownPrice) / product.mrp) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                {!hasSellingPrice && (
                  <p className="mt-2 text-[11px] leading-5 text-white/45">
                    Current selling price or offer is not published in the verified catalogue. Confirm with the store before ordering.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canOrder}
                  className="btn-cyan flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  {added ? "Added to cart" : "Add to cart"}
                </button>
                <a
                  href={sellerContactUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-teal-100/20 bg-teal-100/[0.06] px-4 py-3 text-sm font-bold text-teal-100 transition-colors hover:bg-teal-100/[0.11]"
                >
                  <MessageCircle size={17} aria-hidden="true" /> Ask store
                </a>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-white/35">
                The listed MRP is catalogue information. Final selling price and delivery are confirmed by the store.
              </p>
            </GlassCard>

            <GlassCard className="rounded-[25px] p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Store size={17} className="text-teal-100/75" aria-hidden="true" />
                <h2 className="text-sm font-extrabold text-white">Seller & support</h2>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-sm font-bold text-white">Hariram Prajapat</p>
                <p className="mt-1 text-[11px] text-white/45">Owner · Hari Ram AWPL Store</p>
                <a href={sellerContactUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-100 hover:text-white">
                  Contact seller on WhatsApp <ExternalLink size={13} aria-hidden="true" />
                </a>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
          <GlassCard className="rounded-[25px] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Tag size={17} className="text-teal-100/75" aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-white">Description & usage</h2>
            </div>
            <p className="text-sm leading-7 text-white/60">
              {product.description || "An official product description has not been provided in the current catalogue record. Please check the product packaging or ask the store for verified details before use."}
            </p>
            {product.ingredients && product.ingredients.length > 0 ? (
              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <h3 className="text-xs font-bold text-white">Ingredients / composition</h3>
                <p className="mt-2 text-xs leading-6 text-white/55">{product.ingredients.join(", ")}</p>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-2 border-t border-white/[0.08] pt-4 text-[11px] leading-5 text-white/40">
                <CircleHelp size={14} className="mt-0.5 shrink-0 text-teal-100/55" aria-hidden="true" />
                Ingredients and usage directions are not recorded. Follow the label and verified product instructions.
              </div>
            )}
          </GlassCard>

          <GlassCard className="rounded-[25px] p-5 sm:p-6">
            <ProductReviewsFeed productId={product.id} officialSource={officialSource} />
          </GlassCard>
        </div>
        {relatedProducts.length > 0 && (
          <section className="mt-8" aria-labelledby="related-products-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/60">
                  Explore more
                </p>
                <h2
                  id="related-products-heading"
                  className="mt-1 text-xl font-extrabold tracking-tight text-white"
                >
                  You may also like
                </h2>
              </div>
              <Link
                href="/#catalogue"
                className="text-[11px] font-bold text-teal-100/75 transition-colors hover:text-white"
              >
                View full catalogue
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedProducts.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
