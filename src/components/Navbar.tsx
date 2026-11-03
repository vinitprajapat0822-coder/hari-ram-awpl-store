"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const cartCount = useStore((s) => s.getCartCount());

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass rounded-2xl px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center font-bold text-black text-lg shadow-[0_2px_14px_rgba(0,240,255,0.35)] group-active:scale-95 transition-transform">
            H
          </div>
          <div className="leading-tight">
            <p className="font-bold text-white text-sm tracking-wide">
              HARI RAM
            </p>
            <p className="text-[10px] text-cyan-400/85 tracking-[0.2em]">
              AWPL STORE
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/profile"
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-transparent hover:border-white/10"
            aria-label="Profile"
          >
            <User size={19} className="text-white/75" />
          </Link>

          <Link href="/cart" className="relative" aria-label="Cart">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/25"
            >
              <ShoppingCart size={19} className="text-cyan-300" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
