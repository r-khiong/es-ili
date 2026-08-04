import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ApprovedQr } from "@/components/status/approved-qr";
import { CopyLinkButton } from "@/components/status/copy-link-button";
import { EventCard } from "@/components/event/event-card";
import { EVENT } from "@/lib/event";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import type { RegistrationStatus } from "@/lib/supabase/types";

// Brand status tokens, mirrored from globals.css. Inline hex rather than
// var(--st-*) because these land in a style attribute on a Server Component.
const DOT_SUBMITTED = "#DEDFE0";
const DOT_REVIEWED = "#9E9E9E";
const DOT_APPROVED = "#00F666";
const DOT_REJECTED = "#49494A";
const DOT_UNREACHED = "#2A2A2A";

type Step = {
  label: string;
  /** null = no timestamp available for this step; see timelineFor(). */
  at: string | null;
  done: boolean;
  dot: string;
};

/**
 * The stored status is one of three values; the timeline shows three steps.
 * "Reviewed" is a visual waypoint only — it is never a value in the database
 * (see lib/status.ts) — so an approved or rejected row lights it too.
 *
 * Only the Submitted step carries a timestamp. get_registration_by_token()
 * returns created_at but not status_updated_at (verified against the live
 * function on 2026-07-31), and widening it means dropping and recreating the
 * function plus re-granting EXECUTE to both anon and authenticated — a
 * migration, which this round is scoped to avoid. Reached steps therefore
 * render no stamp rather than an em dash, so they are not mistaken for
 * steps that have not happened yet.
 */
function timelineFor(status: RegistrationStatus, createdAt: string): Step[] {
  const submitted: Step = {
    label: "Submitted",
    at: createdAt,
    done: true,
    dot: DOT_SUBMITTED,
  };

  if (status === "pending") {
    return [
      submitted,
      { label: "Reviewed", at: null, done: false, dot: DOT_UNREACHED },
      { label: "Approved", at: null, done: false, dot: DOT_UNREACHED },
    ];
  }

  return [
    submitted,
    { label: "Reviewed", at: null, done: true, dot: DOT_REVIEWED },
    status === "approved"
      ? { label: "Approved", at: null, done: true, dot: DOT_APPROVED }
      : { label: "Rejected", at: null, done: true, dot: DOT_REJECTED },
  ];
}

/** "07-30 17:42" in the event's timezone, matching the mockup's stamp format. */
function formatStamp(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
    timeZone: EVENT.timeZone,
  }).formatToParts(new Date(iso));

  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${valueOf("month")}-${valueOf("day")} ${valueOf("hour")}:${valueOf("minute")}`;
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_registration_by_token", { p_token: token })
    .single();

  if (error || !data) {
    // PGRST116 = zero rows (a genuinely unknown token). Anything else is a
    // query/permission failure — log it so misconfigured grants or outages
    // are visible in server logs instead of masquerading as 404s.
    if (error && error.code !== "PGRST116") {
      console.error("[status] get_registration_by_token failed", error);
    }
    notFound();
  }

  const steps = timelineFor(data.status, data.created_at);

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-black text-[#DEDFE0]">
      <nav className="flex items-center justify-between border-b border-white/10 px-[34px] py-[18px]">
        <Image
          src="/brand/mark-primary-dark.svg"
          alt="RSVP"
          width={30}
          height={32}
          priority
          className="h-[26px] w-auto"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9E9E9E]">
          Status
        </span>
      </nav>

      <main className="mx-auto w-full max-w-[560px] px-6 py-13">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9E9E]">
          Registration submitted
        </p>
        <h1 className="font-heading mt-3.5 text-[clamp(24px,3.2vw,31px)] font-bold leading-[1.1] tracking-[-0.015em]">
          We&apos;ve received your registration
        </h1>

        <section
          aria-labelledby="save-link-heading"
          className="mt-[26px] mb-[30px] rounded-[0.625rem] border border-[var(--brand-green)] bg-[var(--brand-green)]/[0.045] px-[18px] py-4"
        >
          <h2
            id="save-link-heading"
            className="font-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[var(--brand-green)]"
          >
            <span
              aria-hidden="true"
              className="h-[9px] w-[9px] rounded-full bg-[var(--brand-green)]"
            />
            Save this link
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-[1.65]">
            Keep this link to check your review status anytime.
          </p>
          <div className="mt-3.5 flex flex-wrap items-start gap-2.5">
            <span className="font-mono min-w-0 flex-1 basis-60 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-white/[0.16] bg-white/[0.04] px-3 py-2.5 text-[11.5px]">
              {SITE_HOST}/status/{token}
            </span>
            <CopyLinkButton value={`${SITE_URL}/status/${token}`} />
          </div>
        </section>

        <ol className="mb-[30px] rounded-[0.625rem] border border-white/10 px-[18px] py-1.5">
          {steps.map((step) => (
            <li
              key={step.label}
              className="flex items-center gap-3 border-b border-white/10 py-[13px] text-[13.5px] last:border-b-0"
            >
              <span
                aria-hidden="true"
                className="h-[9px] w-[9px] shrink-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.20)]"
                style={{ backgroundColor: step.dot }}
              />
              <span className={`flex-1 ${step.done ? "" : "text-[#5E5E5E]"}`}>
                {step.label}
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.06em] text-[#5E5E5E]">
                {step.at ? formatStamp(step.at) : step.done ? "" : "—"}
              </span>
            </li>
          ))}
        </ol>

        {data.status === "approved" && (
          <div className="mb-[30px] flex flex-col items-center gap-3">
            <ApprovedQr token={token} />
            <p className="text-[13px] text-[#9E9E9E]">
              Show this QR code at check-in
            </p>
          </div>
        )}

        <EventCard />
      </main>

      <footer className="border-t border-white/10 px-[34px] py-5 text-center">
        <span className="font-mono text-[10.5px] tracking-[0.06em] text-[#5E5E5E]">
          Copyright © 2026 és&apos;ilî. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
