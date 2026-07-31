"use client";

import { useState, useTransition } from "react";
import { signInAsDemo } from "@/app/admin/login/actions";

// Story-page CTA into the read-only admin demo (RSVP-8). Same failure-branch
// pattern as the login page: on success the server action redirects, so this
// component only ever renders the error state. Styled as the landing's
// secondary button (mockup .btn-ghost-l).
export function DemoEntryButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await signInAsDemo();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleClick}
        className="font-mono inline-flex items-center rounded-lg border border-[#D4D4D4] px-5 py-[11px] text-[13px] tracking-[0.04em] text-[#0A0A0A] transition-colors hover:border-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Entering demo..." : "Admin view-only →"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
