# CLAUDE.md

> **What this file is.** The working agreement for the AI implementation layer. It is loaded
> automatically into every Claude Code session, so it answers exactly four questions and nothing
> else:
>
> 1. **What is locked** — stack versions, conventions, and patterns that must not be re-litigated (§2)
> 2. **Who decides what** — the boundary between PM judgment and implementation detail (§3, §6)
> 3. **What has already gone wrong** — traps that cost real time and must not recur (§5)
> 4. **What must not regress** — design and quality invariants (§8), naming rules (§9)
>
> **What this file is not.** Not a status board, not a roadmap, not product narrative. Anything that
> turns false as work proceeds belongs elsewhere: ticket status in Jira, delivery history in
> `CHANGELOG.md`, feature specs in `docs/PRD.md`, reasoning and trade-offs in `docs/decision-log.md`.
> A stale line here is not untidiness — it is an incorrect instruction handed to every future session.
>
> Maintainer: Renata Jiang (rj.khiong@gmail.com)
> Last updated: 2026-08-27

---

## 1. Project Context

### 1.1 What this is

és'ilî is an event registration management system. It replaces the workflow where an organizer
maintains RSVP data by hand and turns it into a single source of truth.

The problem comes from real large-scale event work: with no dedicated tooling, registration data has
to be reconciled manually across three parties — the client, the organizer, and the attendee — and
neither timeliness nor consistency survives that.

The MVP holds to the core flow:

- **Attendee** — submit the registration form → look up status through a private link
- **Organizer** — review submissions in batches → manage the whole list from one place

### 1.2 How the work is run

The PM owns scope and specification. AI handles the implementation layer.

- PRD, user stories, and acceptance criteria are authored PM-side
- Jira carries the sprint plan through to deployment
- Scope boundaries, spec sign-off, acceptance, and deploy authorization stay with the PM

§3 formalizes that split. It exists because PM attention is the scarce resource and must not be
diluted by implementation detail.

### 1.3 Maintainer

Renata Jiang (rj.khiong@gmail.com), product manager. Background across creative curation,
large-scale exhibitions, and international technology clients.

**Does not write code, but owns the technical trade-offs.** See §3 for how decision rights split.

### 1.4 Where to look things up

This file carries no status. Route the question to its authority:

| Question | Authority |
|---|---|
| What is the state of a ticket? | Jira |
| What has actually shipped? | `CHANGELOG.md`, cross-checked against git history |
| What is a feature supposed to do? | `docs/PRD.md` |
| Why is it built this way? | `docs/decision-log.md` |
| What is the live site running? | The Netlify production deploy, not `main`'s HEAD |
| What do the design tokens resolve to? | `app/globals.css` |

Current milestone work — the visibility layer and the admin redesign — does **not** map to a user
story key. **Do not refer to it as RSVP-7, RSVP-8, or RSVP-9**; those keys mean something else on
the board. See §9.3.

---

## 2. Tech Stack Lockdown

The following versions and settings are locked. Do not propose alternatives.

| Layer | Stack | Version | Key convention |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | App Router; `proxy.ts` replaces `middleware.ts` |
| Runtime | React | 19.2.4 | Server Components by default; add `'use client'` only when interaction requires it |
| Type | TypeScript | 5.9.3 | strict mode; `any` is banned |
| Styling | Tailwind CSS | v4.2.4 | CSS-first: `@theme` plus CSS variables. There is no `tailwind.config.ts` |
| Component | shadcn/ui | 3.x | CLI flags: `--template=next --preset=base-nova --base=radix`. **shadcn supplies the component base; design tokens come from the project brand system, see §8.6** |
| Form | react-hook-form + zod + @hookform/resolvers | latest stable | Prefer the uncontrolled FormData pattern |
| Auth + DB | Supabase | latest | Client uses the Publishable key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`); server-side uses the Secret key |
| Hosting | Netlify | - | git-linked auto deploy; production deploy is the only target (see §8.10) |
| Package manager | pnpm | 10.33.0 | Do not use npm or yarn |
| Repo | GitHub | - | `r-khiong/es-ili`, `main` branch, conventional commits |

### 2.1 Deprecated patterns (do not use)

| Old | New | Reason |
|---|---|---|
| `tailwind.config.ts` | `@theme` in `app/globals.css` | Tailwind v4 is CSS-first |
| `middleware.ts` | `proxy.ts` | Next.js 16 renamed it |
| Pages Router (`pages/`) | App Router (`app/`) | This project uses the App Router |
| Supabase `anon` / `service_role` key names | `Publishable` / `Secret` | Supabase renamed them in 2025 |
| shadcn `style: new-york` option | Use the `--preset=base-nova` flag | shadcn 3.x CLI rewrite |
| shadcn interactive base-color prompt | Removed in shadcn 3.x; take the preset default | shadcn 3.x CLI rewrite |
| shadcn default palette and Geist Sans | Project brand system, see §8.6 | The v9 brand system shipped 2026-08-04 |
| `formatRange` | `Intl.DateTimeFormat` | ICU versions differ across the Node build, the browser, and email clients |

---

## 3. Decision Boundaries (core)

This repo is a PM × AI collaboration, so decision rights must be explicit. **PM attention is the
scarce resource and must not be diluted by implementation detail.**

### 3.1 Claude Code decides alone (no need to ask; take the industry default)

- Library version options and CLI arguments (shadcn template/preset/base, Tailwind settings, Next.js config)
- Code structure (file organization, naming, import order, TypeScript type detail)
- Package install options and dependency versions (unless there is a breaking change)
- Purely technical compatibility work (for example, reconciling Tailwind v4 with shadcn 3.x)
- Trial-and-error under 15 minutes

**Note:** styling detail is no longer self-directed. Palette, typography, status presentation, and
spacing all follow the brand system in §8.6. Do not pick your own.

### 3.2 Must ask the PM first (escalate to chat)

- **Scope changes** — anything beyond the current acceptance criteria, however small
- **User flow changes** — page flow, redirect logic, state transitions
- **Business validation rules** — field rules, business-logic thresholds
- **Data model changes** — DB schema changes, adding or removing columns, index design
- **UX trade-offs** — error UI approach, loading UX, empty-state treatment
- **Risk** — blocked over 30 minutes, a compatibility dead end, an architectural choice with no way back
- **Naming and scope assignment** — product names, page names, branch names, milestone ownership

### 3.3 Decision reporting format

When a sub-task is complete, list the implementation details you decided yourself as bullets in the
commit message or the chat report. Do not propose options up front.

Example:

```
chore(ui): init shadcn/ui with radix base (preset=base-nova)

Self-decided implementation details:
- CLI flags: --template=next --preset=base-nova --base=radix --no-monorepo
- Reused existing tw-animate-css from init
```

---

## 4. Commit Convention

### 4.1 Format

Conventional commits: `<type>(<scope>): <subject>`

| Type | Use for |
|---|---|
| `feat` | New functionality (changes user-facing behavior) |
| `fix` | Bug fix |
| `refactor` | Internal restructuring with no behavior change |
| `chore` | Environment, config, tooling, dependencies |
| `docs` | Documentation changes |
| `style` | Pure styling changes with no logic |

### 4.2 Scope vocabulary

**Scope names a section of the codebase — never a tracking identifier.** Conventional Commits
requires a noun describing a part of the tree, so a Jira key, a sprint, a milestone, or a mockup
version is never a scope. Both lists below are closed; a word outside them is not used.

| Scope | Covers |
|---|---|
| `landing` | `app/page.tsx`, `components/story/`, `public/story/` |
| `register` | `app/register/`, `lib/validations/register.ts` |
| `status` | `app/status/`, `components/status/` |
| `admin` | `app/admin/`, `components/admin/`, `lib/validations/login.ts`, `proxy.ts` |
| `db` | `supabase/`, `lib/supabase/` |
| `brand` | `components/brand/`, `public/brand/`, favicon and OG assets, `app/layout.tsx`, `app/globals.css` |
| `ui` | `components/ui/` (the shadcn base) |
| `config` | shared `lib/` modules, build, deploy, and repo plumbing, including the generated `AGENTS.md` |

**Omit the scope when the change has no primary surface.** Around a fifth of this repo's commits
genuinely span several surfaces — a rename, a token change, a font swap. Conventional Commits makes
scope optional for exactly that case, and picking one surface out of five states something untrue.
A shared component inherits the scope of the page the change was made for.

**A `docs` commit scopes the document, not the code.** `docs` is a type, so repeating it as a
scope says nothing. The document being changed is the useful word, and these five are the whole set:

| Scope | Document |
|---|---|
| `prd` | `docs/PRD.md` |
| `log` | `docs/decision-log.md` |
| `changelog` | `CHANGELOG.md` |
| `readme` | `README.md` |
| `claude` | `CLAUDE.md` |

A `feat` or `fix` that also updates documentation — required by §6.2 — keeps the product scope. The
document scopes above belong to `docs` commits alone.

**Story keys go in a footer trailer, not in the scope:**

```
feat(admin): add batch approve/reject to the registrations list

Self-decided implementation details:
- optimistic UI update, rollback on error

Refs: RSVP-4
```

Register a new scope in the table above before using it.


### 4.3 Granularity

**One commit per task.** Do not roll several tasks into a mega-commit.

Reason: the commit history is the record of how the work was decomposed. Rolled-up commits destroy
that record and make a single change impossible to revert on its own.

### 4.4 Commit message rules

- Subject: short, present tense (`add`, `migrate`, `init`). Never past tense
- Body: list the "Self-decided implementation details" bullets (see §3.3)
- If a decision was escalated to the PM, note it in the body as `PM decision: <one line>`

### 4.5 History discipline

- Do not use `--amend`
- Do not rewrite pushed history
- Merge with `--no-ff` (on GitHub, choose `Create a merge commit`). **Never squash** — it destroys
  the per-task commit breakdown
- Every push and every deploy needs explicit PM authorization

---

## 5. Known Risks / Traps Already Hit

### 5.1 Environment compatibility

| Risk | Response | Notes |
|---|---|---|
| shadcn 3.x rewrote the CLI; the old interactive prompts are gone | It no longer asks for a base color. Use the `--template/--preset/--base` flags | Hit during Block A; flags are now fixed |
| Tailwind v4 has no `tailwind.config.ts` | Use `@theme` plus CSS variables | shadcn 3.x already supports this |
| Next.js 16 renamed `middleware.ts` to `proxy.ts` | Admin route protection lives in `proxy.ts` | Watch for this when writing route guards |
| Supabase renamed its API keys (Publishable / Secret) | Do not use the old `anon` / `service_role` names | `.env.local` already matches |
| Server Component default vs `'use client'` | Add `'use client'` only for forms and interactive UI | Default to leaving it off when writing a page |
| Supabase function and table grants are **per-role**: an authenticated user and an anonymous visitor can behave differently on the same page | When adding an RPC, decide explicitly which roles get the grant. If "the same page works for A but not for B", ask **who is logged in** first | Hit on RSVP-5: the status RPC was granted to `anon` only, so a logged-in admin opening the status page got 42501 swallowed as a 404. Cost a full day (2026-07-06/07). Errors must be logged, never swallowed into a 404 |
| `createBrowserClient` (`@supabase/ssr`) reads the cookie session automatically and swaps `Authorization` from the publishable key to the signed-in user's JWT → **a public page then hits the DB as `authenticated`**, a role that usually has no grant | Public flows (`/register` and any other no-login page) must use `lib/supabase/anon-client.ts` (`createClient` with `persistSession: false`). Do not use `lib/supabase/client.ts` — that one is only for admin login, which needs a session | **Second recurrence** of the per-role trap above (2026-07-29): `/register` worked for anonymous visitors but returned 42501 in any browser that had opened the admin. Generic error copy hid it for 12 days. Fixed in `7ee2cee` and `efe2af7`. Rule of thumb: "broken only for me, fine for everyone else" → suspect your own session first |
| Email clients do not render inline SVG or client-side JS | The QR code must be generated server-side as a PNG (for example `/api/qr/[token]`) and embedded via `content_id`; the email header logo must be a static PNG | Not implemented yet; applies when RSVP-7 lands |

### 5.2 Workflow

| Risk | Response |
|---|---|
| Plan Mode escalating every implementation dimension, diluting PM attention | §3 draws the boundary. Implementation-only choices are self-directed |
| One prompt carrying too much scope, so Claude Code stalls midway or drops an AC | Break sub-tasks into ≤ 90-minute units and put the AC at the top of the prompt |
| Binge-debugging instead of escalating | Hard cap at 30 minutes. Stop and report immediately past that |
| A commit body claiming a "manual patch" that was never actually saved | Before committing, grep or read the file to confirm its contents match what the commit body claims. If a tool permission fails, retry — never carry on regardless |
| A commit body claiming "cross-package compatible" when tsc never actually checked it | After installing a cross-layer dependency, add a minimal reference point outside the new file and run tsc. For data-layer SDKs (supabase, prisma, any ORM), the check must include a chained API call such as `.from(table).insert()` — importing the module is not enough to trigger the type chain |
| Treating memory as verification and writing assumptions as spec | Factual statements carry a `[verified]` / `[assumed]` / `[external]` tag. **Anything untagged counts as assumed** and must be verified before acting on it |
| Hand-written docs mirroring Jira status, which always goes stale | This file does not maintain a task backlog — see §7.1 |

---

## 6. Workflow Rules

### 6.1 Starting a sub-task

The PM gives the sub-task in chat, containing:

- Task ID plus scope
- Acceptance criteria (explicit and verifiable)
- An out-of-scope list (to keep Claude Code inside the lines)

Claude Code then:

1. Enters Plan Mode and proposes a plan
2. Gets PM approval (a high-quality plan may self-approve, see §6.4)
3. Executes → self-checks the DoD → commits (pushing requires authorization)

### 6.2 Definition of Done (every task)

- [ ] Every listed acceptance criterion passes
- [ ] No build or type errors
- [ ] The dev server runs and the target page loads correctly
- [ ] Committed, with push authorization obtained
- [ ] The commit message carries the self-decided implementation details bullets
- [ ] **Every document describing the changed behaviour is updated in the same commit or PR.** A
      change to user-visible behaviour that leaves a doc describing the old behaviour has not
      shipped — it has created a false statement. Grep for the thing you changed before committing

### 6.3 Escalation rules

Stop and escalate to chat immediately when:

- Blocked for more than 30 minutes
- Scope, a business rule, or the data model needs a PM call (see §3.2)
- A compatibility dead end is reached and the direction has to change
- The DoD self-check fails and the PM needs to step in
- A DB migration is required. **All migrations are run manually by the PM in the Supabase
  Dashboard. Claude Code never runs one**

### 6.4 Conditions for self-approving a plan

Claude Code may execute without waiting for PM approval when all three hold:

- Scope sits entirely inside the current acceptance criteria
- Nothing in §3.2 is involved
- At least three risk surfaces are named, each with a mitigation

Otherwise, escalate to chat.

### 6.5 Block-level checkpoints

Report back at the Block level by default, not per sub-task:

- Block start: the PM sets the Block scope
- Inside the Block: Claude Code runs and commits on its own
- Block end: report the commits, the self-decided details, and any open question

---

## 7. Scope Boundary

### 7.1 This file holds no task backlog

Jira is the single authority for any ticket's status, scope, and acceptance criteria. A hand-written
status mirror always goes stale, and a stale status in an auto-loaded file is an incorrect
instruction. Route lookups through the table in §1.4.

### 7.2 Outside current scope (not being built)

The following are **not** in the current phase. Stop any implementation impulse that approaches them
and escalate instead — adding one of these is a scope change under §3.2. The current phase closes
when its listed work is done, not on a date; anything below is picked up after that, not during.

- Email notification / SMS
- Automated filtering rules
- Calendar integration (.ics export)
- Audience definition automation
- Multi-language i18n
- Check-in — both manual check-in and a camera QR scanner. The QR already encodes a token the
  scanner can parse, so neither needs a backend change when it is picked up
- Performance optimization
- SEO
- An automated demo-data reset job. **Not being built** — consequently, no UI copy may claim that
  registration data is cleared or reset on any schedule
- Landing-page analytics and outcome tracking

---

## 8. Demo Quality Standards / Project-level DoD

### 8.1 Functional completeness

- RSVP-3 / RSVP-4 / RSVP-5 all work end-to-end
- The E2E flow (register → admin approve → status page) has no break. Check-in is Phase 2 and is
  outside the E2E scope
- No console errors on any page

### 8.2 UI quality

- shadcn/ui is the component base, but **design tokens come from the project brand system, not the
  shadcn defaults**
- Do not mix in another design system
- Spacing, type scale, and color all resolve through the `@theme` definitions in `app/globals.css`.
  Never hardcode values
- No placeholder-grade styling (misalignment, unhandled overflow, unhandled long text)

### 8.3 Responsive

- Verify on three widths: mobile (390px), tablet (768px), desktop (1280px)
- Forms, tables, and the QR display must not break
- No horizontal overflow, no truncated text, every button reachable

### 8.4 UX states

Every interactive page must handle five states:

- loading (shadcn `<Skeleton>` or a spinner)
- error (inline error message plus recovery guidance)
- empty (icon, explanation, CTA)
- success
- disabled

Forms need inline validation feedback, and the submit button must be disabled while submitting to
prevent double submission.

### 8.5 Visual references

| Page | Reference |
|---|---|
| `/` | v9 landing mockup (in the brand kit). Light surface |
| `/register` | v9 dark single column. **The current implementation is authoritative**; do not compare against an external reference |
| `/status/[token]` | v9 dark single column: save-link box, three-step timeline, event card |
| `/admin/registrations` | v9 light: filter pills, table, batch action bar. Target design is the agreed admin mockup |
| `/admin/login` | v9 light: single centered card |

### 8.6 Aesthetic invariants

**The `@theme` block in `app/globals.css` is the only authority.** The table below records design
intent and the values it maps to. If you find a mismatch with `app/globals.css`, stop and report — do
not pick a side yourself.

| Dimension | Spec |
|---|---|
| Color strategy | One neutral grayscale ramp plus a single chromatic accent. **Single-signal discipline**: green is reserved for the primary action and for Approved |
| Accent | `#00F666`. Always paired with black text when used as a fill |
| Surfaces | Three kinds. Guest-facing app pages (`/register`, `/status`) are dark `#000000`; admin is light `#FFFFFF`; the story landing (`/`) is light |
| Foreground | fg dark `#DEDFE0` / fg light `#0A0A0A` |
| Muted | dark `#9E9E9E` / light `#717171` |
| Status presentation | **A dot plus a label, never a filled chip.** Submitted `#DEDFE0` / Reviewed `#9E9E9E` / Approved `#00F666` / Rejected `#49494A` |
| Status wording | The UI always shows `Submitted` / `Reviewed` / `Approved` / `Rejected`. **The DB value `pending` must never reach the screen** — map it to `Submitted` |
| Typography | Archivo (display headings, 500/600/700) / Inter (body default, 400/500/600) / Geist Mono (labels, eyebrows, badges, tokens, 400/500) / Noto Sans TC (CJK fallback, appended to every stack) |
| Font loading | `next/font/google`. Noto Sans TC must set `preload: false` (the CJK files are very large) |
| Typography hierarchy | Five levels; keep the existing ratios |
| Font weight | Never use light |
| Spacing | Three padding steps `p-4` / `p-6` / `p-8`; four stack steps `space-y-2` / `4` / `6` / `8` |
| Icons | lucide-react, two sizes only (`h-4 w-4` / `h-5 w-5`). No emoji |
| Motion | shadcn defaults only (button hover, focus ring). Do not author custom animation |
| Mobile breakpoint | `lg` (1024px) |

**The product name is és'ilî**, on every surface: `<title>`, README heading, admin header, logo
`alt` text, event-card organizer, OG share image, and package name. The word "RSVP" survives only as
a common noun in body copy — the category word, never the product's name. The rationale sits in
`docs/decision-log.md` under the brand entry; do not restate it here.

The one exception is the Netlify subdomain `r-khiong-rsvp.netlify.app`, which stays as it is. That
is a recorded decision, not an unfinished rename — see the comment in `lib/site.ts` before touching it.

Logo asset usage is documented in the brand kit README. As built:

| Asset | Where |
|---|---|
| **V2 "î" monogram** — `public/brand/mark-primary-{light,dark}.svg` | Every nav: landing (light), `/register` and `/status` (dark). Also `app/favicon.ico` and `app/apple-icon.png` |
| **V1 wordmark "és'ilî"** — `public/brand/wordmark-esili-light.svg` | The About concept section on the landing |
| **Lockup** (monogram plus wordmark) | `app/opengraph-image.png` only. Baked PNG, no SVG source in the repo |

### 8.7 /register layout invariants

Since v9, `/register` is a **dark single column**, not a split screen.

**The current implementation is authoritative** (`app/register/page.tsx`). This section lists only
what must not regress:

- Dark surface, following the guest-facing palette in §8.6
- Single column. Do not restore the split screen
- Header carries the event card: EVENT / WHEN / WHERE, with WHERE linking out to Google Maps
- Four fields: Name / Email / Phone / Company (optional)
- **Public pages always use `lib/supabase/anon-client.ts`**, never `lib/supabase/client.ts`.
  See §5.1 — this trap has already recurred once
- The footer must carry the demo disclaimer

When you need the exact copy, read the implementation. Do not infer it from this section.

### 8.8 Deploy standards

- The Netlify production URL resolves (`r-khiong-rsvp.netlify.app`)
- The README is complete: problem, tech stack, live demo URL, local setup, roadmap, decision log
- The repo is public
- Demo data is seeded: `supabase/seed.sql`, 4 rows — 2 Submitted (`pending`) / 1 Approved / 1 Rejected.
  There is no seeded "Reviewed" row and there cannot be: `Reviewed` is a timeline step on the status
  page, never a stored value. The DB column holds `pending` | `approved` | `rejected` only

### 8.9 Explicitly not pursued

- Performance optimization (Lighthouse scores)
- i18n
- SEO meta tags
- Advanced accessibility (WCAG AA is the target; AAA is not)
- Anything in the out-of-scope list (see §7.2)

### 8.10 Deploy and environment (Netlify)

- Hosting is **Netlify** (git-linked; pushing `main` deploys automatically), not Vercel.
- Auto publishing is on, so **merging into `main` means shipping**. There is no second gate.
- Deploy Previews are on, triggered by opening a PR against the production branch. Branch deploys are off.
- Rollback path: Netlify → Deploys → pick an older deploy → Publish deploy. Around 38 seconds.
- Required env vars (Netlify → Site settings → Environment variables, identical across all deploy contexts):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the Supabase **publishable** key, `sb_publishable_…`)
  - Values must match local `.env.local`.
- **The trap:** `NEXT_PUBLIC_*` is **inlined at build time** into the browser bundle. Changing an env
  var or rotating a key **requires a fresh deploy** to take effect (Netlify → Deploys → **Clear cache
  and deploy site**).
  - Symptom to recognize: the page loads and the form renders, but every Supabase request fails →
    usually the live bundle has an old or revoked key baked in. Redeploying fixes it. When an env var
    exists but holds a stale value, `lib/supabase/env.ts` does not throw, so the page still renders.

---

## 9. Numbering and Naming Rules

### 9.1 The test

**Anything that outlives the current conversation needs a Jira key. Anything referenced only across
documents can use a letter prefix.**

How to check: will this need its status looked up next week? If yes it is a work item and belongs on
the board. If no, a letter prefix is enough.

Failure signal: when keyed items are not being tracked and tracked items have no key, the two have
swapped. Stop and realign.

### 9.2 Letter prefix registry

| Prefix | Use | Authoritative document | Lifetime |
|---|---|---|---|
| `M0`–`M5` | Delivery milestones | `docs/PRD.md` §6 | Project |
| `OQ-n` | Open question | `docs/PRD.md` §7 | Until resolved |
| `DD-n` | Design decision | `docs/decision-log.md` | Permanent |
| `Qn` / `En` | Decisions and exceptions inside a single plan file | That plan file | Ends with the plan |
| `Bn` | Block (see §6.5) | The sub-task prompt that opened it | Ends with the Block |

**Register a prefix here before introducing it.** An unregistered prefix counts as ad hoc numbering
and must not be written into any document in this repo.

### 9.3 Story key discipline

- Jira is the only authority for what a story key means. Locked: `RSVP-7` = email notifications,
  `RSVP-8` = automated filter rules, `RSVP-9` = calendar integration.
- **Those three keys must not be borrowed** for landing, demo, infrastructure, or documentation work.
  A story key never appears as a commit scope at all — see §4.2; when a commit does belong to a
  tracked story, the key goes in a `Refs:` footer.
- Non-story work uses a descriptive branch name (for example `feat/root-landing-redesign`,
  `feat/admin-v9-redesign`). If it needs status tracking, open a separate Task ticket rather than
  reusing an existing story key.
- A misused scope in an already-pushed commit is not rewritten. It becomes acknowledged history, with
  a one-line note in `docs/decision-log.md`.

### 9.4 Hierarchy and time-boxing are two different things

`Epic > Story > Subtask` is a hierarchy. A sprint is an orthogonal time box: it holds stories, it does
not contain them. The `M` milestone axis is a third orthogonal axis, cutting by delivery phase.

**None of the three can be derived from the others.** Asking "which sprint does M4 map to" will have
no answer in some cells. That is normal, not a lost record.

This project does not use the Subtask level: on a solo project, tracking below the story level has a
reporting rate of zero.

### 9.5 Things that are never retroactively cleaned up

- Sprint naming history, including the early inconsistencies and mixed-width punctuation. It is
  evidence of how the process evolved, so it is left alone.
- Merged commit history is never rewritten.
- The acceptance criteria and description of a closed ticket are never rewritten. Corrections go in a
  comment, because the AC is the evidence of what was actually accepted at the time.

### 9.6 Jira issue and sprint deletion policy

**Do not delete issues. Do not delete sprints.**

- A ticket that will not be built is closed with resolution `Won't Do`. The record stays on the board.
- An unfinished sprint is completed, with the unfinished items returning to the backlog.
  **Do not delete it and do not extend its dates.** Extending the dates makes the burndown misreport
  what actually happened.

Reason: Jira keys are immutable and non-recyclable, so deleting one creates a permanent gap. RSVP-12
is an existing gap whose content is no longer recoverable. Existing gaps are not backfilled and no
placeholder tickets are created.

### 9.7 Credibility boundary

- Only shipped functionality may appear in landing copy or in any external description of the product.
- UI copy must not describe behavior that is not implemented (for example, "data resets daily").
- No document, commit, or UI string may leave a reader with a false impression of the product's state.

---

## 10. Maintaining CLAUDE.md

### 10.1 When to update

- At a sprint retrospective
- When a new risk needs recording
- On a tech stack version upgrade
- When decision boundaries change
- **Whenever any section here contradicts the actual codebase** — this file is loaded automatically
  into every Claude Code session, so a stale spec is an incorrect instruction

### 10.2 What never goes in here

- Ticket status, task backlogs, progress percentages, or dates that expire
- Product narrative or anything written for an outside reader — that is the README's job
- A decision's reasoning. Record the rule here and the reasoning in `docs/decision-log.md`; do not
  keep two copies that can drift apart
- Per-story acceptance criteria (those are pasted into each sub-task prompt)
- Personal schedule or capacity planning
- Commercially sensitive information (the maintainer's email is a deliberate exception)
