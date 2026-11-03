"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { useStore } from "@/store/useStore";
import { validateCustomerDetails } from "@/lib/order";

export default function ProfileForm() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromCheckout = searchParams.get("from") === "checkout";

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateCustomerDetails(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setUser(form);

    if (fromCheckout) {
      router.replace("/cart");
      return;
    }

    setSaved(true);
  };

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold mb-2">Your Details</h1>
        <p className="text-white/50 text-sm mb-6">
          Details are saved in this browser on this device. They are not
          uploaded to the storefront server. When you choose WhatsApp checkout,
          review the draft before sending it. Avoid saving personal details on
          shared or public devices.
        </p>

        <GlassCard className="p-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="customer-name"
                className="block text-sm text-white/70 mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="customer-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your full name"
                required
                minLength={2}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "customer-name-error" : undefined
                }
                className="input-glass w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none transition-colors"
              />
              {errors.name && (
                <p
                  id="customer-name-error"
                  className="mt-1 text-xs text-rose-300"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="customer-phone"
                className="block text-sm text-white/70 mb-1.5"
              >
                Mobile Number *
              </label>
              <input
                id="customer-phone"
                name="phone"
                type="tel"
                autoComplete="tel-national"
                inputMode="numeric"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="10-digit mobile number"
                required
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "customer-phone-error" : undefined
                }
                className="input-glass w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p
                  id="customer-phone-error"
                  className="mt-1 text-xs text-rose-300"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="customer-address"
                className="block text-sm text-white/70 mb-1.5"
              >
                Delivery Address *
              </label>
              <textarea
                id="customer-address"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Full address with landmark & pincode"
                rows={3}
                required
                minLength={8}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? "customer-address-error" : undefined
                }
                className="input-glass w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none"
              />
              {errors.address && (
                <p
                  id="customer-address-error"
                  className="mt-1 text-xs text-rose-300"
                  role="alert"
                >
                  {errors.address}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-500 text-black font-semibold active:scale-[0.98] transition-all"
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
          </form>
        </GlassCard>

        {fromCheckout && (
          <p className="text-center text-cyan-400/80 text-sm mt-4">
            After saving, you will return to your cart.
          </p>
        )}
      </div>
    </main>
  );
}
