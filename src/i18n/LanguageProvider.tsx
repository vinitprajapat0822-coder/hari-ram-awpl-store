"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";
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
  Apparels: "categoryApparels", apparels: "categoryApparels", apparel: "categoryApparels",
  Food: "categoryFood", Others: "categoryOthers",
  "SNISS Fragrances": "categoryFragrances", "SNISS Cosmetic": "categoryCosmetic",
  Wellness: "categoryWellness", Wellroot: "categoryWellroot", Agriculture: "categoryAgriculture",
  Veterinary: "categoryVeterinary", "Oral Care": "categoryOralCare",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lang, setLangState] = useState<Language>("en");
  const [ready, setReady] = useState(false);
  const [, startTransition] = useTransition();
  const pendingScrollRestore = useRef<number | null>(null);
  const pendingOverflowAnchor = useRef<{ root: string; body: string } | null>(null);
  const textState = useRef(new WeakMap<Text, { source: string; rendered: string }>());
  const attributeState = useRef(new WeakMap<Element, Map<string, { source: string; rendered: string }>>());

  // A height reserve is needed only while the same route is being translated.
  // Clear it on route navigation so a previous long page cannot add blank space
  // to a shorter destination page.
  useEffect(() => {
    document.documentElement.style.minHeight = "";
    document.body.style.minHeight = "";
    pendingScrollRestore.current = null;
  }, [pathname]);

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
    const scrollY = window.scrollY;
    pendingOverflowAnchor.current = {
      root: document.documentElement.style.overflowAnchor,
      body: document.body.style.overflowAnchor,
    };
    document.documentElement.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";
    const minimumHeight = Math.ceil(Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.body.getBoundingClientRect().height,
      scrollY + window.innerHeight,
    ));
    // The document element is the scrolling root in Chromium. Reserving height
    // on both root and body prevents a shorter translation from clamping scrollY.
    document.documentElement.style.minHeight = minimumHeight + "px";
    document.body.style.minHeight = minimumHeight + "px";
    pendingScrollRestore.current = scrollY;
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
      const restoreScroll = () => {
        window.scrollTo({ left: 0, top: scrollToRestore, behavior: "auto" });
      };
      // Hindi font loading can change line metrics after the first React commit.
      // Restore only after the active font set is ready, then keep the root
      // pinned for two paint frames while browser layout/scroll anchoring settles.
      void document.fonts.ready.then(() => {
        if (pendingScrollRestore.current !== scrollToRestore) return;
        requestAnimationFrame(() => {
          restoreScroll();
          requestAnimationFrame(() => {
            restoreScroll();
            const previousAnchor = pendingOverflowAnchor.current;
            if (previousAnchor) {
              document.documentElement.style.overflowAnchor = previousAnchor.root;
              document.body.style.overflowAnchor = previousAnchor.body;
              pendingOverflowAnchor.current = null;
            }
            requestAnimationFrame(() => {
              restoreScroll();
              if (pendingScrollRestore.current === scrollToRestore) pendingScrollRestore.current = null;
            });
          });
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
    const normalized = category.trim();
    const key = categoryKeys[normalized] ?? categoryKeys[normalized.toLowerCase()];
    return key ? (lang === "hi" ? hi[key] : en[key]) : normalized;
  }, [lang]);
  const formatNumber = useCallback((value: number) => new Intl.NumberFormat("en-IN").format(value), []);
  const formatDate = useCallback((value: Date | string | number) =>
    new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, categoryLabel, formatNumber, formatDate, translateText }), [lang, setLang, t, categoryLabel, formatNumber, formatDate, translateText]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
