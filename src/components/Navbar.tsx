"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const cartCount = useStore((s) => s.getCartCount());

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-card !rounded-2xl px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-cyan-500/30">
            H
          </div>
          <div className="leading-tight">
            <p className="font-bold text-white text-sm tracking-wide">
              HARI RAM
            </p>
            <p className="text-[10px] text-cyan-400/90 tracking-widest">
              AWPL STORE
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <User size={20} className="text-white/80" />
          </Link>

          <Link href="/cart" className="relative">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30"
            >
              <ShoppingCart size={20} className="text-cyan-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-black text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
