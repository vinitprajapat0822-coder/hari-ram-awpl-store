"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  fallbackText: string;
  className?: string;
};

export default function ProductImage({
  src,
  alt,
  fallbackText,
  className = "",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`img-placeholder flex items-center justify-center text-5xl font-bold text-cyan-300/50 ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
