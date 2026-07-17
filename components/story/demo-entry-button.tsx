"use client";

import { useState, useTransition } from "react";
import { signInAsDemo } from "@/app/admin/login/actions";

// Story-page CTA into the read-only admin demo (RSVP-8). Same failure-branch
// pattern as the login page: on success the server action redirects, so this
// component only ever renders the error state. Styled as the landing's
// secondary button (mockup .btn-s) — it only renders inside app/page.tsx,
// where the --font-jbm variable is in scope.
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
        className="inline-flex items-center rounded-[9px] border border-black/30 px-[26px] py-[15px] font-[family-name:var(--font-jbm),ui-monospace,monospace] text-[13px] tracking-[0.02em] text-[#141412] transition-colors hover:border-[#141412] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Entering demo..." : "Enter admin demo · read-only"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
