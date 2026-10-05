import assert from "node:assert/strict";
import { test } from "node:test";
import { RENTAL_PRODUCTS } from "../../src/lib/rentals/catalog";
import { RENTAL_CONFIG } from "../../src/lib/rentals/config";
import { getParisLocalDateTime } from "../../src/lib/rentals/dates";
import { quoteRental } from "../../src/lib/rentals/engine";
import type { RentalConfig, RentalProduct, RentalQuoteInput } from "../../src/lib/rentals/types";

const now = new Date("2026-10-05T10:00:00.000Z");
const firstId = "landzie-overseeding-tool";
const secondId = "epandeur-ryobi-batterie";
const input: RentalQuoteInput = {
  itemIds: [firstId],
  duration: "24h",
  startLocal: "2026-10-10T10:00",
  fulfillment: "pickup",
};

function configuredProducts(): RentalProduct[] {
  return RENTAL_PRODUCTS.map((product) => ({
    ...product,
    units: 1,
    calendarConfigured: true,
    blockedPeriods: [],
    ratesTtcCents: { "24h": 1800, "48h": 2800, weekend: 3200 },
  }));
}

const configuredFees: RentalConfig = {
  ...RENTAL_CONFIG,
  fulfillmentFeesTtcCents: { pickup: 400, delivery: 1500, "to-confirm": null },
};

test("the public catalogue stays unconfigured and does not promise availability or a price", () => {
  const result = quoteRental(input, { now });
  assert.equal(result.valid, true);
  assert.equal(result.availability, "unknown");
  assert.equal(result.items[0].priceTtcCents, null);
  assert.equal(result.rentalTotalTtcCents, null);
  assert.equal(result.fulfillmentFeeTtcCents, null);
  assert.equal(result.totalTtcCents, null);
  assert.equal(result.startISO, "2026-10-10T08:00:00.000Z");
  assert.equal(result.endISO, "2026-10-11T08:00:00.000Z");
  assert.match(result.startLabel, /10 oct/);
});

test("24 h and 48 h are exact elapsed hours across the spring clock change", () => {
  const quote24 = quoteRental({ ...input, startLocal: "2027-03-27T10:00" }, { now });
  const quote48 = quoteRental({ ...input, startLocal: "2027-03-27T10:00", duration: "48h" }, { now });
  assert.equal(quote24.valid, true);
  assert.equal(quote24.startISO, "2027-03-27T09:00:00.000Z");
  assert.equal(quote24.endISO, "2027-03-28T09:00:00.000Z");
  assert.match(quote24.endLabel, /11:00/);
  assert.equal(quote48.endISO, "2027-03-29T09:00:00.000Z");
  assert.match(quote48.endLabel, /11:00/);
});

test("24 h is also exact across the autumn clock change", () => {
  const result = quoteRental({ ...input, startLocal: "2027-10-30T10:00" }, { now });
  assert.equal(result.startISO, "2027-10-30T08:00:00.000Z");
  assert.equal(result.endISO, "2027-10-31T08:00:00.000Z");
  assert.match(result.endLabel, /09:00/);
});

test("a nonexistent spring wall-clock time is rejected", () => {
  const result = quoteRental({ ...input, startLocal: "2027-03-28T02:30" }, { now });
  assert.equal(result.valid, false);
  assert.equal(result.startISO, null);
  assert.match(result.errors.join(" "), /n’existe pas/);
});

test("an ambiguous autumn wall-clock time is rejected, rather than assigned silently", () => {
  const result = quoteRental({ ...input, startLocal: "2027-10-31T02:30" }, { now });
  assert.equal(result.valid, false);
  assert.equal(result.startISO, null);
  assert.match(result.errors.join(" "), /se répète/);
});

test("invalid calendar dates, malformed dates and past starts are rejected", () => {
  for (const startLocal of ["2027-02-29T10:00", "2026-13-10T10:00", "2026-10-10T24:00", "2026-10-10", "2026-10-01T10:00"]) {
    const result = quoteRental({ ...input, startLocal }, { now });
    assert.equal(result.valid, false, startLocal);
    assert.equal(result.availability, "unknown");
    assert.equal(result.totalTtcCents, null);
  }
});

test("unknown equipment, duplicate IDs, empty and excessive selections are rejected", () => {
  for (const itemIds of [[], ["not-a-product"], [firstId, firstId], [...RENTAL_PRODUCTS.map((product) => product.id), firstId]]) {
    const result = quoteRental({ ...input, itemIds }, { now });
    assert.equal(result.valid, false);
    assert.equal(result.availability, "unknown");
  }
});

test("invalid duration and fulfilment cannot produce prices", () => {
  const result = quoteRental({ ...input, duration: "7days", fulfillment: "post" } as unknown as RentalQuoteInput, { now });
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
  assert.equal(result.totalTtcCents, null);
});

test("an unconfigured weekend permits a manual request, with its return date explicitly unknown", () => {
  const result = quoteRental({ ...input, duration: "weekend" }, { now, products: configuredProducts(), config: configuredFees });
  assert.equal(result.valid, true);
  assert.equal(result.weekendConfigured, false);
  assert.equal(result.endISO, null);
  assert.equal(result.endLabel, "À confirmer");
  assert.equal(result.availability, "unknown");
  assert.equal(result.totalTtcCents, null);
});

test("a configured weekend uses local collection and return times across a DST weekend", () => {
  const config: RentalConfig = {
    ...configuredFees,
    weekendRule: { startWeekday: 5, startTime: "18:00", endWeekday: 1, endTime: "09:00" },
  };
  const result = quoteRental({ ...input, duration: "weekend", startLocal: "2027-03-26T18:00" }, {
    now, products: configuredProducts(), config,
  });
  assert.equal(result.valid, true);
  assert.equal(result.weekendConfigured, true);
  assert.equal(result.startISO, "2027-03-26T17:00:00.000Z");
  assert.equal(result.endISO, "2027-03-29T07:00:00.000Z");
  assert.equal(result.availability, "available");
  assert.equal(result.totalTtcCents, 3600);
  const wrongStart = quoteRental({ ...input, duration: "weekend", startLocal: "2027-03-27T18:00" }, { now, config });
  assert.equal(wrongStart.valid, false);
  assert.match(wrongStart.errors.join(" "), /vendredi/);
});

test("a conflict anywhere within the rental blocks one configured unit", () => {
  const products = configuredProducts();
  products[0].blockedPeriods = [{ startISO: "2026-10-10T15:00:00Z", endISO: "2026-10-10T16:00:00Z" }];
  const result = quoteRental(input, { now, products });
  assert.equal(result.availability, "unavailable");
  assert.equal(result.items[0].availability, "unavailable");
});

test("exclusive end times allow an adjacent rental with no overlap", () => {
  const products = configuredProducts();
  products[0].blockedPeriods = [
    { startISO: "2026-10-09T08:00:00Z", endISO: "2026-10-10T08:00:00Z" },
    { startISO: "2026-10-11T08:00:00Z", endISO: "2026-10-12T08:00:00Z" },
  ];
  assert.equal(quoteRental(input, { now, products }).availability, "available");
});

test("availability counts peak simultaneous reservations, not unrelated blocks in the interval", () => {
  const products = configuredProducts();
  products[0].units = 2;
  products[0].blockedPeriods = [
    { startISO: "2026-10-10T10:00:00Z", endISO: "2026-10-10T11:00:00Z" },
    { startISO: "2026-10-10T11:00:00Z", endISO: "2026-10-10T12:00:00Z" },
  ];
  assert.equal(quoteRental(input, { now, products }).availability, "available");
  products[0].blockedPeriods = [
    { startISO: "2026-10-10T10:00:00Z", endISO: "2026-10-10T12:00:00Z" },
    { startISO: "2026-10-10T11:00:00Z", endISO: "2026-10-10T13:00:00Z" },
  ];
  assert.equal(quoteRental(input, { now, products }).availability, "unavailable");
});

test("blocked quantities consume the corresponding number of units", () => {
  const products = configuredProducts();
  products[0].units = 3;
  products[0].blockedPeriods = [{ startISO: "2026-10-10T10:00:00Z", endISO: "2026-10-10T12:00:00Z", units: 2 }];
  assert.equal(quoteRental(input, { now, products }).availability, "available");
  products[0].blockedPeriods = [{ ...products[0].blockedPeriods[0], units: 3 }];
  assert.equal(quoteRental(input, { now, products }).availability, "unavailable");
});

test("an incomplete or invalid calendar cannot claim available stock", () => {
  const products = configuredProducts();
  products[0].calendarConfigured = false;
  assert.equal(quoteRental(input, { now, products }).availability, "unknown");
  products[0].calendarConfigured = true;
  products[0].blockedPeriods = [{ startISO: "2026-10-10T10:00:00", endISO: "2026-10-10T12:00:00" }];
  assert.equal(quoteRental(input, { now, products }).availability, "unknown");
  products[0].blockedPeriods = [{ startISO: "2026-10-10T12:00:00Z", endISO: "2026-10-10T10:00:00Z" }];
  assert.equal(quoteRental(input, { now, products }).availability, "unknown");
  products[0].blockedPeriods = [{ startISO: "2027-02-30T10:00:00Z", endISO: "2027-03-02T10:00:00Z" }];
  assert.equal(quoteRental(input, { now, products }).availability, "unknown");
  products[0].units = 0;
  assert.equal(quoteRental(input, { now, products }).availability, "unavailable");
});

test("a pack is available only when every selected item is available", () => {
  const products = configuredProducts();
  const selected = { ...input, itemIds: [firstId, secondId] };
  assert.equal(quoteRental(selected, { now, products }).availability, "available");
  products.find((product) => product.id === secondId)!.calendarConfigured = false;
  assert.equal(quoteRental(selected, { now, products }).availability, "unknown");
  products[0].blockedPeriods = [{ startISO: "2026-10-10T10:00:00Z", endISO: "2026-10-10T12:00:00Z" }];
  assert.equal(quoteRental(selected, { now, products }).availability, "unavailable");
});

test("configured TTC rates sum without inventing a pack discount, with separate fulfilment", () => {
  const products = configuredProducts();
  const result = quoteRental({ ...input, itemIds: [firstId, secondId] }, { now, products, config: configuredFees });
  assert.equal(result.items.length, 2);
  assert.equal(result.rentalTotalTtcCents, 3600);
  assert.equal(result.fulfillmentFeeTtcCents, 400);
  assert.equal(result.totalTtcCents, 4000);
  assert.equal(quoteRental({ ...input, fulfillment: "delivery" }, { now, products, config: configuredFees }).totalTtcCents, 3300);
});

test("one unknown rate or fulfilment fee makes the total unknown; zero is a valid configured value", () => {
  const products = configuredProducts();
  products[0].ratesTtcCents = { "24h": null, "48h": 0, weekend: 3200 };
  assert.equal(quoteRental(input, { now, products, config: configuredFees }).totalTtcCents, null);
  assert.equal(quoteRental({ ...input, duration: "48h" }, { now, products, config: configuredFees }).totalTtcCents, 400);
  assert.equal(quoteRental({ ...input, duration: "48h", fulfillment: "to-confirm" }, { now, products, config: configuredFees }).totalTtcCents, null);
});

test("local datetime formatting stays in Europe/Paris regardless of the process timezone", () => {
  assert.equal(getParisLocalDateTime(new Date("2026-10-10T08:00:00Z")), "2026-10-10T10:00");
  assert.equal(getParisLocalDateTime(new Date("2027-01-10T09:00:00Z")), "2027-01-10T10:00");
});
