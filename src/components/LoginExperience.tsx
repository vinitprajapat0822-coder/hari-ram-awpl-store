"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getSupabaseBrowserClient, setAuthRememberPreference } from "@/lib/supabase";

type Mode = "login" | "register" | "forgot";

function appRedirect(path: string) {
  const basePath = "/hari-ram-awpl-store";
  return new URL(basePath + path, window.location.origin).toString();
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-[18px] w-[18px]">
      <path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z" />
      <path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.1H5.9v5.3A20 20 0 0 0 24 44Z" />
      <path fill="#4CAF50" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z" />
      <path fill="#1976D2" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.9 14.9l6.9 5.3C14.4 15.6 18.8 12.1 24 12.1Z" />
    </svg>
  );
}

function Character({ passwordFocus }: { passwordFocus: boolean }) {
  return (
    <motion.div
      className={`auth-mascot ${passwordFocus ? "auth-mascot--protect" : ""}`}
      animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 340 350" role="presentation" className="h-full w-full">
        <defs>
          <radialGradient id="mascot-halo" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity=".25" />
            <stop offset="65%" stopColor="#4f46e5" stopOpacity=".10" />
            <stop offset="100%" stopColor="#07070f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mascot-skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe6c9" />
            <stop offset="55%" stopColor="#efb98e" />
            <stop offset="100%" stopColor="#bd795d" />
          </linearGradient>
          <linearGradient id="mascot-hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#30334c" />
            <stop offset="55%" stopColor="#15182b" />
            <stop offset="100%" stopColor="#080b18" />
          </linearGradient>
          <linearGradient id="mascot-jacket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5ee7f5" />
            <stop offset="45%" stopColor="#3379ad" />
            <stop offset="100%" stopColor="#28235f" />
          </linearGradient>
          <linearGradient id="mascot-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6fbff" />
            <stop offset="100%" stopColor="#a7c8d9" />
          </linearGradient>
          <filter id="mascot-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="mascot-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <ellipse cx="170" cy="178" rx="139" ry="143" fill="url(#mascot-halo)" />
        <ellipse cx="170" cy="320" rx="78" ry="13" fill="#000" opacity=".35" filter="url(#mascot-shadow)" />
        <circle cx="170" cy="170" r="123" fill="none" stroke="#83f7f5" strokeOpacity=".13" />
        <circle cx="170" cy="170" r="137" fill="none" stroke="#8b83ff" strokeOpacity=".16" strokeDasharray="2 10" />
        <circle cx="57" cy="99" r="5" fill="#00f2fe" opacity=".8" filter="url(#mascot-glow)" />
        <circle cx="278" cy="228" r="4" fill="#8c7dff" opacity=".9" filter="url(#mascot-glow)" />

        <path d="M93 299c4-52 27-83 77-83s73 31 77 83l-16 16H109l-16-16Z" fill="#10172c" opacity=".8" />
        <path d="M99 305c3-51 28-82 71-82s68 31 71 82l-15 12H114l-15-12Z" fill="url(#mascot-jacket)" stroke="#9af6f6" strokeOpacity=".35" strokeWidth="2" />
        <path d="m145 225 25 38 25-38-10-13h-30l-10 13Z" fill="url(#mascot-shirt)" />
        <path d="m170 263-13 54h26l-13-54Z" fill="#14243e" opacity=".85" />
        <path d="M130 251c-9 12-17 31-21 54M210 251c9 12 17 31 21 54" fill="none" stroke="#a9ffff" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />

        <path d="M124 132c0-34 20-58 48-58s48 24 48 58v52c0 38-22 62-48 62s-48-24-48-62v-52Z" fill="url(#mascot-skin)" stroke="#ffe9d7" strokeOpacity=".45" strokeWidth="2" />
        <path d="M122 145c-12-51 9-91 49-95 30-3 53 18 56 53 3 22-4 36-9 45l-9-30c-22-1-42-10-56-25-5 18-16 31-29 39l-2 17Z" fill="url(#mascot-hair)" />
        <path d="M125 133c-13 2-18 13-15 25 2 9 8 13 15 12M216 133c13 2 18 13 15 25-2 9-8 13-15 12" fill="url(#mascot-skin)" />
        <path d="M139 154c7-6 16-6 23-1M178 153c7-5 16-5 23 1" fill="none" stroke="#704b43" strokeWidth="4" strokeLinecap="round" />
        <g className="auth-mascot__eyes">
          <ellipse cx="151" cy="166" rx="4.5" ry="7" fill="#202239" />
          <ellipse cx="191" cy="166" rx="4.5" ry="7" fill="#202239" />
          <circle cx="152.5" cy="163.5" r="1.5" fill="#fff" />
          <circle cx="192.5" cy="163.5" r="1.5" fill="#fff" />
        </g>
        <path d="M161 187c5 4 13 4 18 0" fill="none" stroke="#9d5d54" strokeWidth="3" strokeLinecap="round" />
        <path d="M141 183c4 4 10 4 14 0M184 183c4 4 10 4 14 0" fill="none" stroke="#e58e7b" strokeOpacity=".7" strokeWidth="5" strokeLinecap="round" />

        <g className="auth-mascot__arms">
          <path d="M105 257c-18-12-29-27-31-43-1-9 4-15 11-14 7 1 9 9 11 16 3 9 9 15 19 21l12 9-22 11Z" fill="url(#mascot-skin)" stroke="#ffd9c1" strokeOpacity=".5" strokeWidth="2" />
          <path d="M235 257c18-12 29-27 31-43 1-9-4-15-11-14-7 1-9 9-11 16-3 9-9 15-19 21l-12 9 22 11Z" fill="url(#mascot-skin)" stroke="#ffd9c1" strokeOpacity=".5" strokeWidth="2" />
          <circle cx="88" cy="200" r="11" fill="url(#mascot-skin)" />
          <circle cx="252" cy="200" r="11" fill="url(#mascot-skin)" />
        </g>
        <path d="M131 292c11 8 24 12 39 12s28-4 39-12" fill="none" stroke="#b4fbf2" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="auth-mascot__spark auth-mascot__spark--one" />
      <span className="auth-mascot__spark auth-mascot__spark--two" />
    </motion.div>
  );
}

export default function LoginExperience() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);
  const [configWarning, setConfigWarning] = useState("");

  useEffect(() => {
    setRememberMe(window.localStorage.getItem("hr-auth-remember") !== "false");
    try {
      const supabase = getSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data, error: sessionError }) => {
        if (sessionError) setError(sessionError.message);
        if (data.session?.user.email) setAuthenticatedEmail(data.session.user.email);
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthenticatedEmail(session?.user.email ?? null);
      });
      return () => data.subscription.unsubscribe();
    } catch (caught) {
      setConfigWarning(caught instanceof Error ? caught.message : "Customer sign-in is not configured yet.");
    }
  }, []);

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      if (mode === "forgot") {
        if (!email.trim()) throw new Error("Enter your email address first.");
        const supabase = getSupabaseBrowserClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: appRedirect("/reset-password/"),
        });
        if (resetError) throw resetError;
        setNotice("Password reset link sent. Check your email inbox.");
        return;
      }

      if (mode === "register") {
        if (name.trim().length < 2) throw new Error("Enter your full name.");
        if (password !== confirmPassword) throw new Error("Your passwords do not match.");
      }
      if (password.length < 8) throw new Error("Use a password with at least 8 characters.");

      setAuthRememberPreference(rememberMe);
      const supabase = getSupabaseBrowserClient();

      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: appRedirect("/login/"),
          },
        });
        if (signUpError) throw signUpError;
        if (data.session?.user.email) {
          setAuthenticatedEmail(data.session.user.email);
          setNotice("Your account is ready. You are signed in.");
        } else {
          setNotice("Account created. Check your email to verify your address, then sign in.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signInError) throw signInError;
        setAuthenticatedEmail(data.user.email ?? email);
        setNotice("Signed in successfully. Your session is active.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      setAuthRememberPreference(rememberMe);
      const supabase = getSupabaseBrowserClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: appRedirect("/login/"),
          queryParams: { prompt: "select_account" },
        },
      });
      if (oauthError) throw oauthError;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Google sign-in could not be started.");
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await getSupabaseBrowserClient().auth.signOut();
      if (signOutError) throw signOutError;
      setAuthenticatedEmail(null);
      setNotice("You have been signed out.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign out.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page relative isolate min-h-[calc(100svh-80px)] overflow-hidden px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="auth-ambient auth-ambient--cyan" aria-hidden="true" />
      <div className="auth-ambient auth-ambient--violet" aria-hidden="true" />
      <div className="auth-grid absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-7 lg:grid-cols-[minmax(0,.88fr)_minmax(390px,1fr)] lg:gap-14">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="auth-intro order-2 text-center lg:order-1 lg:text-left"
        >
          <div className="auth-intro__eyebrow"><span /> INDEPENDENT CUSTOMER STORE</div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.8rem]">
            Welcome to <span className="auth-title-gradient">HARI RAM</span>
            <span className="block text-white/75">AWPL Store</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300/65 lg:mx-0">
            Sign in to manage your customer account. Browse the product catalogue without signing in.
          </p>
          <Character passwordFocus={passwordFocus} />
          <div className="auth-trust-row">
            <span><ShieldCheck size={14} aria-hidden="true" /> Secure account access</span>
            <span><LockKeyhole size={13} aria-hidden="true" /> Protected by Supabase Auth</span>
          </div>
          <Link href="/" className="auth-back-link">← Continue browsing the catalogue</Link>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="auth-ring-frame order-1 mx-auto w-full max-w-[470px] lg:order-2"
          aria-label="Customer account access"
        >
          <div className="auth-ring-frame__spin" aria-hidden="true" />
          <div className="auth-glass-card">
            {authenticatedEmail ? (
              <div className="py-7 text-center">
                <span className="auth-success-mark"><CheckCircle2 size={28} aria-hidden="true" /></span>
                <p className="auth-kicker mt-5">ACCOUNT CONNECTED</p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">You're signed in</h2>
                <p className="mt-2 break-all text-sm text-slate-300/65">{authenticatedEmail}</p>
                <p className="mt-4 text-xs leading-5 text-slate-300/55">Your account session is active in this browser.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/" className="liquid-button auth-action">Browse catalogue <ArrowRight size={16} /></Link>
                  <button type="button" onClick={signOut} disabled={busy} className="auth-secondary-button">{busy ? "Signing out…" : "Sign out"}</button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <div className="auth-brand-icon"><ShieldCheck size={23} aria-hidden="true" /></div>
                  <p className="auth-kicker mt-3">HARI RAM · CUSTOMER ACCOUNT</p>
                  <h2 className="mt-2 text-[1.7rem] font-extrabold tracking-tight text-white">
                    {mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password"}
                  </h2>
                  <p className="mt-1.5 text-xs leading-5 text-slate-300/55">
                    {mode === "login" ? "Sign in to access your customer account." : mode === "register" ? "A few details to get your account started." : "We'll email you a secure password reset link."}
                  </p>
                </div>

                {mode !== "forgot" && (
                  <button type="button" onClick={signInWithGoogle} disabled={busy} className="auth-google-button">
                    <GoogleMark /> <span>Continue with Google</span>
                  </button>
                )}

                {mode !== "forgot" && <div className="auth-divider"><span>OR CONTINUE WITH EMAIL</span></div>}

                <form onSubmit={submit} className="space-y-4" noValidate={false}>
                  <AnimatePresence initial={false}>
                    {mode === "register" && (
                      <motion.label
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="auth-field-label"
                      >
                        Full name
                        <span className="auth-input-wrap"><UserRound size={17} aria-hidden="true" /><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" /></span>
                      </motion.label>
                    )}
                  </AnimatePresence>

                  <label className="auth-field-label">
                    Email address
                    <span className="auth-input-wrap"><Mail size={17} aria-hidden="true" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={254} placeholder="name@example.com" /></span>
                  </label>

                  {mode !== "forgot" && (
                    <label className="auth-field-label">
                      Password
                      <span className="auth-input-wrap">
                        <KeyRound size={17} aria-hidden="true" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)} autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={8} placeholder="At least 8 characters" />
                        <button type="button" className="auth-eye-button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                      </span>
                    </label>
                  )}

                  {mode === "register" && (
                    <label className="auth-field-label">
                      Confirm password
                      <span className="auth-input-wrap">
                        <LockKeyhole size={17} aria-hidden="true" />
                        <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)} autoComplete="new-password" required minLength={8} placeholder="Enter password again" />
                      </span>
                    </label>
                  )}

                  {mode === "login" && (
                    <div className="flex items-center justify-between gap-3 pt-0.5 text-xs">
                      <label className="flex cursor-pointer items-center gap-2 text-slate-300/65">
                        <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="auth-checkbox" />
                        Remember me
                      </label>
                      <button type="button" onClick={() => selectMode("forgot")} className="font-semibold text-cyan-200 transition-colors hover:text-white">Forgot password?</button>
                    </div>
                  )}

                  {mode === "forgot" && <p className="text-[11px] leading-5 text-slate-300/55">Enter the email address used for your account. The reset link will open a secure password update page.</p>}

                  {configWarning && <p className="auth-config-note" role="status">{configWarning}</p>}
                  {error && <p className="auth-error" role="alert">{error}</p>}
                  {notice && <p className="auth-notice" role="status">{notice}</p>}

                  <button type="submit" disabled={busy} className="liquid-button auth-action mt-2">
                    {busy ? <><span className="auth-spinner" /> Please wait…</> : <>{mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"} <ArrowRight size={16} /></>}
                  </button>
                </form>

                <div className="auth-switcher">
                  {mode === "forgot" ? (
                    <button type="button" onClick={() => selectMode("login")}>← Back to sign in</button>
                  ) : mode === "login" ? (
                    <>Don't have an account? <button type="button" onClick={() => selectMode("register")}>Register now</button></>
                  ) : (
                    <>Already registered? <button type="button" onClick={() => selectMode("login")}>Sign in</button></>
                  )}
                </div>
                <p className="auth-privacy-note">Independent storefront. Your password is handled by Supabase Authentication, not stored by this website.</p>
              </>
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
