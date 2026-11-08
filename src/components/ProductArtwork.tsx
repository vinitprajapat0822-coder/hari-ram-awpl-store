"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useLanguage } from "@/i18n/useLanguage";

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word.charAt(0)).join("").toUpperCase() || "AW";
}

type Props = { product: Product; showAttribution?: boolean };

export default function ProductArtwork({ product }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { lang, categoryLabel } = useLanguage();
  const productName = lang === "hi" && product.nameHi ? product.nameHi : product.name;
  const hasProductImage = Boolean(product.image) && product.imageStatus !== "MISSING" && product.imageStatus !== "MISMATCH" && !imageFailed;

  return (
    <div className="product-media product-artwork mb-3" data-testid="product-artwork">
      <div className="product-artwork__fallback" data-testid="product-artwork-fallback" aria-hidden="true">
        <span className="product-artwork__monogram">{initialsFor(productName)}</span>
        <span className="product-artwork__category">{categoryLabel(product.category)}</span>
      </div>
      {hasProductImage && product.image && (
        <>
          {!imageLoaded && <span className="product-artwork__skeleton" aria-hidden="true" />}
          <Image
            src={product.image}
            alt={productName + (lang === "hi" ? " उत्पाद छवि" : " product image")}
            width={600}
            height={600}
            unoptimized
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 240px"
            className={"product-artwork__image" + (imageLoaded ? " is-loaded" : "")}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        </>
      )}
      <span className="product-artwork__source">
        {lang === "hi"
          ? (imageFailed ? "छवि उपलब्ध नहीं" : product.imageStatus === "VERIFIED" ? "उत्पाद/पैक का मिलान सत्यापित" : product.image ? "छवि का मिलान समीक्षा में" : "उत्पाद छवि उपलब्ध नहीं")
          : (imageFailed ? "Image unavailable" : product.imageStatus === "MISMATCH" ? "Image/pack mismatch — hidden pending replacement" : product.imageStatus === "VERIFIED" ? "SKU/pack match verified" : product.image ? "Image match pending review" : "No product image")}
      </span>
      <span className="product-artwork__pack">{lang === "hi" ? "पैक आकार" : "Pack size"}: {product.qty || "—"}</span>
    </div>
  );
}
