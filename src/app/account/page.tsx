"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { getSupabaseClient } from "@/lib/supabase";
import { ArrowLeft, LockKeyhole, LogIn, UserPlus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/orders";
  return value;
}

function AccountContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState("");

  useEffect(() => {
    const client = getSupabaseClient();
    setConfigured(Boolean(client));
    if (!client) return;
    void client.auth.getSession().then(({ data }) => {
      setSignedInEmail(data.session?.user?.email ?? "");
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setSignedInEmail(session?.user?.email ?? "");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error(t("accountServiceUnavailable"));
      if (!email.trim() || password.length < 8) throw new Error(t("enterEmailPassword"));

      if (mode === "signup") {
        if (fullName.trim().length < 2) throw new Error(t("enterFullName"));
        const { data, error: authError } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() }, emailRedirectTo: window.location.origin + window.location.pathname },
        });
        if (authError) throw authError;
        if (!data.session) {
          setNotice(t("accountCreatedNotice"));
        } else {
          router.push(safeNextPath(searchParams.get("next")));
        }
      } else {
        const { error: authError } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        router.push(safeNextPath(searchParams.get("next")));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("accountRequestFailed"));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (!client) return;
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) setError(signOutError.message);
    else setNotice(t("signedOutNotice"));
  };

  return (
    <main className="min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-xl px-4 pt-7 sm:px-6 sm:pt-10">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 hover:text-teal-100">
          <ArrowLeft size={15} aria-hidden="true" /> {t("backToStore")}
        </Link>
        <GlassCard className="rounded-[26px] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/15 bg-teal-100/[0.07] text-teal-100">
              <LockKeyhole size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200/65">{t("customerAccount")}</p>
              <h1 className="mt-1 text-xl font-black text-white">{t("accountTitle")}</h1>
            </div>
          </div>

          {!configured ? (
            <p className="rounded-xl border border-amber-200/20 bg-amber-200/[0.06] p-4 text-xs leading-6 text-amber-100/80">
              {t("onlineAccountsNotConfigured")}
            </p>
          ) : signedInEmail ? (
            <div className="space-y-4">
              <p className="text-sm text-white/65">{t("signedInAs")} <strong className="text-white">{signedInEmail}</strong></p>
              <Link href="/orders" className="hero-cta flex min-h-11 items-center justify-center">{t("openMyOrders")}</Link>
              <button type="button" onClick={() => void signOut()} className="w-full rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-white/65">{t("signOut")}</button>
            </div>
          ) : (
            <>
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
                <button type="button" onClick={() => setMode("signin")} aria-pressed={mode === "signin"} className={"rounded-lg px-3 py-2.5 text-xs font-bold " + (mode === "signin" ? "bg-teal-100/[0.12] text-teal-100" : "text-white/45")}>
                  <LogIn className="mr-1 inline" size={14} aria-hidden="true" /> {t("signIn")}
                </button>
                <button type="button" onClick={() => setMode("signup")} aria-pressed={mode === "signup"} className={"rounded-lg px-3 py-2.5 text-xs font-bold " + (mode === "signup" ? "bg-teal-100/[0.12] text-teal-100" : "text-white/45")}>
                  <UserPlus className="mr-1 inline" size={14} aria-hidden="true" /> {t("createAccount")}
                </button>
              </div>
              <div className="space-y-3">
                {mode === "signup" && (
                  <label className="block text-xs font-semibold text-white/65">
                    {t("fullName")}
                    <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" maxLength={120} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-teal-100/40" />
                  </label>
                )}
                <label className="block text-xs font-semibold text-white/65">
                  {t("emailAddress")}
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-teal-100/40" />
                </label>
                <label className="block text-xs font-semibold text-white/65">
                  {t("password")}
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-teal-100/40" />
                </label>
                <p className="text-[10px] leading-5 text-white/35">{t("passwordHint")}</p>
                {error && <p role="alert" className="rounded-xl border border-rose-200/20 bg-rose-200/[0.06] p-3 text-xs text-rose-100">{error}</p>}
                {notice && <p role="status" className="rounded-xl border border-teal-100/15 bg-teal-100/[0.06] p-3 text-xs text-teal-100">{notice}</p>}
                <button type="button" onClick={() => void submit()} disabled={busy} className="btn-cyan flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold disabled:opacity-40">
                  {busy ? t("pleaseWait") : mode === "signin" ? t("signIn") : t("createCustomerAccount")}
                </button>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="min-h-screen"><Navbar /><div className="mx-auto max-w-xl px-4 pt-10 text-sm text-white/50">Loading account…</div></main>}>
      <AccountContent />
    </Suspense>
  );
}
