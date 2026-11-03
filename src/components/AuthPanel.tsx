"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type AuthPanelProps = { heading?: string; helper?: string };

export default function AuthPanel({ heading = "Your customer account", helper = "Sign in or create an account to view secure order history." }: AuthPanelProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email ?? null));
      const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user.email ?? null));
      return () => data.subscription.unsubscribe();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication configuration is unavailable.");
    }
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabaseBrowserClient();
      if (mode === "signup") {
        if (name.trim().length < 2) throw new Error("Enter your full name.");
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { display_name: name.trim() } },
        });
        if (authError) throw authError;
        if (!data.session) setNotice("Account created. Check your email to confirm the account, then sign in.");
        else setNotice("Account created and signed in.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (authError) throw authError;
        setNotice("Signed in successfully.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to complete authentication.");
    } finally { setBusy(false); }
  };

  const signOut = async () => {
    try { await getSupabaseBrowserClient().auth.signOut(); setNotice("Signed out."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to sign out."); }
  };

  return (
    <section className="glass-card rounded-[24px] p-5 sm:p-6" aria-labelledby="account-auth-heading">
      <h2 id="account-auth-heading" className="text-base font-extrabold text-white">{heading}</h2>
      <p className="mt-1 text-xs leading-5 text-white/45">{helper}</p>
      {userEmail ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-teal-100">{userEmail}</p>
          <button type="button" onClick={signOut} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/5">Sign out</button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex gap-2" role="group" aria-label="Authentication mode">
            <button type="button" onClick={() => setMode("signin")} aria-pressed={mode === "signin"} className={`rounded-xl px-3 py-2 text-xs font-bold ${mode === "signin" ? "bg-teal-100/15 text-teal-100" : "bg-white/5 text-white/50"}`}>Sign in</button>
            <button type="button" onClick={() => setMode("signup")} aria-pressed={mode === "signup"} className={`rounded-xl px-3 py-2 text-xs font-bold ${mode === "signup" ? "bg-teal-100/15 text-teal-100" : "bg-white/5 text-white/50"}`}>Create account</button>
          </div>
          <form onSubmit={submit} className="mt-4 space-y-3">
            {mode === "signup" && <label className="block text-xs font-semibold text-white/65">Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required minLength={2} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm text-white outline-none focus:border-teal-100/40" /></label>}
            <label className="block text-xs font-semibold text-white/65">Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm text-white outline-none focus:border-teal-100/40" /></label>
            <label className="block text-xs font-semibold text-white/65">Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={8} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm text-white outline-none focus:border-teal-100/40" /><span className="mt-1 block text-[10px] text-white/35">At least 8 characters.</span></label>
            <button disabled={busy} className="btn-cyan min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-extrabold disabled:opacity-50">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
          </form>
        </>
      )}
      {notice && <p role="status" className="mt-3 text-xs leading-5 text-teal-100">{notice}</p>}
      {error && <p role="alert" className="mt-3 text-xs leading-5 text-rose-200">{error}</p>}
    </section>
  );
}
