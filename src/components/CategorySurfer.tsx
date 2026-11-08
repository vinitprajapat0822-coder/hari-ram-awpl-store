"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/useLanguage";

type Props = { categories: string[]; activeCategory: string; onSelect: (category: string) => void };

export default function CategorySurfer({ categories, activeCategory, onSelect }: Props) {
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const { categoryLabel } = useLanguage();

  useEffect(() => {
    const activeButton = buttonRefs.current.get(activeCategory);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeButton?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  return (
    <nav id="catalogue-categories" aria-label="Product categories" className="category-surfer no-scrollbar mb-5 flex scroll-mt-28 gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            ref={(element) => { if (element) buttonRefs.current.set(category, element); else buttonRefs.current.delete(category); }}
            type="button"
            onClick={() => onSelect(category)}
            aria-pressed={active}
            className={"category-chip category-surfer__chip focus-visible:amber" + (active ? " is-active" : "")}
          >
            {active && <span className="category-surfer__active-surface" aria-hidden="true" />}
            <span className="relative z-10">{categoryLabel(category)}</span>
          </button>
        );
      })}
    </nav>
  );
}
