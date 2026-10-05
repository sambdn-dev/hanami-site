import { RENTAL_PRODUCTS } from "./catalog";
import { RENTAL_CONFIG } from "./config";
import { addLocalCalendarDays, formatRentalDate, parseParisLocal } from "./dates";
import type {
  RentalAvailability,
  RentalProduct,
  RentalQuote,
  RentalQuoteInput,
  RentalQuoteOptions,
  RentalWeekendRule,
} from "./types";

const HOUR_MS = 60 * 60 * 1000;
const MAX_ITEMS = 6;

function validCents(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function validWeekendRule(rule: RentalWeekendRule | null): rule is RentalWeekendRule {
  return !!rule
    && Number.isInteger(rule.startWeekday) && rule.startWeekday >= 0 && rule.startWeekday <= 6
    && Number.isInteger(rule.endWeekday) && rule.endWeekday >= 0 && rule.endWeekday <= 6
    && /^([01]\d|2[0-3]):[0-5]\d$/.test(rule.startTime)
    && /^([01]\d|2[0-3]):[0-5]\d$/.test(rule.endTime);
}

function calendarInstant(value: string): number | null {
  // Require ISO instants with an offset and reject calendar dates that Date.parse
  // would otherwise normalize (for example, February 30).
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) return null;
  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue, offset] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const calendar = new Date(Date.UTC(year, month - 1, day));
  if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1
    || calendar.getUTCFullYear() !== year || calendar.getUTCMonth() + 1 !== month || calendar.getUTCDate() !== day
    || Number(hourValue) > 23 || Number(minuteValue) > 59 || Number(secondValue ?? 0) > 59) return null;
  if (offset !== "Z" && (Number(offset.slice(1, 3)) > 23 || Number(offset.slice(4)) > 59)) return null;
  const instant = Date.parse(value);
  return Number.isFinite(instant) ? instant : null;
}

/** A known inventory is available only when its complete calendar is configured. */
function availabilityFor(product: RentalProduct, start: Date | null, end: Date | null): RentalAvailability {
  if (product.units === 0) return "unavailable";
  if (!Number.isSafeInteger(product.units) || product.units === null || product.units < 0
    || !product.calendarConfigured || !start || !end) return "unknown";

  const startTime = start.getTime();
  const endTime = end.getTime();
  const events: { time: number; delta: number }[] = [];
  for (const period of product.blockedPeriods) {
    const from = calendarInstant(period.startISO);
    const until = calendarInstant(period.endISO);
    const units = period.units ?? 1;
    if (from === null || until === null || until <= from
      || !Number.isSafeInteger(units) || units <= 0) return "unknown";
    if (from >= endTime || until <= startTime) continue;
    events.push({ time: Math.max(from, startTime), delta: units });
    events.push({ time: Math.min(until, endTime), delta: -units });
  }
  // Return releases stock before another booking starting at the same instant.
  events.sort((left, right) => left.time - right.time || left.delta - right.delta);
  let occupied = 0;
  for (const event of events) {
    occupied += event.delta;
    if (occupied >= product.units) return "unavailable";
  }
  return "available";
}

function aggregateAvailability(values: readonly RentalAvailability[]): RentalAvailability {
  if (values.includes("unavailable")) return "unavailable";
  if (!values.length || values.includes("unknown")) return "unknown";
  return "available";
}

function sumKnown(values: readonly (number | null)[]): number | null {
  if (!values.length || values.some((value) => value === null)) return null;
  const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  return Number.isSafeInteger(total) ? total : null;
}

/**
 * Pure calculation for a request, not a stock hold or an accepted reservation.
 * Unknown configuration stays unknown; calendar fixtures belong only in tests.
 */
export function quoteRental(input: RentalQuoteInput, options: RentalQuoteOptions = {}): RentalQuote {
  const products = options.products ?? RENTAL_PRODUCTS;
  const config = options.config ?? RENTAL_CONFIG;
  const now = options.now ?? new Date();
  const errors: string[] = [];
  const durationValid = ["24h", "48h", "weekend"].includes(input.duration);
  const fulfillmentValid = ["pickup", "delivery", "to-confirm"].includes(input.fulfillment);
  const weekendConfigured = validWeekendRule(config.weekendRule);

  if (!durationValid) errors.push("Choisissez une formule : 24 h, 48 h ou week-end.");
  if (!fulfillmentValid) errors.push("Choisissez un mode de remise du matériel.");
  const ids = Array.isArray(input.itemIds) ? input.itemIds : [];
  if (!ids.length) errors.push("Choisissez au moins un équipement.");
  if (ids.length > MAX_ITEMS) errors.push("La sélection ne peut pas dépasser six équipements.");
  if (new Set(ids).size !== ids.length) errors.push("Un équipement ne peut figurer qu’une fois dans la sélection.");
  const selected: RentalProduct[] = [];
  for (const id of [...new Set(ids)].slice(0, MAX_ITEMS)) {
    const product = typeof id === "string" ? products.find((entry) => entry.id === id) : undefined;
    if (!product) errors.push("Un équipement de la sélection n’est pas reconnu.");
    else selected.push(product);
  }

  let start: Date | null = null;
  let end: Date | null = null;
  const parsed = parseParisLocal(input.startLocal);
  if (!parsed.valid) {
    if (parsed.reason === "nonexistent") errors.push("Cette heure n’existe pas lors du passage à l’heure d’été. Choisissez un autre horaire.");
    else if (parsed.reason === "ambiguous") errors.push("Cette heure se répète lors du passage à l’heure d’hiver. Choisissez un horaire avant 2 h ou après 3 h.");
    else errors.push("Renseignez une date et une heure de départ valides.");
  } else {
    start = parsed.date;
    if (!Number.isFinite(now.getTime()) || start.getTime() <= now.getTime()) {
      errors.push("La date de départ doit être dans le futur.");
    }
    if (input.duration === "24h" || input.duration === "48h") {
      end = new Date(start.getTime() + (input.duration === "24h" ? 24 : 48) * HOUR_MS);
    } else if (input.duration === "weekend" && weekendConfigured) {
      const rule = config.weekendRule;
      if (rule) {
        const weekday = new Date(Date.UTC(parsed.parts.year, parsed.parts.month - 1, parsed.parts.day)).getUTCDay();
        const time = input.startLocal.slice(11);
        if (weekday !== rule.startWeekday || time !== rule.startTime) {
          const weekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
          errors.push(`La formule week-end commence le ${weekdays[rule.startWeekday]} à ${rule.startTime.replace(":", " h ")}.`);
        } else {
          let days = (rule.endWeekday - rule.startWeekday + 7) % 7;
          if (days === 0 && rule.endTime <= rule.startTime) days = 7;
          const result = parseParisLocal(addLocalCalendarDays(parsed.parts, days, rule.endTime));
          if (result.valid && result.date.getTime() > start.getTime()) end = result.date;
          else errors.push("L’horaire de retour du week-end doit être confirmé avec Hanami pour cette date.");
        }
      }
    }
  }

  const valid = errors.length === 0;
  const items = selected.map((product) => ({
    id: product.id,
    name: product.name,
    priceTtcCents: valid && durationValid && validCents(product.ratesTtcCents[input.duration])
      ? product.ratesTtcCents[input.duration] : null,
    availability: valid ? availabilityFor(product, start, end) : "unknown" as RentalAvailability,
  }));
  const rentalTotalTtcCents = valid ? sumKnown(items.map((item) => item.priceTtcCents)) : null;
  const fee = fulfillmentValid ? config.fulfillmentFeesTtcCents[input.fulfillment] : null;
  const fulfillmentFeeTtcCents = valid && validCents(fee) ? fee : null;
  // A weekend lacking agreed return times remains a manual request even if a rate exists.
  const totalTtcCents = valid && end && rentalTotalTtcCents !== null && fulfillmentFeeTtcCents !== null
    ? sumKnown([rentalTotalTtcCents, fulfillmentFeeTtcCents]) : null;

  return {
    valid,
    errors,
    startISO: start?.toISOString() ?? null,
    endISO: end?.toISOString() ?? null,
    startLabel: start ? formatRentalDate(start) : "À choisir",
    endLabel: end ? formatRentalDate(end) : "À confirmer",
    availability: valid ? aggregateAvailability(items.map((item) => item.availability)) : "unknown",
    items,
    rentalTotalTtcCents,
    fulfillmentFeeTtcCents,
    totalTtcCents,
    weekendConfigured,
  };
}
