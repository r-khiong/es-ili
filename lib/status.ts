import type { RegistrationStatus } from "@/lib/supabase/types";

// Single source of truth for status visuals. Colours are the brand-kit LOCKED
// status tokens (--st-sub / --st-app / --st-rej in globals.css); green fill
// always pairs with black text per the brand kit.
//
// `pending` renders as "Submitted" because that is the guest-facing word in the
// v9 spec — the DB value stays `pending`, so URLs like ?status=pending and every
// existing row are untouched. "Reviewed" appears only as an intermediate step on
// the status-page timeline; it is never a stored state.
//
// checked_in is added in RSVP-6 when it can actually be displayed.
export const STATUS_STYLES: Record<
  RegistrationStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Submitted", bg: "#DEDFE0", text: "#0A0A0A" },
  approved: { label: "Approved", bg: "#00F666", text: "#0A0A0A" },
  rejected: { label: "Rejected", bg: "#49494A", text: "#DEDFE0" },
};

export const SELECTED_ROW_BG = "#E0EEFF";

export const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export function isStatusFilter(value: string | undefined): value is StatusFilter {
  return value !== undefined && (STATUS_FILTERS as readonly string[]).includes(value);
}
