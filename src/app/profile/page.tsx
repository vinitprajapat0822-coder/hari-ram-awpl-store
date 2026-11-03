"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { ArrowLeft, Check, MapPin, Phone, Save, UserRound } from "lucide-react";

function ProfileContent() {
  const { user, setUser } = useStore();
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromCheckout = searchParams.get("from") === "checkout";

  useEffect(() => { setForm(user); }, [user]);

  const handleSave = () => {
    const digits = form.phone.replace(/\D/g, "");
    const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

    if (!form.name.trim() || !form.address.trim()) {
      setError("Please complete your name and delivery address.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setError("");
    setUser({ name: form.name.trim(), phone, address: form.address.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
    if (fromCheckout) window.setTimeout(() => router.push("/cart"), 800);
  };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-xl px-4 pt-7 sm:px-6 sm:pt-9">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition-colors hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> Back to catalogue
        </Link>

        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/65">Delivery information</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Your Details</h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
            Save your contact and delivery details once. They stay on this device and are included only when you choose to prepare an order on WhatsApp.
          </p>
        </div>

        <GlassCard className="rounded-[26px] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-white/[0.08] pb-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100"><UserRound size={20} aria-hidden="true" /></span>
            <div><p className="text-sm font-bold text-white">Customer profile</p><p className="mt-0.5 text-[10px] text-white/40">All fields marked with * are required</p></div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-xs font-semibold text-white/70">Full Name *</label>
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 transition-colors focus-within:border-teal-200/40 focus-within:bg-teal-100/[0.035]">
                <UserRound size={16} className="shrink-0 text-teal-100/50" aria-hidden="true" />
                <input id="profile-name" type="text" autoComplete="name" value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setError(""); }} placeholder="Your full name" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30" />
              </div>
            </div>

            <div>
              <label htmlFor="profile-phone" className="mb-2 block text-xs font-semibold text-white/70">Mobile Number *</label>
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 transition-colors focus-within:border-teal-200/40 focus-within:bg-teal-100/[0.035]">
                <Phone size={16} className="shrink-0 text-teal-100/50" aria-hidden="true" />
                <input id="profile-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(event) => { setForm({ ...form, phone: event.target.value }); setError(""); }} placeholder="10-digit mobile number" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30" />
              </div>
              <p className="mt-1.5 text-[10px] text-white/35">An Indian mobile number, with or without the +91 prefix.</p>
            </div>

            <div>
              <label htmlFor="profile-address" className="mb-2 block text-xs font-semibold text-white/70">Delivery Address *</label>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 transition-colors focus-within:border-teal-200/40 focus-within:bg-teal-100/[0.035]">
                <MapPin size={16} className="mt-3.5 shrink-0 text-teal-100/50" aria-hidden="true" />
                <textarea id="profile-address" autoComplete="street-address" value={form.address} onChange={(event) => { setForm({ ...form, address: event.target.value }); setError(""); }} placeholder="House / street, landmark, city and pincode" rows={4} className="min-w-0 flex-1 resize-none bg-transparent py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30" />
              </div>
            </div>
          </div>

          {error && <p role="alert" className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-3.5 py-3 text-xs leading-5 text-rose-200">{error}</p>}

          <button type="button" onClick={handleSave} disabled={!form.name.trim() || !form.phone.trim() || !form.address.trim()} className="btn-cyan mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35">
            {saved ? <><Check size={17} aria-hidden="true" /> Details saved</> : <><Save size={17} aria-hidden="true" /> Save details</>}
          </button>
        </GlassCard>

        <div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/orders" className="rounded-xl border border-teal-100/20 bg-teal-100/[0.06] px-4 py-2.5 text-xs font-bold text-teal-100">My Orders & Tracking</Link></div>
        <p className="mx-auto mt-4 max-w-md text-center text-[10px] leading-5 text-white/30">
          Your profile is stored locally in this browser. It is shared only when you open the WhatsApp order message.
        </p>
        {fromCheckout && <p className="mt-4 text-center text-xs font-medium text-teal-100/75">After saving, you will return to your cart.</p>}
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<main className="min-h-screen pb-28 md:pb-16"><Navbar /><div className="mx-auto max-w-xl px-4 pt-7 text-sm text-white/50 sm:px-6">Loading profile…</div></main>}>
      <ProfileContent />
    </Suspense>
  );
}
