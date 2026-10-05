export type RentalDuration = "24h" | "48h" | "weekend";

export type RentalFulfillment = "pickup" | "delivery" | "to-confirm";

export type RentalAvailability = "available" | "unavailable" | "unknown";

/** A calendar entry consumes units for [startISO, endISO), in UTC. */
export interface RentalBlockedPeriod {
  startISO: string;
  endISO: string;
  units?: number;
}

export interface RentalProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  summary: string;
  description: string;
  benefits: readonly [string, string, string, string];
  included: readonly string[];
  photo: { src: string; alt: string };
  ratesTtcCents: Readonly<Record<RentalDuration, number | null>>;
  units: number | null;
  calendarConfigured: boolean;
  blockedPeriods: readonly RentalBlockedPeriod[];
}

/** Local times follow Europe/Paris, including seasonal clock changes. */
export interface RentalWeekendRule {
  startWeekday: number;
  startTime: string;
  endWeekday: number;
  endTime: string;
}

export interface RentalConfig {
  timezone: "Europe/Paris";
  weekendRule: RentalWeekendRule | null;
  fulfillmentFeesTtcCents: Readonly<Record<RentalFulfillment, number | null>>;
}

export interface RentalQuoteInput {
  itemIds: readonly string[];
  duration: RentalDuration;
  startLocal: string;
  fulfillment: RentalFulfillment;
}

export interface RentalQuoteItem {
  id: string;
  name: string;
  priceTtcCents: number | null;
  availability: RentalAvailability;
}

export interface RentalQuote {
  valid: boolean;
  errors: string[];
  startISO: string | null;
  endISO: string | null;
  startLabel: string;
  endLabel: string;
  availability: RentalAvailability;
  items: RentalQuoteItem[];
  rentalTotalTtcCents: number | null;
  fulfillmentFeeTtcCents: number | null;
  totalTtcCents: number | null;
  weekendConfigured: boolean;
}

export interface RentalQuoteOptions {
  now?: Date;
  products?: readonly RentalProduct[];
  config?: RentalConfig;
}
