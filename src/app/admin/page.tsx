"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import OrderTrackingTimeline from "@/components/OrderTrackingTimeline";
import { getSupabaseClient } from "@/lib/supabase";
import { formatOrderDate, type StoreOrder } from "@/lib/commerce";
import { ArrowLeft, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";

type PendingReview = {
  id: string;
  product_id: string;
  rating: number;
  quality_note: string;
  packaging_note: string;
  delivery_note: string;
  created_at: string;
  review_images?: Array<{ storage_path: string }>;
  photoUrls: string[];
};

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  mrp: number | null;
  dp: number | null;
  selling_price: number | null;
  catalogue_status: string;
  availability: string;
};

const transitions: Array<{ action: string; label: string; from: string; next: string }> = [
  { action: "ACCEPT_ORDER", label: "Accept Order", from: "ORDER_PLACED", next: "ORDER_ACCEPTED" },
  { action: "MARK_PACKED", label: "Mark Packed", from: "ORDER_ACCEPTED", next: "PACKED" },
  { action: "MARK_SHIPPED", label: "Mark Shipped", from: "PACKED", next: "SHIPPED" },
  { action: "IN_TRANSIT", label: "In Transit", from: "SHIPPED", next: "IN_TRANSIT" },
  { action: "OUT_FOR_DELIVERY", label: "Out for Delivery", from: "IN_TRANSIT", next: "OUT_FOR_DELIVERY" },
  { action: "MARK_DELIVERED", label: "Mark Delivered", from: "OUT_FOR_DELIVERY", next: "DELIVERED" },
];

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, { dp: string; sp: string }>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [delayForms, setDelayForms] = useState<Record<string, { date: string; start: string; end: string; note: string }>>({});

  const load = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setError("The database service is not configured.");
      setChecking(false);
      return;
    }
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session?.user?.id) {
      setAuthorized(false);
      setChecking(false);
      return;
    }
    const { data: ownerResult, error: ownerError } = await client.rpc("is_store_owner");
    if (ownerError || ownerResult !== true) {
      setAuthorized(false);
      setChecking(false);
      return;
    }
    setAuthorized(true);

    const [orderResult, reviewResult, productResult] = await Promise.all([
      client.from("orders").select("*,order_items(*),order_updates(*)").order("created_at", { ascending: false }).limit(100),
      client.from("reviews").select("id,product_id,rating,quality_note,packaging_note,delivery_note,created_at,review_images(storage_path)").eq("status", "PENDING").order("created_at", { ascending: true }).limit(100),
      client.from("store_products").select("id,name,category,mrp,dp,selling_price,catalogue_status,availability").order("name").limit(200),
    ]);
    if (orderResult.error) setError(orderResult.error.message);
    else setOrders((orderResult.data ?? []) as unknown as StoreOrder[]);
    if (reviewResult.error) setError(reviewResult.error.message);
    else {
      const pending = (reviewResult.data ?? []) as Array<Omit<PendingReview, "photoUrls">>;
      const pendingWithPhotos = await Promise.all(pending.map(async (review) => {
        const urls = await Promise.all((review.review_images ?? []).map(async (photo) => {
          const { data: signed, error: signedError } = await client.storage
            .from("review-images")
            .createSignedUrl(photo.storage_path, 60 * 60);
          return !signedError ? signed?.signedUrl ?? null : null;
        }));
        return { ...review, photoUrls: urls.filter((url): url is string => Boolean(url)) };
      }));
      setReviews(pendingWithPhotos);
    }
    if (productResult.error) setError(productResult.error.message);
    else setProducts((productResult.data ?? []) as AdminProduct[]);
    setChecking(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runOrderAction = async (
    orderId: string,
    action: string,
    note?: string,
    etaDate?: string,
    etaStart?: string,
    etaEnd?: string
  ) => {
    const client = getSupabaseClient();
    if (!client) return;
    setError("");
    setMessage("");
    const { error: actionError } = await client.rpc("owner_update_order", {
      p_order_id: orderId,
      p_action: action,
      p_message: note ?? null,
      p_eta_date: etaDate ?? null,
      p_eta_start: etaStart || null,
      p_eta_end: etaEnd || null,
    });
    if (actionError) setError(actionError.message);
    else {
      setMessage("Order updated. Customer tracking will refresh from the database.");
      await load();
    }
  };

  const saveDeliveryEta = async (orderId: string) => {
    const client = getSupabaseClient();
    const values = delayForms[orderId];
    if (!client || !values?.date) return;
    const { error: etaError } = await client.rpc("owner_set_delivery_eta", {
      p_order_id: orderId,
      p_eta_date: values.date,
      p_eta_start: values.start || null,
      p_eta_end: values.end || null,
      p_message: values.note.trim() || null,
    });
    if (etaError) setError(etaError.message);
    else {
      setMessage("Delivery estimate saved and added to the customer timeline.");
      await load();
    }
  };

  const moderateReview = async (reviewId: string, approve: boolean) => {
    const client = getSupabaseClient();
    if (!client) return;
    const { error: moderationError } = await client.rpc("owner_moderate_review", {
      p_review_id: reviewId,
      p_approve: approve,
    });
    if (moderationError) setError(moderationError.message);
    else {
      setMessage(approve ? "Review published." : "Review rejected.");
      await load();
    }
  };

  const saveProductPrices = async (product: AdminProduct) => {
    const client = getSupabaseClient();
    if (!client) return;
    const draft = priceDrafts[product.id] ?? {
      dp: product.dp === null ? "" : String(product.dp),
      sp: product.selling_price === null ? "" : String(product.selling_price),
    };
    const parsePrice = (raw: string, label: string): number | null => {
      if (!raw.trim()) return null;
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0) throw new Error(label + " must be a valid non-negative amount.");
      return value;
    };
    try {
      const dp = parsePrice(draft.dp, "DP");
      const sellingPrice = parsePrice(draft.sp, "Selling price");
      const { error: priceError } = await client.from("store_products")
        .update({ dp, selling_price: sellingPrice, updated_at: new Date().toISOString() })
        .eq("id", product.id);
      if (priceError) throw priceError;
      setMessage("Distributor price and selling price saved separately.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Price update failed.");
    }
  };

  const updateAvailability = async (productId: string, availability: string) => {
    const client = getSupabaseClient();
    if (!client) return;
    const { error: updateError } = await client.from("store_products").update({ availability }).eq("id", productId);
    if (updateError) setError(updateError.message);
    else {
      setMessage("Product availability updated.");
      await load();
    }
  };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-7 sm:px-6 sm:pt-9">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> Back to store
        </Link>
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/65">Private control centre</p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">Owner Dashboard</h1>
            <p className="mt-1 text-xs text-white/40">Hariram Prajapat · Orders, stock confirmation and review moderation</p>
          </div>
          <button type="button" onClick={() => { setChecking(true); void load(); }} aria-label="Refresh admin data" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-teal-100/70">
            <RefreshCw size={16} aria-hidden="true" />
          </button>
        </div>

        {checking ? (
          <p className="py-10 text-center text-sm text-white/45">Checking owner authorization…</p>
        ) : !authorized ? (
          <GlassCard className="mx-auto max-w-xl rounded-[24px] p-6 text-center">
            <LockKeyhole size={30} className="mx-auto text-amber-100/80" aria-hidden="true" />
            <h2 className="mt-4 text-base font-bold text-white">Access denied</h2>
            <p className="mt-2 text-xs leading-6 text-white/45">This dashboard requires an authenticated user ID explicitly registered in the store_admins table. A matching display name or customer account is not sufficient.</p>
            <Link href="/account?next=%2Fadmin" className="hero-cta mt-5 inline-flex">Sign in</Link>
          </GlassCard>
        ) : (
          <>
            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200/20 bg-rose-200/[0.06] p-3 text-xs text-rose-100">{error}</p>}
            {message && <p role="status" className="mb-4 rounded-xl border border-teal-100/15 bg-teal-100/[0.06] p-3 text-xs text-teal-100">{message}</p>}

            <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["All orders", orders.length],
                ["New orders", orders.filter((order) => order.status === "ORDER_PLACED").length],
                ["In progress", orders.filter((order) => order.status !== "DELIVERED").length],
                ["Pending reviews", reviews.length],
              ].map(([label, value]) => (
                <GlassCard key={String(label)} className="rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-white/40">{label}</p>
                  <p className="mt-1 text-2xl font-black text-teal-100">{value}</p>
                </GlassCard>
              ))}
            </section>

            <section className="mb-8" aria-labelledby="admin-orders-heading">
              <h2 id="admin-orders-heading" className="mb-3 text-lg font-extrabold text-white">Order management</h2>
              {orders.length === 0 ? (
                <GlassCard className="rounded-2xl p-5 text-sm text-white/45">No orders have been placed yet.</GlassCard>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <GlassCard key={order.id} className="rounded-[24px] p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-100/65">{order.order_number}</p>
                          <h3 className="mt-1 text-sm font-extrabold text-white">{order.customer_name}</h3>
                          <p className="mt-1 text-[10px] text-white/40">{order.phone} · {formatOrderDate(order.created_at)}</p>
                        </div>
                        <span className="rounded-full border border-teal-100/15 bg-teal-100/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase text-teal-100/80">{order.status.replaceAll("_", " ")}</span>
                      </div>
                      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_1fr]">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Items · {order.order_items?.length ?? 0}</p>
                          <div className="mt-2 space-y-2">
                            {(order.order_items ?? []).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                                <p className="text-xs font-semibold text-white">{item.product_name}</p>
                                <p className="mt-1 text-[10px] text-white/40">{item.pack_size} · Qty {item.quantity} · MRP ₹{Number(item.mrp).toLocaleString("en-IN")}</p>
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 text-xs text-white/60">Delivery address: {order.delivery_address}</p>
                          <p className="mt-1 text-xs font-bold text-teal-100">MRP total: ₹{Number(order.subtotal_mrp).toLocaleString("en-IN")}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {order.status === "ORDER_PLACED" && !order.availability_confirmed && (
                              <button type="button" onClick={() => void runOrderAction(order.id, "CONFIRM_AVAILABILITY")} className="rounded-xl border border-teal-100/25 bg-teal-100/[0.08] px-3 py-2 text-[10px] font-bold text-teal-100">Confirm Availability</button>
                            )}
                            {transitions.filter((step) => step.from === order.status && (step.action !== "ACCEPT_ORDER" || order.availability_confirmed)).map((step) => (
                              <button key={step.action} type="button" onClick={() => void runOrderAction(order.id, step.action)} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-bold text-white/75">{step.label}</button>
                            ))}
                          </div>
                          {order.status !== "DELIVERED" && (
                            <div className="mt-4 rounded-xl border border-amber-100/10 bg-amber-100/[0.025] p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-100/75">Delivery slot / delay update</p>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <input type="date" aria-label={"Revised date for " + order.order_number} value={delayForms[order.id]?.date ?? ""} onChange={(event) => setDelayForms((current) => ({ ...current, [order.id]: { date: event.target.value, start: current[order.id]?.start ?? "", end: current[order.id]?.end ?? "", note: current[order.id]?.note ?? "" } }))} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-[10px] text-white" />
                                <input type="time" aria-label={"Revised start time for " + order.order_number} value={delayForms[order.id]?.start ?? ""} onChange={(event) => setDelayForms((current) => ({ ...current, [order.id]: { date: current[order.id]?.date ?? "", start: event.target.value, end: current[order.id]?.end ?? "", note: current[order.id]?.note ?? "" } }))} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-[10px] text-white" />
                                <input type="time" aria-label={"Revised end time for " + order.order_number} value={delayForms[order.id]?.end ?? ""} onChange={(event) => setDelayForms((current) => ({ ...current, [order.id]: { date: current[order.id]?.date ?? "", start: current[order.id]?.start ?? "", end: event.target.value, note: current[order.id]?.note ?? "" } }))} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-[10px] text-white" />
                                <input type="text" aria-label={"Delay message for " + order.order_number} placeholder="Owner update / reason" value={delayForms[order.id]?.note ?? ""} onChange={(event) => setDelayForms((current) => ({ ...current, [order.id]: { date: current[order.id]?.date ?? "", start: current[order.id]?.start ?? "", end: current[order.id]?.end ?? "", note: event.target.value } }))} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-[10px] text-white placeholder:text-white/30" />
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <button type="button" disabled={!delayForms[order.id]?.date} onClick={() => void saveDeliveryEta(order.id)} className="rounded-xl border border-teal-100/25 bg-teal-100/[0.08] px-3 py-2 text-[10px] font-bold text-teal-100 disabled:opacity-35">Set delivery slot</button>
                                <button type="button" disabled={!delayForms[order.id]?.date || !delayForms[order.id]?.note?.trim()} onClick={() => void runOrderAction(order.id, "DELIVERY_DELAYED", delayForms[order.id]?.note, delayForms[order.id]?.date, delayForms[order.id]?.start, delayForms[order.id]?.end)} className="rounded-xl border border-amber-100/25 bg-amber-100/[0.08] px-3 py-2 text-[10px] font-bold text-amber-100 disabled:opacity-35">Save delivery delay</button>
                              </div>
                            </div>
                          )}
                        </div>
                        <OrderTrackingTimeline order={order} />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-8" aria-labelledby="admin-reviews-heading">
              <h2 id="admin-reviews-heading" className="mb-3 text-lg font-extrabold text-white">Review moderation</h2>
              {reviews.length === 0 ? (
                <GlassCard className="rounded-2xl p-5 text-sm text-white/45">No customer reviews are waiting for approval.</GlassCard>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <GlassCard key={review.id} className="rounded-2xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-white">{review.product_id}</p>
                        <span className="text-xs font-bold text-amber-100">{review.rating}/5</span>
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3 text-[11px] text-white/55">
                        <p><strong className="text-white/75">Quality:</strong> {review.quality_note}</p>
                        <p><strong className="text-white/75">Packaging:</strong> {review.packaging_note}</p>
                        <p><strong className="text-white/75">Delivery:</strong> {review.delivery_note}</p>
                      </div>
                      {review.photoUrls.length > 0 && (
                        <div className="mt-3 grid max-w-xs grid-cols-3 gap-2">
                          {review.photoUrls.map((url) => (
                            <img key={url} src={url} alt="Customer review photo awaiting moderation" loading="lazy" decoding="async" className="aspect-square w-full rounded-lg border border-white/10 object-cover" />
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => void moderateReview(review.id, true)} className="rounded-xl border border-teal-100/20 bg-teal-100/[0.07] px-3 py-2 text-[10px] font-bold text-teal-100">Approve & publish</button>
                        <button type="button" onClick={() => void moderateReview(review.id, false)} className="rounded-xl border border-rose-200/20 bg-rose-200/[0.05] px-3 py-2 text-[10px] font-bold text-rose-100">Reject</button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-8" aria-labelledby="admin-products-heading">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-100/70" aria-hidden="true" />
                <h2 id="admin-products-heading" className="text-lg font-extrabold text-white">Product availability</h2>
              </div>
              <GlassCard className="overflow-hidden rounded-2xl p-0">
                <div className="max-h-[480px] overflow-auto">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{product.name}</p>
                        <p className="mt-1 text-[9px] text-white/35">{product.category} · {product.catalogue_status} · MRP {product.mrp === null ? "not listed" : "₹" + Number(product.mrp).toLocaleString("en-IN")}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <label className="text-[9px] text-white/45">DP
                            <input type="number" min="0" step="0.01" aria-label={"DP for " + product.name} value={priceDrafts[product.id]?.dp ?? (product.dp === null ? "" : String(product.dp))} onChange={(event) => setPriceDrafts((current) => ({ ...current, [product.id]: { dp: event.target.value, sp: current[product.id]?.sp ?? (product.selling_price === null ? "" : String(product.selling_price)) } }))} className="ml-1 w-20 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5 text-[10px] text-white" />
                          </label>
                          <label className="text-[9px] text-white/45">SP
                            <input type="number" min="0" step="0.01" aria-label={"SP for " + product.name} value={priceDrafts[product.id]?.sp ?? (product.selling_price === null ? "" : String(product.selling_price))} onChange={(event) => setPriceDrafts((current) => ({ ...current, [product.id]: { dp: current[product.id]?.dp ?? (product.dp === null ? "" : String(product.dp)), sp: event.target.value } }))} className="ml-1 w-20 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5 text-[10px] text-white" />
                          </label>
                          <button type="button" onClick={() => void saveProductPrices(product)} className="rounded-lg border border-teal-100/20 px-2 py-1.5 text-[9px] font-bold text-teal-100">Save prices</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select aria-label={"Availability for " + product.name} value={product.availability} onChange={(event) => void updateAvailability(product.id, event.target.value)} className="rounded-lg border border-white/10 bg-[#0b1721] px-2 py-2 text-[10px] text-white">
                          <option value="UNKNOWN">Unknown</option>
                          <option value="AVAILABLE">Available</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                          <option value="REVIEW_REQUIRED">Review required</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
