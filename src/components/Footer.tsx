import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { storefrontConfig } from "@/data/storefront-config";

const footerLinks = [
  { href: "/about", label: "About this store" },
  { href: "/privacy", label: "Privacy & data use" },
  { href: "/product-disclaimer", label: "Product information" },
];

export default function Footer() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-6xl px-4 pb-28 sm:px-6 md:pb-10">
      <div className="glass-card overflow-hidden rounded-[24px] border border-white/[0.08] p-5 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-extrabold tracking-[0.16em] text-white">{storefrontConfig.storeName}</p>
            <p className="mt-2 text-xs leading-6 text-white/50">
              Independent catalogue and order-enquiry storefront. This is not the official AWPL corporate website.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/35">
              No company authorisation or affiliation is asserted. Product MRP, availability and delivery details must be confirmed before an order is accepted.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-3">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-100/70 transition-colors hover:text-teal-50">
                {item.label}<ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-5 flex items-start gap-2 border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-white/35">
          <ShieldCheck size={13} className="mt-0.5 shrink-0 text-teal-100/55" aria-hidden="true" />
          <p>{storefrontConfig.orderAcceptanceDisclosure}</p>
        </div>
      </div>
    </footer>
  );
}
