import Link from "next/link";
import { storefrontConfig } from "@/data/storefront-config";

export const metadata = {
  title: "About this Store | Hari Ram AWPL Store",
  description: "How the independent product catalogue and enquiry storefront works.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-4 pb-16 pt-10 sm:px-6">
      <Link href="/" className="text-xs font-semibold text-teal-100/70 hover:text-teal-50">← Back to catalogue</Link>
      <section className="glass-card mt-5 rounded-[26px] p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100/65">Store information</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">About this store</h1>
        <p className="mt-4 text-sm leading-7 text-white/65">
          {storefrontConfig.storeName} is an independently operated product catalogue and order-enquiry storefront. It is not the official AWPL corporate website. This site does not assert that it is operated, owned, sponsored or authorised by AWPL.
        </p>
        <h2 className="mt-6 text-sm font-bold text-white">How enquiries work</h2>
        <p className="mt-2 text-sm leading-7 text-white/60">
          Customers can browse the catalogue, review listed MRP and prepare an enquiry. A prefilled WhatsApp message is opened only after the customer chooses that action. Sending an enquiry or order request does not itself mean the order has been accepted.
        </p>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Before accepting an order, the seller must separately confirm the current MRP, product availability, delivery details and acceptance. This static storefront does not currently provide a server-backed order-management system.
        </p>
        <p className="mt-6 rounded-2xl border border-amber-200/15 bg-amber-200/[0.04] p-4 text-xs leading-6 text-amber-100/75">
          Seller identity, seller authorisation, fulfilment responsibility and certain third-party brand/image permissions are still awaiting owner verification. No unverified details are represented as confirmed.
        </p>
      </section>
    </main>
  );
}
