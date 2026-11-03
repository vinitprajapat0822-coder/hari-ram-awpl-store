import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, Instagram, MessageCircle, ShieldCheck, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Hari Ram AWPL Store",
  description:
    "Meet Hari Ram AWPL Store, an independent AWPL product store managed by Hariram Prajapat. Browse the catalogue and contact the store directly.",
};

const whatsappUrl =
  "https://wa.me/919799133838?text=Namaste%2C%20mujhe%20Hari%20Ram%20AWPL%20Store%20ke%20products%20ke%20baare%20mein%20jaankari%20chahiye.";

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />

      <section className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <div className="hero-panel relative overflow-hidden rounded-[30px] px-5 py-9 sm:px-9 sm:py-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-200/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100/20 bg-teal-100/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-teal-100/80">
              <Store size={13} aria-hidden="true" /> About the store
            </span>
            <p className="mt-5 text-[11px] font-bold tracking-[0.28em] text-teal-100/65">
              HARI RAM
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl">
              AWPL STORE
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              A simple, direct way to explore the Asclepius Wellness / AWPL product catalogue
              and contact the store for order enquiries.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <article className="glass-card rounded-[26px] p-5 sm:p-7">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={17} className="text-teal-100/75" aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-white">हमारे बारे में</h2>
            </div>
            <p className="text-sm leading-8 text-white/65">
              Hari Ram AWPL Store, Hariram Prajapat द्वारा संचालित एक independent product
              store है। यहाँ Asclepius Wellness / AWPL के उपलब्ध catalogue में wellness,
              juices और ras, personal care, home care, spices तथा everyday products देखे
              जा सकते हैं। हर listing में उपलब्ध product name, pack size और catalogue MRP
              दिखाने का प्रयास किया गया है। Final selling price, current availability और
              delivery की जानकारी WhatsApp पर सीधे confirm की जाती है। Product के ingredients
              और इस्तेमाल के लिए हमेशा उसकी original packaging पर दिए निर्देश पढ़ें।
              किसी स्वास्थ्य-संबंधी निर्णय के लिए योग्य professional की सलाह लें।
            </p>

            <div className="mt-7 border-t border-white/[0.08] pt-5">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/75">
                About us · English
              </h3>
              <p className="mt-2 text-xs leading-7 text-white/50">
                Hari Ram AWPL Store is an independent product store managed by Hariram
                Prajapat. Browse available Asclepius Wellness / AWPL catalogue items and
                contact us directly on WhatsApp to confirm product details, final pricing
                and delivery.
              </p>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="glass-card rounded-[26px] p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-teal-100/60">
                Store owner
              </p>
              <h2 className="mt-2 text-xl font-black text-white">Hariram Prajapat</h2>
              <p className="mt-1 text-xs text-white/45">Hari Ram AWPL Store</p>

              <div className="mt-5 space-y-3 border-t border-white/[0.08] pt-4">
                <a
                  href="https://wa.me/919799133838"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-teal-100/15 bg-teal-100/[0.06] p-3 text-sm font-semibold text-teal-50 transition-colors hover:bg-teal-100/[0.1]"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  <span>WhatsApp · 9799133838</span>
                </a>
                <a
                  href="https://instagram.com/hariramprajapat97"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/[0.07]"
                >
                  <Instagram size={17} aria-hidden="true" />
                  <span>@hariramprajapat97</span>
                </a>
              </div>
            </div>

            <div className="glass-card rounded-[26px] p-5 sm:p-6">
              <h2 className="text-sm font-extrabold text-white">Explore the catalogue</h2>
              <p className="mt-2 text-xs leading-6 text-white/45">
                Product information and pack details are shown where available. Ask the
                store to confirm any details before placing an order.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/#catalogue"
                  className="btn-cyan flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold"
                >
                  Browse products <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-bold text-white/75 transition-colors hover:bg-white/[0.07]"
                >
                  <MessageCircle size={14} aria-hidden="true" /> Message on WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-[10px] leading-5 text-white/30">
          Hari Ram AWPL Store is an independent storefront. Product information, pricing
          and availability are subject to confirmation with the store and the product label.
        </p>
      </section>
    </main>
  );
}
