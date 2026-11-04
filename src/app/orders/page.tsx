"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import OrderTrackingTimeline from "@/components/OrderTrackingTimeline";
import OrderReviewForm from "@/components/OrderReviewForm";
import { getSupabaseClient } from "@/lib/supabase";
import { formatOrderDate, type StoreOrder } from "@/lib/commerce";
import { ArrowLeft, PackageCheck, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function OrdersPage() {
  const { t, locale } = useLanguage();
  const statusLabels = {
    ORDER_PLACED: "orderPlaced", ORDER_ACCEPTED: "orderAccepted", PACKED: "packed",
    SHIPPED: "shipped", IN_TRANSIT: "inTransit", OUT_FOR_DELIVERY: "outForDelivery", DELIVERED: "delivered",
  } as const;
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    const client = getSupabaseClient();
    setConfigured(Boolean(client));
    if (!client) {
      setLoading(false);
      return;
    }

    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
      setError(sessionError.message);
      setLoading(false);
      return;
    }
    const user = sessionData.session?.user;
    setSignedIn(Boolean(user));
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await client
      .from("orders")
      .select("*,order_items(*,reviews(id,status)),order_updates(*)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (queryError) setError(queryError.message);
    else {
      setError("");
      setOrders((data ?? []) as unknown as StoreOrder[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let disposed = false;
    let removeChannel: (() => void) | null = null;

    const start = async () => {
      await loadOrders();
      const client = getSupabaseClient();
      if (!client || disposed) return;

      const { data } = await client.auth.getSession();
      const userId = data.session?.user?.id;
      if (!userId || disposed) return;

      const channel: RealtimeChannel = client.channel("customer-order-updates-" + userId)
        .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: "customer_id=eq." + userId }, () => { void loadOrders(); })
        .on("postgres_changes", { event: "*", schema: "public", table: "order_updates", filter: "customer_id=eq." + userId }, () => { void loadOrders(); })
        .subscribe();
      removeChannel = () => { void client.removeChannel(channel); };
    };

    void start();
    return () => {
      disposed = true;
      removeChannel?.();
    };
  }, [loadOrders]);

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-7 sm:px-6 sm:pt-9">
        <Link href="/profile" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> {t("backToProfile")}
        </Link>
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/65">{t("orderCentre")}</p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">{t("myOrders")}</h1>
            <p className="mt-1 text-xs text-white/40">{t("orderHistory")}</p>
          </div>
          <button type="button" onClick={() => { setLoading(true); void loadOrders(); }} aria-label={t("refreshOrders")} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-teal-100/70">
            <RefreshCw size={16} aria-hidden="true" />
          </button>
        </div>

        {!configured ? (
          <GlassCard className="rounded-2xl p-5 text-sm leading-6 text-white/55">
            {t("trackingNotConfigured")}
          </GlassCard>
        ) : !signedIn ? (
          <GlassCard className="rounded-2xl p-5">
            <p className="text-sm font-semibold text-white">{t("signInToOrders")}</p>
            <Link href="/account?next=%2Forders" className="hero-cta mt-4 inline-flex">{t("customerSignIn")}</Link>
          </GlassCard>
        ) : loading ? (
          <p className="py-8 text-center text-sm text-white/45">{t("loadingOrders")}</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-rose-200/20 bg-rose-200/[0.06] p-4 text-xs text-rose-100">{error}</p>
        ) : orders.length === 0 ? (
          <GlassCard className="rounded-2xl px-5 py-12 text-center">
            <PackageCheck size={30} className="mx-auto text-teal-100/60" aria-hidden="true" />
            <h2 className="mt-4 text-base font-bold text-white">{t("noTrackedOrders")}</h2>
            <p className="mt-2 text-xs text-white/45">{t("trackedOrderHint")}</p>
            <Link href="/" className="hero-cta mt-5 inline-flex">{t("browseCatalogue")}</Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <GlassCard key={order.id} className="rounded-[24px] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-100/65">Order {order.order_number}</p>
                    <h2 className="mt-1 text-sm font-extrabold text-white">{formatOrderDate(order.created_at, locale)}</h2>
                  </div>
                  <span className="rounded-full border border-teal-100/15 bg-teal-100/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-teal-100/80">{order.status in statusLabels ? t(statusLabels[order.status as keyof typeof statusLabels]) : order.status.replaceAll("_", " ")}</span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div>
                    <h3 className="text-xs font-bold text-white/75">{t("itemsOrdered")}</h3>
                    <div className="mt-2 space-y-2">
                      {(order.order_items ?? []).map((item) => {
                        const existingReview = item.reviews?.[0];
                        return (
                          <div key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-xs font-semibold text-white">{item.product_name}</p>
                              <span className="text-[10px] text-white/45">× {item.quantity}</span>
                            </div>
                            <p className="mt-1 text-[10px] text-white/40">{item.pack_size || t("packNotListed")} · MRP ₹{Number(item.mrp).toLocaleString("en-IN")}</p>
                            {order.status === "DELIVERED" && existingReview ? (
                              <p className="mt-3 text-[10px] font-semibold text-teal-100/70">
                                {existingReview.status === "APPROVED" ? t("reviewPublished") : t("reviewModeration")}
                              </p>
                            ) : order.status === "DELIVERED" ? (
                              <OrderReviewForm orderItemId={item.id} productName={item.product_name} onSubmitted={() => { void loadOrders(); }} />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex justify-between border-t border-white/[0.08] pt-3 text-xs">
                      <span className="text-white/45">{t("orderMrpTotal")}</span>
                      <strong className="text-teal-100">₹{Number(order.subtotal_mrp).toLocaleString("en-IN")}</strong>
                    </div>
                    {order.final_total !== null && (
                      <p className="mt-1 text-right text-[10px] text-white/45">{t("ownerConfirmedTotal")}: ₹{Number(order.final_total).toLocaleString("en-IN")}</p>
                    )}
                  </div>
                  <OrderTrackingTimeline order={order} />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
