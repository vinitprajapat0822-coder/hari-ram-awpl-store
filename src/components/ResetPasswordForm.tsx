"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/useLanguage";

export default function ResetPasswordForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [configMissing, setConfigMissing] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" || session) setReady(true);
      });
      return () => data.subscription.unsubscribe();
    } catch {
      queueMicrotask(() => setConfigMissing(true));
    }
  }, [t]);

  const displayError = error || (configMissing ? t("passwordRecoveryNotConfigured") : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (password.length < 8) {
      setError(t("passwordMinLength"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }

    setBusy(true);
    try {
      const { error: updateError } = await getSupabaseBrowserClient().auth.updateUser({ password });
      if (updateError) throw updateError;
      setNotice(t("passwordUpdatedNotice"));
      window.setTimeout(() => router.replace("/login/"), 1200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("passwordUpdateFailed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page relative isolate min-h-[65vh] overflow-hidden px-4 py-12 sm:px-6">
      <Navbar />
      <div className="auth-ambient auth-ambient--cyan" aria-hidden="true" />
      <div className="auth-ambient auth-ambient--violet" aria-hidden="true" />
      <section className="auth-reset-card auth-glass-card mx-auto w-full max-w-md">
        <span className="auth-brand-icon"><KeyRound size={22} aria-hidden="true" /></span>
        <p className="auth-kicker mt-4">{t("accountSecurity").toUpperCase()}</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white">{t("chooseNewPassword")}</h1>
        <p className="mt-2 text-xs leading-5 text-slate-300/60">{t("passwordRecoveryInstructions")}</p>

        {ready ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="auth-field-label">
              {t("newPasswordLabel")}
              <span className="auth-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required placeholder={t("passwordPlaceholder")} /></span>
            </label>
            <label className="auth-field-label">
              {t("confirmNewPassword")}
              <span className="auth-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required placeholder={t("passwordConfirmAgain")} /></span>
            </label>
            {displayError && <p role="alert" className="auth-error">{displayError}</p>}
            {notice && <p role="status" className="auth-notice"><CheckCircle2 size={15} className="inline mr-1" />{notice}</p>}
            <button disabled={busy} className="liquid-button auth-action">{busy ? t("updating") : t("updatePassword")}</button>
          </form>
        ) : (
          <div className="mt-5">
            {error && <p role="alert" className="auth-error">{error}</p>}
            <p className="text-xs leading-5 text-slate-300/55">{t("openResetEmail")}</p>
          </div>
        )}
        <Link href="/login/" className="auth-back-link mt-6 inline-flex">{t("backToLogin")}</Link>
      </section>
    </main>
  );
}
