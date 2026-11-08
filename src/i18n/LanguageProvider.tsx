"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
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
  translateText: (value: string) => string;
};
export const LanguageContext = createContext<LanguageContextValue | null>(null);

const categoryKeys: Record<string, TranslationKey> = {
  All: "categoryAll", Herbal: "categoryHerbal", "SNISS Herbal": "categoryHerbal",
  Elite: "categoryElite", "SNISS Elite": "categoryElite", "Cooking Oils": "categoryCookingOils",
  Masalas: "categoryMasalas", "Baby Care": "categoryBabyCare", "Home Care": "categoryHomeCare",
  Apparels: "categoryApparels", Food: "categoryFood", Others: "categoryOthers",
  "SNISS Fragrances": "categoryFragrances", "SNISS Cosmetic": "categoryCosmetic",
  Wellness: "categoryWellness", Wellroot: "categoryWellroot", Agriculture: "categoryAgriculture",
  Veterinary: "categoryVeterinary", "Oral Care": "categoryOralCare",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [ready, setReady] = useState(false);
  const [, startTransition] = useTransition();
  const pendingScrollRestore = useRef<number | null>(null);
  const textState = useRef(new WeakMap<Text, { source: string; rendered: string }>());
  const attributeState = useRef(new WeakMap<Element, Map<string, { source: string; rendered: string }>>());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lang");
      if (saved === "hi" || saved === "en") setLangState(saved);
    } catch {
      // The default language remains available when storage is disabled.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try { window.localStorage.setItem("lang", lang); } catch { /* In-memory language still works. */ }
  }, [lang, ready]);

  const setLang = useCallback((next: Language) => {
    if (next === lang) return;
    pendingScrollRestore.current = window.scrollY;
    try { window.localStorage.setItem("lang", next); } catch { /* In-memory language still works. */ }
    startTransition(() => setLangState(next));
  }, [lang, startTransition]);

  const translationMap = useMemo(() => {
    const map = new Map<string, string>();
    (Object.keys(en) as TranslationKey[]).forEach((key) => map.set(en[key], hi[key]));
    return map;
  }, []);

  const translateText = useCallback((value: string) => {
    if (lang === "en") return value;
    return translationMap.get(value.trim()) ?? value;
  }, [lang, translationMap]);

  useEffect(() => {
    if (typeof document === "undefined" || !document.body) return;
    const attributes = ["aria-label", "aria-description", "placeholder", "title", "alt"];
    const applyText = (node: Text) => {
      const current = node.nodeValue ?? "";
      const remembered = textState.current.get(node);
      const source = remembered && current === remembered.rendered ? remembered.source : current;
      if (!remembered || current !== remembered.rendered) textState.current.set(node, { source, rendered: current });
      const leading = source.match(/^\s*/)?.[0] ?? "";
      const trailing = source.match(/\s*$/)?.[0] ?? "";
      const body = source.slice(leading.length, source.length - trailing.length);
      const target = lang === "hi" ? (translationMap.get(body) ?? source) : source;
      const previous = textState.current.get(node);
      textState.current.set(node, { source, rendered: target });
      if (current !== target && previous?.rendered !== target) node.nodeValue = target;
    };
    const applyAttribute = (element: Element, attribute: string) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      let state = attributeState.current.get(element);
      if (!state) { state = new Map(); attributeState.current.set(element, state); }
      const remembered = state.get(attribute);
      const source = remembered && current === remembered.rendered ? remembered.source : current;
      const target = lang === "hi" ? (translationMap.get(source.trim()) ?? source) : source;
      state.set(attribute, { source, rendered: target });
      if (current !== target) element.setAttribute(attribute, target);
    };
    const visit = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) { applyText(root as Text); return; }
      if (root.nodeType !== Node.ELEMENT_NODE && root !== document.body) return;
      const element = root as Element;
      if (element.matches("script,style,textarea,[data-no-translate]")) return;
      attributes.forEach((attribute) => applyAttribute(element, attribute));
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const parent = node.parentElement;
        if (parent && !parent.closest("script,style,textarea,[data-no-translate]")) applyText(node as Text);
        node = walker.nextNode();
      }
    };
    visit(document.body);
    const scrollToRestore = pendingScrollRestore.current;
    if (scrollToRestore !== null) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollToRestore);
        requestAnimationFrame(() => {
          if (pendingScrollRestore.current === scrollToRestore) pendingScrollRestore.current = null;
        });
      });
    }
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "characterData" && record.target.nodeType === Node.TEXT_NODE) applyText(record.target as Text);
        if (record.type === "attributes" && record.target instanceof Element && record.attributeName) applyAttribute(record.target, record.attributeName);
        record.addedNodes.forEach(visit);
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
    return () => observer.disconnect();
  }, [lang, translationMap]);

  const t = useCallback((key: TranslationKey) => lang === "hi" ? hi[key] : en[key], [lang]);
  const categoryLabel = useCallback((category: string) => {
    const key = categoryKeys[category];
    return key ? (lang === "hi" ? hi[key] : en[key]) : category;
  }, [lang]);
  const formatNumber = useCallback((value: number) => new Intl.NumberFormat("en-IN").format(value), []);
  const formatDate = useCallback((value: Date | string | number) =>
    new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, categoryLabel, formatNumber, formatDate, translateText }), [lang, setLang, t, categoryLabel, formatNumber, formatDate, translateText]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
