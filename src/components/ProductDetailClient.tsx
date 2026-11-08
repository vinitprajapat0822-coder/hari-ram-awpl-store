"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import Navbar from "@/components/Navbar";
import ProductArtwork from "@/components/ProductArtwork";
import GlassCard from "@/components/GlassCard";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl, useStore } from "@/store/useStore";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleHelp,
  ExternalLink,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Tag,
} from "lucide-react";

type Props = {
  product: Product;
};

function displayDate(value: string | null | undefined, lang: "en" | "hi"): string {
  if (!value) return lang === "hi" ? "दर्ज नहीं है" : "Not recorded";
  const parsed = new Date(value + "T00:00:00+05:30");
  if (Number.isNaN(parsed.getTime())) return lang === "hi" ? "दर्ज नहीं है" : "Not recorded";
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(parsed);
}

export default function ProductDetailClient({ product }: Props) {
  const addToCart = useStore((state) => state.addToCart);
  const { lang, t, categoryLabel } = useLanguage();
  const productName = lang === "hi" && product.nameHi ? product.nameHi : product.name;
  const productDescription = lang === "hi" && product.descriptionHi ? product.descriptionHi : product.description;
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const canOrder = product.status === "VERIFIED";
  const shownPrice = product.mrp;

  const stockLabel = product.availability === "AVAILABLE"
    ? t("markedAvailable")
    : product.availability === "UNAVAILABLE"
      ? t("markedUnavailable")
      : product.availability === "REVIEW_REQUIRED"
        ? t("availabilityReview")
        : t("stockNotSynced");

  const enquiryMessage = lang === "hi"
    ? ["नमस्ते Hari Ram Store,", "मैं इस उत्पाद के बारे में पूछताछ करना चाहता/चाहती हूँ:", "उत्पाद: " + productName, "पैक आकार: " + (product.qty || t("notListed")), "सूचीबद्ध एमआरपी: " + formatPrice(product.mrp), t("confirmCurrentStockDelivery")].join("\n")
    : ["Hello Hari Ram Store,", "I want to enquire about this product:", "Product: " + productName, "Pack size: " + (product.qty || "Not listed"), "Listed MRP: " + formatPrice(product.mrp), "Please confirm current MRP, stock availability and delivery before order."].join("\n");

  const reviewMessage = lang === "hi"
    ? ["नमस्ते Hari Ram Store,", "मैं इस उत्पाद के बारे में प्रतिक्रिया साझा करना चाहता/चाहती हूँ:", "उत्पाद: " + productName, "रेटिंग: " + reviewRating + "/5", "टिप्पणी: " + reviewComment.trim(), "प्रकाशित करने से पहले कृपया इस प्रतिक्रिया की समीक्षा करें।"].join("\n")
    : ["Hello Hari Ram Store,", "I want to share feedback for:", "Product: " + productName, "Rating: " + reviewRating + "/5", "Comment: " + reviewComment.trim(), "Please review this feedback before publishing it."].join("\n");
  const reviewUrl = reviewRating > 0 && reviewComment.trim()
    ? getWhatsAppUrl(reviewMessage)
    : null;

  const sellerContactUrl = getWhatsAppUrl(enquiryMessage);
  const verifiedDate = displayDate(product.lastVerifiedAt, lang);
  const officialSource = product.productSource?.sourceUrl
    || product.priceEvidence?.sourceUrl
    || null;

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
          <ArrowLeft size={15} aria-hidden="true" /> {t("backToCatalogue")}
        </Link>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-white/35">
          <Link href="/" className="transition-colors hover:text-teal-100">{t("navHome")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/#catalogue" className="transition-colors hover:text-teal-100">{t("navCatalogue")}</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[58vw] truncate text-teal-100/75">{categoryLabel(product.category)}</span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.92fr)] lg:gap-7">
          <div className="space-y-4">
            <GlassCard className="rounded-[28px] p-3 sm:p-5">
              <ProductArtwork product={product} />
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100/15 bg-teal-100/[0.06] px-3 py-1.5 text-[10px] font-bold text-teal-100/80">
                  <ShieldCheck size={13} aria-hidden="true" />
                  {product.image && product.imageStatus === "VERIFIED" ? t("officialProductImage") : t("illustrativeImage")}
                </span>
                <span className="text-[10px] font-medium text-white/35">{t("pack")} {product.qty || t("notListed")}</span>
              </div>
            </GlassCard>

            <GlassCard className="rounded-[25px] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Package size={17} className="text-teal-100/75" aria-hidden="true" />
                <h2 className="text-sm font-extrabold text-white">{t("productInformationHeading")}</h2>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <div className="detail-fact">
                  <dt>{t("categoryLabel")}</dt>
                  <dd>{categoryLabel(product.category)}</dd>
                </div>
                <div className="detail-fact">
                  <dt>{t("brandLabel")}</dt>
                  <dd>{product.brand || t("notSpecified")}</dd>
                </div>
                <div className="detail-fact">
                  <dt>{t("packSize")}</dt>
                  <dd>{product.qty || t("notListed")}</dd>
                </div>
                <div className="detail-fact">
                  <dt>{t("productCode")}</dt>
                  <dd className="break-all text-[10px]">{product.id}</dd>
                </div>
                <div className="detail-fact">
                  <dt>{t("addedDate")}</dt>
                  <dd>{t("notRecorded")}</dd>
                </div>
                <div className="detail-fact">
                  <dt>{t("lastVerified")}</dt>
                  <dd>{verifiedDate}</dd>
                </div>
              </dl>
            </GlassCard>
          </div>

          <div className="space-y-4">
            <GlassCard className="rounded-[28px] p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-teal-100/15 bg-teal-100/[0.06] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-teal-100/75">
                  {categoryLabel(product.category)}
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
                {productName}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
                <span className="inline-flex items-center gap-1.5">
                  <Star size={14} className="text-white/35" aria-hidden="true" />
                  {t("noVerifiedRatings")}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t("noCustomerReviews")}</span>
              </div>

              <div className="my-5 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">{t("priceInformation")}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-black tracking-tight text-white">{formatPrice(shownPrice)}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">{t("listedMrpOnly")}</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-white/45">
                  {t("listedMrpContext")}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canOrder}
                  className="btn-cyan flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  {added ? t("addedToCart") : t("addToCart")}
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
                {t("finalPriceNote")}
              </p>
            </GlassCard>

            <GlassCard className="rounded-[25px] p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Store size={17} className="text-teal-100/75" aria-hidden="true" />
                <h2 className="text-sm font-extrabold text-white">{t("sellerStock")}</h2>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-sm font-bold text-white">Hari Ram AWPL Store</p>
                <p className="mt-1 text-[11px] text-white/45">{t("storeOwnerNotListed")}</p>
                <a href={sellerContactUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-100 hover:text-white">
                  {t("contactSellerWhatsapp")} <ExternalLink size={13} aria-hidden="true" />
                </a>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3">
                <div className="detail-fact">
                  <dt>{t("stockStatus")}</dt>
                  <dd>{stockLabel}</dd>
                </div>
                <div className="detail-fact">
                  <dt>{t("unitsRemaining")}</dt>
                  <dd>{t("notProvided")}</dd>
                </div>
              </dl>
            </GlassCard>
          </div>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
          <GlassCard className="rounded-[25px] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Tag size={17} className="text-teal-100/75" aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-white">{t("descriptionUsage")}</h2>
            </div>
            <p className="text-sm leading-7 text-white/60">
              {productDescription || t("noOfficialDescription")}
            </p>
            {product.ingredients && product.ingredients.length > 0 ? (
              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <h3 className="text-xs font-bold text-white">{t("ingredientsComposition")}</h3>
                <p className="mt-2 text-xs leading-6 text-white/55">{product.ingredients.join(", ")}</p>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-2 border-t border-white/[0.08] pt-4 text-[11px] leading-5 text-white/40">
                <CircleHelp size={14} className="mt-0.5 shrink-0 text-teal-100/55" aria-hidden="true" />
                {t("ingredientsNotRecorded")}
              </div>
            )}
          </GlassCard>

          <GlassCard className="rounded-[25px] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Star size={17} className="text-teal-100/75" aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-white">{t("customerRatingsReviews")}</h2>
            </div>
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.025] px-4 py-7 text-center">
              <Star size={24} className="mx-auto text-white/25" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-white">{t("noVerifiedReviews")}</p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/40">
                {t("noReviewsHelp")}
              </p>
            </div>
            {officialSource && (
              <a
                href={officialSource}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-100/80 hover:text-white"
              >
                {t("viewOfficialSource")} <ExternalLink size={12} aria-hidden="true" />
              </a>
            )}
            <div className="mt-5 border-t border-white/[0.08] pt-5">
              <h3 className="text-xs font-extrabold text-white">{t("shareFeedback")}</h3>
              <div className="mt-3 flex items-center gap-1.5" role="group" aria-label={t("chooseProductRating")}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    aria-label={lang === "hi" ? t("rateStars") + " " + value + " " + t("stars") : t("rateStars") + " " + value + " " + t("stars")}
                    aria-pressed={reviewRating === value}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-amber-200 transition-colors hover:bg-amber-200/[0.08]"
                  >
                    <Star size={18} fill={reviewRating >= value ? "currentColor" : "none"} aria-hidden="true" />
                  </button>
                ))}
                <span className="ml-2 text-[10px] text-white/40">
                  {reviewRating > 0 ? reviewRating + " / 5 " + t("selected") : t("selectRating")}
                </span>
              </div>
              <label htmlFor="product-review-comment" className="mt-3 block text-[10px] font-bold uppercase tracking-[0.13em] text-white/45">
                {t("yourComment")}
              </label>
              <textarea
                id="product-review-comment"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder={t("shareExperience")}
                className="mt-2 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs leading-6 text-white outline-none placeholder:text-white/30 focus:border-teal-100/35"
              />
              <button
                type="button"
                disabled={!reviewUrl}
                onClick={() => {
                  if (reviewUrl) window.open(reviewUrl, "_blank", "noopener,noreferrer");
                }}
                className="btn-cyan mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-35"
              >
                <MessageCircle size={15} aria-hidden="true" /> {t("sendFeedbackWhatsapp")}
              </button>
              <p className="mt-2 text-[10px] leading-5 text-white/35">
                {t("feedbackPrivate")}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[10px] text-white/35">
              <CalendarDays size={13} aria-hidden="true" />
              {t("catalogueLastChecked")} {verifiedDate}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
