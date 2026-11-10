"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, generateWhatsAppMessage, getWhatsAppUrl } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, Trash2, MessageCircle, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

export default function CartPage() {
  const { cart, user, updateQuantity, removeFromCart, getCartTotal } = useStore();
  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();
  const { lang, t, categoryLabel, formatNumber } = useLanguage();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!user.name.trim() || !user.phone.trim() || !user.address.trim()) {
      router.push("/profile?from=checkout");
      return;
    }
    const message = generateWhatsAppMessage(cart, user, total);
    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-7 sm:px-6 sm:pt-9">
        <Link href="/" className="focus-visible:amber mb-5 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-white/85 transition-colors hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> {t("continueBrowsing")}
        </Link>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/85">{t("yourSelection")}</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{t("yourCart")}</h1>
            <p className="mt-1 text-xs text-white/75">{formatNumber(itemCount)} {t("itemsSelected")}</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100">
            <ShoppingCart size={21} aria-hidden="true" />
          </span>
        </div>

        {cart.length === 0 ? (
          <GlassCard className="rounded-[22px] px-6 py-12 text-center sm:py-16">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100/85"><ShoppingCart size={28} strokeWidth={1.4} aria-hidden="true" /></span>
            <h2 className="mt-5 text-lg font-bold text-white">{t("cartWaiting")}</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/85">{t("cartEmptyHelp")}</p>
            <Link href="/" className="hero-cta focus-visible:amber mt-6 min-h-11">{t("browseProducts")} <ArrowLeft className="rotate-180" size={15} aria-hidden="true" /></Link>
          </GlassCard>
        ) : (
          <div className="grid items-start gap-5 md:grid-cols-[1fr_290px]">
            <div className="space-y-3">
              {cart.map((item) => {
                const name = lang === "hi" && item.product.nameHi ? item.product.nameHi : item.product.name;
                return (
                  <GlassCard key={item.product.id} className="rounded-[22px] p-3.5 sm:p-4">
                    <div className="flex gap-3.5">
                      <div className="product-media h-20 w-20 shrink-0 rounded-[22px] sm:h-24 sm:w-24">
                        {item.product.image && item.product.imageStatus !== "MISSING" ? (
                          <Image src={item.product.image} alt={name + (lang === "hi" ? " उत्पाद छवि" : " product image")} width={176} height={176} sizes="(max-width: 640px) 80px, 96px" className="h-full w-full object-contain p-2" />
                        ) : <ImageIcon size={23} className="text-teal-100/75" aria-hidden="true" />}
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-teal-200/85">{categoryLabel(item.product.category)}</p>
                        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-white">{name}</h2>
                        <p className="mt-1 text-[11px] text-white/75">{item.product.qty}</p>
                        <p className="mt-2 text-sm font-extrabold text-teal-100">{formatPrice(item.product.mrp * item.quantity)}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end justify-between">
                        <button type="button" onClick={() => removeFromCart(item.product.id)} aria-label={t("delete") + " " + name} className="focus-visible:amber grid h-11 w-11 place-items-center rounded-xl text-white/75 transition-colors hover:bg-rose-400/10 hover:text-rose-300">
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.045] p-1">
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label={t("decrease") + " " + name} className="focus-visible:amber grid h-11 w-11 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                            <Minus size={13} aria-hidden="true" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold text-white" aria-live="polite">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label={t("increase") + " " + name} className="focus-visible:amber grid h-11 w-11 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                            <Plus size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <GlassCard className="rounded-[22px] p-5 md:sticky md:top-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200/85">{t("orderSummary")}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-white/85"><span>{t("items")}</span><span>{itemCount}</span></div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/85"><span>{t("subtotalMrp")}</span><span>{formatPrice(total)}</span></div>
              <div className="my-4 border-t border-white/10" />
              <div className="flex items-end justify-between gap-3">
                <span className="text-sm font-semibold text-white">{t("totalMrp")}</span>
                <span className="text-xl font-black tracking-tight text-teal-100">{formatPrice(total)}</span>
              </div>
              <button type="button" onClick={handleCheckout} className="btn-cyan focus-visible:amber mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm">
                <MessageCircle size={18} aria-hidden="true" /> {t("continueWhatsApp")}
              </button>
              <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-white/75">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-teal-200/85" aria-hidden="true" />
                {t("stockConfirmation")}
              </p>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}
