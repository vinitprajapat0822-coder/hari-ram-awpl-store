"use client";
import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
type Props = { variant?: "compact" | "segmented" };
export default function LanguageToggle({ variant = "compact" }: Props) {
 const { locale, setLocale, t } = useLanguage();
 if (variant === "segmented") return <div className="language-switcher" role="group" aria-label={t("language")}><Languages size={15} aria-hidden="true"/><button type="button" onClick={()=>setLocale("en")} aria-pressed={locale==="en"}>English</button><span aria-hidden="true" className="language-switcher__divider">|</span><button type="button" onClick={()=>setLocale("hi")} aria-pressed={locale==="hi"}>हिन्दी</button></div>;
 return <button type="button" className="language-toggle" onClick={()=>setLocale(locale==="en"?"hi":"en")} aria-label={locale==="en"?"हिन्दी, "+t("switchToHindi"):"EN, "+t("switchToEnglish")} aria-pressed={locale==="hi"} title={t("language")}><Languages size={14} aria-hidden="true"/><span>{locale==="en"?"हिन्दी":"EN"}</span></button>;
}