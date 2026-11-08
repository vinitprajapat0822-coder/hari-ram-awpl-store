"use client";

import { usePathname, useRouter } from "next/navigation";
import { GlassButton } from "@zakisheriff/liquid-glass";
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
      <GlassButton
        type="button"
        size="md"
        variant="filled"
        tint="#FFB300"
        intensity={6}
        thickness={3}
        onClick={() => router.push("/cart")}
        aria-label={t("navOrder")}
        className="min-h-11 min-w-11 focus-visible:amber"
      >
        {t("navOrder")}
      </GlassButton>
    </div>
  );
}
