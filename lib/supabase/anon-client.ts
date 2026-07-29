import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

// Client for PUBLIC flows that must always talk to Postgres as the `anon` role.
//
// Do NOT replace this with `createBrowserClient` from @supabase/ssr (see
// ./client.ts). That helper reads the Supabase session out of cookies and swaps
// the `Authorization` header from the publishable key to the signed-in user's
// JWT — which makes the same page hit Postgres as `authenticated` instead of
// `anon`. Grants are per-role: `authenticated` has never been granted
// `SELECT ON events` or `INSERT ON registrations`, so a visitor who happens to
// have an admin session gets 42501 permission denied on the public register
// form while an anonymous visitor succeeds.
//
// Disabling session persistence keeps this client stateless: it never reads or
// writes cookies/localStorage, so every request carries only the publishable
// key and therefore always resolves to `anon`.
export const anonSupabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
