// Single source of truth for the demo event's metadata. Pure constants — no env
// read, no DB round-trip. The seeded row in supabase/seed.sql only carries the
// event name; everything a reviewer-facing surface needs to render (when, where,
// who) lives here so no template re-types it.
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
  readonly description: string;
  readonly organizerName: string;
};

export const EVENT: EventInfo = {
  name: "Product Builders Meetup Vol.3",
  startsAt: "2026-09-12T14:00:00+08:00",
  endsAt: "2026-09-12T17:30:00+08:00",
  timeZone: "Asia/Taipei",
  venueName: "CLBC 大直心",
  venueAddress: "台北市中山區樂群三路 123 號 5F",
  description:
    "An afternoon of product talks and open networking for builders.",
  organizerName: "RSVP",
};

// Formatting is composed from three separate Intl formatters rather than
// Intl.DateTimeFormat#formatRange: the range separator and its surrounding
// whitespace vary by ICU version, and this string has to render identically in
// the Node build, the browser, and an email client.
function timeFieldsIn(date: Date, formatter: Intl.DateTimeFormat) {
  const parts = formatter.formatToParts(date);
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    hour: valueOf("hour"),
    minute: valueOf("minute"),
    dayPeriod: valueOf("dayPeriod"),
  };
}

/**
 * Human-readable event window for display and email copy.
 *
 * @example
 * formatEventWhen() // "Sat, Sep 12, 2026 · 2:00–5:30 PM (UTC+8)"
 */
export function formatEventWhen(event: EventInfo = EVENT): string {
  const { timeZone } = event;
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });
  const zoneFormatter = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "shortOffset",
    timeZone,
  });

  const from = timeFieldsIn(start, timeFormatter);
  const to = timeFieldsIn(end, timeFormatter);

  // Drop the leading meridiem when both ends share it ("2:00–5:30 PM"), keep
  // both when the window crosses noon or midnight ("11:00 AM–1:30 PM").
  const startTime =
    from.dayPeriod === to.dayPeriod
      ? `${from.hour}:${from.minute}`
      : `${from.hour}:${from.minute} ${from.dayPeriod}`;
  const endTime = `${to.hour}:${to.minute} ${to.dayPeriod}`;

  const offsetLabel = (
    zoneFormatter
      .formatToParts(start)
      .find((part) => part.type === "timeZoneName")?.value ?? ""
  ).replace("GMT", "UTC");

  return `${dateFormatter.format(start)} · ${startTime}–${endTime} (${offsetLabel})`;
}
