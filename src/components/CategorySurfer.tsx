"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

type Props = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function CategorySurfer({
  categories,
  activeCategory,
  onSelect,
}: Props) {
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const reducedMotion = useReducedMotion();
  const { t, categoryLabel } = useLanguage();

  useEffect(() => {
    const activeButton = buttonRefs.current.get(activeCategory);
    activeButton?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory, reducedMotion]);

  return (
    <nav aria-label={t("productCatalogue")} className="category-surfer no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = activeCategory === category;
        return (
          <motion.button
            key={category}
            ref={(element) => {
              if (element) buttonRefs.current.set(category, element);
              else buttonRefs.current.delete(category);
            }}
            type="button"
            layout
            onClick={() => onSelect(category)}
            aria-pressed={active}
            className={"category-chip category-surfer__chip" + (active ? " is-active" : "")}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {active && (
              <motion.span
                layoutId="category-surfer-active"
                className="category-surfer__active-surface"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{categoryLabel(category)}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
