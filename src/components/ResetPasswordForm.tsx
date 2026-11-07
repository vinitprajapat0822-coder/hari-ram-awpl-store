"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" || session) setReady(true);
      });
      return () => data.subscription.unsubscribe();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password recovery is not configured.");
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const { error: updateError } = await getSupabaseBrowserClient().auth.updateUser({ password });
      if (updateError) throw updateError;
      setNotice("Password updated. You can now sign in with your new password.");
      window.setTimeout(() => router.replace("/login/"), 1200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page relative isolate min-h-[65vh] overflow-hidden px-4 py-12 sm:px-6">
      <div className="auth-ambient auth-ambient--cyan" aria-hidden="true" />
      <div className="auth-ambient auth-ambient--violet" aria-hidden="true" />
      <section className="auth-reset-card auth-glass-card mx-auto w-full max-w-md">
        <span className="auth-brand-icon"><KeyRound size={22} aria-hidden="true" /></span>
        <p className="auth-kicker mt-4">ACCOUNT SECURITY</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white">Choose a new password</h1>
        <p className="mt-2 text-xs leading-5 text-slate-300/60">Use at least 8 characters. You will be redirected to sign in after the password is updated.</p>

        {ready ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="auth-field-label">
              New password
              <span className="auth-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" /></span>
            </label>
            <label className="auth-field-label">
              Confirm new password
              <span className="auth-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required placeholder="Enter it again" /></span>
            </label>
            {error && <p role="alert" className="auth-error">{error}</p>}
            {notice && <p role="status" className="auth-notice"><CheckCircle2 size={15} className="inline mr-1" />{notice}</p>}
            <button disabled={busy} className="liquid-button auth-action">{busy ? "Updating…" : "Update password"}</button>
          </form>
        ) : (
          <div className="mt-5">
            {error && <p role="alert" className="auth-error">{error}</p>}
            <p className="text-xs leading-5 text-slate-300/55">Open the latest password-reset email on this device. If the link has expired, request a new one from the login page.</p>
          </div>
        )}
        <Link href="/login/" className="auth-back-link mt-6 inline-flex">← Back to login</Link>
      </section>
    </main>
  );
}
