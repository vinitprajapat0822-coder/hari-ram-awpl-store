"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Compass, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";

const navigation = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useStore((state) => state.getCartCount());

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <div className="site-header__inner glass mx-auto flex max-w-6xl items-center justify-between rounded-[22px] px-3.5 sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Hari Ram AWPL Store home">
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
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="nav-link relative text-xs font-semibold" aria-current={active ? "page" : undefined}>
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                    {item.href === "/cart" && cartCount > 0 && (
                      <span className="ml-0.5 rounded-full bg-teal-200 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-950">{cartCount > 99 ? "99+" : cartCount}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35 xs:block">Everyday essentials</span>
            <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-teal-200/20 bg-teal-200/[0.08] text-teal-100">
              <ShoppingBag size={18} aria-hidden="true" />
              <span className="sr-only">Catalogue</span>
            </span>
          </div>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
        <nav aria-label="Mobile navigation" className="mobile-dock pointer-events-auto mx-auto flex max-w-sm items-center gap-1 p-1.5">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="mobile-dock__link relative text-[10px] font-semibold" aria-current={active ? "page" : undefined}>
                <span className="relative">
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                  {item.href === "/cart" && cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-teal-200 px-1 text-[9px] font-extrabold text-slate-950">{cartCount > 99 ? "99+" : cartCount}</span>
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
