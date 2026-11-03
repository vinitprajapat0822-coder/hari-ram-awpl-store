"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthPanel from "@/components/AuthPanel";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Clock3, Package, Truck } from "lucide-react";

type OrderItem = { id:string; product_id:string; product_name:string; pack_size:string; quantity:number; mrp_each:number; selling_each:number|null; image_url:string|null };
type OrderUpdate = { id:string; status:string; message:string; eta_start:string|null; eta_end:string|null; created_at:string };
type OrderRecord = { id:string; order_code:string; status:string; mrp_total:number; selling_total:number; eta_start:string|null; eta_end:string|null; delay_notice:string|null; owner_message:string|null; created_at:string; order_items:OrderItem[]; order_updates:OrderUpdate[] };

const steps = ["ORDER_PLACED","ORDER_ACCEPTED","PACKED","SHIPPED","IN_TRANSIT","OUT_FOR_DELIVERY","DELIVERED"];
const labels:Record<string,string> = { ORDER_PLACED:"Order placed",ORDER_ACCEPTED:"Order accepted",PACKED:"Packed",SHIPPED:"Shipped",IN_TRANSIT:"In transit",OUT_FOR_DELIVERY:"Out for delivery",DELIVERED:"Delivered" };
const dateTime=(value:string|null)=>value?new Date(value).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}):"Not set";

async function compressReviewPhoto(file: File): Promise<Blob> {
  if (file.size > 15 * 1024 * 1024) throw new Error("Each selected photo must be 15 MB or smaller before compression.");
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image compression is unavailable in this browser.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Photo compression failed.")), "image/webp", 0.82));
    if (blob.size > 5 * 1024 * 1024) throw new Error("Compressed photo is still larger than 5 MB. Choose a smaller image.");
    return blob;
  } catch (caught) {
    if (caught instanceof Error && (caught.message.includes("15 MB") || caught.message.includes("5 MB"))) throw caught;
    if (file.size <= 5 * 1024 * 1024) return file;
    throw new Error("This photo could not be compressed. Choose a smaller JPG, PNG or WebP image.");
  }
}
function ReviewForm({orderId,productId,onDone}:{orderId:string;productId:string;onDone:()=>void}) {
  const [rating,setRating]=useState(5),[quality,setQuality]=useState(5),[packaging,setPackaging]=useState(5),[delivery,setDelivery]=useState(5);
  const [qualityText,setQualityText]=useState(""),[packagingText,setPackagingText]=useState(""),[deliveryText,setDeliveryText]=useState("");
  const [photos,setPhotos]=useState<File[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[done,setDone]=useState(false);
  const stars=(value:number,setter:(n:number)=>void,label:string)=><fieldset className="mt-2"><legend className="text-[10px] font-semibold text-white/50">{label}</legend><div className="mt-1 flex gap-1">{[1,2,3,4,5].map(n=><button key={n} type="button" onClick={()=>setter(n)} aria-label={label+" "+n+" stars"} aria-pressed={value===n} className={`grid h-8 w-8 place-items-center rounded-lg ${n<=value?"text-amber-300":"text-white/25"}`}>★</button>)}</div></fieldset>;
  const submit=async()=>{
    setBusy(true);setError("");
    try {
      const supabase=getSupabaseBrowserClient();
      const {data:{user},error:authError}=await supabase.auth.getUser();
      if(authError||!user) throw new Error("Sign in to submit a verified-purchase review.");
      if(photos.length>4) throw new Error("Maximum 4 photos per review.");
      if(photos.some(file=>!["image/jpeg","image/png","image/webp"].includes(file.type))) throw new Error("Use JPG, PNG or WebP images.");
      const {data:reviewId,error:reviewError}=await supabase.rpc("submit_store_review",{
        p_order_id:orderId,p_product_id:productId,p_rating:rating,p_quality_rating:quality,p_packaging_rating:packaging,p_delivery_rating:delivery,
        p_product_quality:qualityText,p_packaging_experience:packagingText,p_delivery_experience:deliveryText
      });
      if(reviewError) throw reviewError;
      const uploaded:string[]=[];
      for(const file of photos){
        const blob=await compressReviewPhoto(file);
        const path=user.id+"/"+orderId+"/"+crypto.randomUUID()+".webp";
        const {error:uploadError}=await supabase.storage.from("review-photos").upload(path,blob,{contentType:"image/webp",upsert:false});
        if(uploadError) throw uploadError;
        uploaded.push(path);
      }
      if(uploaded.length){
        const {error:imageError}=await supabase.from("review_images").insert(uploaded.map(storage_path=>({review_id:reviewId,storage_path})));
        if(imageError) throw imageError;
      }
      setDone(true);onDone();
    } catch(caught){setError(caught instanceof Error?caught.message:"Review submission failed.");}
    finally{setBusy(false);}
  };
  if(done)return <p className="mt-3 text-xs text-teal-100">Review submitted. It will appear publicly after owner moderation.</p>;
  return <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
    <h4 className="text-xs font-bold text-white">Review this delivered product</h4>
    {stars(rating,setRating,"Overall rating")}{stars(quality,setQuality,"Product quality")}{stars(packaging,setPackaging,"Packaging")}{stars(delivery,setDelivery,"Delivery")}
    <label className="mt-3 block text-[10px] font-semibold text-white/50">Product quality experience<textarea value={qualityText} onChange={e=>setQualityText(e.target.value)} maxLength={1500} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-white" /></label>
    <label className="mt-3 block text-[10px] font-semibold text-white/50">Packaging experience<textarea value={packagingText} onChange={e=>setPackagingText(e.target.value)} maxLength={1500} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-white" /></label>
    <label className="mt-3 block text-[10px] font-semibold text-white/50">Delivery experience<textarea value={deliveryText} onChange={e=>setDeliveryText(e.target.value)} maxLength={1500} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-white" /></label>
    <label className="mt-3 block text-[10px] font-semibold text-white/50">Photos (up to 4; automatically compressed to WebP)<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" multiple onChange={e=>setPhotos(Array.from(e.target.files??[]).slice(0,4))} className="mt-2 block w-full text-xs text-white/60" /></label>
    {error&&<p role="alert" className="mt-3 text-xs text-rose-200">{error}</p>}
    <button type="button" disabled={busy} onClick={submit} className="btn-cyan mt-3 min-h-10 w-full rounded-xl text-xs font-bold disabled:opacity-50">{busy?"Submitting…":"Submit verified review"}</button>
  </div>;
}

function OrderTimeline({order}:{order:OrderRecord}) {
  const current=steps.indexOf(order.status);
  const updates=[...(order.order_updates??[])].sort((a,b)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime());
  return <div className="mt-4">
    <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-100/70">Order tracking</h3>
    <ol className="mt-3 space-y-3">{steps.map((step,index)=>{
      const update=[...updates].reverse().find(item=>item.status===step);
      const complete=current>=index;
      return <li key={step} className="flex gap-3">
        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${complete?"border-teal-200/50 bg-teal-100/15 text-teal-100":"border-white/10 text-white/25"}`}>{complete?<CheckCircle2 size={14}/>:<span className="text-[9px]">{index+1}</span>}</span>
        <div className="min-w-0 flex-1"><p className={`text-xs font-semibold ${complete?"text-white":"text-white/35"}`}>{labels[step]}</p>{update&&<p className="mt-0.5 text-[10px] text-white/40">{dateTime(update.created_at)} · {update.message}</p>}</div>
      </li>;
    })}</ol>
    {updates.filter(item=>item.status==="DELIVERY_DELAYED").map(item=><div key={item.id} className="mt-3 rounded-xl border border-amber-300/30 bg-amber-200/[0.07] p-3">
      <p className="text-xs font-extrabold text-amber-200">Delivery delayed notice</p><p className="mt-1 text-[11px] leading-5 text-white/70">{item.message}</p>
      <p className="mt-1 text-[10px] text-amber-100/75">Revised window: {dateTime(item.eta_start)} – {dateTime(item.eta_end)}</p>
    </div>)}
    {order.owner_message&&!updates.some(item=>item.message===order.owner_message)&&<p className="mt-3 text-[11px] text-white/55">Store update: {order.owner_message}</p>}
    <p className="mt-3 text-[10px] text-white/40">Expected delivery: {dateTime(order.eta_start)} – {dateTime(order.eta_end)}</p>
  </div>;
}

export default function OrdersPage(){
 const [userEmail,setUserEmail]=useState<string|null>(null),[orders,setOrders]=useState<OrderRecord[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const load=useCallback(async()=>{try{const supabase=getSupabaseBrowserClient();const {data:{user}}=await supabase.auth.getUser();setUserEmail(user?.email??null);if(!user){setOrders([]);return;}const {data,error:queryError}=await supabase.from("orders").select("*,order_items(*),order_updates(*)").order("created_at",{ascending:false});if(queryError)throw queryError;setOrders((data??[]) as OrderRecord[]);}catch(caught){setError(caught instanceof Error?caught.message:"Unable to load orders.");}finally{setLoading(false);}},[]);
 useEffect(()=>{let channel:ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]>|undefined;try{const supabase=getSupabaseBrowserClient();void load();channel=supabase.channel("customer-orders-live").on("postgres_changes",{event:"*",schema:"public",table:"orders"},()=>void load()).on("postgres_changes",{event:"*",schema:"public",table:"order_updates"},()=>void load()).subscribe();const {data}=supabase.auth.onAuthStateChange(()=>void load());return()=>{data.subscription.unsubscribe();if(channel)supabase.removeChannel(channel);};}catch(caught){setError(caught instanceof Error?caught.message:"Supabase is not configured.");setLoading(false);}},[load]);
 return <main className="min-h-screen pb-32 md:pb-16"><Navbar/><div className="mx-auto max-w-4xl px-4 pt-7 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/65">Customer account</p><h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">My Orders</h1><p className="mt-2 text-sm text-white/45">Your order history and owner-updated delivery timeline.</p>
 <div className="mt-6"><AuthPanel heading="Customer sign in" helper="Create an account or sign in to securely access only your own orders."/></div>
 {error&&<p role="alert" className="mt-4 text-xs text-rose-200">{error}</p>}
 {loading?<p className="mt-6 text-sm text-white/45">Loading orders…</p>:userEmail&&orders.length===0?<div className="glass-card mt-5 rounded-2xl p-6 text-center text-sm text-white/50">No orders found for this account yet.</div>:null}
 <div className="mt-4"><a href="/hari-ram-awpl-store/cart/" className="text-xs font-bold text-teal-100 underline underline-offset-4">Return to cart</a></div>
 <div className="mt-5 space-y-5">{orders.map(order=><article key={order.id} className="glass-card rounded-[24px] p-4 sm:p-5">
  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-100/60">Order ID</p><h2 className="mt-1 text-base font-black text-white">#{order.order_code}</h2><p className="mt-1 text-[10px] text-white/40">Placed {dateTime(order.created_at)}</p></div><span className="rounded-full border border-teal-100/20 bg-teal-100/[0.07] px-3 py-1.5 text-[10px] font-bold text-teal-100">{labels[order.status]??order.status}</span></div>
  <div className="mt-4 divide-y divide-white/[0.07]">{(order.order_items??[]).map(item=><div key={item.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="text-xs font-semibold text-white">{item.product_name}</p><p className="mt-1 text-[10px] text-white/40">{item.pack_size} · Qty {item.quantity}</p></div><div className="text-right"><p className="text-xs font-bold text-white">{formatPrice(Number(item.selling_each??item.mrp_each)*item.quantity)}</p><p className="text-[9px] text-white/35">MRP {formatPrice(Number(item.mrp_each))}</p></div></div>)}</div>
  <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-xs"><span className="text-white/50">MRP total</span><strong className="text-white">{formatPrice(Number(order.mrp_total))}</strong></div><div className="mt-1 flex justify-between text-xs"><span className="text-white/50">Selling total (SP when configured)</span><strong className="text-teal-100">{formatPrice(Number(order.selling_total))}</strong></div>
  <OrderTimeline order={order}/>
  {order.status==="DELIVERED"&&(order.order_items??[]).map(item=><ReviewForm key={item.id} orderId={order.id} productId={item.product_id} onDone={()=>void load()}/>)}
 </article>)}</div></div></main>;
}
