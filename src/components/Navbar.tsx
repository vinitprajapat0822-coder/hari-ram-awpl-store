"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Home, LayoutGrid, Search, ShoppingCart, UserRound } from "lucide-react";
import { motion } from "framer-motion";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#catalogue", label: "Catalogue", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function isActive(pathname: string, href: string, activeHash: string) {
  if (href === "/") return pathname === "/" && activeHash !== "#catalogue";
  if (href === "/#catalogue") return pathname === "/" && activeHash === "#catalogue";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useStore((state) => state.getCartCount());
  const [activeHash, setActiveHash] = useState("");

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
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Product catalogue</span>
            <nav aria-label="Primary navigation" className="flex items-center gap-1">
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
                    {item.label}
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

          <Link
            href="/#catalogue"
            onClick={() => handleNavigation("/#catalogue")}
            className="header-search-link"
            aria-label="Search catalogue"
          >
            <Search size={17} aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
        <nav aria-label="Mobile navigation" className="mobile-dock pointer-events-auto mx-auto flex max-w-sm items-center gap-1 p-1.5">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href, activeHash);
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                className="min-w-0 flex-1"
                whileHover={{ y: -3, scale: 1.045 }}
                whileTap={{ scale: 0.91 }}
                transition={{ type: "spring", stiffness: 460, damping: 25, mass: 0.55 }}
              >
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
                  {item.label}
                  {active && <motion.span layoutId="mobile-dock-active" className="mobile-dock__indicator" aria-hidden="true" />}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
