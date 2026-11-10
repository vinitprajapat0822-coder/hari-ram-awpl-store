"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

export default function Footer() {
  const { t } = useLanguage();
  const footerLinks = [
    { href: "/about", label: t("footerAbout") },
    { href: "/privacy", label: t("footerPrivacy") },
    { href: "/product-disclaimer", label: t("footerProducts") },
  ];
  return (
    <footer className="content-auto mx-auto mt-16 w-full max-w-6xl px-4 pb-28 sm:px-6 md:pb-10">
      <div className="glass-card overflow-hidden rounded-[22px] border border-white/[0.08] p-5 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-extrabold tracking-[0.16em] text-white">{t("storefrontName")}</p>
            <p className="mt-2 text-xs leading-6 text-white/85">{t("footerDescription")}</p>
            <p className="mt-2 text-[10px] leading-5 text-white/75">{t("footerAffiliation")} {t("footerDisclosure")}</p>
          </div>
          <nav aria-label={t("footerProducts")} className="flex flex-wrap gap-x-4 gap-y-3">
            {footerLinks.map((item) => <Link key={item.href} href={item.href} prefetch={false} className="focus-visible:amber inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-teal-100/85 transition-colors hover:text-teal-50">{item.label}<ArrowUpRight size={12} aria-hidden="true" /></Link>)}
          </nav>
        </div>
        <div className="mt-5 flex items-start gap-2 border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-white/75">
          <ShieldCheck size={13} className="mt-0.5 shrink-0 text-teal-100/85" aria-hidden="true" />
          <p>{t("orderAcceptanceFooter")} {t("footerSecurity")}</p>
        </div>
      </div>
    </footer>
  );
}
