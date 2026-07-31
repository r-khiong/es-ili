import { EVENT, formatEventWhen } from "@/lib/event";

// Event / When / Where block shared by /register and /status (mockup v9 .evt).
// Dark-surface only — both guest pages are dark, and the landing does not show
// event details, so there is no light variant to parameterise yet.

function Divider() {
  return <hr className="my-[14px] border-0 border-t border-white/10" />;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9E9E9E]">
        {label}
      </div>
      <div className="mt-1.5 text-[14px]">{children}</div>
    </div>
  );
}

export function EventCard({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="Event details"
      className={`rounded-[0.625rem] border border-white/10 px-5 py-[18px] text-left ${className}`}
    >
      <Field label="Event">
        <span className="font-heading text-[18px] font-semibold">
          {EVENT.name}
        </span>
      </Field>
      <Divider />
      <Field label="When">{formatEventWhen()}</Field>
      <Divider />
      <Field label="Where">
        {EVENT.venueName} · {EVENT.venueAddress}
        <a
          href={EVENT.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2.5 whitespace-nowrap border-b border-white/[0.28] font-mono text-[11px] tracking-[0.04em] text-[#DEDFE0] hover:border-[#DEDFE0]"
        >
          Google Maps ↗
        </a>
      </Field>
    </section>
  );
}
