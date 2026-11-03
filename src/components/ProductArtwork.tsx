"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";

type OpenverseImage = {
  thumbnail?: string;
  url?: string;
  title?: string;
  creator?: string;
  license?: string;
  foreign_landing_url?: string;
};

type OpenverseResponse = {
  results?: OpenverseImage[];
};

const categorySearchTerms: Record<string, string> = {
  agriculture: "agriculture plants farm produce",
  apparels: "clothing apparel textile",
  "baby care": "baby care products",
  food: "food ingredients groceries",
  "home care": "home cleaning household",
  jeeveda: "food wellness kitchen products",
  "oral care": "toothbrush toothpaste oral hygiene",
  "sniss cosmetic": "cosmetics skincare makeup",
  "sniss elite": "skincare beauty cosmetics",
  "sniss fragrances": "perfume fragrance bottle",
  "sniss herbal": "herbal skincare aloe vera",
  "sniss health": "wellness care products",
  "sniss personal care": "personal care toiletries",
  "veterinary": "veterinary animal care",
  "wellroot": "herbal wellness plants",
};

function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word.charAt(0)).join("");
  return initials.toUpperCase() || "AW";
}

function buildImageQuery(product: Product): string {
  const category = categorySearchTerms[product.category.trim().toLowerCase()] ?? "everyday essentials product";
  const title = product.name
    .replace(/\b\d+(?:\.\d+)?\s*(?:ml|gm|g|kg|ltr|l|number|nos?)\b/gi, " ")
    .replace(/[()[\]_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (title + " " + category).slice(0, 180);
}

export default function ProductArtwork({ product }: { product: Product }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [officialBroken, setOfficialBroken] = useState(false);
  const [stockImage, setStockImage] = useState<OpenverseImage | null>(null);
  const [stockLoaded, setStockLoaded] = useState(false);
  const [stockBroken, setStockBroken] = useState(false);

  useEffect(() => {
    if (!container || visible) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [container, visible]);

  useEffect(() => {
    const hasOfficialImage = Boolean(product.image) && product.imageStatus === "VERIFIED" && !officialBroken;
    if (!visible || hasOfficialImage || stockImage || stockBroken) return undefined;

    const controller = new AbortController();
    const query = buildImageQuery(product);
    const requestUrl = "https://api.openverse.org/v1/images/?q="
      + encodeURIComponent(query)
      + "&category=photograph&license_type=commercial&size=medium&page_size=4";

    fetch(requestUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Image search unavailable");
        return response.json() as Promise<OpenverseResponse>;
      })
      .then((payload) => {
        const result = Array.isArray(payload.results)
          ? payload.results.find((item) => safeHttpsUrl(item.thumbnail) !== null)
          : undefined;

        if (result) {
          setStockImage({
            ...result,
            thumbnail: safeHttpsUrl(result.thumbnail) ?? undefined,
            foreign_landing_url: safeHttpsUrl(result.foreign_landing_url) ?? undefined,
          });
        } else {
          setStockBroken(true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStockBroken(true);
      });

    return () => controller.abort();
  }, [officialBroken, product, stockBroken, stockImage, visible]);

  const hasOfficialImage = Boolean(product.image) && product.imageStatus === "VERIFIED" && !officialBroken;
  const stockUrl = safeHttpsUrl(stockImage?.thumbnail);
  const initials = initialsFor(product.name);

  return (
    <div
      ref={setContainer}
      className="product-media product-artwork mb-3"
      data-testid="product-artwork"
      aria-label={"Artwork for " + product.name}
    >
      <div className="product-artwork__fallback" data-testid="product-artwork-fallback" aria-hidden="true">
        <span className="product-artwork__monogram">{initials}</span>
        <span className="product-artwork__category">{product.category}</span>
      </div>

      {hasOfficialImage && product.image && (
        <Image
          src={product.image}
          alt={product.name + " product image"}
          width={600}
          height={600}
          unoptimized
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 240px"
          className="product-artwork__image"
          onError={() => setOfficialBroken(true)}
        />
      )}

      {!hasOfficialImage && stockUrl && !stockBroken && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stockUrl}
            alt={"Illustrative stock photo related to " + product.name + "; not official product packaging"}
            className={"product-artwork__image product-artwork__stock" + (stockLoaded ? " is-loaded" : "")}
            loading="lazy"
            decoding="async"
            onLoad={() => setStockLoaded(true)}
            onError={() => setStockBroken(true)}
          />
          <span className="product-artwork__source">Illustrative visual</span>
          {stockImage?.foreign_landing_url && (
            <a
              className="product-artwork__attribution"
              href={stockImage.foreign_landing_url}
              target="_blank"
              rel="noreferrer"
              aria-label={"Open image source for " + product.name}
            >
              {stockImage.creator ? "Photo: " + stockImage.creator : "Open image source"}
              {stockImage.license ? " · " + stockImage.license.toUpperCase() : ""}
            </a>
          )}
        </>
      )}

      <span className="absolute bottom-2 right-2 max-w-[75%] truncate rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-[9px] font-semibold text-white/75 backdrop-blur-xl">
        {product.qty || "Pack size pending"}
      </span>
    </div>
  );
}
