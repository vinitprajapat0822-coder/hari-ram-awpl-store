"use client";

import { useState } from "react";
import { Camera, ImagePlus, Star } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

async function optimizePhoto(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type) || file.size > 8 * 1024 * 1024) {
    throw new Error("Choose a JPG, PNG or WebP image under 8 MB.");
  }
  if (typeof createImageBitmap !== "function") {
    throw new Error("Photo compression is not supported in this browser. Use a recent browser to upload review photos.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1440 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Photo compression is not available in this browser.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
  if (!blob || blob.type !== "image/webp") throw new Error("This browser could not encode the selected photo as WebP.");
  const compressed = new File([blob], "review-photo.webp", { type: "image/webp" });
  if (compressed.size > 3 * 1024 * 1024) throw new Error("Compressed photo exceeds the 3 MB limit.");
  return compressed;
}

export default function OrderReviewForm({
  orderItemId,
  productName,
  onSubmitted,
}: {
  orderItemId: string;
  productName: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [quality, setQuality] = useState("");
  const [packaging, setPackaging] = useState("");
  const [delivery, setDelivery] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const addPhotos = (files: FileList | null) => {
    const incoming = Array.from(files ?? []);
    setPhotos((current) => [...current, ...incoming].slice(0, 3));
    setMessage("");
  };

  const submit = async () => {
    if (rating < 1 || !quality.trim() || !packaging.trim() || !delivery.trim()) {
      setMessage("Choose a rating and complete all three review fields.");
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      setMessage("Online reviews are not configured yet.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error("Sign in to the account that placed this order.");

      const { data, error } = await client.rpc("create_product_review", {
        p_order_item_id: orderItemId,
        p_rating: rating,
        p_quality_note: quality.trim(),
        p_packaging_note: packaging.trim(),
        p_delivery_note: delivery.trim(),
      });
      if (error) throw error;
      const reviewId = typeof data === "string" ? data : "";
      if (!reviewId) throw new Error("The review service did not return a review ID.");

      let photoWarning = "";
      for (const original of photos) {
        try {
          const file = await optimizePhoto(original);
          const path = userId + "/" + reviewId + "/" + crypto.randomUUID() + ".webp";
          const { error: uploadError } = await client.storage
            .from("review-images")
            .upload(path, file, { contentType: "image/webp", upsert: false });
          if (uploadError) throw uploadError;

          const { error: linkError } = await client.from("review_images").insert({
            review_id: reviewId,
            customer_id: userId,
            storage_path: path,
          });
          if (linkError) throw linkError;
        } catch {
          photoWarning = " Review submitted, but one or more photos could not be attached.";
        }
      }

      setMessage("Review submitted for owner moderation." + photoWarning);
      setRating(0);
      setQuality("");
      setPackaging("");
      setDelivery("");
      setPhotos([]);
      onSubmitted();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The review could not be submitted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-teal-100/10 bg-teal-100/[0.025] p-4">
      <p className="text-xs font-bold text-white">Review {productName}</p>
      <div className="mt-3 flex items-center gap-1.5" role="group" aria-label="Product rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)} aria-label={"Rate " + value + " stars"} aria-pressed={rating === value} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-amber-200">
            <Star size={17} fill={rating >= value ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/45">
          Product quality
          <textarea value={quality} onChange={(event) => setQuality(event.target.value)} maxLength={500} rows={2} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-5 text-white outline-none focus:border-teal-100/35" />
        </label>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/45">
          Packaging experience
          <textarea value={packaging} onChange={(event) => setPackaging(event.target.value)} maxLength={500} rows={2} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-5 text-white outline-none focus:border-teal-100/35" />
        </label>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/45">
          Delivery experience
          <textarea value={delivery} onChange={(event) => setDelivery(event.target.value)} maxLength={500} rows={2} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-5 text-white outline-none focus:border-teal-100/35" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-bold text-white/65">
          <Camera size={14} aria-hidden="true" /> Camera
          <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => addPhotos(event.currentTarget.files)} />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-bold text-white/65">
          <ImagePlus size={14} aria-hidden="true" /> Gallery
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => addPhotos(event.currentTarget.files)} />
        </label>
        <span className="self-center text-[10px] text-white/35">{photos.length}/3 photos selected</span>
      </div>
      {message && <p role="status" className="mt-3 text-[10px] leading-5 text-teal-100/80">{message}</p>}
      <button type="button" onClick={() => void submit()} disabled={busy || rating < 1 || !quality.trim() || !packaging.trim() || !delivery.trim()} className="btn-cyan mt-4 flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-35">
        {busy ? "Submitting…" : "Submit verified review"}
      </button>
    </div>
  );
}
