const PARIS_TIMEZONE = "Europe/Paris";

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: PARIS_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const labelFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: PARIS_TIMEZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface LocalDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export type ParisLocalResult =
  | { valid: true; date: Date; parts: LocalDateParts }
  | { valid: false; reason: "invalid" | "nonexistent" | "ambiguous" };

function dateParts(date: Date): LocalDateParts {
  const values: Record<string, number> = {};
  for (const part of partsFormatter.formatToParts(date)) {
    if (part.type !== "literal") values[part.type] = Number(part.value);
  }
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
  };
}

function toWallTime(parts: LocalDateParts): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
}

function sameParts(left: LocalDateParts, right: LocalDateParts): boolean {
  return left.year === right.year && left.month === right.month && left.day === right.day
    && left.hour === right.hour && left.minute === right.minute;
}

/** Parse a wall-clock time without depending on the browser/server timezone. */
export function parseParisLocal(value: string): ParisLocalResult {
  if (typeof value !== "string") return { valid: false, reason: "invalid" };
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return { valid: false, reason: "invalid" };
  const [, year, month, day, hour, minute] = match;
  const parts: LocalDateParts = {
    year: Number(year), month: Number(month), day: Number(day),
    hour: Number(hour), minute: Number(minute),
  };
  if (parts.year < 2000 || parts.year > 2100 || parts.month < 1 || parts.month > 12
    || parts.day < 1 || parts.day > 31 || parts.hour > 23 || parts.minute > 59) {
    return { valid: false, reason: "invalid" };
  }
  const naive = toWallTime(parts);
  const calendar = new Date(naive);
  if (calendar.getUTCFullYear() !== parts.year || calendar.getUTCMonth() + 1 !== parts.month
    || calendar.getUTCDate() !== parts.day) return { valid: false, reason: "invalid" };

  // Obtain possible offsets on both sides of a clock change, then round-trip
  // candidates. A spring gap has none; a repeated autumn hour has two.
  const offsets = new Set<number>();
  for (const hours of [-36, 0, 36]) {
    const sample = naive + hours * 60 * 60 * 1000;
    offsets.add(toWallTime(dateParts(new Date(sample))) - sample);
  }
  const candidates = [...offsets]
    .map((offset) => new Date(naive - offset))
    .filter((date) => sameParts(dateParts(date), parts));
  if (!candidates.length) return { valid: false, reason: "nonexistent" };
  if (candidates.length > 1) return { valid: false, reason: "ambiguous" };
  return { valid: true, date: candidates[0], parts };
}

export function formatRentalDate(date: Date): string {
  return labelFormatter.format(date);
}

function localString(parts: LocalDateParts): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function getParisLocalDateTime(date: Date = new Date()): string {
  return localString(dateParts(date));
}

export function addLocalCalendarDays(parts: LocalDateParts, days: number, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days, hour, minute));
  return localString({
    year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate(),
    hour: date.getUTCHours(), minute: date.getUTCMinutes(),
  });
}
