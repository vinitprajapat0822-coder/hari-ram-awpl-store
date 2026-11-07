"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ExternalLink, MessageCircle, SendHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import { getWhatsAppUrl } from "@/store/useStore";
import {
  answerQuery,
  formatMrp,
  MAX_QUERY_LENGTH,
  suggestedPrompts,
  welcomeReply,
  type AssistantReply,
} from "@/lib/catalogue-assistant";

type Message =
  | { id: number; from: "user"; text: string }
  | { id: number; from: "bot"; reply: AssistantReply; question: string };

/**
 * Rule-based catalogue helper. Conversation lives only in React state: nothing
 * is saved, nothing is sent to a server, and WhatsApp opens only when the
 * visitor taps the "Ask the store" link.
 */
export default function CatalogueAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", reply: welcomeReply(), question: "" }]);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else if (returnFocus.current) {
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
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
    setMessages((current) => [
      ...current,
      { id: userId, from: "user", text: trimmed },
      { id: botId, from: "bot", reply, question: trimmed },
    ]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <>
      {!open && (
        <button
          ref={fabRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ask catalogue — open assistant"
          aria-expanded={false}
          aria-controls="catalogue-assistant-panel"
          data-testid="assistant-open"
          className="btn-cyan fixed bottom-24 right-4 z-[55] inline-flex h-12 items-center gap-2 rounded-full px-4 text-xs md:bottom-6 md:right-6"
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span>Ask catalogue</span>
        </button>
      )}

      {open && (
        <section
          id="catalogue-assistant-panel"
          role="dialog"
          aria-label="Catalogue assistant"
          data-testid="assistant-panel"
          className="glass fixed inset-x-3 bottom-24 z-[60] flex max-h-[min(72vh,34rem)] flex-col overflow-hidden rounded-[24px] md:inset-x-auto md:bottom-6 md:right-6 md:w-[24rem]"
          style={{ background: "rgba(7,15,26,.95)" }}
        >
          <header className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-white">Catalogue assistant</h2>
              <p className="mt-0.5 text-[11px] leading-4 text-white/55">
                Automated catalogue helper, not AI or an AWPL service. This runs in your browser; questions are not stored. The WhatsApp link opens a prefilled message for you to review and send.
              </p>
            </div>
            <button
              type="button"
              onClick={() => close(true)}
              aria-label="Close catalogue assistant"
              data-testid="assistant-close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-white"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((message) =>
              message.from === "user" ? (
                <p
                  key={message.id}
                  className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-teal-300/15 px-3 py-2 text-xs leading-5 text-teal-50"
                >
                  {message.text}
                </p>
              ) : (
                <div key={message.id} className="max-w-[95%] space-y-2" data-testid="assistant-reply" data-kind={message.reply.kind}>
                  <p className="rounded-2xl rounded-bl-md bg-white/[0.06] px-3 py-2 text-xs leading-5 text-white/80">
                    {message.reply.text}
                  </p>
                  {message.reply.products.length > 0 && (
                    <ul className="space-y-1.5">
                      {message.reply.products.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/product/${product.id}`}
                            onClick={() => close(false)}
                            className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 hover:border-teal-200/30"
                          >
                            <span className="block text-xs font-semibold text-white">{product.name}</span>
                            <span className="mt-0.5 block text-[11px] text-white/55">
                              {product.qty || "Pack size pending"} · {formatMrp(product)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {message.reply.products.length > 0 && (
                    <p className="text-[10px] leading-4 text-white/60">
                      MRP is as listed in this catalogue. Confirm with the store before ordering.
                    </p>
                  )}
                  {message.reply.offerStore && (
                    <a
                      href={getWhatsAppUrl(
                        message.question
                          ? `Hello, I have a question about the Hari Ram AWPL Store catalogue: ${message.question}`
                          : "Hello, I have a question about the Hari Ram AWPL Store catalogue.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-100/80 hover:text-teal-50"
                    >
                      Ask the store on WhatsApp (opens WhatsApp with your question)
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => ask(prompt)}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/65 hover:border-teal-200/30 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/[0.08] p-3">
            <label htmlFor="assistant-input" className="sr-only">
              Ask about a product, category or price
            </label>
            <input
              id="assistant-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={MAX_QUERY_LENGTH}
              autoComplete="off"
              placeholder="Product, category or price…"
              className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/35"
            />
            <button
              type="submit"
              aria-label="Send question"
              className="btn-cyan inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            >
              <SendHorizontal size={16} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
