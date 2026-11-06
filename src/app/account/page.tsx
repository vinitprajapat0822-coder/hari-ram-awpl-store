"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LanguageToggle from "@/components/LanguageToggle";
import GlassCard from "@/components/GlassCard";
import { getSupabaseClient } from "@/lib/supabase";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn, UserPlus } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="login-page min-h-screen pb-28 md:pb-16">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 sm:pt-7">
        <div className="login-topbar">
          <Link href="/" className="login-back-link">
            <ArrowLeft size={15} aria-hidden="true" />
            {t("backToStore")}
          </Link>
          <LanguageToggle variant="segmented" />
        </div>

        <section className="login-stage" aria-labelledby="account-title">
          <div className="login-card-frame">
            <GlassCard noPress className="login-card rounded-[26px] p-5 sm:p-8">
              <div className="login-heading">
                <span className="login-lock-mark">
                  <LockKeyhole size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="login-eyebrow">{t("customerAccount")}</p>
                  <h1 id="account-title" className="mt-1 text-2xl font-black tracking-tight text-white sm:text-[28px]">
                    {t("accountTitle")}
                  </h1>
                </div>
              </div>

              {!configured ? (
                <p className="login-message login-message--warning">
                  {t("onlineAccountsNotConfigured")}
                </p>
              ) : signedInEmail ? (
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-white/65">
                    {t("signedInAs")} <strong className="break-all text-white">{signedInEmail}</strong>
                  </p>
                  <Link href="/orders" className="login-submit flex items-center justify-center">
                    {t("openMyOrders")}
                  </Link>
                  <button type="button" onClick={() => void signOut()} className="login-secondary w-full">
                    {t("signOut")}
                  </button>
                  {error && <p role="alert" className="login-message login-message--error">{error}</p>}
                  {notice && <p role="status" className="login-message login-message--success">{notice}</p>}
                </div>
              ) : (
                <>
                  <div className="login-mode-switch" role="group" aria-label={t("customerAccount")}>
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      aria-pressed={mode === "signin"}
                      className={mode === "signin" ? "is-active" : ""}
                    >
                      <LogIn size={15} aria-hidden="true" />
                      {t("signIn")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      aria-pressed={mode === "signup"}
                      className={mode === "signup" ? "is-active" : ""}
                    >
                      <UserPlus size={15} aria-hidden="true" />
                      {t("createAccount")}
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {mode === "signup" && (
                      <div className="login-field">
                        <div className="login-field__control">
                          <input
                            id="full-name"
                            type="text"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            autoComplete="name"
                            maxLength={120}
                            placeholder=" "
                            className="login-field__input"
                          />
                          <label htmlFor="full-name" className="login-field__label">{t("fullName")}</label>
                        </div>
                      </div>
                    )}

                    <div className="login-field">
                      <div className="login-field__control">
                        <input
                          id="email-address"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          autoComplete="email"
                          placeholder=" "
                          className="login-field__input"
                        />
                        <label htmlFor="email-address" className="login-field__label">{t("emailAddress")}</label>
                      </div>
                    </div>

                    <div className="login-field">
                      <div className="login-field__control">
                        <input
                          id="account-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          autoComplete={mode === "signup" ? "new-password" : "current-password"}
                          minLength={8}
                          placeholder=" "
                          className="login-field__input login-field__input--password"
                        />
                        <label htmlFor="account-password" className="login-field__label">{t("password")}</label>
                      </div>
                      <button
                        type="button"
                        className="login-password-toggle"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                      </button>
                    </div>

                    <p className="px-1 text-[10px] leading-5 text-white/40">{t("passwordHint")}</p>

                    {error && <p role="alert" className="login-message login-message--error">{error}</p>}
                    {notice && <p role="status" className="login-message login-message--success">{notice}</p>}

                    <button
                      type="button"
                      onClick={() => void submit()}
                      disabled={busy}
                      className="login-submit w-full disabled:cursor-wait disabled:opacity-45"
                    >
                      {busy ? t("pleaseWait") : mode === "signin" ? t("signIn") : t("createCustomerAccount")}
                    </button>
                  </div>
                </>
              )}
            </GlassCard>
          </div>
        </section>
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
