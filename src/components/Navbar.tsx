"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Home, Info, LayoutGrid, Search, ShoppingCart, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/i18n/LanguageProvider";

const navigation = [
  { href: "/", label: "Home", key: "home" as const, icon: Home },
  { href: "/#catalogue", label: "Catalogue", key: "catalogue" as const, icon: LayoutGrid },
  { href: "/about", label: "About", key: "about" as const, icon: Info },
  { href: "/cart", label: "Cart", key: "cart" as const, icon: ShoppingCart },
  { href: "/profile", label: "Profile", key: "profile" as const, icon: UserRound },
];

function isActive(pathname: string, href: string, activeHash: string) {
  if (href === "/") return pathname === "/" && activeHash !== "#catalogue";
  if (href === "/#catalogue") return pathname === "/" && activeHash === "#catalogue";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const cartCount = useStore((state) => state.getCartCount());
  const [activeHash, setActiveHash] = useState("");
  const dockRef = useRef<HTMLElement | null>(null);

  const updateMagneticDock = (event: PointerEvent<HTMLElement>) => {
    const dock = dockRef.current;
    if (!dock) return;
    const dockBounds = dock.getBoundingClientRect();

    dock.querySelectorAll<HTMLElement>(".mobile-dock__item").forEach((item) => {
      // offsetLeft/offsetTop stay tied to the untransformed layout, preventing feedback drift.
      const dx = event.clientX - (dockBounds.left + dock.clientLeft + item.offsetLeft + item.offsetWidth / 2);
      const dy = event.clientY - (dockBounds.top + dock.clientTop + item.offsetTop + item.offsetHeight / 2);
      const distance = Math.hypot(dx, dy);
      const intensity = Math.max(0, 1 - distance / 118);
      const pullX = distance > 0 ? (dx / distance) * 4.5 * intensity : 0;
      const pullY = (distance > 0 ? (dy / distance) * 1.8 : 0) * intensity - 7 * intensity;

      item.style.setProperty("--dock-x", pullX.toFixed(2) + "px");
      item.style.setProperty("--dock-y", pullY.toFixed(2) + "px");
      item.style.setProperty("--dock-scale", (1 + intensity * 0.18).toFixed(3));
    });
  };

  const resetMagneticDock = () => {
    dockRef.current?.querySelectorAll<HTMLElement>(".mobile-dock__item").forEach((item) => {
      item.style.setProperty("--dock-x", "0px");
      item.style.setProperty("--dock-y", "0px");
      item.style.setProperty("--dock-scale", "1");
    });
  };

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const handleNavigation = (href: string) => {
    setActiveHash(href === "/#catalogue" ? "#catalogue" : "");
  };

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <div className="site-header__inner glass mx-auto flex max-w-6xl items-center justify-between rounded-[22px] px-3.5 sm:px-5">
          <Link href="/" onClick={() => handleNavigation("/")} className="flex min-w-0 items-center gap-3">
            <span className="brand-mark text-lg font-black tracking-tight">H</span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-extrabold tracking-[0.13em] text-white">HARI RAM</span>
              <span className="mt-1 block text-[9px] font-bold tracking-[0.25em] text-teal-200/80">AWPL STORE</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">{t("productCatalogue")}</span>
            <nav aria-label={t("primaryNavigation")} className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href, activeHash);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className="nav-link relative text-xs font-semibold"
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {t(item.key)}
                    {item.href === "/cart" && cartCount > 0 && (
                      <span className="ml-0.5 rounded-full bg-teal-200 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-950">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href="/#catalogue"
              onClick={() => handleNavigation("/#catalogue")}
              className="header-search-link"
              aria-label={t("searchCatalogue")}
            >
            <Search size={17} aria-hidden="true" />
              <span className="hidden sm:inline">{t("search")}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
        <nav
          ref={dockRef}
          aria-label={t("mobileNavigation")}
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
                <Link
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="mobile-dock__link relative text-[10px] font-semibold"
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                    {item.href === "/cart" && cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-teal-200 px-1 text-[9px] font-extrabold text-slate-950">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                  {t(item.key)}
                  {active && <motion.span layoutId="mobile-dock-active" className="mobile-dock__indicator" aria-hidden="true" />}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
