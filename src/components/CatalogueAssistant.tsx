"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ExternalLink, MessageCircle, SendHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import { getWhatsAppUrl } from "@/store/useStore";
import { answerQuery, formatMrp, MAX_QUERY_LENGTH, suggestedPrompts, welcomeReply, type AssistantReply } from "@/lib/catalogue-assistant";
import { useLanguage } from "@/i18n/useLanguage";

type Message =
  | { id: number; from: "user"; text: string }
  | { id: number; from: "bot"; reply: AssistantReply; question: string };

export default function CatalogueAssistant() {
  const pathname = usePathname();
  const { lang, t, categoryLabel, formatNumber } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", reply: welcomeReply(), question: "" }]);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  const prompts = lang === "hi"
    ? ["Jeeveda", "₹200 से कम के उत्पाद", "कौन-सी श्रेणियाँ हैं?", "ऑर्डर कैसे करें?"]
    : [...suggestedPrompts];

  const categorySummary = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => counts.set(product.category, (counts.get(product.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => `${categoryLabel(name)} (${formatNumber(count)})`).join(", ");
  }, [categoryLabel, formatNumber]);

  function localizedReply(reply: AssistantReply): string {
    if (lang === "en") return reply.text;
    switch (reply.kind) {
      case "welcome": return t("assistantWelcomeHindi");
      case "seller-info": return t("assistantSellerInfoHindi");
      case "order-help": return t("assistantOrderHelpHindi");
      case "categories": return t("assistantCategoriesHindi") + " " + categorySummary + "। किसी भी श्रेणी का नाम लिखकर खोजें।";
      case "no-match": return t("assistantNoMatchHindi");
      case "refusal":
        if (/health|treatment|disease|medical/i.test(reply.text)) return t("assistantGuardMedicalHindi");
        if (/discount|earning|distributor|offer/i.test(reply.text)) return t("assistantGuardBusinessHindi");
        if (/stock|delivery|payment|returns|refund/i.test(reply.text)) return t("assistantGuardLogisticsHindi");
        return t("assistantGuardIngredientsHindi");
      case "products":
        return t("assistantProductsHindi") + " " + formatNumber(reply.total) + "। नीचे अधिकतम " + formatNumber(reply.products.length) + " उत्पाद दिखाए गए हैं। सूचीबद्ध एमआरपी ऑर्डर से पहले स्टोर से सत्यापित करें।";
      default: return t("assistantNoMatchHindi");
    }
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (returnFocus.current) {
      returnFocus.current = false;
      fabRef.current?.focus();
    }
  }, [open]);

  function close(restoreFocus: boolean) {
    returnFocus.current = restoreFocus;
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(true); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  function ask(question: string) {
    const trimmed = question.trim().slice(0, MAX_QUERY_LENGTH);
    if (!trimmed) return;
    const reply = answerQuery(trimmed, products);
    const userId = nextId.current++;
    const botId = nextId.current++;
    setMessages((current) => [...current, { id: userId, from: "user", text: trimmed }, { id: botId, from: "bot", reply, question: trimmed }]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  if (pathname === "/login" || pathname === "/reset-password") return null;

  const askStoreMessage = (question: string) => lang === "hi"
    ? `नमस्ते Hari Ram Store, कैटलॉग के बारे में मेरा प्रश्न है: ${question || "कृपया मुझे उत्पाद की जानकारी दें।"}`
    : question
      ? `Hello, I have a question about the Hari Ram AWPL Store catalogue: ${question}`
      : "Hello, I have a question about the Hari Ram AWPL Store catalogue.";

  return (
    <>
      {!open && (
        <button
          ref={fabRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("assistantOpen")}
          aria-expanded={false}
          aria-controls="catalogue-assistant-panel"
          data-testid="assistant-open"
          className="btn-cyan focus-visible:amber fixed bottom-28 right-4 z-[55] inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-xs md:bottom-6 md:right-6"
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span>{t("assistantButton")}</span>
        </button>
      )}

      {open && (
        <section
          id="catalogue-assistant-panel"
          role="dialog"
          aria-label={t("catalogueAssistantTitle")}
          data-testid="assistant-panel"
          className="glass fixed inset-x-3 bottom-28 z-[60] flex max-h-[min(72vh,34rem)] flex-col overflow-hidden rounded-[22px] md:inset-x-auto md:bottom-6 md:right-6 md:w-[24rem]"
          style={{ background: "rgba(7,15,26,.97)" }}
        >
          <header className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-white">{t("catalogueAssistantTitle")}</h2>
              <p className="mt-1 text-[11px] leading-5 text-white/85">{lang === "hi" ? t("assistantDisclaimer") : "Automated catalogue helper, not AI or an AWPL service. This runs in your browser; questions are not stored. The WhatsApp link opens a prefilled message for you to review and send."}</p>
            </div>
            <button type="button" onClick={() => close(true)} aria-label={t("assistantClose")} data-testid="assistant-close" className="focus-visible:amber inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/85 hover:text-white">
              <X size={16} aria-hidden="true" />
            </button>
          </header>

          <div ref={listRef} role="log" aria-live="polite" aria-label={t("assistantConversation")} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message) => message.from === "user" ? (
              <p key={message.id} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-teal-300/15 px-3 py-2 text-xs leading-5 text-teal-50">{message.text}</p>
            ) : (
              <div key={message.id} className="max-w-[95%] space-y-2" data-testid="assistant-reply" data-kind={message.reply.kind}>
                <p className="rounded-2xl rounded-bl-md bg-white/[0.06] px-3 py-2 text-xs leading-5 text-white/90">{localizedReply(message.reply)}</p>
                {message.reply.products.length > 0 && (
                  <ul className="space-y-2">
                    {message.reply.products.map((product) => {
                      const name = lang === "hi" && product.nameHi ? product.nameHi : product.name;
                      const price = lang === "hi" ? "एमआरपी ₹" + new Intl.NumberFormat("en-IN").format(product.mrp) + " (सूचीबद्ध)" : formatMrp(product);
                      return (
                        <li key={product.id}>
                          <Link href={`/product/${product.id}/`} onClick={() => close(false)} className="focus-visible:amber block min-h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 hover:border-teal-200/30">
                            <span className="block text-xs font-semibold text-white">{name}</span>
                            <span className="mt-1 block text-[11px] text-white/85">{product.qty || t("assistantPackPending")} · {price}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {message.reply.products.length > 0 && <p className="text-[10px] leading-5 text-white/85">{lang === "hi" ? t("assistantProductMrpNoticeHindi") : "MRP is as listed in this catalogue. Confirm with the store before ordering."}</p>}
                {message.reply.offerStore && (
                  <a href={getWhatsAppUrl(askStoreMessage(message.question))} target="_blank" rel="noopener noreferrer" className="focus-visible:amber inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-teal-100/90 hover:text-teal-50">
                    {lang === "hi" ? t("assistantOpenWhatsappHindi") : "Ask the store on WhatsApp"}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {prompts.map((prompt) => <button key={prompt} type="button" onClick={() => ask(prompt)} className="focus-visible:amber min-h-11 rounded-full border border-white/10 px-3 text-xs text-white/85 hover:border-teal-200/30 hover:text-white">{prompt}</button>)}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/[0.08] p-3">
            <label htmlFor="assistant-input" className="sr-only">{t("assistantAskProduct")}</label>
            <input id="assistant-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={MAX_QUERY_LENGTH} autoComplete="off" placeholder={t("assistantProductPlaceholder")} className="focus-visible:amber min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/60" />
            <button type="submit" aria-label={t("assistantSendQuestion")} className="btn-cyan focus-visible:amber inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <SendHorizontal size={16} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
