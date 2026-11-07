import Link from "next/link";

export const metadata = {
  title: "Product Information | Hari Ram AWPL Store",
  description: "Important information about listed product details, MRP, images and availability.",
};

export default function ProductDisclaimerPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-4 pb-16 pt-10 sm:px-6">
      <Link href="/" className="text-xs font-semibold text-teal-100/70 hover:text-teal-50">← Back to catalogue</Link>
      <section className="glass-card mt-5 rounded-[26px] p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100/65">Catalogue information</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">Product information notice</h1>
        <p className="mt-4 text-sm leading-7 text-white/65">
          Product names, pack sizes and listed MRP are provided to help customers identify catalogue entries. Prices, packaging and availability can change; the current pack label and seller confirmation must be checked before an order is accepted.
        </p>
        <h2 className="mt-6 text-sm font-bold text-white">Images and descriptions</h2>
        <p className="mt-2 text-sm leading-7 text-white/60">
          An image URL does not by itself establish that the image matches the exact product and pack. Some image matches are still under review. Descriptions may be incomplete and must not be treated as a substitute for the product's physical label, ingredients list, directions or warnings.
        </p>
        <h2 className="mt-6 text-sm font-bold text-white">Health, food and cosmetic information</h2>
        <p className="mt-2 text-sm leading-7 text-white/60">
          This catalogue does not make a claim that a product diagnoses, treats, cures or prevents a disease. Do not rely on catalogue text to determine whether a food, cosmetic or health-related product is suitable for a particular person. Check the product label and applicable professional guidance.
        </p>
        <p className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-xs leading-6 text-white/45">
          The catalogue is not a live inventory system. A listed item or price is not a stock reservation, dispatch promise or order acceptance.
        </p>
      </section>
    </main>
  );
}
