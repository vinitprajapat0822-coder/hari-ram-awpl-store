"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word.charAt(0)).join("");
  return initials.toUpperCase() || "AW";
}

type Props = { product: Product; showAttribution?: boolean };

export default function ProductArtwork({ product }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasProductImage = Boolean(product.image)
    && product.imageStatus !== "MISSING"
    && !imageFailed;

  return (
    <div className="product-media product-artwork mb-3" data-testid="product-artwork">
      <div className="product-artwork__fallback" data-testid="product-artwork-fallback" aria-hidden="true">
        <span className="product-artwork__monogram">{initialsFor(product.name)}</span>
        <span className="product-artwork__category">{product.category}</span>
      </div>

      {hasProductImage && product.image && (
        <Image
          src={product.image}
          alt={product.name + " product image"}
          width={600}
          height={600}
          unoptimized
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 240px"
          className="product-artwork__image"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="product-artwork__source">
        {imageFailed
          ? "Image unavailable"
          : product.image && product.imageStatus === "VERIFIED"
            ? "SKU/pack match verified"
            : product.image
              ? "Image match pending review"
              : "No product image"}
      </span>

      <span className="absolute bottom-2 right-2 max-w-[75%] truncate rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-[9px] font-semibold text-white/75 backdrop-blur-xl">
        {product.qty || "Pack size pending"}
      </span>
    </div>
  );
}
