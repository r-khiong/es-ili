# Changelog

All notable changes to this project are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions are **delivery
milestones**, defined in [`docs/PRD.md`](docs/PRD.md) §6 — not semantic versions. This project makes
no external API compatibility promise, so a milestone name carries more information than a number
would.

Entries describe **what changed in the product**. Reasoning behind each choice lives in
[`docs/decision-log.md`](docs/decision-log.md); ticket status lives in Jira.

---

## [Unreleased] — M4 Visibility

Making the product legible to a first-time visitor: the root landing, a read-only admin demo, and
product documentation in the repo.

### Added

- Root story landing at `/` — problem, core flow, key decisions, and the artifact chain on one page,
  replacing the previous redirect to `/register`
- Read-only admin demo — a one-click entry into the real admin UI with seeded data, writes denied at
  the RLS layer rather than hidden in the UI
- Product documentation in the repo: `docs/PRD.md`, `docs/decision-log.md`
- Brand assets in `public/brand/`, with the font stack consolidated to four families
- `lib/site.ts` and `lib/event.ts` as single sources for the base URL and event metadata

### Changed

- `/register` rebuilt as a v9 dark single-column form (previously a light split screen)
- `/status/[token]` rebuilt with a save-link box, a three-step timeline, and a copy button
- Brand position reworked: the product is **és'ilî**, with its own accent, type stack, and surface
  palette in place of shadcn defaults. Repository renamed to `r-khiong/es-ili`

### Fixed

- Registration submitted as `anon` instead of inheriting an admin session, and error codes surfaced
  in the UI. A browser that had opened the admin console was hitting `42501` on `/register` while
  anonymous visitors were unaffected — hidden for 12 days by generic error copy
- Landing nav logo returns to the top of the page, honouring `prefers-reduced-motion`. The v9
  landing shipped the monogram as a static mark, leaving a visitor who reached the footer no
  way back up

---

## [m3-ship] — 2026-07-10

First public release. Production deploy, public repository, complete README.

### Added

- Netlify production deployment, git-linked: merging `main` publishes
- Public repository with a README covering the problem, tech stack, live demo URL, local setup, and
  the decision log
- Node 22 pinned via `.nvmrc`

### Changed

- Application metadata (title, description) set for shared links

---

## [m2-recovery] — 2026-07-07

Recovery of the three MVP user stories after M1 closed unfinished, plus the security hardening that
came out of it.

### Added

- **Attendee registration** (RSVP-3) — form with inline validation, submitted to Supabase with a
  `nanoid` token, redirecting to a private status page
- **Organizer console** (RSVP-4) — Supabase Auth login, registrations table, status filter, and
  batch approve/reject through a Server Action
- **Status page with QR code** (RSVP-5) — the QR encodes the full `/status/{token}` URL, so any phone
  camera opens it and a future scanner reuses the same address
- Organizer login entry point on the register page
- Direct link from an approved admin row to that registration's status page

### Changed

- **Check-in (RSVP-6) moved to Phase 2.** The end-to-end story (register → review → status/QR) is
  complete without it, and the QR already carries the token a scanner would need

### Fixed

- **Token-scoped reads close a PII hole.** The status page no longer reads `registrations` directly.
  A `SECURITY DEFINER` RPC returns only the matching row and anonymous `SELECT` on the table is
  revoked — previously the public key could have dumped the whole list
- Status RPC granted to `authenticated` as well as `anon`. A signed-in admin opening a status page
  was getting `42501` swallowed as a 404; grants are per-role and both roles use that page
- Admin table frame stabilised: client-side status filtering, a reserved scrollbar gutter, and fixed
  column widths, so filtering no longer shifts the layout

---

## [m1-build] — 2026-05-20

**Closed unfinished at 0 of 4 stories shipped.** A pre-scheduled trip (5/23–5/31) interrupted the
sprint. The dates were not extended retroactively — that would have distorted velocity — so the
sprint closed honestly and the work carried into m2-recovery.

### Added

- Registration form: native HTML first, then migrated onto shadcn/ui
- Validation with zod plus react-hook-form, with inline feedback and submission states
- Supabase client, generated database types, and `nanoid` token generation
- Minimal status page with token lookup
- `CLAUDE.md` ground rules for the PM × AI working model

---

## [m0-discovery] — 2026-05-08

Problem definition, PRD, user flow, Jira backlog, environment, and the first push.
