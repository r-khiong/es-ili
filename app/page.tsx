import Link from "next/link";
import Image from "next/image";
import { DemoEntryButton } from "@/components/story/demo-entry-button";

// RSVP root landing, Paper Light editorial (RJ mockup v9, 2026-07-31).
// Fonts come from layout.tsx — this page loads none of its own.
// Copy is locked to the v9 spec; do not reword without a PjM decision.

const MONO = "font-mono";
const DISP = "font-heading";
const PAD = "px-[22px] md:px-10";

const REPO_URL = "https://github.com/r-khiong/es-ili";
const GITHUB_PROFILE_URL = "https://github.com/r-khiong";
const LINKEDIN_URL = "https://www.linkedin.com/in/renatajiang";

const STACK = [
  "Next.js 16 · React 19 · TypeScript",
  "Tailwind v4 · shadcn/ui",
  "Supabase · Postgres RLS",
  "Netlify",
];

const TOOLS = ["VS Code × Claude Code", "Jira · Notion · Figma"];

interface FlowRow {
  idx: string;
  kicker: string;
  title: string;
  sub: string;
  /** Rendered as two lines, matching the <br> in the spec. */
  body: readonly [string, string];
  badge: string;
  src: string;
  shotTag: string;
  alt: string;
  /** Text column moves right on wide screens (spec: .row:nth-child(even)). */
  flip: boolean;
}

// Screenshot order is deliberately not 1-2-3: row 02 is about batch review, so
// it carries the admin capture (state-3), and row 03 is about the status link,
// so it carries the status capture (state-2).
const FLOW: readonly FlowRow[] = [
  {
    idx: "01",
    kicker: "Register",
    title: "Scoped to the Core",
    sub: "專注核心功能，以 MVP 優先規劃需求。",
    body: [
      "報名 → 審核 → 入場憑證。",
      "MVP 邊界收斂範疇，聚焦活動報名關鍵功能。",
    ],
    badge: "Scope decision",
    src: "/story/state-1.png",
    shotTag: "/register",
    alt: "Register page with the event details and the registration form",
    flip: false,
  },
  {
    idx: "02",
    kicker: "Batch review",
    title: "One List, Three Roles",
    sub: "多筆同時審核，減少重複操作。",
    body: [
      "客戶、主辦方、報名者三方名單整合。",
      "勾選後批次 approve 或 reject，一次處理整批申請。",
    ],
    badge: "Ops efficiency",
    src: "/story/state-3.png",
    shotTag: "admin demo",
    alt: "Admin console showing the read-only demo of the registrations table",
    flip: true,
  },
  {
    idx: "03",
    kicker: "Status link",
    title: "One Link, Live Status",
    sub: "專屬連結，隨時查詢最新審核狀態。",
    body: [
      "審核結果即時反映，不需來回確認。",
      "核准後同一頁面提供入場資訊與 QR code。",
    ],
    badge: "Single source of truth",
    src: "/story/state-2.png",
    shotTag: "status + QR",
    alt: "Status page for an approved registration with its check-in QR code",
    flip: false,
  },
];

function Monogram() {
  return (
    <Image
      src="/brand/mark-primary-light.svg"
      alt="RSVP"
      width={30}
      height={32}
      priority
      unoptimized
      className="h-[26px] w-auto"
    />
  );
}

function Shot({
  src,
  alt,
  shotTag,
  priority = false,
}: {
  src: string;
  alt: string;
  shotTag: string;
  priority?: boolean;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[#ECECEC] bg-[#FCFCFC]">
      <p
        className={`${MONO} border-b border-[#ECECEC] bg-white px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-[#9A9A9A]`}
      >
        screenshot · {shotTag}
      </p>
      <div className="p-5">
        <Image
          src={src}
          alt={alt}
          width={2560}
          height={1600}
          priority={priority}
          sizes="(min-width: 900px) 45vw, 100vw"
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-[9px] grid gap-[7px]">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-baseline gap-[9px] text-[12.5px] text-[#717171]"
        >
          <span
            aria-hidden="true"
            className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#D4D4D4]"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div className="font-sans flex-1 bg-white text-[#0A0A0A]">
      <header
        className={`${PAD} flex items-center justify-between border-b border-[#ECECEC] py-5`}
      >
        <Monogram />
        <nav
          aria-label="Main navigation"
          className={`${MONO} flex items-center gap-[22px] text-xs tracking-[0.04em]`}
        >
          <a href="#the-name" className="text-[#717171] hover:text-[#0A0A0A]">
            About
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#717171] hover:text-[#0A0A0A]"
          >
            GitHub
          </a>
          <Link
            href="/register"
            className="rounded-lg border border-[#D4D4D4] px-3.5 py-2 transition-colors hover:border-[#0A0A0A]"
          >
            View demo →
          </Link>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="hero-heading"
          className={`${PAD} grid items-start gap-[30px] border-b border-[#ECECEC] pb-[46px] pt-[52px] min-[900px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-[900px]:gap-[56px] min-[900px]:pb-[58px] min-[900px]:pt-[70px]`}
        >
          <div>
            <p
              className={`${MONO} text-[11px] uppercase tracking-[0.14em] text-[#717171]`}
            >
              Event registration &amp; guest management
            </p>
            <h1
              id="hero-heading"
              className={`${DISP} mt-4 text-[clamp(30px,4.2vw,50px)] font-bold leading-[1.04] tracking-[-0.02em]`}
            >
              {/* Break 1 of the three options in the spec. Below 900px the
                  segment goes inline so the line wraps to the column. */}
              <span className="min-[900px]:block">
                Manage event RSVPs without{" "}
              </span>
              the spreadsheet chaos.
            </h1>
            <p className="mt-5 max-w-[42ch] text-base leading-[1.7] text-[#717171]">
              彙整報名至入場，籌備狀態即時掌握。
            </p>
            <div className="mt-[30px] flex flex-wrap items-start gap-[11px]">
              <Link
                href="/register"
                className={`${MONO} rounded-lg bg-[var(--brand-green)] px-5 py-[11px] text-[13px] font-medium tracking-[0.04em] text-black transition-opacity hover:opacity-90`}
              >
                View the live demo →
              </Link>
              <DemoEntryButton />
            </div>
          </div>

          <aside
            aria-labelledby="built-heading"
            className="rounded-[0.625rem] border border-[#ECECEC] p-5"
          >
            <h2
              id="built-heading"
              className={`${MONO} flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[#717171]`}
            >
              <span
                aria-hidden="true"
                className="h-[9px] w-[9px] rounded-full bg-[var(--brand-green)] shadow-[0_0_0_1px_rgba(0,0,0,0.14)]"
              />
              How it was built
            </h2>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-between gap-3.5 border-b border-[#ECECEC] pb-4 pt-3.5 hover:text-[#0A0A0A]"
            >
              <span>
                <span className="block text-sm font-medium">
                  Product requirements
                </span>
                <span
                  className={`${MONO} mt-1 block text-[10px] uppercase tracking-[0.06em] text-[#717171]`}
                >
                  github.com/r-khiong/es-ili
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`${MONO} shrink-0 text-xs text-[#717171]`}
              >
                →
              </span>
            </a>
            <p
              className={`${MONO} mt-4 text-[9.5px] uppercase tracking-[0.14em] text-[#A8A8A8]`}
            >
              Stack
            </p>
            <BulletList items={STACK} />
            <p
              className={`${MONO} mt-4 text-[9.5px] uppercase tracking-[0.14em] text-[#A8A8A8]`}
            >
              Tools
            </p>
            <BulletList items={TOOLS} />
          </aside>
        </section>

        <section aria-label="Core flow" className={`${PAD} pt-3.5`}>
          <ul>
            {FLOW.map((row, i) => (
              <li
                key={row.idx}
                className="grid items-center gap-[26px] border-b border-[#ECECEC] py-[38px] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] min-[900px]:gap-11 min-[900px]:py-[52px]"
              >
                <div className={row.flip ? "min-[900px]:order-2" : undefined}>
                  <p>
                    <span
                      className={`${MONO} inline-block rounded-[5px] bg-[#0A0A0A] px-2 py-[3px] text-[11px] tracking-[0.14em] text-[var(--brand-green)]`}
                    >
                      {row.idx}
                    </span>
                    <span
                      className={`${MONO} ml-2.5 text-[11px] uppercase tracking-[0.14em] text-[#717171]`}
                    >
                      {row.kicker}
                    </span>
                  </p>
                  <h3
                    className={`${DISP} mb-2 mt-4 text-[27px] font-semibold leading-[1.14] tracking-[-0.01em]`}
                  >
                    {row.title}
                  </h3>
                  <p className="mb-3 max-w-[40ch] text-sm font-medium leading-[1.6]">
                    {row.sub}
                  </p>
                  <p className="max-w-[44ch] text-sm leading-[1.75] text-[#717171]">
                    {row.body[0]}
                    <br />
                    {row.body[1]}
                  </p>
                  <p
                    className={`${MONO} mt-[18px] inline-block rounded-[7px] border border-[#ECECEC] px-[11px] py-1.5 text-[10.5px] uppercase tracking-[0.1em] text-[#717171]`}
                  >
                    {row.badge}
                  </p>
                </div>
                <div className={row.flip ? "min-[900px]:order-1" : undefined}>
                  <Shot
                    src={row.src}
                    alt={row.alt}
                    shotTag={row.shotTag}
                    priority={i === 0}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Signals that email notification is known and queued, without
            claiming it ships today. */}
        <section
          aria-label="Backlog signal"
          className={`${PAD} border-b border-[#ECECEC] py-7`}
        >
          <p className="inline-flex items-center gap-2.5 text-[13.5px] text-[#717171]">
            <span
              aria-hidden="true"
              className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#9E9E9E] shadow-[0_0_0_1px_rgba(0,0,0,0.14)]"
            />
            Email notifications are next in the backlog.
          </p>
        </section>

        <section
          id="the-name"
          aria-labelledby="name-heading"
          className={`${PAD} border-b border-[#ECECEC] pb-[78px] pt-[76px] text-center`}
        >
          <h2
            id="name-heading"
            className={`${MONO} inline-flex items-center gap-[9px] text-[11px] uppercase tracking-[0.14em] text-[#717171]`}
          >
            <span
              aria-hidden="true"
              className="h-[9px] w-[9px] rounded-full bg-[var(--brand-green)] shadow-[0_0_0_1px_rgba(0,0,0,0.14)]"
            />
            The name
          </h2>

          <p
            className={`${DISP} mx-auto mt-[22px] max-w-[22ch] text-[clamp(24px,3.4vw,38px)] font-semibold leading-[1.2] tracking-[-0.01em]`}
          >
            R<span className="text-[var(--brand-green)]">é</span>pondez s
            <span className="text-[var(--brand-green)]">&apos;</span>il vous pla
            <span className="text-[var(--brand-green)]">î</span>t
          </p>

          <div className="mx-auto mt-[30px] max-w-[54ch] space-y-2.5">
            <p className="text-[14.5px] leading-[1.9] text-[#717171]">
              RSVP 的流程也像原句一樣漫長，從報名、審核一路到活動現場。
            </p>
            <p className="text-[14.5px] leading-[1.9] text-[#717171]">
              把重點提煉成清晰的步驟，讓關鍵狀態一目瞭然。
            </p>
            <p className="text-[14.5px] leading-[1.9] text-[#717171]">
              就像句末的{" "}
              <strong className="font-medium text-[#0A0A0A]">î</strong>
              ，往前推進，持續交付，就是這個品牌的初衷。
            </p>
          </div>

          {/* Brand-kit original, not a CSS reconstruction. The viewBox has a
              non-zero origin, so width/height are given explicitly and the
              rendered size comes from the height utility. */}
          <div className="mt-11 flex justify-center">
            <Image
              src="/brand/wordmark-esili-light.svg"
              alt="és'ilî"
              width={2261}
              height={705}
              unoptimized
              className="h-[68px] w-auto"
            />
          </div>
          <p
            className={`${MONO} mt-5 text-[10px] uppercase tracking-[0.14em] text-[#A8A8A8]`}
          >
            és&apos;ilî · wordmark
          </p>
        </section>
      </main>

      {/* Portfolio links kept reachable from the footer alongside the
          copyright line the spec specifies. */}
      <footer className={`${PAD} py-7`}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <p
            className={`${MONO} flex flex-wrap items-center gap-x-2 text-[11px] tracking-[0.05em] text-[#9A9A9A]`}
          >
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A0A0A]"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A0A0A]"
            >
              LinkedIn
            </a>
          </p>
          <p
            className={`${MONO} text-[11px] tracking-[0.05em] text-[#9A9A9A]`}
          >
            Copyright © 2026 és&apos;ilî. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
