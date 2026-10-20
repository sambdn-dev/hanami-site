import { basketSubtotal, getVariant } from './variants.js';

// France métropolitaine. Rates per product, never a blanket 20% assumption.
// Catalogue evidence: erp/gazoneo-source-data.js, cart_verified, 2026-10-14.
// Seeds 10%; the four mineral fertilisers in this selection 20%.
// Repacked formats retain their parent's product rate. Live checkout remains authoritative.
const rates = Object.freeze({
  'resrpr-15': 1000, 'pro12-15': 1000,
  'fl-racines-25': 2000, 'sierrablen-3m-25': 2000,
  'ferrotop-mini-25': 2000, 'basfoliar-ferrotop-10l': 2000,
});

export function basketTaxTotals(items) {
  const totalTtcCents = basketSubtotal(items);
  if (totalTtcCents === null) return null;
  const groups = new Map();
  let totalHtCents = 0;
  for (const item of items) {
    const variant = getVariant(item.id);
    const rateBasisPoints = variant.vatRateBasisPoints ?? rates[variant.productId];
    if (!Number.isSafeInteger(rateBasisPoints)) return null;
    const ttcCents = variant.priceTtcCents * item.quantity;
    // Round each line once, after quantity multiplication. TVA is the exact remainder.
    const htCents = Math.round(ttcCents * 10000 / (10000 + rateBasisPoints));
    const vatCents = ttcCents - htCents;
    totalHtCents += htCents;
    const group = groups.get(rateBasisPoints) || { rateBasisPoints, htCents: 0, vatCents: 0, ttcCents: 0 };
    group.htCents += htCents; group.vatCents += vatCents; group.ttcCents += ttcCents;
    groups.set(rateBasisPoints, group);
  }
  return { totalHtCents, totalVatCents: totalTtcCents - totalHtCents, totalTtcCents, groups: [...groups.values()].sort((a, b) => a.rateBasisPoints - b.rateBasisPoints) };
}
