import Link from "next/link";
import { ArrowRight, ArrowUp, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoEntryButton } from "@/components/story/demo-entry-button";
import { ScrollReveal } from "@/components/story/scroll-reveal";

// RSVP-9 root landing redesign. Language layering: English is the skeleton
// (nav, buttons, section titles, role tags); Chinese is the narrative body
// (About copy, flow labels, on-site caption, disclaimer). Copy locked by the
// redesign spec — see docs/handoffs. Root serves the story; the product
// entry lives at /register.

const REPO_URL = "https://github.com/r-khiong/rsvp-demo";
const GITHUB_PROFILE_URL = "https://github.com/r-khiong";
const LINKEDIN_URL = "https://www.linkedin.com/in/renatajiang";

const PROBLEM_POINTS = [
  "名單散落在表單、試算表和 email，各處不同步",
  "報名者無法自行查詢狀態",
  "多方協作審核，缺乏單一可信狀態",
];

// Base images (public/story/state-N.png) arrive with chore-3; skeleton
// placeholders hold the slots until then. Card 4 (0/4 sprint close) is
// intentionally out of this comparison per spec §8 option A.
const STORYBOARD = [
  {
    flow: "Register 訪客報名",
    term: "8 → 4 → Phase 2",
    note: "做小做完",
    asset: "state-1.png",
  },
  {
    flow: "Status link 自查狀態",
    term: "Token-scoped RPC",
    note: "撈不走名單",
    asset: "state-2.png",
  },
  {
    flow: "Batch review 批次審核",
    term: "Batch-only",
    note: "定稿三天後推翻自己",
    asset: "state-3.png",
  },
];

// Sprint backlog chip temporarily points at the PRD until the Jira capture
// lands in the repo (PjM will supply the asset).
const ARTIFACT_CHIPS = [
  { label: "PRD", href: `${REPO_URL}/blob/main/docs/PRD.md` },
  { label: "Decision log", href: `${REPO_URL}/blob/main/docs/decision-log.md` },
  { label: "Sprint backlog", href: `${REPO_URL}/blob/main/docs/PRD.md` },
  { label: "Code", href: REPO_URL },
  { label: "Live demo", href: "/register" },
];

const ROLE_TAGS = [
  "Scope · PM",
  "Business rules · PM",
  "Data model · PM",
  "UX trade-offs · PM",
  "Implementation · Claude Code",
  "Decision boundaries · CLAUDE.md",
];

export default function Home() {
  return (
    <div id="top">
      {/* Nav */}
      <header className="border-b">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="h-5 w-5" />
            <span className="text-lg">RSVP</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:underline">
              About
            </a>
            <Link href="/register" className="hover:underline">
              RSVP
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="bg-zinc-900 text-zinc-50">
          <div className="mx-auto max-w-5xl space-y-6 px-6 py-16 lg:py-24">
            <h1
              id="hero-heading"
              className="max-w-2xl text-3xl font-bold leading-snug"
            >
              &ldquo;Manage event RSVPs without the spreadsheet chaos.&rdquo;
            </h1>
            <Button asChild size="lg" variant="secondary" className="font-semibold">
              <Link href="/register">Enter RSVP</Link>
            </Button>
          </div>
        </section>

        {/* About the Pain Point — The Problem → The Approach */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="scroll-mt-8 border-b"
        >
          <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
            <h2 id="about-heading" className="text-xl font-semibold">
              About the Pain Point
            </h2>

            <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex-1 space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  The Problem
                </h3>
                <ul className="space-y-2 text-base leading-relaxed">
                  {PROBLEM_POINTS.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden="true" className="text-muted-foreground">
                        ·
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ArrowRight
                aria-hidden="true"
                className="mx-auto h-5 w-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0"
              />

              <div className="flex-1 space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  The Approach
                </h3>
                <p className="text-base leading-relaxed">
                  一套輕鬆熟悉的 RSVP
                  系統——為每個角色清楚定義，收件、審核、狀態查詢。
                </p>
                <p className="text-base leading-relaxed">
                  以產品規劃出發：列出目標功能、劃清 scope in/out，定義工具、外觀與
                  UX，與 Claude Code
                  協作實作。技術選型偏主流生態、資源成熟，一人作業也能安全維護：Next.js
                  + Supabase、權限強制在 DB 層（RLS）、Netlify 部署、shadcn/ui。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core flow × decisions — vertical comparison, all visible */}
        <section aria-labelledby="flow-heading" className="border-b">
          <div className="mx-auto max-w-5xl space-y-10 px-6 py-16">
            <h2 id="flow-heading" className="text-xl font-semibold">
              Core Flow &times; Decisions
            </h2>

            <ul className="space-y-8">
              {STORYBOARD.map((group) => (
                <li key={group.asset}>
                  <ScrollReveal>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                      {/* Slot for public/story/state-N.png (chore-3); skeleton until the capture lands. */}
                      <div
                        role="img"
                        aria-label={`分鏡素材準備中：${group.flow}`}
                        className="aspect-[16/10] w-full shrink-0 animate-pulse rounded-lg border bg-muted sm:w-44"
                      />
                      <p className="flex-1 font-medium">{group.flow}</p>
                      <p className="inline-flex flex-wrap items-baseline gap-x-2 rounded-lg border px-3 py-1.5 text-sm">
                        <span className="font-medium">{group.term}</span>
                        <span aria-hidden="true" className="text-muted-foreground">
                          ·
                        </span>
                        <span className="text-muted-foreground">{group.note}</span>
                      </p>
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <div className="flex flex-wrap items-start gap-3">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/register">Open live demo</Link>
                </Button>
                <DemoEntryButton />
              </div>
              <p className="text-sm text-muted-foreground">
                On-site check-in — Phase 2（QR 已預留 token 介面，後端零改動可接）
              </p>
            </div>
          </div>
        </section>

        {/* Delivery chain & role split */}
        <section aria-labelledby="chain-heading">
          <div className="mx-auto max-w-5xl space-y-6 px-6 py-16">
            <h2 id="chain-heading" className="sr-only">
              Delivery chain
            </h2>
            <ul className="flex flex-wrap gap-2">
              {ARTIFACT_CHIPS.map((chip) => {
                const isExternal = chip.href.startsWith("http");
                const chipClassName =
                  "inline-flex rounded-full border px-3 py-1 text-sm font-medium transition-colors hover:bg-muted";
                return (
                  <li key={chip.label}>
                    {isExternal ? (
                      <a
                        href={chip.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={chipClassName}
                      >
                        {chip.label}
                      </a>
                    ) : (
                      <Link href={chip.href} className={chipClassName}>
                        {chip.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap gap-2">
              {ROLE_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p className="flex flex-wrap items-center gap-x-2">
            <span className="font-medium text-foreground">Renata Jiang</span>
            <span aria-hidden="true">·</span>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </p>
          <p className="flex flex-wrap items-center gap-x-4">
            <span>Demo 資料純屬虛構，不長期保存個資。</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1 font-medium hover:underline"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Back to top
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
