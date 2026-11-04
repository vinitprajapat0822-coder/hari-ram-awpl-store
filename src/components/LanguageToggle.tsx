"use client";
import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
export default function LanguageToggle(){
 const {locale,setLocale,t}=useLanguage();
 return <button type="button" className="language-toggle" onClick={()=>setLocale(locale==="en"?"hi":"en")} aria-label={`${locale==="en"?"हिन्दी":"EN"} — ${t(locale==="en"?"switchToHindi":"switchToEnglish")}`} aria-pressed={locale==="hi"} title={t("language")}><Languages size={14} aria-hidden="true"/><span>{locale==="en"?"हिन्दी":"EN"}</span></button>;
}
