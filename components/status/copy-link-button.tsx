"use client";

import { useEffect, useRef, useState } from "react";

const RESET_AFTER_MS = 2000;

/**
 * Copies the guest's status URL to the clipboard.
 *
 * `navigator.clipboard` is undefined outside a secure context, so the write is
 * wrapped: on failure the button says so and points at the link, which stays
 * selectable text either way. No dependency is added for this.
 */
export function CopyLinkButton({ value }: { value: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleClick() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), RESET_AFTER_MS);
    } catch (error: unknown) {
      console.error("[status] clipboard write failed", error);
      setState("failed");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        className="font-mono rounded-lg bg-[var(--brand-green)] px-3.5 py-2 text-[12px] font-medium tracking-[0.04em] text-black transition-opacity hover:opacity-90"
      >
        {state === "copied" ? "Copied" : "Copy link"}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Link copied to clipboard" : ""}
      </span>
      {state === "failed" && (
        <p className="text-[11px] text-[#F09090]">
          Copy failed — select the link and copy it manually.
        </p>
      )}
    </div>
  );
}
