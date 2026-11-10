"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/useLanguage";

export default function FloatingOrderButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  if (pathname === "/cart" || pathname === "/login" || pathname === "/reset-password") {
    return null;
  }

  return (
    <div className="fixed bottom-28 left-4 z-[56] md:bottom-6 md:left-6">
      <button
        type="button"
        onClick={() => router.push("/cart")}
        aria-label={t("navOrder")}
        className="floating-order-button focus-visible:amber"
      >
        {t("navOrder")}
      </button>
    </div>
  );
}
