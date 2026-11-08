"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Home, LayoutGrid, Search, ShoppingCart, UserRound, LogIn } from "lucide-react";
import { GlassCard } from "@zakisheriff/liquid-glass";
import FloatingOrderButton from "@/components/FloatingOrderButton";
import { useLanguage } from "@/i18n/useLanguage";

const navigation = [
  { href: "/", key: "navHome" as const, icon: Home },
  { href: "/#catalogue", key: "navCatalogue" as const, icon: LayoutGrid },
  { href: "/cart", key: "navCart" as const, icon: ShoppingCart },
  { href: "/login", key: "navAccount" as const, icon: LogIn },
  { href: "/profile", key: "navProfile" as const, icon: UserRound },
];

type DockCacheEntry = { element: HTMLElement; centerX: number; centerY: number };

function isActive(pathname: string, href: string, activeHash: string) {
  if (href === "/") return pathname === "/" && activeHash !== "#catalogue";
  if (href === "/#catalogue") return pathname === "/" && activeHash === "#catalogue";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useStore((state) => state.getCartCount());
  const { lang, setLang, t } = useLanguage();
  const [activeHash, setActiveHash] = useState("");
  const dockRef = useRef<HTMLElement | null>(null);
  const dockCacheRef = useRef<DockCacheEntry[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const magneticEnabledRef = useRef(false);

  useEffect(() => {
    const dock = dockRef.current;
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateCapability = () => {
      magneticEnabledRef.current = hoverQuery.matches && !motionQuery.matches;
      if (!magneticEnabledRef.current) resetMagneticDock();
    };
    const measure = () => {
      if (!dock) return;
      dockCacheRef.current = Array.from(dock.querySelectorAll<HTMLElement>(".mobile-dock__item")).map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2 };
      });
    };
    let resizeTimer: number | undefined;
    const scheduleMeasure = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 120);
    };
    const syncHash = () => setActiveHash(window.location.hash);
    updateCapability();
    measure();
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("orientationchange", scheduleMeasure, { passive: true });
    hoverQuery.addEventListener("change", updateCapability);
    motionQuery.addEventListener("change", updateCapability);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
      hoverQuery.removeEventListener("change", updateCapability);
      motionQuery.removeEventListener("change", updateCapability);
      window.clearTimeout(resizeTimer);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const resetMagneticDock = () => {
    dockCacheRef.current.forEach(({ element }) => {
      element.style.setProperty("--dock-x", "0px");
      element.style.setProperty("--dock-y", "0px");
      element.style.setProperty("--dock-scale", "1");
    });
    pointerRef.current = null;
  };

  const updateMagneticDock = (event: PointerEvent<HTMLElement>) => {
    if (!magneticEnabledRef.current) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const pointer = pointerRef.current;
      if (!pointer || !magneticEnabledRef.current) return;
      dockCacheRef.current.forEach(({ element, centerX, centerY }) => {
        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;
        const distance = Math.hypot(dx, dy);
        const strength = Math.max(0, 1 - distance / 118);
        const pullX = distance > 0 ? (dx / distance) * 4.5 * strength : 0;
        const pullY = (distance > 0 ? (dy / distance) * 1.8 : 0) * strength - 7 * strength;
        element.style.setProperty("--dock-x", pullX.toFixed(2) + "px");
        element.style.setProperty("--dock-y", pullY.toFixed(2) + "px");
        element.style.setProperty("--dock-scale", (1 + strength * 0.18).toFixed(3));
      });
    });
  };

  const handleNavigation = (href: string) => {
    setActiveHash(href === "/#catalogue" ? "#catalogue" : "");
  };

  const activeLanguageLabel = t(lang === "en" ? "english" : "hindi");

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <GlassCard padding="0px" radius="22px" intensity={6} thickness={3} tint="rgba(3, 26, 28, 0.80)" className="site-header__inner mx-auto flex max-w-6xl items-center justify-between rounded-[22px] px-3.5 sm:px-5">
          <Link href="/" onClick={() => handleNavigation("/")} className="flex min-w-0 items-center gap-3">
            <span className="brand-mark text-lg font-black tracking-tight">H</span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-extrabold tracking-[0.13em] text-white">HARI RAM</span>
              <span className="mt-1 block text-[9px] font-bold tracking-[0.25em] text-teal-200/80">AWPL {t("authStoreSuffix").toUpperCase()}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">{t("productCatalogue")}</span>
            <nav aria-label={t("productCatalogue")} className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href, activeHash);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => handleNavigation(item.href)} className="nav-link relative text-xs font-semibold" aria-current={active ? "page" : undefined}>
                    <Icon size={16} aria-hidden="true" />
                    {t(item.key)}
                    {item.href === "/cart" && cartCount > 0 && (
                      <span className="ml-1 rounded-full bg-teal-200 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-950">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/#catalogue" onClick={() => handleNavigation("/#catalogue")} className="header-search-link focus-visible:amber" aria-label={t("searchCatalogue")}>
              <Search size={17} aria-hidden="true" />
              <span className="hidden sm:inline">{t("navSearch")}</span>
            </Link>
            <div role="group" aria-label={t("language")} className="language-switcher">
              <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} aria-label={"EN, " + t("switchToEnglish")} title={activeLanguageLabel}>EN</button>
              <button type="button" onClick={() => setLang("hi")} aria-pressed={lang === "hi"} aria-label={"हिं, " + t("switchToHindi")} title={activeLanguageLabel}>हिं</button>
            </div>
          </div>
        </GlassCard>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
        <nav
          ref={dockRef}
          aria-label={t("navCatalogue")}
          className="mobile-dock pointer-events-auto mx-auto flex max-w-sm items-center gap-1 p-1.5"
          onPointerMove={updateMagneticDock}
          onPointerDown={updateMagneticDock}
          onPointerUp={resetMagneticDock}
          onPointerCancel={resetMagneticDock}
          onPointerLeave={resetMagneticDock}
        >
          {navigation.map((item) => {
            const active = isActive(pathname, item.href, activeHash);
            const Icon = item.icon;
            return (
              <div key={item.href} className="mobile-dock__item min-w-0 flex-1">
                <Link href={item.href} onClick={() => handleNavigation(item.href)} className="mobile-dock__link relative text-[10px] font-semibold" aria-current={active ? "page" : undefined}>
                  <span className="relative">
                    <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                    {item.href === "/cart" && cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-teal-200 px-1 text-[9px] font-extrabold text-slate-950">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                  {t(item.key)}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
      <FloatingOrderButton />
    </>
  );
}
