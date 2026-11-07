import Link from "next/link";

export const metadata = {
  title: "Privacy & Data Use | Hari Ram AWPL Store",
  description: "Interim information about locally stored profile details and WhatsApp hand-off.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-4 pb-16 pt-10 sm:px-6">
      <Link href="/" className="text-xs font-semibold text-teal-100/70 hover:text-teal-50">← Back to catalogue</Link>
      <section className="glass-card mt-5 rounded-[26px] p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/70">Interim notice · not a complete legal privacy policy</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">Privacy and data use</h1>
        <p className="mt-4 text-sm leading-7 text-white/65">
          This page describes the current application behaviour. A complete privacy notice remains pending confirmation of the responsible seller identity, contact channel, data-retention period and applicable legal requirements.
        </p>
        <h2 className="mt-6 text-sm font-bold text-white">Details stored on this device</h2>
        <p className="mt-2 text-sm leading-7 text-white/60">
          When you save your profile, the current application stores your name, mobile number, delivery address and cart in this browser's local storage. The data is kept on this device/browser until its site data is cleared. Avoid saving personal details on a shared device.
        </p>
        <h2 className="mt-6 text-sm font-bold text-white">WhatsApp hand-off</h2>
        <p className="mt-2 text-sm leading-7 text-white/60">
          When you choose to continue on WhatsApp from the cart, the application prepares a message containing selected products and the profile details you saved. A WhatsApp window opens with that message prefilled. Review it carefully; it is not sent by this website unless you choose to send it in WhatsApp. WhatsApp and the recipient then handle the information under their own applicable terms and practices.
        </p>
        <h2 className="mt-6 text-sm font-bold text-white">No website order database yet</h2>
        <p className="mt-2 text-sm leading-7 text-white/60">
          This GitHub Pages version is a static catalogue and enquiry storefront. It does not currently submit customer details to a site-operated order database or provide a seller admin order-management service.
        </p>
        <p className="mt-6 rounded-2xl border border-amber-200/15 bg-amber-200/[0.04] p-4 text-xs leading-6 text-amber-100/75">
          This is an interim data-use explanation, not a representation that all privacy-law requirements have been satisfied. The full notice and responsible contact details require owner confirmation and legal review.
        </p>
      </section>
    </main>
  );
}
