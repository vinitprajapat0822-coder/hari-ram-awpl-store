"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, generateWhatsAppMessage, getWhatsAppUrl } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { createStoreOrder } from "@/lib/commerce";
import { getSupabaseClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import ProductArtwork from "@/components/ProductArtwork";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, Trash2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function CartPage() {
  const { locale, t, categoryLabel, productName } = useLanguage();
  const { cart, user, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore();
  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [databasePrices, setDatabasePrices] = useState<Record<string, number | null>>({});
  const productIds = cart.map((item) => item.product.id).join("|");
  const sellingPriceTotal = cart.reduce((sum, item) => {
    const databasePrice = databasePrices[item.product.id];
    const productPrice = databasePrice !== undefined ? databasePrice : item.product.sellingPrice;
    return typeof productPrice === "number" && Number.isFinite(productPrice) && productPrice >= 0
      ? sum + productPrice * item.quantity
      : sum;
  }, 0);
  const hasCompleteSellingPrices = cart.length > 0 && cart.every((item) => {
    const databasePrice = databasePrices[item.product.id];
    const productPrice = databasePrice !== undefined ? databasePrice : item.product.sellingPrice;
    return typeof productPrice === "number" && Number.isFinite(productPrice) && productPrice >= 0;
  });
  const router = useRouter();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client || !productIds) {
      setDatabasePrices({});
      return undefined;
    }
    let active = true;
    const ids = productIds.split("|");
    void client.from("store_products").select("id,selling_price").in("id", ids).then(({ data, error }) => {
      if (!active || error || !Array.isArray(data)) return;
      const next: Record<string, number | null> = {};
      data.forEach((row) => {
        const value = row.selling_price === null ? null : Number(row.selling_price);
        next[row.id] = value !== null && Number.isFinite(value) && value >= 0 ? value : null;
      });
      setDatabasePrices(next);
    });
    return () => { active = false; };
  }, [productIds]);
  const [checkoutNotice, setCheckoutNotice] = useState("");

  const handleCheckout = async () => {
    if (cart.length === 0 || checkoutBusy) return;
    setCheckoutError("");
    setCheckoutNotice("");
    if (!user.name.trim() || !user.phone.trim() || !user.address.trim()) {
      router.push("/profile?from=checkout");
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      const message = generateWhatsAppMessage(cart, user, total, locale)
        + (locale === "hi" ? "\n\nट्रैकिंग: केवल WhatsApp पूछताछ। ऑनलाइन ऑर्डर रिकॉर्ड नहीं बना है।" : "\n\nTracking: WhatsApp enquiry only. No online order record has been created.");
      window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      setCheckoutNotice(t("whatsappOpened"));
      return;
    }

    setCheckoutBusy(true);
    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session?.user?.id) {
        router.push("/account?next=%2Fcart");
        return;
      }

      const created = await createStoreOrder(cart, user);
      const message = generateWhatsAppMessage(cart, user, total, locale)
        + "\n\n*Tracked order reference:* " + created.order_number
        + "\nYour order record is available in My Orders.";
      clearCart();
      window.location.assign(getWhatsAppUrl(message));
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Order creation failed. Please retry.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  return (
    <main className="min-h-screen pb-32 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-7 sm:px-6 sm:pt-9">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition-colors hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> {t("continueBrowsing")}
        </Link>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/65">{t("yourSelection")}</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{t("yourCart")}</h1>
            <p className="mt-1 text-xs text-white/40">{itemCount} {locale === "hi" ? (itemCount === 1 ? t("itemSelected") : t("itemsSelected")) : (itemCount === 1 ? "item selected" : "items selected")}</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100">
            <ShoppingCart size={21} aria-hidden="true" />
          </span>
        </div>

        {cart.length === 0 ? (
          <GlassCard className="rounded-[26px] px-6 py-12 text-center sm:py-16">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100/70"><ShoppingCart size={28} strokeWidth={1.4} aria-hidden="true" /></span>
            <h2 className="mt-5 text-lg font-bold text-white">{t("cartWaiting")}</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/45">{t("addProducts")}</p>
            <Link href="/" className="hero-cta mt-6">{t("browseProducts")} <ArrowLeft className="rotate-180" size={15} aria-hidden="true" /></Link>
          </GlassCard>
        ) : (
          <div className="grid items-start gap-5 md:grid-cols-[1fr_290px]">
            <div className="space-y-3">
              {cart.map((item) => {
                const databasePrice = databasePrices[item.product.id];
                const staticPrice = item.product.sellingPrice;
                const sellingPrice = databasePrice !== undefined
                  ? databasePrice
                  : typeof staticPrice === "number" && Number.isFinite(staticPrice) && staticPrice >= 0
                    ? staticPrice
                    : null;
                return (
                  <GlassCard key={item.product.id} className="rounded-[22px] p-3.5 sm:p-4">
                    <div className="flex gap-3.5">
                      <div className="w-[76px] shrink-0 sm:w-[88px]">
                        <ProductArtwork product={item.product} showAttribution={false} />
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-teal-200/65">{categoryLabel(item.product.category)}</p>
                        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-white">{productName(item.product)}</h2>
                        <p className="mt-1 text-[11px] text-white/45">{item.product.qty}</p>
                        <p className="mt-2 text-[10px] text-white/55">MRP: {formatPrice(item.product.mrp)} / unit</p>
                        <p className="mt-0.5 text-[10px] text-teal-100/70">SP: {sellingPrice === null ? t("confirmWithStore") : formatPrice(sellingPrice) + " / unit"}</p>
                        <p className="mt-1 text-sm font-extrabold text-teal-100">Line MRP: {formatPrice(item.product.mrp * item.quantity)}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end justify-between">
                        <button type="button" onClick={() => removeFromCart(item.product.id)} aria-label={"Remove " + item.product.name + " from cart"} className="grid h-8 w-8 place-items-center rounded-xl text-white/35 transition-colors hover:bg-rose-400/10 hover:text-rose-300">
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.045] p-1">
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label={"Decrease " + item.product.name + " quantity"} className="grid h-7 w-7 place-items-center rounded-lg text-white/65 transition-colors hover:bg-white/10 hover:text-white">
                            <Minus size={13} aria-hidden="true" />
                          </button>
                          <span className="min-w-5 text-center text-xs font-bold text-white" aria-live="polite">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label={"Increase " + item.product.name + " quantity"} className="grid h-7 w-7 place-items-center rounded-lg text-white/65 transition-colors hover:bg-white/10 hover:text-white">
                            <Plus size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <GlassCard className="rounded-[24px] p-5 md:sticky md:top-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200/65">{t("orderSummary")}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-white/55"><span>Items</span><span>{itemCount}</span></div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/55"><span>{t("subtotalMrp")}</span><span>{formatPrice(total)}</span></div>
              <div className="mt-2 flex items-center justify-between text-sm text-white/55"><span>{t("subtotalSp")}</span><span>{hasCompleteSellingPrices ? formatPrice(sellingPriceTotal) : t("confirmWithStore")}</span></div>
              <div className="my-4 border-t border-white/10" />
              <div className="flex items-end justify-between gap-3">
                <span className="text-sm font-semibold text-white">{t("totalMrp")}</span>
                <span className="text-xl font-black tracking-tight text-teal-100">{formatPrice(total)}</span>
              </div>
              {checkoutError && <p role="alert" className="mt-4 rounded-xl border border-rose-200/20 bg-rose-200/[0.06] p-3 text-[10px] leading-5 text-rose-100">{checkoutError}</p>}
              {checkoutNotice && <p role="status" className="mt-4 rounded-xl border border-amber-100/15 bg-amber-100/[0.05] p-3 text-[10px] leading-5 text-amber-100/80">{checkoutNotice}</p>}
              <button type="button" onClick={() => void handleCheckout()} disabled={checkoutBusy} className="btn-cyan mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm disabled:opacity-40">
                <MessageCircle size={18} aria-hidden="true" /> {checkoutBusy ? t("createTrackedOrder") : t("continueWhatsApp")}
              </button>
              <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-white/40">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-teal-200/70" aria-hidden="true" />
                {t("listedMrpRecorded")}
              </p>
              <Link href="/orders" className="mt-3 block text-center text-[10px] font-bold text-teal-100/70 hover:text-teal-50">{t("viewMyOrders")}</Link>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}
