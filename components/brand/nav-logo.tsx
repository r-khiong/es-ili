"use client";

import Image from "next/image";

// Landing nav monogram. PR #1 shipped it as a static mark; this wraps it in a
// button so the mark also takes the visitor back to the top of the page.
//
// A plain anchor was rejected: it would leave /#top in the URL, and the root
// address is what goes on the resume and in the GitHub About field.
//
// The mark is decorative here — the button carries the accessible name, so the
// image is hidden from assistive tech instead of naming itself a second time.
export function NavLogo() {
  function handleClick() {
    // Read the motion preference at click time, not at render time: the server
    // has no window, and reading it here also picks up an OS-level change made
    // mid-session without needing an effect subscription.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  }

  return (
    <button type="button" aria-label="Back to top" onClick={handleClick}>
      <Image
        src="/brand/mark-primary-light.svg"
        alt=""
        aria-hidden="true"
        width={30}
        height={32}
        priority
        unoptimized
        className="h-[26px] w-auto"
      />
    </button>
  );
}
