// Single source of truth for the demo event's metadata. Pure constants — no env
// read, no DB round-trip. The seeded row in supabase/seed.sql only carries the
// event name; everything a reviewer-facing surface needs to render (when, where,
// how to get there) lives here so no template re-types it.
//
// Mirrors the module-level constant pattern of lib/status.ts and lib/site.ts.

export type EventInfo = {
  readonly name: string;
  /** ISO 8601 with an explicit UTC offset. */
  readonly startsAt: string;
  readonly endsAt: string;
  /** IANA zone — drives all display formatting. */
  readonly timeZone: string;
  readonly venueName: string;
  readonly venueAddress: string;
  /**
   * Google Maps query link, not a place-ID pin. A query link keeps working if
   * the venue's listing is renamed or re-registered; the trade-off is that it
   * lands on a search result rather than an exact pin (PjM decision, v9).
   */
  readonly mapsUrl: string;
  readonly description: string;
  readonly organizerName: string;
};

export const EVENT: EventInfo = {
  name: "Digital Marketing Summit",
  startsAt: "2026-09-20T19:00:00+08:00",
  endsAt: "2026-09-20T21:30:00+08:00",
  timeZone: "Asia/Taipei",
  venueName: "Aspace YS",
  venueAddress: "No. 1, Yumen St., Zhongshan Dist., Taipei",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Aspace+YS+No.+1+Yumen+St+Zhongshan+Dist+Taipei",
  description:
    "An evening of talks and open networking for digital marketing practitioners.",
  organizerName: "RSVP",
};

// Formatting is composed from separate Intl formatters rather than
// Intl.DateTimeFormat#formatRange: the range separator and its surrounding
// whitespace vary by ICU version, and this string has to render identically in
// the Node build, the browser, and an email client.
function timeIn(date: Date, formatter: Intl.DateTimeFormat): string {
  const parts = formatter.formatToParts(date);
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${valueOf("hour")}:${valueOf("minute")}`;
}

/**
 * Human-readable event window for display and email copy.
 *
 * @example
 * formatEventWhen() // "Sep 20, 2026 (Sun) 19:00–21:30 GMT+8"
 */
export function formatEventWhen(event: EventInfo = EVENT): string {
  const { timeZone } = event;
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone,
  });
  // hourCycle h23 pins midnight to "00:00"; hour12:false alone can yield "24:00".
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
    timeZone,
  });
  const zoneFormatter = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "shortOffset",
    timeZone,
  });

  const offsetLabel =
    zoneFormatter
      .formatToParts(start)
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return `${dateFormatter.format(start)} (${weekdayFormatter.format(start)}) ${timeIn(start, timeFormatter)}–${timeIn(end, timeFormatter)} ${offsetLabel}`;
}
