"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word.charAt(0)).join("");
  return initials.toUpperCase() || "AW";
}

/**
 * Image display rules (Phase 1):
 * - Official image only when image URL exists AND imageStatus === "VERIFIED" AND the asset loads.
 * - Broken / 404 URLs fall back to monogram placeholder ("Official image unavailable").
 * - Missing or non-verified status shows "Official image pending".
 * - Never substitute random stock photos or invented packaging.
 */
type Props = {
  product: Product;
  showAttribution?: boolean;
  size?: "card" | "detail";
};

export default function ProductArtwork({ product, size = "card" }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasVerifiedUrl = Boolean(product.image) && product.imageStatus === "VERIFIED";
  const hasOfficialImage = hasVerifiedUrl && !imageFailed;

  const statusLabel = hasOfficialImage
    ? "Official product image"
    : hasVerifiedUrl && imageFailed
      ? "Official image unavailable"
      : "Official image pending";

  const imageSizes =
    size === "detail"
      ? "(max-width: 768px) 90vw, 520px"
      : "(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 240px";

  return (
    <div
      className="product-media product-artwork mb-3"
      data-testid="product-artwork"
      data-image-status={hasOfficialImage ? "verified" : hasVerifiedUrl ? "failed" : "pending"}
    >
      <div className="product-artwork__fallback" data-testid="product-artwork-fallback" aria-hidden="true">
        <span className="product-artwork__monogram">{initialsFor(product.name)}</span>
        <span className="product-artwork__category">{product.category}</span>
      </div>

      {hasOfficialImage && product.image ? (
        <Image
          src={product.image}
          alt={product.name + " official product image"}
          width={size === "detail" ? 720 : 600}
          height={size === "detail" ? 720 : 600}
          unoptimized
          sizes={imageSizes}
          className="product-artwork__image"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="product-artwork__source">{statusLabel}</span>
      )}

      <span className="absolute bottom-2 right-2 max-w-[75%] truncate rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-[9px] font-semibold text-white/75 backdrop-blur-xl">
        {product.qty || "Pack size pending"}
      </span>
    </div>
  );
}
