import type { RentalConfig, RentalDuration } from "./types";

export const RENTAL_DURATIONS: readonly {
  id: RentalDuration;
  label: string;
  description: string;
}[] = [
  { id: "24h", label: "24 h", description: "Une journée pour votre intervention." },
  { id: "48h", label: "48 h", description: "Deux journées pour avancer à votre rythme." },
  { id: "weekend", label: "Week-end", description: "Les horaires de départ et de retour sont à confirmer." },
];

/**
 * Values left null are not published as free or available.
 * Set weekendRule only after the actual collection and return policy is agreed.
 * Sale delivery prices do not establish a rental delivery/return price.
 */
export const RENTAL_CONFIG: RentalConfig = {
  timezone: "Europe/Paris",
  weekendRule: null,
  fulfillmentFeesTtcCents: {
    pickup: null,
    delivery: null,
    "to-confirm": null,
  },
};
