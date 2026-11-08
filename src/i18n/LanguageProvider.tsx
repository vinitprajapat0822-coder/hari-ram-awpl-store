"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type TranslationKey } from "./en";
import { hi } from "./hi";

export type Language = "en" | "hi";
type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  categoryLabel: (category: string) => string;
  formatNumber: (value: number) => string;
  formatDate: (value: Date | string | number) => string;
};
export const LanguageContext = createContext<LanguageContextValue | null>(null);

const categoryKeys: Record<string, TranslationKey> = {
  All: "categoryAll",
  Herbal: "categoryHerbal",
  "SNISS Herbal": "categoryHerbal",
  Elite: "categoryElite",
  "SNISS Elite": "categoryElite",
  "Cooking Oils": "categoryCookingOils",
  Masalas: "categoryMasalas",
  "Baby Care": "categoryBabyCare",
  "Home Care": "categoryHomeCare",
  Apparels: "categoryApparels",
  Food: "categoryFood",
  Others: "categoryOthers",
  "SNISS Fragrances": "categoryFragrances",
  "SNISS Cosmetic": "categoryCosmetic",
  Wellness: "categoryWellness",
  Wellroot: "categoryWellroot",
  Agriculture: "categoryAgriculture",
  Veterinary: "categoryVeterinary",
  "Oral Care": "categoryOralCare",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = document.documentElement.dataset.lang;
    if (saved === "hi") setLangState("hi");
    else if (saved === "en") setLangState("en");
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    document.documentElement.lang = next;
    document.documentElement.dataset.lang = next;
    try {
      window.localStorage.setItem("lang", next);
    } catch {
      // Storage may be unavailable in private browsing; the in-memory choice still works.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try {
      window.localStorage.setItem("lang", lang);
    } catch {
      // Storage may be unavailable in private browsing; the in-memory choice still works.
    }
  }, [lang]);

  const t = useCallback((key: TranslationKey) => lang === "hi" ? hi[key] : en[key], [lang]);
  const categoryLabel = useCallback((category: string) => {
    const key = categoryKeys[category];
    return key ? (lang === "hi" ? hi[key] : en[key]) : category;
  }, [lang]);
  const formatNumber = useCallback((value: number) => new Intl.NumberFormat("en-IN").format(value), []);
  const formatDate = useCallback((value: Date | string | number) =>
    new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, categoryLabel, formatNumber, formatDate }), [lang, setLang, t, categoryLabel, formatNumber, formatDate]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
