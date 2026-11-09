"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Keep the non-critical catalogue helper out of the initial storefront hydration.
 * It becomes available shortly after the first paint without blocking navigation,
 * catalogue search, or the cart.
 */
export default function DeferredCatalogueAssistant() {
  const [Assistant, setAssistant] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void import("@/components/CatalogueAssistant").then((module) => {
        if (active) setAssistant(() => module.default);
      });
    }, 1800);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return Assistant ? <Assistant /> : null;
}
