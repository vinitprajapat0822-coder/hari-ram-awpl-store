"use client";

import { useState, type ComponentType } from "react";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

type AssistantProps = { initialOpen?: boolean };

/**
 * Keep the catalogue helper's search index and answer engine out of the initial
 * page bundle. Load it only after a visitor explicitly opens the assistant.
 */
export default function DeferredCatalogueAssistant() {
  const { t } = useLanguage();
  const [Assistant, setAssistant] = useState<ComponentType<AssistantProps> | null>(null);
  const [loading, setLoading] = useState(false);

  async function openAssistant() {
    if (loading || Assistant) return;
    setLoading(true);
    try {
      const assistantModule = await import("@/components/CatalogueAssistant");
      setAssistant(() => assistantModule.default);
    } finally {
      setLoading(false);
    }
  }

  if (Assistant) return <Assistant initialOpen />;

  return (
    <button
      type="button"
      onClick={openAssistant}
      aria-label={t("assistantOpen")}
      aria-expanded={false}
      aria-controls="catalogue-assistant-panel"
      aria-busy={loading}
      data-testid="assistant-open"
      className="btn-cyan focus-visible:amber fixed bottom-28 right-4 z-[55] inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-xs md:bottom-6 md:right-6"
    >
      <MessageCircle size={18} aria-hidden="true" />
      <span>{loading ? t("loading") : t("assistantButton")}</span>
    </button>
  );
}
