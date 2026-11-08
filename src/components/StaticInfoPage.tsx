"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/useLanguage";

type StaticInfoKind = "about" | "privacy" | "product";

export default function StaticInfoPage({ kind }: { kind: StaticInfoKind }) {
  const { t } = useLanguage();

  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-4 pb-16 pt-10 sm:px-6">
      <Link href="/" className="text-xs font-semibold text-teal-100/70 hover:text-teal-50">
        {t("pageBackToCatalogue")}
      </Link>
      <section className="glass-card mt-5 rounded-[26px] p-6 sm:p-8">
        {kind === "about" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100/65">{t("pageStoreInformation")}</p>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{t("pageAboutTitle")}</h1>
            <p className="mt-4 text-sm leading-7 text-white/65">{t("pageAboutIntro")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageHowEnquiriesWork")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageAboutEnquiry")}</p>
            <p className="mt-3 text-sm leading-7 text-white/60">{t("pageAboutAcceptance")}</p>
            <p className="mt-6 rounded-2xl border border-amber-200/15 bg-amber-200/[0.04] p-4 text-xs leading-6 text-amber-100/75">
              {t("pageSellerVerification")}
            </p>
          </>
        )}

        {kind === "privacy" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/70">{t("pagePrivacyNotice")}</p>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{t("pagePrivacyTitle")}</h1>
            <p className="mt-4 text-sm leading-7 text-white/65">{t("pagePrivacyIntro")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageLocalStorageHeading")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageLocalStorageBody")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageWhatsappHeading")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageWhatsappBody")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageAuthHeading")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageAuthBody")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageNoOrderDbHeading")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageNoOrderDbBody")}</p>
            <p className="mt-6 rounded-2xl border border-amber-200/15 bg-amber-200/[0.04] p-4 text-xs leading-6 text-amber-100/75">
              {t("pagePrivacyInterim")}
            </p>
          </>
        )}

        {kind === "product" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100/65">{t("pageCatalogueInformation")}</p>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{t("pageProductNoticeTitle")}</h1>
            <p className="mt-4 text-sm leading-7 text-white/65">{t("pageProductNoticeIntro")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageImagesDescriptionsHeading")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageImagesDescriptionsBody")}</p>
            <h2 className="mt-6 text-sm font-bold text-white">{t("pageHealthFoodHeading")}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{t("pageHealthFoodBody")}</p>
            <p className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-xs leading-6 text-white/65">
              {t("pageInventoryDisclaimer")}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
