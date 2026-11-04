"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useLanguage } from "@/i18n/LanguageProvider";

function formatPrice(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const { t, productName } = useLanguage();

  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.mrp * item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-white/80 transition hover:border-teal-200/25 hover:bg-teal-200/[0.07] active:scale-95"
        onClick={() => setOpen(true)}
        aria-label={t("openCart")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="store-cart-drawer"
      >
        <ShoppingCart size={17} aria-hidden="true" />
        <span className="sr-only">{t("openCart")}</span>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-teal-200 px-1 text-[9px] font-extrabold text-slate-950" aria-hidden="true">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 cursor-default bg-[#020611]/75 backdrop-blur-md"
              aria-label={t("closeCart")}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              id="store-cart-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="store-cart-title"
              className="relative z-10 flex h-dvh w-full max-w-md flex-col border-l border-white/[0.1] bg-[#0b0f19]/95 pt-[env(safe-area-inset-top)] shadow-[-24px_0_80px_rgba(0,0,0,.45)] backdrop-blur-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              <header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-200/65">{t("yourSelection")}</p>
                  <h2 id="store-cart-title" className="mt-1 text-xl font-black text-white">{t("yourCart")}</h2>
                  <p className="mt-1 text-xs text-white/45">{count} {t("items")}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/75 transition active:scale-95" aria-label={t("closeCart")}>
                  <X size={18} aria-hidden="true" />
                </button>
              </header>

              {cart.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-teal-100/55">
                    <ShoppingBag size={26} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-white">{t("emptyCart")}</h3>
                  <p className="mt-2 max-w-xs text-xs leading-5 text-white/45">{t("emptyCartHint")}</p>
                  <Link href="/#catalogue" onClick={() => setOpen(false)} className="mt-6 rounded-xl border border-teal-200/20 bg-teal-200/10 px-4 py-2.5 text-xs font-bold text-teal-50 transition hover:bg-teal-200/15 active:scale-[.98]">
                    {t("browseProducts")}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                    {cart.map((item) => (
                      <article key={item.product.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.045)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">{productName(item.product)}</h3>
                            <p className="mt-1 text-[10px] text-white/45">{item.product.qty}</p>
                            <p className="mt-2 text-xs font-semibold text-teal-100">{formatPrice(item.product.mrp * item.quantity)}</p>
                          </div>
                          <button type="button" onClick={() => removeFromCart(item.product.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/40 transition hover:bg-rose-300/10 hover:text-rose-200 active:scale-90" aria-label={t("removeFromCart") + ": " + productName(item.product)}>
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-white/45">{t("itemSubtotal")}</span>
                          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 p-1">
                            <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} className="grid h-7 w-7 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30" aria-label={t("decreaseQuantity")}>
                              <Minus size={13} aria-hidden="true" />
                            </button>
                            <span className="min-w-5 text-center text-xs font-extrabold text-white" aria-live="polite">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 active:scale-90" aria-label={t("increaseQuantity")}>
                              <Plus size={13} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <footer className="border-t border-white/[0.08] bg-black/20 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/55">{t("subtotalMrp")}</span>
                      <span className="text-lg font-black text-teal-100">{formatPrice(subtotal)}</span>
                    </div>
                    <Link href="/cart" onClick={() => setOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200/25 bg-gradient-to-r from-teal-200/15 to-violet-300/10 px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_35px_-20px_rgba(70,230,218,.8)] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[.99]">
                      {t("viewCart")}
                    </Link>
                  </footer>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
