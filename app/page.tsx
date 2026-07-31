import Link from "next/link";
import Image from "next/image";
import { DemoEntryButton } from "@/components/story/demo-entry-button";
import { SITE_HOST } from "@/lib/site";

// RSVP-9 root landing, Paper Light editorial (RJ mockup 2026-07-17).
// Fonts come from layout.tsx — this page loads none of its own.
// Copy is locked to the approved final draft (PjM, 2026-07-20) — do not
// reword without a PjM decision.

// Archivo/Inter carry no CJK glyphs; Noto Sans TC backfills Chinese narrative
// copy before the system stack takes over.
const DISP = "font-heading";
const MONO = "font-mono";
const WRAP = "mx-auto w-full max-w-[1120px] px-[22px] md:px-[34px]";

const REPO_URL = "https://github.com/r-khiong/rsvp";
const GITHUB_PROFILE_URL = "https://github.com/r-khiong";
const LINKEDIN_URL = "https://www.linkedin.com/in/renatajiang";

// PjM decision 2026-07-17, reaffirmed 2026-07-20: PWA chip replaced with
// TypeScript (project ships no PWA; recruiter-facing claims must stay factual).
const STACK_CHIPS = ["Next.js", "TypeScript", "Supabase", "Netlify"];

const ROLES = [
  {
    key: "Product",
    body: "定義 PRD、user story 與驗收標準,在 Jira 規劃 4 個 sprint。",
    dim: "每份 PRD 明確標註 out-of-scope 與優先序。",
  },
  {
    key: "Ownership",
    body: "全程握有 scope、data model 與版本決策權。",
    dim: "決策留在我手上,不外包給工具。",
  },
  {
    key: "AI-native workflow",
    body: "在 VS Code × Claude Code 協作模式下開發。",
    dim: "規格與驗收由我 own,AI 負責在鎖定的約束內執行。",
  },
  {
    key: "Shipped",
    body: "產品已上線 Netlify,admin console 持續迭代中。",
    dim: "先上線,再擴敘事。",
  },
];

interface FlowRow {
  idx: string;
  kicker: string;
  title: string;
  desc: string;
  badge: string;
  src: string;
  alt: string;
  flip: boolean;
}

// PjM decision 2026-07-20: 03 desc uses the non-email wording — email
// notification is unshipped Phase 2 scope; the email copy lands with it.
const FLOW: FlowRow[] = [
  {
    idx: "01",
    kicker: "Register",
    title: "MVP 證明產品成立。",
    desc: "報名 → 審核 → 入場憑證。4 個 sprint 完成 MVP 上線，其餘需求進 backlog 持續迭代。",
    badge: "Scope decision",
    src: "/story/state-1.png",
    alt: "Register page — split-screen registration form",
    flip: false,
  },
  {
    idx: "02",
    kicker: "Status link",
    title: "三方管理誤差，名單狀態斷層。",
    desc: "客戶、主辦方、參加者三方名單，收束為單一資訊窗口，資訊即時、正確、透明。",
    badge: "Single source of truth",
    src: "/story/state-2.png",
    alt: "Status page — approved registration with check-in QR code",
    flip: true,
  },
  {
    idx: "03",
    kicker: "Batch review",
    title: "多筆審閱，狀態即時同步。",
    desc: "批次 approve / reject，每位訪客的狀態連結即時更新。",
    badge: "Ops efficiency",
    src: "/story/state-3.png",
    alt: "Admin console — read-only demo of the registrations table",
    flip: false,
  },
];

interface BrowserFrameProps {
  src: string;
  alt: string;
  priority?: boolean;
}

function BrowserFrame({ src, alt, priority = false }: BrowserFrameProps) {
  return (
    <div className="overflow-hidden rounded-[13px] border border-black/[0.14] bg-white shadow-[0_30px_70px_-34px_rgba(20,20,18,0.35)]">
      <div
        aria-hidden="true"
        className="flex h-[34px] items-center gap-1.5 border-b border-[#e8e8e4] bg-[#f4f4f2] px-[13px]"
      >
        <span className="h-[9px] w-[9px] rounded-full bg-[#dcdcd6]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#dcdcd6]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#dcdcd6]" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={2560}
        height={1600}
        priority={priority}
        sizes="(min-width: 768px) 45vw, 100vw"
        className="w-full bg-white"
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans flex-1 bg-[#F3F3F1] text-[#141412]">
      <main>
        {/* Hero */}
        <section
          aria-labelledby="hero-heading"
          className="border-b border-black/[0.07] pb-[76px] pt-[88px]"
        >
          <div
            className={`${WRAP} grid items-center gap-10 md:grid-cols-2 md:gap-[56px]`}
          >
            <div>
              <p
                className={`${MONO} mb-[22px] text-[12.5px] uppercase tracking-[0.24em] text-[#6C6C66]`}
              >
                SaaS Side Project
              </p>
              <h1
                id="hero-heading"
                className={`${DISP} text-[clamp(58px,8.4vw,108px)] font-extrabold leading-[0.92] tracking-[-0.035em]`}
              >
                <span className="inline-block pb-[0.02em] shadow-[inset_0_-0.09em_0_#141412]">
                  RSVP
                </span>
                -Demo
              </h1>
              <p className="mt-[30px] text-balance text-[clamp(20px,2.35vw,29px)] font-[450] leading-[1.32] tracking-[-0.01em]">
                Manage event RSVPs without the spreadsheet chaos.
              </p>
              <ul className="mt-[34px] flex flex-wrap gap-x-2.5 gap-y-2">
                {STACK_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className={`${MONO} rounded-md border border-black/[0.14] bg-black/[0.04] py-1.5 pl-[11px] pr-3 text-[13px] tracking-[0.02em]`}
                  >
                    <span aria-hidden="true" className="mr-2 text-[#9A9A93]">
                      │
                    </span>
                    {chip}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`${MONO} mt-[34px] inline-flex items-center gap-[9px] border-b border-black/[0.14] text-[13px] tracking-[0.02em] transition-colors hover:border-[#141412]`}
              >
                <span
                  aria-hidden="true"
                  className="h-[7px] w-[7px] rounded-full bg-[#3fbf6a] shadow-[0_0_0_4px_rgba(63,191,106,0.22)]"
                />
                Live demo · {SITE_HOST}
              </Link>
            </div>
            <BrowserFrame
              src="/story/state-1.png"
              alt="RSVP register page — split-screen registration form"
              priority
            />
          </div>
        </section>

        {/* Core Flow × Decisions */}
        <section
          aria-labelledby="flow-heading"
          className="border-b border-black/[0.07] pb-[64px] pt-[82px]"
        >
          <div className={WRAP}>
            <h2
              id="flow-heading"
              className={`${DISP} mb-2 text-[clamp(34px,5.2vw,60px)] font-extrabold leading-none tracking-[-0.03em]`}
            >
              Core Flow &times; Decisions
            </h2>
            <p className="mb-[46px] max-w-[46ch] text-[17px] leading-[1.5] text-[#6C6C66] md:mb-[66px]">
              拆解活動現場真實情境，提出核心痛點。
            </p>

            <ul>
              {FLOW.map((row) => (
                <li
                  key={row.idx}
                  className="grid items-center gap-[26px] border-black/[0.07] py-[44px] first:pt-0 md:grid-cols-2 md:gap-[60px] [&+&]:border-t"
                >
                  <div className={row.flip ? "min-w-0 md:order-2" : "min-w-0"}>
                    <BrowserFrame src={row.src} alt={row.alt} />
                  </div>
                  <div className={row.flip ? "md:order-1" : undefined}>
                    <p
                      className={`${MONO} mb-5 flex items-center gap-3 text-xs tracking-[0.16em] text-[#9A9A93]`}
                    >
                      {row.idx}
                      <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-black/[0.14]"
                      />
                    </p>
                    <p
                      className={`${MONO} mb-3.5 text-[12.5px] tracking-[0.05em] text-[#6C6C66]`}
                    >
                      {row.kicker}
                    </p>
                    <h3
                      className={`${DISP} mb-[18px] text-balance text-[clamp(24px,3vw,37px)] font-bold leading-[1.08] tracking-[-0.02em]`}
                    >
                      {row.title}
                    </h3>
                    <p className="mb-[22px] max-w-[34ch] text-[16.5px] leading-[1.62] text-[#6C6C66]">
                      {row.desc}
                    </p>
                    <p
                      className={`${MONO} inline-block rounded-md border border-black/[0.14] bg-black/[0.04] px-[11px] py-1.5 text-[11px] uppercase tracking-[0.16em]`}
                    >
                      {row.badge}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Role band */}
        <section aria-labelledby="owned-heading" className="py-[66px]">
          <div className={WRAP}>
            <h2
              id="owned-heading"
              className={`${MONO} mb-[30px] text-xs uppercase tracking-[0.22em] text-[#6C6C66]`}
            >
              What I actually owned
            </h2>
            <p
              className={`${DISP} max-w-[22ch] text-balance text-[clamp(26px,3.6vw,44px)] font-semibold leading-[1.14] tracking-[-0.02em]`}
            >
              多年活動現場 RSVP
              實戰經驗，收斂成可交付的產品。從產品定義到功能取捨以及優先序安排，並以
              SDLC 框架推進。
            </p>
            <dl className="mt-[52px] grid border-t border-black/[0.14] md:grid-cols-2">
              {ROLES.map((role, i) => (
                <div
                  key={role.key}
                  className={`border-b border-black/[0.07] py-[22px] md:pb-[30px] md:pt-[26px] ${
                    i % 2 === 0
                      ? "md:pr-[44px]"
                      : "md:border-l md:border-black/[0.07] md:pl-[44px]"
                  }`}
                >
                  <dt
                    className={`${MONO} mb-3 text-[11.5px] uppercase tracking-[0.14em] text-[#9A9A93]`}
                  >
                    {role.key}
                  </dt>
                  <dd className="text-base leading-[1.55]">
                    {role.body}{" "}
                    <span className="text-[#6C6C66]">{role.dim}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section aria-label="Live demo entry" className="mt-[34px] border-t border-black/[0.07] pb-[30px] pt-[60px]">
          <div className={WRAP}>
            <div className="flex flex-wrap items-start gap-3.5">
              <Link
                href="/register"
                className={`${MONO} inline-flex items-center rounded-[9px] bg-[#141412] px-[26px] py-[15px] text-[13px] tracking-[0.02em] text-[#FAFAF8] transition-opacity hover:opacity-[0.88]`}
              >
                Open live demo
              </Link>
              <DemoEntryButton />
            </div>
            {/* PjM decision 2026-07-20: non-email footnote until email
                notification (Phase 2) actually ships. */}
            <p className="mt-[26px] max-w-[60ch] text-sm leading-[1.55] text-[#6C6C66]">
              現場報到{" "}
              <b className="font-semibold text-[#141412]">On-site check-in</b>{" "}
              已排入 Phase 2。
            </p>
          </div>
        </section>
      </main>

      {/* Footer — kept from the previous landing so the portfolio links
          (GitHub / LinkedIn / source) stay reachable; restyled to the mockup's
          hairline + mono language. */}
      <footer className="border-t border-black/[0.07]">
        <div
          className={`${WRAP} flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-[#6C6C66]`}
        >
          <p className="flex flex-wrap items-center gap-x-2">
            <span className="font-medium text-[#141412]">Renata Jiang</span>
            <span aria-hidden="true">·</span>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#141412]"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#141412]"
            >
              LinkedIn
            </a>
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MONO} text-xs tracking-[0.02em] transition-colors hover:text-[#141412]`}
          >
            Source · r-khiong/rsvp
          </a>
        </div>
      </footer>
    </div>
  );
}
