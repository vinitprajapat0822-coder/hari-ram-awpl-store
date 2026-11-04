"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Star } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import type { StoreReview } from "@/lib/commerce";
import { useLanguage } from "@/i18n/LanguageProvider";

type ReviewView = StoreReview & { photoUrls: string[] };

export default function ProductReviewsFeed({
  productId,
  officialSource,
}: {
  productId: string;
  officialSource?: string | null;
}) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const client = getSupabaseClient();
      if (!client) {
        if (active) setLoading(false);
        return;
      }
      const { data, error } = await client
        .from("reviews")
        .select("id,product_id,order_id,order_item_id,rating,quality_note,packaging_note,delivery_note,created_at,review_images(storage_path)")
        .eq("product_id", productId)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!active) return;
      if (error || !Array.isArray(data)) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const rows = data as unknown as StoreReview[];
      const mapped = await Promise.all(rows.map(async (review) => {
        const urls = await Promise.all((review.review_images ?? []).map(async (photo) => {
          const { data: signed, error: signedError } = await client.storage
            .from("review-images")
            .createSignedUrl(photo.storage_path, 60 * 60);
          return !signedError ? signed?.signedUrl ?? null : null;
        }));
        return { ...review, photoUrls: urls.filter((url): url is string => Boolean(url)) };
      }));
      if (!active) return;
      setReviews(mapped);
      setLoading(false);
    };

    void load();
    return () => { active = false; };
  }, [productId]);

  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  const average = reviews.length > 0
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  return (
    <section aria-labelledby="product-reviews-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="product-reviews-heading" className="text-sm font-extrabold text-white">{t("customerReviews")}</h2>
          <p className="mt-1 text-[10px] text-white/40">{t("approvedReviewsOnly")}</p>
        </div>
        {reviews.length > 0 && (
          <div className="text-right">
            <p className="text-lg font-black text-teal-100">{average.toFixed(1)} / 5</p>
            <p className="text-[10px] text-white/40">{reviews.length} {t("verifiedReviews")}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div role="status" aria-label={t("loadingReviews")} className="space-y-3">
          <span className="sr-only">{t("loadingReviews")}</span>
          {[0, 1].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex items-center justify-between">
                <span className="h-3 w-24 rounded-full bg-white/10" />
                <span className="h-3 w-20 rounded-full bg-white/10" />
              </div>
              <span className="mt-3 block h-2.5 w-28 rounded-full bg-white/[0.07]" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <span className="aspect-square rounded-xl bg-white/[0.07]" />
                <span className="aspect-square rounded-xl bg-white/[0.07]" />
                <span className="aspect-square rounded-xl bg-white/[0.07]" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.025] px-4 py-7 text-center">
          <Star size={24} className="mx-auto text-white/25" aria-hidden="true" />
          <p className="mt-3 text-sm font-bold text-white">{t("noVerifiedReviews")}</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/40">
            {t("reviewsAfterDelivery")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-200" aria-label={review.rating + " out of 5 stars"}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={13} fill={index < review.rating ? "currentColor" : "none"} aria-hidden="true" />
                  ))}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-100/65">{t("verifiedPurchase")}</span>
              </div>
              <p className="mt-2 text-[10px] text-white/35">
                {new Date(review.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div><p className="text-[9px] font-bold uppercase tracking-wider text-white/35">{t("productQuality")}</p><p className="mt-1 text-xs leading-5 text-white/65">{review.quality_note}</p></div>
                <div><p className="text-[9px] font-bold uppercase tracking-wider text-white/35">{t("packaging")}</p><p className="mt-1 text-xs leading-5 text-white/65">{review.packaging_note}</p></div>
                <div><p className="text-[9px] font-bold uppercase tracking-wider text-white/35">{t("delivery")}</p><p className="mt-1 text-xs leading-5 text-white/65">{review.delivery_note}</p></div>
              </div>
              {review.photoUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {review.photoUrls.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setSelectedPhoto(url)}
                      aria-label={t("viewReviewPhoto") + " " + (index + 1)}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                    >
                      <img src={url} alt={t("reviewPhotoAlt")} loading="lazy" decoding="async" className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105" />
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {officialSource && (
        <a href={officialSource} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-100/80 hover:text-white">
          {t("officialSource")}
        </a>
      )}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
          >
            <button type="button" className="absolute inset-0 bg-[#020611]/90 backdrop-blur-xl" aria-label={t("closePhoto")} onClick={() => setSelectedPhoto(null)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("viewReviewPhoto")}
              className="relative z-10 max-h-[90dvh] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0b0f19] p-2 shadow-2xl"
              initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            >
              <button type="button" onClick={() => setSelectedPhoto(null)} aria-label={t("closePhoto")} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md">
                <X size={17} aria-hidden="true" />
              </button>
              <img src={selectedPhoto} alt={t("reviewPhotoAlt")} className="max-h-[84dvh] w-auto max-w-full rounded-xl object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
