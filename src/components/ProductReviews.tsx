"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Star } from "lucide-react";

type ReviewImage={storage_path:string;url?:string};
type ReviewRow={id:string;rating:number;product_quality:string;packaging_experience:string;delivery_experience:string;created_at:string;review_images:ReviewImage[]};

export default function ProductReviews({productId}:{productId:string}){
 const [reviews,setReviews]=useState<ReviewRow[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;const load=async()=>{try{const supabase=getSupabaseBrowserClient();const {data}=await supabase.from("reviews").select("id,rating,product_quality,packaging_experience,delivery_experience,created_at,review_images(storage_path)").eq("product_id",productId).eq("is_verified_purchase",true).eq("is_published",true).order("created_at",{ascending:false});if(active){const rows=(data??[]) as ReviewRow[];const hydrated=await Promise.all(rows.map(async row=>({...row,review_images:await Promise.all((row.review_images??[]).map(async image=>{const {data:signed}=await supabase.storage.from("review-photos").createSignedUrl(image.storage_path,3600);return {...image,url:signed?.signedUrl};}))})));if(active)setReviews(hydrated);}}catch{if(active)setReviews([]);}finally{if(active)setLoading(false);}};void load();return()=>{active=false;};},[productId]);
 const average=reviews.length?reviews.reduce((sum,item)=>sum+Number(item.rating),0)/reviews.length:0;
 return <section className="mt-8" aria-labelledby="verified-reviews-heading">
  <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/60">Verified customers</p><h2 id="verified-reviews-heading" className="mt-1 text-xl font-extrabold text-white">Customer reviews</h2></div>
  {reviews.length>0&&<div className="text-right"><p className="flex items-center justify-end gap-1 text-sm font-extrabold text-amber-200"><Star size={15} fill="currentColor"/> {average.toFixed(1)} / 5</p><p className="text-[10px] text-white/40">{reviews.length} verified review{reviews.length===1?"":"s"}</p></div>}</div>
  {loading?<p className="mt-4 text-xs text-white/40">Loading verified reviews…</p>:reviews.length===0?<div className="glass-card mt-4 rounded-2xl p-5 text-xs text-white/45">No published verified reviews yet.</div>:<div className="mt-4 grid gap-3 sm:grid-cols-2">{reviews.map(review=><article key={review.id} className="glass-card rounded-2xl p-4"><div className="flex items-center justify-between"><span className="text-sm tracking-wide text-amber-200">{"★".repeat(Math.max(0,Math.min(5,review.rating)))}</span><span className="text-[9px] text-teal-100/60">Verified purchase</span></div>
  {[["Product quality",review.product_quality],["Packaging",review.packaging_experience],["Delivery",review.delivery_experience]].filter(([,value])=>Boolean(value)).map(([label,value])=><p key={String(label)} className="mt-2 text-[11px] leading-5 text-white/65"><strong className="text-white/80">{label}:</strong> {value}</p>)}
  {(review.review_images??[]).length>0&&<div className="mt-3 grid grid-cols-4 gap-2">{review.review_images.map((image,index)=>image.url?<a key={image.storage_path} href={image.url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl border border-white/10"><Image src={image.url} alt={"Customer review photo "+(index+1)} width={320} height={320} sizes="25vw" unoptimized className="h-full w-full object-cover"/></a>:null)}</div>}
  <p className="mt-3 text-[9px] text-white/30">{new Date(review.created_at).toLocaleDateString("en-IN")}</p></article>)}</div>}
 </section>;
}
