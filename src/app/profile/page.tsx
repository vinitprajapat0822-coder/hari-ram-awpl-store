"use client";

import { useStore } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, Check } from "lucide-react";

function ProfileContent() {
  const { user, setUser } = useStore();
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromCheckout = searchParams.get("from") === "checkout";

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleSave = () => {
    setUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);

    if (fromCheckout) {
      setTimeout(() => router.push("/cart"), 800);
    }
  };

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold mb-2">Your Details</h1>
        <p className="text-white/50 text-sm mb-6">
          These details are saved only on your device and will be sent with your
          order on WhatsApp. We cannot see them until you place an order.
        </p>

        <GlassCard className="p-5 space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm text-white/70 mb-1.5">
              Full Name *
            </label>
            <input
              id="profile-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="profile-phone" className="block text-sm text-white/70 mb-1.5">
              Mobile Number *
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="profile-address" className="block text-sm text-white/70 mb-1.5">
              Delivery Address *
            </label>
            <textarea
              id="profile-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Full address with landmark & pincode"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!form.name || !form.phone || !form.address}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-500 text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            {saved ? (
              <>
                <Check size={18} /> Saved
              </>
            ) : (
              <>
                <Save size={18} /> Save Details
              </>
            )}
          </button>
        </GlassCard>

        {fromCheckout && (
          <p className="text-center text-cyan-400/80 text-sm mt-4">
            After saving you will return to cart to place order
          </p>
        )}
      </div>
    </main>
  );
}


export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen pb-24">
          <Navbar />
          <div className="max-w-md mx-auto px-4 pt-6 text-sm text-white/50">
            Loading profile…
          </div>
        </main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
