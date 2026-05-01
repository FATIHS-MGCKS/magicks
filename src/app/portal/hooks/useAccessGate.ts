/**
 * useAccessGate — Supabase Magic-Link auth.
 *
 * Flow:
 *   1. User enters their e-mail. We call `signInWithOtp({ email })`.
 *   2. Supabase sends a one-time login link to that mailbox.
 *   3. User clicks the link → Supabase redirects back to /portal with
 *      a session token in the URL hash, which the SDK exchanges for a
 *      persistent session (PKCE).
 *   4. `onAuthStateChange` fires → status flips to "unlocked".
 *
 * Only the email defined in `PORTAL_OWNER_EMAIL` (mirrored in the
 * Supabase RLS policy) can actually read/write portal data — even if
 * someone else somehow obtained a magic link, they would receive 0
 * rows from every query and 0 writes would land.
 */
import { useCallback, useEffect, useState } from "react";
import {
  PORTAL_OWNER_EMAIL,
  getSupabase,
  magicLinkRedirectUrl,
  supabaseConfigured,
} from "../data/supabase";
import { resetHydration } from "../data/store";

type Status = "checking" | "locked" | "unlocked" | "unconfigured";

export interface AccessGateApi {
  status: Status;
  unlocked: boolean;
  unconfigured: boolean;
  /** Email currently authenticated, if any. */
  email: string | null;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  sendMagicLink: (
    email: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  lock: () => Promise<void>;
}

export function useAccessGate(): AccessGateApi {
  const [status, setStatus] = useState<Status>(
    supabaseConfigured ? "checking" : "unconfigured",
  );
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) {
      setStatus("unconfigured");
      return;
    }
    let cancelled = false;
    const supabase = getSupabase();

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session?.user?.email) {
        setEmail(data.session.user.email);
        setStatus("unlocked");
      } else {
        setStatus("locked");
      }
    })();

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user?.email) {
        setEmail(session.user.email);
        setStatus("unlocked");
      } else {
        setEmail(null);
        setStatus("locked");
      }
    });

    return () => {
      cancelled = true;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (
      input: string,
      password: string,
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      const trimmed = input.trim().toLowerCase();
      if (!trimmed.includes("@")) {
        return { ok: false, error: "Bitte gültige E-Mail-Adresse eingeben." };
      }
      if (trimmed !== PORTAL_OWNER_EMAIL.toLowerCase()) {
        return {
          ok: false,
          error: "Diese E-Mail-Adresse ist für das Portal nicht freigegeben.",
        };
      }
      if (password.length === 0) {
        return { ok: false, error: "Bitte Passwort eingeben." };
      }
      if (!supabaseConfigured) {
        return { ok: false, error: "Supabase ist nicht konfiguriert." };
      }
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      if (error) {
        const friendly =
          error.message === "Invalid login credentials"
            ? "E-Mail oder Passwort falsch."
            : error.message;
        return { ok: false, error: friendly };
      }
      return { ok: true };
    },
    [],
  );

  const sendMagicLink = useCallback(
    async (
      input: string,
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      const trimmed = input.trim().toLowerCase();
      if (!trimmed.includes("@")) {
        return { ok: false, error: "Bitte gültige E-Mail-Adresse eingeben." };
      }
      if (trimmed !== PORTAL_OWNER_EMAIL.toLowerCase()) {
        return {
          ok: false,
          error: "Diese E-Mail-Adresse ist für das Portal nicht freigegeben.",
        };
      }
      if (!supabaseConfigured) {
        return { ok: false, error: "Supabase ist nicht konfiguriert." };
      }
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: magicLinkRedirectUrl(),
          shouldCreateUser: true,
        },
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      return { ok: true };
    },
    [],
  );

  const lock = useCallback(async () => {
    if (!supabaseConfigured) return;
    try {
      await getSupabase().auth.signOut();
    } catch {
      // even if signOut fails (network), we still want the UI to lock
    }
    resetHydration();
    setStatus("locked");
    setEmail(null);
  }, []);

  return {
    status,
    unlocked: status === "unlocked",
    unconfigured: status === "unconfigured",
    email,
    signIn,
    sendMagicLink,
    lock,
  };
}
