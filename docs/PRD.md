# RSVP — Product Requirements Document (Phase 1 MVP)

> **Author:** Renata Jiang (r.khiong)
> **Created:** 2026-04-16 · **Last updated:** 2026-07-28
> **Status:** Active
> **Version:** 0.5 (supersedes v0.4 / v0.3 / v0.2 / v0.1)

> **What changed in v0.5 (see full changelog §9):** **RSVP-7 realigned to Jira** — the key now
> carries **Email Notifications** (Phase 1), and the former *RSVP-7 Story Landing* story is
> **removed as superseded**: the landing is a non-story track (descriptive branch), not a user
> story (decision 2026-07-22). **RSVP-8 marked Done.** Email moved out of Non-Goals and out of
> the Phase 2 backlog accordingly (SMS stays deferred).

---

## 1. Overview

### Problem Statement

Event organizers managing 50+ attendees still default to Google Forms plus manual email follow-up for registration and approval. This workflow creates several pain points:

- No centralized view of registration status (pending / approved / rejected)
- Manual email communication for approval results is time-consuming and error-prone
- No standardized check-in method — organizers resort to printed lists or manual name-checks
- Attendees have no self-serve way to check their application status

### Product Summary

RSVP is a lightweight event registration and guest-management tool. Organizers collect applications, review and approve/reject attendees in batch, and verify attendees on-site — replacing the fragmented Google Form + email + spreadsheet workflow with a single streamlined system.

### Portfolio Layer (added in v0.4)

This repo also serves as a PM portfolio artifact. Its primary reviewer persona (hiring managers / interviewers) could not previously see the product's core value — the admin workflow and the decision trail — from the public URL. A **visibility layer** was added for that persona without changing the product itself: **RSVP-8** (read-only admin demo) plus the **root landing** — the latter tracked as a non-story descriptive branch rather than a user story (decision 2026-07-22; see §9).

---

## 2. Goals & Non-Goals

### Goals (Phase 1 MVP)

| # | Goal | Success Criteria | Status |
|---|------|-----------------|--------|
| G1 | Attendees can submit a registration form | Submission completes without errors; duplicate email is blocked | ✅ Shipped |
| G2 | Organizers can review and approve/reject in batch | Organizer can process 50+ registrations in under 5 minutes | ✅ Shipped |
| G3 | Approved attendees receive a unique QR code | QR renders on the status page immediately after approval | ✅ Shipped |
| G4 | Organizers can verify and check in attendees on-site | Organizer can mark an approved attendee as checked-in from the admin view | ↪ Moved to Phase 2 (2026-07-07); QR verification-ready state shipped via RSVP-5 |
| G5 *(v0.4)* | Reviewers can grasp the product and its decision trail from one URL | A non-technical reader states the product's purpose + two key decisions within 3 minutes; admin workflow visible without requesting credentials | 🔄 In progress — RSVP-8 ✅ Done; root landing on the non-story track (§9) |
| G6 *(v0.5)* | Attendees learn the review outcome without polling the status page | An approved / rejected attendee receives an email carrying the decision and their status-page link | 🔜 RSVP-7 |

### Non-Goals (Phase 1)

| Item | Rationale |
|------|-----------|
| Business card file upload | Dropped from MVP (v0.3) — no storage/RLS overhead; reconsider in Phase 2 if a real need surfaces |
| Camera-based QR scanner | On-site verification deferred with RSVP-6 to Phase 2; QR already encodes the token status URL, so the scanner reuses it without backend changes |
| ~~Email notifications~~ *(promoted in v0.5)* | **No longer a Non-Goal** — promoted into Phase 1 as **RSVP-7** (§4). The Gmail-SMTP-over-Resend assessment made before the original deferral carries forward |
| SMS notifications | Still deferred to Phase 2 — needs a paid gateway and per-country number handling; email covers the notification need for this audience |
| Per-record notification resend | *(v0.5)* Deferred to **Phase 1.5** per RSVP-7 trade-off (b): a failed send is logged only, with no operator-facing retry in this version |
| Automated filtering rules | MVP uses manual review; rule-based filtering needs a TA-definition UI; Phase 2 |
| Free-text search in dashboard | Status filter is sufficient for MVP; keyword search deferred to Phase 2 |
| Pagination in dashboard | *(realigned in v0.4)* Not built in MVP — dataset is small; select-all scopes to the rendered page. Pagination (50/page) moves to Phase 2 with search |
| Interactive demo sandbox *(v0.4)* | Read-only demo + workflow GIF delivers ~80% of reviewer value at ~1/3 cost with zero data-pollution risk; sandbox with data reset is Phase 2, gated on interview feedback |
| Calendar integration | Nice-to-have, not critical to the registration-to-check-in flow |
| Multi-event UI | Schema is multi-event ready; a single event is seeded; multi-event UI deferred |
| Attendee account system | Attendees access status via a unique token URL — no login |
| Story-page analytics / SEO | Out of scope per project-level exclusions (CLAUDE.md §8.9) |

---

## 3. User Personas

### Organizer
| Attribute | Description |
|-----------|-------------|
| Who | Event host (marketing team, community manager, event-agency PM) |
| Goal | Manage the guest list: review applications, control entry, verify attendance on-site |
| Current Solution | Google Form → spreadsheet → manual email → printed list for check-in |
| Pain Points | No batch approval; no real-time status; manual, error-prone check-in |

### Attendee
| Attribute | Description |
|-----------|-------------|
| Who | Professional or community member who wants to attend |
| Goal | Apply, know whether approved, get proof of entry |
| Current Solution | Fill Google Form → wait for email → may miss it / not know the timeline |
| Pain Points | No visibility into status; no standardized entry confirmation |

### Reviewer *(added in v0.4)*
| Attribute | Description |
|-----------|-------------|
| Who | Hiring manager / interviewer reviewing this repo as a portfolio piece |
| Goal | Judge the author's PM judgment (scope, trade-offs, delivery) in minutes |
| Current Solution | Opens the live URL → sees only a registration form; admin flow and decision docs invisible |
| Pain Points | No credentials for the admin side; decisions buried in commit history and external docs |

---

## 4. User Stories & Acceptance Criteria

> Jira keys in parentheses map each story to the live board. AC blocks here are the
> source of truth; the paste-ready Jira versions are in §10.

### RSVP-3 — Registration Form (Attendee)

> **As an** Attendee, **I want to** fill out a registration form, **so that** I can apply to attend the event.

**Acceptance Criteria**
- Form contains: Full Name (required), Email (required), Phone (required), Company / Organization (optional)
- Submission blocked if required fields are empty; inline validation messages shown
- Duplicate email check: if the email already exists for the event, show "This email has already been registered"
- On success, redirect to the Status Page with a persistent unique token URL (`/status/{token}`)
- Status URL shown with the prompt: "Bookmark this page to check your application status"

**Status:** ✅ Done — built, RLS hardened (token-scoped RPC), deployed live.

---

### RSVP-4 — Review & Batch Approval (Organizer)

> **As an** Organizer, **I want to** review all registrations and approve or reject applicants in batch, **so that** I can efficiently manage event attendance.

**Acceptance Criteria** *(realigned to as-built in v0.4; see decision note below)*
- Organizer accesses `/admin/*` via Supabase Auth (single admin account for MVP; SSO / multi-role → Phase 2)
- Dashboard table columns: Select (checkbox) | Name | Email | Phone | Company | Status | Remark (read-only) — plus a per-row link to the attendee's status page for approved rows (shipped with RSVP-5)
- **Batch-only action model:** multi-select via checkboxes → "Approve Selected" / "Reject Selected" in the toolbar. No per-row Approve/Reject buttons; selecting a single row is the single-row operation (same path)
- "Select All" selects the currently rendered page (table is single-page in MVP — pagination deferred to Phase 2)
- Confirmation dialog before any batch action — e.g., "Approve 12 selected applicants?" — with sonner toast on completion
- Status filter: Pending / Approved / Rejected / All (default All)
- Default sort: submission time, newest first
- Idempotent batch: only rows whose status actually changes are updated; same-status rows are a no-op (no error). Approve/Reject are reversible
- Status changes auto-saved on confirm; no separate "Save" button
- `status_updated_at` is written only on a real status transition (explicit app-level write in the Server Action; no DB trigger)

> **Decision note (2026-06-09 pivot):** v0.3 specified per-row Approve/Reject buttons *plus*
> batch actions. Locked to **batch-only** before implementation: it mirrors how organizers
> actually work (review a batch, decide a batch), keeps one write path, and simplifies the
> state machine. Recorded in `docs/decision-log.md`.

**Out of scope (this story):** full auth (SSO, roles) → Phase 2 · free-text search → Phase 2 · CSV export → Phase 2 · concurrent-edit conflict resolution → Phase 2 · inline Remark editing → Phase 2

**Status:** ✅ Done — batch-only dashboard live behind Supabase Auth; RLS policies + table GRANT applied (migration `20260611000000_rsvp4_admin_access.sql`).

---

### RSVP-5 — Application Status Page + QR Code (Attendee)

> **As an** Attendee, **I want to** check my application status and receive a QR code after approval, **so that** I know whether I'm in and can check in on-site.

**Acceptance Criteria**
- Each attendee has a unique, persistent URL: `/status/{token}` (token = nanoid)
- The page displays one of three attendee-facing states:

| State | Visual | Content |
|-------|--------|---------|
| Pending | Neutral (blue/gray) | "Application Received" · "Your application is under review" · name + submission time |
| Approved | Positive (green) | "You're In!" · QR code shown prominently · "Screenshot or bookmark this page for check-in" |
| Rejected | Muted (gray) | "Application Update" · "Unfortunately, your application was not approved this time" |

- Status reflects the organizer's latest review (on load / refresh)
- QR code is rendered client-side from the attendee's token — no static image
- Mobile-responsive (primary access is mobile)

> Note: `checked_in` is an internal status reserved for Phase 2 check-in; the attendee-facing page treats checked-in as the Approved view.

**Status:** ✅ Done — accepted 2026-07-07. Includes admin-side status links; status RPC granted to both `anon` and `authenticated` (migration `20260707000000_grant_status_rpc_to_authenticated.sql` — see decision log: per-role grant lesson).

---

### RSVP-6 — On-Site Manual Check-in (Organizer)

> **As an** Organizer, **I want to** mark approved attendees as checked-in on-site, **so that** I can verify attendance quickly.

**Status:** ↪ **Moved to Phase 2** (PjM decision 2026-07-07). Rationale: the demo's goal is one core flow shipped end-to-end at 100%; check-in is not required for the reviewer-facing E2E story (register → review → status/QR). The QR already encodes the token status URL, so the future check-in flow (manual or scanner) plugs in without backend changes. AC preserved in §8 backlog for Phase 2 pickup.

---

### RSVP-7 — Email Notifications (Attendee) *(realigned to Jira in v0.5)*

> **As an** Attendee, **I want to** be emailed when my registration is approved or rejected, **so that** I learn the outcome without repeatedly re-opening my status page.

> **Note on this key:** RSVP-7 previously carried a *Story Landing* story in v0.4. That story is
> **removed as superseded** — the root landing is tracked as a non-story descriptive branch, not a
> user story (decision 2026-07-22). Jira is canonical for keys; this PRD follows Jira. See §9.

**Acceptance Criteria** *(⚠️ drafted from the locked trade-offs below — reconcile against the Jira ticket before build)*
- A notification email is sent on a **real status transition** (`pending → approved | rejected`), triggered from the existing write path (the `updateRegistrationsStatus` Server Action). The RSVP-4 idempotency rule governs sending too: a same-status no-op sends nothing
- Email content: event name, the decision, and the attendee's `/status/{token}` link
- **Send state is recorded as a nullable timestamp** on `registrations` (see §5) — the `status` enum is **not** extended, and the RSVP-4 dashboard change stays minimal
- A send failure is **logged server-side only**; the status update still commits. The attendee-facing status page remains the source of truth for the decision
- Reversing a decision (approve → reject or back) is a real transition and therefore sends again
- Transport carries forward the pre-existing assessment: **Gmail SMTP preferred over Resend** (see `docs/decision-log.md`)
- Single-event scope (see trade-off (a))
- **Event information source: `TBD — pending PM decision`** — pending the resolution of how `events` and `lib/event.ts` divide responsibility

**Trade-offs (locked by PjM)**
```
(a) 單一活動 scope —— schema 本身支援 multi-event
    （events 表 + registrations.event_id FK），
    但 UI 與本版功能刻意只涵蓋單一活動。
    Multi-event 管理介面屬 Phase 2。

(b) 無單筆補寄 —— 失敗只 log，補寄能力列 Phase 1.5

(c) 不擴 status enum —— 以 nullable timestamp 表達寄送狀態，
    換取最小 migration 與最小 RSVP-4 dashboard 改動
```

**Out of scope (this story):** per-record resend → Phase 1.5 (trade-off b) · SMS → Phase 2 · send-status column surfaced in the dashboard UI → Phase 2 · multi-event templating → Phase 2 (trade-off a) · registration-received (pre-decision) confirmation email

**Status:** 📋 To Do.

---

### RSVP-8 — Read-only Admin Demo (Reviewer) *(added in v0.4)*

> **As a** Reviewer, **I want** one-click read-only access to the admin dashboard with seeded data, **so that** I can see the review workflow without requesting credentials.

**Acceptance Criteria**
- "Enter Admin Demo" on the story page signs in a dedicated demo user via a Server Action (credentials live only in server-side env) and lands on `/admin/registrations`
- Demo user sees the seeded dataset (7 rows across pending / approved / rejected) and all filters
- Writes are denied **at the RLS layer** for the demo user (restrictive carve-out from the blanket `authenticated` UPDATE policy) — verified by a direct SQL/API write attempt, not only via UI
- Demo session shows a banner: `Demo mode (read-only) — batch actions disabled. Seeded demo data.`; the batch action bar is disabled, not hidden
- Real admin account behavior is unchanged
- Demo credentials never enter the client bundle or the repo

**Out of scope (this story):** interactive writes + data reset (Phase 2 sandbox) · separate demo dataset (reuses `supabase/seed.sql`)

**Status:** ✅ Done — merged 2026-07-14. `signInAsDemo` Server Action (`app/admin/login/actions.ts`), demo banner + disabled batch bar (`app/admin/registrations/page.tsx`), restrictive RLS carve-out (migration `20260711000000_rsvp8_demo_admin_readonly.sql`).

---

## 5. Technical Notes

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (CSS-first, no `tailwind.config.ts`), shadcn/ui
- **Backend / DB:** Supabase (Postgres + Auth + RLS)
- **QR:** `qrcode.react` (client-side generation)
- **Hosting:** Netlify (git-linked continuous deploy)

### Data Model (as-built, v0.4)
```
events
  id                bigint  PK (identity)
  name              text
  created_at        timestamptz

registrations
  id                bigint  PK (identity)
  event_id          bigint  FK → events.id
  name              text          -- v0.3 doc said full_name; as-built column is `name`
  email             text
  phone             text
  company           text  NULL    -- optional
  status            text          -- pending | approved | rejected (checked_in reserved for Phase 2)
  token             text  UNIQUE  -- nanoid
  remark            text  NULL    -- organizer-side note (read-only in UI; inline edit → Phase 2)
  created_at        timestamptz
  status_updated_at timestamptz NULL  -- written only on real status transitions (app-level)
  notified_at       timestamptz NULL  -- RSVP-7 (planned): last successful decision email.
                                      -- NULL = never sent OR last send failed. Send state is
                                      -- carried by this nullable timestamp instead of new
                                      -- status values — see RSVP-7 trade-off (c)

  UNIQUE (event_id, email)
```
> `notified_at` is **specified, not yet built** — it lands with RSVP-7. Column name is provisional
> until the migration is authored.

Status transitions (live): `pending → approved | rejected` (reversible).
Phase 2 adds: `approved → checked_in` + `checked_in_at` column.

### Security Model
- **Public pages** (`/register`, `/status/{token}`) use the **anon** client under RLS:
  insert-only on `registrations`; reads are token-scoped via a `SECURITY DEFINER` RPC with fixed `search_path`. Direct anon `SELECT` on `registrations` is revoked.
- **Admin pages** (`/admin/*`) are gated by a Server Component check of the **Supabase session server-side**; RLS (authenticated-role SELECT/UPDATE policies **plus table-level GRANT** — both are required) is the enforcement layer at the DB boundary.
- Authorization is kept **out of `proxy.ts`** per Next.js 16 guidance (proxy handles the login redirect UX only; RLS is the enforcement boundary).
- **Grants are per-role:** the status RPC is granted to both `anon` and `authenticated` (2026-07-07 lesson: a logged-in admin opening a status page runs as `authenticated`, not `anon`).
- **Demo user (RSVP-8):** the demo account is an `authenticated` user whose UPDATE/DELETE are denied by a restrictive RLS carve-out; read-only is enforced at the DB boundary, with the UI disabled state as presentation only.

---

## 6. Milestones

| Milestone | Scope | Sprint / Actual |
|-----------|-------|-----------------|
| M0 — Discovery / Setup | PRD, user flow, Jira backlog, environment, first push | Sprint 0 (4/22–5/8) ✅ |
| M1 — Build (paused mid-flight) | RSVP-3, RSVP-4 started | Sprint v2 (5/13–5/22), closed honestly at 0/4 shipped ✅ |
| M2 — Recovery | RSVP-3 ✅ (6/3, RLS hardened) · RSVP-4 ✅ (6/11+) · RSVP-5 ✅ (accepted 7/7) · RSVP-6 ↪ Phase 2 (7/7) | Sprint v3 (6/2–6/16) + spillover, closed 7/7 |
| M3 — Ship | Netlify production deploy, repo public, README | ✅ Live (`r-khiong-rsvp.netlify.app`) |
| M4 — Visibility *(v0.4; scope restated in v0.5)* | RSVP-8 read-only demo ✅ + root landing (non-story track, in progress) + docs-in-repo ✅ + README sync ✅ | July 2026, then **freeze** (changes only on interview feedback) |
| M5 — Notifications *(v0.5)* | RSVP-7 email notifications | Not scheduled — sits outside the M4 freeze; scheduled only if interview feedback calls for it |

> Sprint v2 was paused by a pre-scheduled trip (5/23–5/31). Rather than retroactively
> extending its dates (a ScrumBut anti-pattern that distorts velocity), it was closed
> with honest reporting; unfinished tickets carried into Sprint v3, labelled Recovery.

---

## 7. Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Custom (organizer-defined) form fields? | Deferred to Phase 3 |
| OQ-2 | Organizer authentication method? | ✅ Resolved — Supabase Auth (single admin MVP) |
| OQ-3 | Dedicated QR scan page vs visual check? | Scanner → Phase 2 (with RSVP-6) |
| OQ-4 | Multi-language (EN / ZH)? | Product UI English-only; story landing Chinese (OQ-9); i18n → Phase 3 |
| OQ-5 | Single vs multi-event? | ✅ Resolved — multi-event schema, single event seeded, multi-event UI deferred |
| OQ-6 | Keyword search in dashboard? | Deferred to Phase 2 (status filter only for MVP) |
| OQ-7 | CSV export? | Phase 2 |
| OQ-8 | Inline Remark editing in dashboard? | Phase 2 (MVP shows Remark read-only) |
| OQ-9 *(v0.4)* | Story landing language? | ✅ Resolved 2026-07-10 — Chinese body (reviewer audience is Taiwan hiring managers), English UI terms; product UI stays English |
| OQ-10 *(v0.4)* | Where do product docs live? | ✅ Resolved 2026-07-10 — in-repo `docs/` (git history = version trail); Notion keeps private job-search materials only |
| OQ-11 *(v0.4)* | Read-only demo vs interactive sandbox? | ✅ Resolved 2026-07-10 — read-only + GIF for Phase 1; sandbox with reset gated on interview feedback |

---

## 8. Phase 1.5 / Phase 2+ Backlog

### Phase 1.5 *(added in v0.5 — follows directly from RSVP-7)*

- Per-record notification resend (operator-triggered retry for a failed send). RSVP-7 ships with
  log-only failure handling per trade-off (b); `notified_at` already carries the state this needs

### Phase 2+

- On-site check-in (RSVP-6 scope: manual check-in + `checked_in`/`checked_in_at` + visually distinct rows; then camera QR scanner — both reuse the token status URL)
- Interactive demo sandbox (demo user writes + data reset + rate limit)
- SMS notification on status change *(email portion promoted to Phase 1 as RSVP-7 in v0.5)*
- Send-status column surfaced in the admin dashboard (RSVP-7 writes `notified_at` but does not display it)
- Free-text / keyword search + pagination (50/page) in admin dashboard
- Automated TA filtering rules
- Inline Remark editing
- CSV export
- Calendar (.ics) integration
- Multi-event organizer UI
- Custom registration form fields
- Analytics (registration / approval rates; story-page funnel)

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | 2026-04-16 | Initial draft. 5-field form incl. Business Card upload; 4 status states; QR scan as stretch goal |
| v0.2 | 2026-05-07 | Supabase Auth added to MVP; scan page brought into MVP; Jira board + AC built |
| v0.3 | 2026-06-06 | Dashboard columns realigned to built schema; Business Card upload removed; organizer auth resolved to Supabase Auth; on-site check-in confirmed manual (scanner → Phase 1.5); status filter kept, free-text search → Phase 2; multi-event clarified (schema-ready, single-event UI); idempotent / reversible batch rule and `select-all = current page` documented |
| **v0.4** | **2026-07-10** | RSVP-4/5 marked **Done**, AC realigned to as-built: **batch-only pivot (2026-06-09)** documented — per-row buttons removed; `registrations.name` (not `full_name`); **no pagination in MVP** (moved to Phase 2). RSVP-6 **moved to Phase 2** (2026-07-07). Added **Reviewer persona**, **G5**, **RSVP-7 Story Landing**, **RSVP-8 Read-only Admin Demo**. Security model: per-role grant lesson (7/7) + demo-user restrictive carve-out. Docs moved into repo (`docs/`); OQ-9/10/11 resolved. M4 Visibility milestone + post-M4 freeze |
| **v0.5** | **2026-07-28** | **RSVP-7 realigned to Jira as Email Notifications.** The v0.4 *RSVP-7 Story Landing* story is **removed as superseded** — the root landing is a **non-story track (descriptive branch)**, not a user story (decision **2026-07-22**); Jira is canonical for keys and this PRD follows Jira. Trade-offs (a) single-event scope / (b) no per-record resend, failures log-only → Phase 1.5 / (c) no `status` enum extension, send state as a nullable timestamp — locked by PjM. **RSVP-8 → Done** (merged 2026-07-14). Email removed from §2 Non-Goals and from the §8 backlog (**SMS stays deferred**); new **Phase 1.5** bucket for resend. Added **G6**, **M5 — Notifications**, and provisional `registrations.notified_at` to the §5 data model. *Supersedes draft revisions discussed 2026-07-22/23 (chat-side); remaining content port tracked separately.* Open: RSVP-7 AC awaits reconciliation against the Jira ticket; event information source `TBD — pending PM decision` |

---

## 10. Appendix — Paste-ready Jira AC

> Copy the block under each key into the Jira ticket's Acceptance Criteria field.
> RSVP-3/5 blocks unchanged from v0.3 (shipped as specced). RSVP-4 updated to as-built. RSVP-6 parked in Phase 2 backlog.
> RSVP-7 rewritten in v0.5 for the Email Notifications realignment — it is a **draft**, not yet reconciled with the Jira ticket.

**RSVP-4 — Review & Batch Approval (as-built)**
```
* Admin access via Supabase Auth (single admin for MVP; SSO/roles → Phase 2)
* Dashboard columns: Select | Name | Email | Phone | Company | Status | Remark (read-only)
* Batch-only actions: multi-select + "Approve/Reject Selected" with confirmation dialog + toast
  (no per-row Approve/Reject; single row selected = single-row operation, same path)
* Select All = currently rendered page (single-page table in MVP; pagination → Phase 2)
* Status filter: Pending / Approved / Rejected / All (default All)
* Default sort: submission time, newest first
* Idempotent: only rows that actually change status are updated; same-status = no-op
* Approve/Reject reversible; status_updated_at written only on real transition (app-level, in Server Action)
* Status changes auto-saved on confirm; no manual Save button

Out of Scope:
* Full authentication (SSO, roles) → Phase 2
* Free-text search / pagination → Phase 2
* Inline Remark editing → Phase 2
* Export to CSV → Phase 2
* Concurrent editing conflict resolution → Phase 2
```

**RSVP-7 — Email Notifications** *(draft — reconcile against the Jira ticket before build)*
```
* Notification email sent on a REAL status transition (pending → approved | rejected),
  triggered from the existing updateRegistrationsStatus Server Action
* RSVP-4 idempotency governs sending: same-status no-op sends nothing.
  A reversal (approve → reject or back) is a real transition and sends again
* Email content: event name, decision, attendee's /status/{token} link
* Send state = nullable timestamp on registrations (notified_at, provisional name).
  status enum NOT extended; RSVP-4 dashboard change stays minimal
* Send failure: logged server-side only; the status update still commits
* Transport: Gmail SMTP (preferred over Resend — see docs/decision-log.md)
* Single-event scope
* Event information source: TBD — pending PM decision

Out of Scope:
* Per-record resend → Phase 1.5
* SMS → Phase 2
* Send-status column surfaced in dashboard UI → Phase 2
* Multi-event templating → Phase 2
* Registration-received (pre-decision) confirmation email
```

**RSVP-8 — Read-only Admin Demo**
```
* Story-page CTA signs in dedicated demo user via Server Action (creds in server env only)
* Lands on /admin/registrations with seeded data (7 rows, three statuses) + filters
* Demo user writes denied at RLS layer (restrictive carve-out on authenticated UPDATE);
  verified by direct SQL/API write attempt, not only UI
* Banner: "Demo mode (read-only) — batch actions disabled. Seeded demo data."
* Batch action bar disabled (not hidden); real admin behavior unchanged
* Demo credentials never in client bundle or repo

Out of Scope:
* Interactive writes + data reset (Phase 2 sandbox)
* Separate demo dataset (reuses supabase/seed.sql)
```
