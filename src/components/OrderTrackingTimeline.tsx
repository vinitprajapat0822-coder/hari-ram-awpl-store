"use client";

import { CheckCircle2, Circle, Package, Truck } from "lucide-react";
import type { StoreOrder } from "@/lib/commerce";
import { formatDeliveryDate } from "@/lib/commerce";
import { useLanguage } from "@/i18n/LanguageProvider";

const steps = [
  { status: "ORDER_PLACED", label: "orderPlaced" as const, Icon: CheckCircle2 },
  { status: "ORDER_ACCEPTED", label: "orderAccepted" as const, Icon: CheckCircle2 },
  { status: "PACKED", label: "packed" as const, Icon: Package },
  { status: "SHIPPED", label: "shipped" as const, Icon: Package },
  { status: "IN_TRANSIT", label: "inTransit" as const, Icon: Truck },
  { status: "OUT_FOR_DELIVERY", label: "outForDelivery" as const, Icon: Truck },
  { status: "DELIVERED", label: "delivered" as const, Icon: CheckCircle2 },
] as const;

export default function OrderTrackingTimeline({ order }: { order: StoreOrder }) {
  const { t } = useLanguage();
  const currentIndex = steps.findIndex((step) => step.status === order.status);
  const updates = [...(order.order_updates ?? [])].sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );
  const delayUpdates = updates.filter((update) => update.status === "DELIVERY_DELAYED");
  const etaUpdate = [...updates].reverse().find((update) =>
    update.status === "DELIVERY_SCHEDULED" || update.status === "DELIVERY_DELAYED"
  );

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4" aria-label={t("trackingTimeline")}>
      <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-100/75">{t("trackingTimeline")}</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const complete = currentIndex >= index;
          const active = currentIndex === index;
          const Icon = step.Icon;
          const event = updates.find((item) => item.status === step.status);
          return (
            <li key={step.status} className="flex items-start gap-3">
              <span className={"mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border " + (complete
                ? "border-teal-100/35 bg-teal-100/[0.10] text-teal-100"
                : "border-white/10 bg-white/[0.025] text-white/25")}>
                {complete ? <Icon size={14} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={"block text-xs font-semibold " + (active ? "text-teal-100" : complete ? "text-white/75" : "text-white/35")}>
                  {t(step.label)}
                </span>
                {active && <span className="mt-0.5 block text-[10px] text-teal-100/55">{t("currentStatus")}</span>}
                {event?.message && <span className="mt-1 block text-[10px] leading-5 text-white/40">{event.message}</span>}
              </span>
              {complete && <span className="text-[9px] font-bold uppercase tracking-wider text-teal-100/60">{t("done")}</span>}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3 text-[11px]">
        <span className="text-white/45">{t("expectedDelivery")}</span>
        <span className="font-semibold text-white/75">{formatDeliveryDate(order.expected_delivery_date)}</span>
      </div>
      {order.expected_delivery_start && order.expected_delivery_end && (
        <p className="mt-1 text-right text-[10px] text-white/40">
          {order.expected_delivery_start.slice(0, 5)}–{order.expected_delivery_end.slice(0, 5)}
        </p>
      )}
      {etaUpdate?.message && etaUpdate.status === "DELIVERY_SCHEDULED" && (
        <p className="mt-2 text-[10px] leading-5 text-teal-100/65">{etaUpdate.message}</p>
      )}

      {delayUpdates.map((update) => (
        <div key={update.id} className="mt-3 rounded-xl border border-amber-200/35 bg-amber-200/[0.08] p-3" role="status">
          <p className="text-xs font-extrabold text-amber-100">{t("deliveryDelayed")}</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-50/80">
            {update.message || t("storeUpdatedEta")}
          </p>
          {update.eta_date && (
            <p className="mt-1 text-[10px] font-semibold text-amber-100/80">
              {t("revisedDelivery")}: {formatDeliveryDate(update.eta_date)}
              {update.eta_start && update.eta_end
                ? " · " + update.eta_start.slice(0, 5) + "–" + update.eta_end.slice(0, 5)
                : ""}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
