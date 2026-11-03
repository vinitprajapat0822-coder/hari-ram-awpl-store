"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore, generateWhatsAppMessage, getWhatsAppUrl } from "@/store/useStore";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, Trash2, MessageCircle, Image as ImageIcon } from "lucide-react";

export default function CartPage() {
  const { cart, user, updateQuantity, removeFromCart, getCartTotal } = useStore();
  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const mrpTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user.name.trim() || !user.phone.trim() || !user.address.trim()) {
      router.push("/profile?from=checkout");
      return;
    }
    setCheckoutBusy(true);
    setCheckoutError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authUser) {
        router.push("/orders?checkout=1");
        return;
      }
      const { data: order, error: orderError } = await supabase.rpc("create_store_order", {
        p_items: cart.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
        p_customer_name: user.name.trim(),
        p_customer_phone: user.phone.replace(/\D/g, "").replace(/^91(?=[6-9]\d{9}$)/, ""),
        p_delivery_address: user.address.trim(),
      });
      if (orderError) throw orderError;
      const orderCode = typeof order === "object" && order !== null && "order_code" in order ? String(order.order_code) : "created";
      const message = generateWhatsAppMessage(cart, user, total) + `\n\n*Order ID:* ${orderCode}`;
      window.location.assign(getWhatsAppUrl(message));
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Order could not be created. Please try again.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  return (
    <main className="min-h-screen pb-32 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-7 sm:px-6 sm:pt-9">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition-colors hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> Continue browsing
        </Link>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/65">Your selection</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Your Cart</h1>
            <p className="mt-1 text-xs text-white/40">{itemCount} item{itemCount !== 1 ? "s" : ""} selected</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100">
            <ShoppingCart size={21} aria-hidden="true" />
          </span>
        </div>

        {cart.length === 0 ? (
          <GlassCard className="rounded-[26px] px-6 py-12 text-center sm:py-16">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100/70"><ShoppingCart size={28} strokeWidth={1.4} aria-hidden="true" /></span>
            <h2 className="mt-5 text-lg font-bold text-white">Your cart is waiting</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/45">Add products from the catalogue and they will appear here.</p>
            <Link href="/" className="hero-cta mt-6">Browse products <ArrowLeft className="rotate-180" size={15} aria-hidden="true" /></Link>
          </GlassCard>
        ) : (
          <div className="grid items-start gap-5 md:grid-cols-[1fr_290px]">
            <div className="space-y-3">
              {cart.map((item) => (
                <GlassCard key={item.product.id} className="rounded-[22px] p-3.5 sm:p-4">
                  <div className="flex gap-3.5">
                    <div className="product-media h-[76px] w-[76px] shrink-0 rounded-2xl sm:h-[88px] sm:w-[88px]">
                      {item.product.image && item.product.imageStatus === "VERIFIED" ? (
                        <Image src={item.product.image} alt={item.product.name} width={176} height={176} sizes="88px" className="h-full w-full object-contain p-2" />
                      ) : (
                        <ImageIcon size={23} className="text-teal-100/40" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-teal-200/65">{item.product.category}</p>
                      <h2 className="line-clamp-2 text-sm font-bold leading-snug text-white">{item.product.name}</h2>
                      <p className="mt-1 text-[11px] text-white/45">{item.product.qty}</p>
                      <p className="mt-2 text-xs font-bold text-white/70">MRP: {formatPrice(item.product.mrp * item.quantity)}</p><p className="mt-1 text-xs font-extrabold text-teal-100">SP: {item.product.sellingPrice == null ? "Confirm with store" : formatPrice(item.product.sellingPrice * item.quantity)}</p>
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
              ))}
            </div>

            <GlassCard className="rounded-[24px] p-5 md:sticky md:top-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200/65">Order summary</p>
              <div className="mt-4 flex items-center justify-between text-sm text-white/55"><span>Items</span><span>{itemCount}</span></div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/55"><span>Subtotal (MRP)</span><span>{formatPrice(mrpTotal)}</span></div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/55"><span>Estimated SP total</span><span>{formatPrice(total)}</span></div>
              <div className="my-4 border-t border-white/10" />
              <div className="flex items-end justify-between gap-3">
                <span className="text-sm font-semibold text-white">Estimated total</span>
                <span className="text-xl font-black tracking-tight text-teal-100">{formatPrice(total)}</span>
              </div>
              {checkoutError && <p role="alert" className="mt-3 text-[11px] leading-5 text-rose-200">{checkoutError}</p>}
              <button type="button" disabled={checkoutBusy} onClick={handleCheckout} className="btn-cyan mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm disabled:opacity-50">
                <MessageCircle size={18} aria-hidden="true" /> {checkoutBusy ? "Creating order…" : "Place order on WhatsApp"}
              </button>
              <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-white/40">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-teal-200/70" aria-hidden="true" />
                Your order is saved first. The owner confirms availability and any unlisted selling price before acceptance.
              </p>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}
