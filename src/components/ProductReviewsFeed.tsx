"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
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
        <p className="rounded-xl bg-white/[0.025] px-4 py-5 text-center text-xs text-white/45">{t("loadingReviews")}</p>
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
                  {review.photoUrls.map((url) => (
                    <img key={url} src={url} alt={t("customerReviews")} loading="lazy" decoding="async" className="aspect-square w-full rounded-xl border border-white/10 object-cover" />
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
    </section>
  );
}
