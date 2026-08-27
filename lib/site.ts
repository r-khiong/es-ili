// Single source for the public site URL. The PM sets NEXT_PUBLIC_SITE_URL on
// Netlify and in .env.local; every surface that prints or encodes the URL reads
// it from here, so adding a custom domain later needs no code change. Falls back
// to the live URL so nothing breaks if the env var is unset (NEXT_PUBLIC_* is
// build-time inlined, so changing it requires a redeploy — see CLAUDE.md §8.10).
//
// The Netlify subdomain keeps the word "rsvp" while the product is called
// és'ilî. That is a deliberate, recorded decision, not an unfinished rename:
// renaming a Netlify site does not redirect its old URL, and this one has
// already been distributed. Do not rename it. See docs/decision-log.md.
const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://r-khiong-rsvp.netlify.app";

export const SITE_URL = raw;
export const SITE_HOST = raw.replace(/^https?:\/\//, "");
