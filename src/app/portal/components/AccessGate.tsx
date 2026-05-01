/**
 * Two-stage gate that wraps the portal:
 *
 *   1. AUTH stage — magic-link login via Supabase. The owner enters
 *      their e-mail, receives a one-time link, returns to /portal
 *      authenticated. RLS policies ensure only the allowed email can
 *      ever read or write portal data.
 *   2. HYDRATION stage — pulls the canonical snapshot from
 *      `portal_state` so all in-memory caches are populated before
 *      any page renders.
 */
import { useEffect, useState, type ReactNode } from "react";
import { useAccessGate } from "../hooks/useAccessGate";
import { hydrateFromServer, isHydrated } from "../data/store";
import { PORTAL_OWNER_EMAIL } from "../data/supabase";

interface AccessGateProps {
  children: ReactNode;
}

function FullScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5">
      {children}
    </div>
  );
}

export function AccessGate({ children }: AccessGateProps) {
  const gate = useAccessGate();

  if (gate.status === "checking") {
    return (
      <FullScreen>
        <div className="text-[12.5px] uppercase tracking-[0.16em] text-white/40">
          Lade Portal…
        </div>
      </FullScreen>
    );
  }

  if (gate.status === "unconfigured") {
    return (
      <FullScreen>
        <div className="w-full max-w-md rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-7 text-amber-100/85">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-amber-200/70">
            MAGICKS · Portal
          </div>
          <h1 className="mt-1 font-instrument text-3xl text-amber-100">
            Noch nicht konfiguriert
          </h1>
          <p className="mt-3 text-sm leading-relaxed">
            Es fehlen die Supabase-Zugangsdaten:{" "}
            <code className="font-mono">VITE_SUPABASE_URL</code> und{" "}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-amber-100/70">
            Beide Werte aus dem Supabase-Dashboard (Project Settings →
            API) in <code className="font-mono">.env</code> bzw. die
            Hostinger-Build-Variablen eintragen und Build neu auslösen.
          </p>
        </div>
      </FullScreen>
    );
  }

  if (gate.status === "locked") {
    return <LoginForm onSignIn={gate.signIn} onSendLink={gate.sendMagicLink} />;
  }

  return <HydrationGate>{children}</HydrationGate>;
}

interface LoginFormProps {
  onSignIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  onSendLink: (
    email: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
}

type Mode = "password" | "magic";

function LoginForm({ onSignIn, onSendLink }: LoginFormProps) {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState(PORTAL_OWNER_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const submitPassword = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await onSignIn(email, password);
    setBusy(false);
    if (!result.ok) setError(result.error);
  };

  const submitMagicLink = async () => {
    if (busy || email.length === 0) return;
    setBusy(true);
    setError(null);
    const result = await onSendLink(email);
    setBusy(false);
    if (!result.ok) setError(result.error);
    else setLinkSent(true);
  };

  if (mode === "magic" && linkSent) {
    return (
      <FullScreen>
        <div className="w-full max-w-sm rounded-2xl border border-emerald-300/20 bg-[#0F0F11] p-7 text-emerald-100/90">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-emerald-200/70">
            MAGICKS · Portal
          </div>
          <h1 className="mt-1 font-instrument text-3xl text-white">
            Link verschickt
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Wir haben einen Login-Link an{" "}
            <strong className="text-white">{email}</strong> gesendet.
            Öffne ihn auf diesem Gerät, um das Portal zu betreten.
          </p>
          <p className="mt-3 text-[11.5px] text-white/45">
            Der Link ist 60 Minuten gültig. Bei Mail-Verzögerungen den
            Spam-Ordner prüfen oder zurück zum Passwort-Login.
          </p>
          <button
            type="button"
            onClick={() => {
              setLinkSent(false);
              setMode("password");
              setError(null);
            }}
            className="mt-5 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[12.5px] text-white/70 transition hover:text-white"
          >
            Zurück zum Passwort-Login
          </button>
        </div>
      </FullScreen>
    );
  }

  return (
    <FullScreen>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "password") void submitPassword();
          else void submitMagicLink();
        }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F0F11] p-7"
      >
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
          MAGICKS · Internes Portal
        </div>
        <h1 className="mt-1 font-instrument text-3xl text-white">Zugang</h1>
        <p className="mt-2 text-sm text-white/55">
          {mode === "password"
            ? "Mit E-Mail und Passwort anmelden."
            : "Einmalig anstelle des Passworts: Magic-Link per Mail."}
        </p>

        <label className="mt-6 block text-[11px] uppercase tracking-[0.14em] text-white/50">
          E-Mail
        </label>
        <input
          type="email"
          autoFocus={mode === "magic"}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[14px] text-white outline-none transition focus:border-white/30"
        />

        {mode === "password" ? (
          <>
            <label className="mt-4 block text-[11px] uppercase tracking-[0.14em] text-white/50">
              Passwort
            </label>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[14px] text-white outline-none transition focus:border-white/30"
            />
          </>
        ) : null}

        {error ? (
          <div className="mt-3 text-[12.5px] text-rose-300/90">{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={
            busy ||
            email.length === 0 ||
            (mode === "password" && password.length === 0)
          }
          className="mt-5 w-full rounded-md border border-white/15 bg-white/95 px-3 py-2 text-[13px] font-medium text-black transition hover:bg-white disabled:opacity-50"
        >
          {busy
            ? mode === "password"
              ? "Prüfe…"
              : "Sende Link…"
            : mode === "password"
              ? "Anmelden"
              : "Magic-Link senden"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "password" ? "magic" : "password"));
            setError(null);
          }}
          className="mt-3 w-full text-center text-[11.5px] text-white/45 transition hover:text-white/75"
        >
          {mode === "password"
            ? "Passwort vergessen? Magic-Link senden"
            : "Zurück zum Passwort-Login"}
        </button>

        <p className="mt-5 text-[10.5px] leading-relaxed text-white/35">
          Daten liegen verschlüsselt in Supabase Postgres mit täglichen
          Backups. Sitzung bleibt aktiv, bis explizit gesperrt wird.
        </p>
      </form>
    </FullScreen>
  );
}

interface HydrationGateProps {
  children: ReactNode;
}

function HydrationGate({ children }: HydrationGateProps) {
  const [state, setState] = useState<"loading" | "ready" | "error">(
    isHydrated() ? "ready" : "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated()) {
      setState("ready");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await hydrateFromServer();
        if (!cancelled) setState("ready");
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Daten konnten nicht geladen werden.",
        );
        setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <FullScreen>
        <div className="text-[12.5px] uppercase tracking-[0.16em] text-white/40">
          Lade Daten…
        </div>
      </FullScreen>
    );
  }

  if (state === "error") {
    return (
      <FullScreen>
        <div className="w-full max-w-sm rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-7 text-rose-100/85">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-rose-200/70">
            Fehler
          </div>
          <h2 className="mt-1 font-instrument text-2xl text-rose-100">
            Portal-Daten konnten nicht geladen werden
          </h2>
          <p className="mt-3 text-sm leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md border border-rose-300/30 bg-rose-300/[0.08] px-3 py-1.5 text-[12.5px] text-rose-100/95 transition hover:bg-rose-300/[0.14]"
          >
            Neu versuchen
          </button>
        </div>
      </FullScreen>
    );
  }

  return <>{children}</>;
}
