"use client";

import { usePathname, useRouter } from "next/navigation";
import { GlassButton } from "@zakisheriff/liquid-glass";

export default function FloatingOrderButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/cart" || pathname === "/login" || pathname === "/reset-password") {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 z-[56] md:bottom-6 md:left-6">
      <GlassButton
        type="button"
        size="md"
        variant="filled"
        tint="#FFB300"
        intensity={4}
        thickness={2}
        onClick={() => router.push("/cart")}
        aria-label="Open cart to prepare an order enquiry"
      >
        Order enquiry
      </GlassButton>
    </div>
  );
}
