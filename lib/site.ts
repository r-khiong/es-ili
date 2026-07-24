// Single source for the public site URL. PjM sets NEXT_PUBLIC_SITE_URL on
// Netlify + .env.local; flip it to https://r-khiong.com at Track A cutover and
// the landing chip follows automatically — no code change needed. Falls back to
// the current live URL so the landing never breaks if the env var is unset
// (NEXT_PUBLIC_* is build-time inlined; see CLAUDE.md §8.10).
const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://r-khiong-rsvp.netlify.app";

export const SITE_URL = raw;
export const SITE_HOST = raw.replace(/^https?:\/\//, "");
