/**
 * Supabase client used by the portal layer.
 *
 * The portal is gated behind a single allowed e-mail (defined as the
 * RLS policy in `supabase/schema.sql`). Public-site code never imports
 * from this file, so the bundle of the public homepage stays free of
 * the Supabase SDK — Vite splits it into the lazy portal chunk.
 *
 * Two env vars are required at build time:
 *   VITE_SUPABASE_URL        e.g. https://xxxxxxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY   the project's *public* anon key
 *
 * The anon key is safe to ship in the client bundle — it grants only
 * the rights that the RLS policies allow. It is NOT the service-role
 * key (which must NEVER reach the browser).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

if (supabaseConfigured) {
  client = createClient(url as string, anonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "magicks-portal-auth",
    },
  });
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase ist nicht konfiguriert. VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen gesetzt sein.",
    );
  }
  return client;
}

/** The ONE allowed portal user. Mirrors the RLS allowlist in schema.sql. */
export const PORTAL_OWNER_EMAIL = "hello@magicks.de";

/**
 * Where Supabase should redirect the magic-link callback. Same origin
 * as the portal so the cookie/storage is in the right place.
 */
export function magicLinkRedirectUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/portal`;
}
