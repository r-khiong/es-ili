import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

// Browser client for Client Components that need the signed-in session
// (admin login). Session-aware: it reads/writes Supabase auth cookies and sends
// the user's JWT once signed in, so requests run as `authenticated`.
//
// Public flows must NOT use this — see ./anon-client.ts.
export const supabase = createBrowserClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
