"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { anonSupabase } from "@/lib/supabase/anon-client";
import { EventCard } from "@/components/event/event-card";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/register";

// Postgres unique_violation — the (event_id, email) constraint on registrations.
const DUPLICATE_EMAIL_CODE = "23505";

// Keeps the copy friendly but always carries the underlying code, so a failure
// can be diagnosed from a screenshot instead of requiring DevTools. A silent
// generic message previously hid a 42501 permission error for days.
function failureMessage(code?: string): string {
  return `Something went wrong. Please try again. (${code ?? "unknown"})`;
}

// Variant A row: label in a fixed 104px column, input to its right, dashed
// hairline between rows. Collapses to a single column below 900px, matching the
// mockup's own breakpoint rather than a Tailwind default.
const ROW =
  "grid grid-cols-1 gap-2 border-b border-dashed border-[var(--dash-d)] py-[15px] min-[900px]:grid-cols-[104px_minmax(0,1fr)] min-[900px]:items-center min-[900px]:gap-[18px]";

const INPUT_BASE =
  "min-h-[44px] w-full rounded-lg border bg-white/[0.03] px-[13px] py-[11px] text-[14px] text-[#DEDFE0] placeholder:text-[#5E5E5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function FieldError_({ error }: { error?: FieldError }) {
  if (!error) return null;
  return (
    <p className="mt-[7px] flex items-center gap-[7px] text-[12px] text-[#F09090]">
      <span
        aria-hidden="true"
        className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#E06060]"
      />
      {error.message}
    </p>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: "onTouched",
  });

  const errors = form.formState.errors;

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null);

    try {
      const { data: event, error: eventErr } = await anonSupabase
        .from("events")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (eventErr || !event) {
        console.error("[register] event fetch failed", eventErr);
        setServerError(failureMessage(eventErr?.code));
        return;
      }

      const token = nanoid();

      // No .select() chained here on purpose: `anon` holds INSERT but not
      // SELECT on registrations, so asking for the inserted row back would
      // fail the whole submit.
      const { error: insertErr } = await anonSupabase
        .from("registrations")
        .insert({
          event_id: event.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          token,
          status: "pending",
        });

      if (insertErr) {
        console.error("[register] insert failed", insertErr);
        if (insertErr.code === DUPLICATE_EMAIL_CODE) {
          setServerError("This email has already registered.");
        } else {
          setServerError(failureMessage(insertErr.code));
        }
        return;
      }

      router.push(`/status/${token}`);
    } catch (error: unknown) {
      // Without this the throw escapes handleSubmit as an unhandled rejection:
      // no banner, no redirect, the button just re-enables.
      console.error("[register] submit threw", error);
      setServerError(failureMessage("exception"));
    }
  }

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
          Registration
        </span>
      </nav>

      <main className="mx-auto w-full max-w-[560px] px-6 py-14 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9E9E]">
          Step 1 of 1
        </p>
        <h1 className="font-heading mt-3.5 text-[clamp(26px,3.4vw,34px)] font-bold leading-[1.08] tracking-[-0.015em]">
          Register for the event
        </h1>

        <EventCard className="mt-[30px] mb-[34px]" />

        {serverError && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-[10px] rounded-lg border border-[#E06060] bg-[#E06060]/10 px-4 py-3 text-left text-[13px] text-[#F09090]"
          >
            <span
              aria-hidden="true"
              className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#E06060]"
            />
            {serverError}
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="text-left"
          noValidate
        >
          <div className="border-t border-dashed border-[var(--dash-d)]">
            <div className={ROW}>
              <label
                htmlFor="name"
                className="font-mono text-[11.5px] tracking-[0.06em] text-[#DEDFE0]"
              >
                Name
              </label>
              <div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={`${INPUT_BASE} ${errors.name ? "border-[#E06060]" : "border-white/[0.16]"}`}
                  {...form.register("name")}
                />
                <FieldError_ error={errors.name} />
              </div>
            </div>

            <div className={ROW}>
              <label
                htmlFor="email"
                className="font-mono text-[11.5px] tracking-[0.06em] text-[#DEDFE0]"
              >
                Email
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={`${INPUT_BASE} ${errors.email ? "border-[#E06060]" : "border-white/[0.16]"}`}
                  {...form.register("email")}
                />
                <FieldError_ error={errors.email} />
              </div>
            </div>

            <div className={ROW}>
              <label
                htmlFor="phone"
                className="font-mono text-[11.5px] tracking-[0.06em] text-[#DEDFE0]"
              >
                Phone
              </label>
              <div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  className={`${INPUT_BASE} ${errors.phone ? "border-[#E06060]" : "border-white/[0.16]"}`}
                  {...form.register("phone")}
                />
                <FieldError_ error={errors.phone} />
              </div>
            </div>

            <div className={ROW}>
              <label
                htmlFor="company"
                className="font-mono text-[11.5px] tracking-[0.06em] text-[#DEDFE0]"
              >
                Company
                <span className="block text-[9.5px] uppercase tracking-[0.1em] text-[#5E5E5E]">
                  Optional
                </span>
              </label>
              <div>
                <input
                  id="company"
                  type="text"
                  autoComplete="organization"
                  aria-invalid={!!errors.company}
                  className={`${INPUT_BASE} ${errors.company ? "border-[#E06060]" : "border-white/[0.16]"}`}
                  {...form.register("company")}
                />
                <FieldError_ error={errors.company} />
              </div>
            </div>
          </div>

          <p className="mt-7 text-[11.5px] leading-[1.7] text-[#9E9E9E]">
            By submitting this form you agree this is a demo site. The
            details you enter are used only to review this demo registration,
            are never shared with third parties or used for marketing, and are
            cleared periodically.
          </p>

          <div className="mt-[26px]">
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="font-mono rounded-lg bg-[var(--brand-green)] px-[34px] py-3.5 text-[14px] font-medium tracking-[0.04em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : "Submit registration"}
            </button>
          </div>
        </form>
      </main>

      <footer className="border-t border-white/10 px-[34px] py-5 text-center">
        <span className="font-mono text-[10.5px] tracking-[0.06em] text-[#5E5E5E]">
          Copyright © 2026 és&apos;ilî. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
