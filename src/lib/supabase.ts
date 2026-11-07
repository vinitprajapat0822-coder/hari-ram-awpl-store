"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type StorageMode = "local" | "session";

let browserClient: SupabaseClient | null = null;
let browserClientMode: StorageMode | null = null;

function getStorageMode(): StorageMode {
  return window.localStorage.getItem("hr-auth-remember") === "false"
    ? "session"
    : "local";
}

/**
 * Choose whether this browser session survives a browser restart.
 * The preference itself is non-sensitive; Supabase stores the auth session
 * in localStorage or sessionStorage according to this choice.
 */
export function setAuthRememberPreference(rememberMe: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("hr-auth-remember", rememberMe ? "true" : "false");
  browserClient = null;
  browserClientMode = null;
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Authentication is available only in the browser.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Customer sign-in is not configured yet. The store owner must connect the Supabase project."
    );
  }

  const mode = getStorageMode();
  if (!browserClient || browserClientMode !== mode) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: mode === "local" ? window.localStorage : window.sessionStorage,
      },
    });
    browserClientMode = mode;
  }

  return browserClient;
}
