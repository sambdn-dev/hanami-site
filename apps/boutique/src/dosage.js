import { DOSAGE_PROFILES } from './dosage-data.js';
import { getVariant } from './variants.js';

export function parseSurface(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null;
  if (typeof value !== 'string' || !/^\d+(?:[.,]\d+)?$/.test(value.trim())) return null;
  const number = Number(value.trim().replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function getDosageProfile(productOrId) {
  const id = typeof productOrId === 'string' ? productOrId : productOrId?.id;
  const variant = getVariant(id);
  const profile = variant && DOSAGE_PROFILES[variant.productId];
  return profile ? { ...profile, variantId: variant.id, productId: variant.productId,
    packageSize: variant.packageSize, packageLabel: variant.packageLabel, packaging: variant.packaging } : null;
}

// A caller may provide this only after a scoped, authenticated client read.
// This contract is not an authentication mechanism and never reads localStorage,
// URL parameters, demo zones or a fabricated client record.
export function getTrustedKnownArea(value) {
  if (!value || typeof value !== 'object' || value.source !== 'authenticated-client' || value.verified !== true) return null;
  return parseSurface(value.areaM2);
}

export function calculateDosage({ productId, variantId, areaM2, contextId, rate, sprayVolumeLHa, foliarConfirmed = false } = {}) {
  const baseProfile = getDosageProfile(productId);
  const blocked = (status, message) => ({ status, message, canAdd: false, packageCount: null });
  if (!baseProfile) return blocked('unsupported', 'Le calcul n’est pas encore documenté pour ce produit.');
  const variant = getVariant(variantId === undefined ? productId : variantId);
  if (!variant || variant.productId !== baseProfile.productId) return blocked('invalid_variant', 'Choisissez un format disponible pour ce produit.');
  const profile = getDosageProfile(variant.id);
  const area = parseSurface(areaM2);
  if (area === null) return blocked('invalid_surface', 'Saisissez une surface supérieure à zéro en m².');
  const context = profile.contexts.find(item => item.id === contextId);
  if (!context || context.source?.verified !== true) return blocked('needs_context', 'Choisissez un usage documenté par le fabricant.');
  const minAmount = area * context.min / 1000;
  const maxAmount = area * context.max / 1000;
  if (!Number.isFinite(maxAmount) || minAmount <= 0 || maxAmount > Number.MAX_SAFE_INTEGER / 1000) return blocked('invalid_surface', 'Cette surface dépasse la précision du calcul.');
  const ceilPackages = amount => Math.max(1, Math.ceil(amount / profile.packageSize - Number.EPSILON * 8));
  const minPackages = ceilPackages(minAmount);
  const maxPackages = ceilPackages(maxAmount);
  const common = { areaM2: area, context, profile, unit: profile.unit, variantId: variant.id, productId: variant.productId, packageSize: profile.packageSize, packageLabel: profile.packageLabel, packaging: variant.packaging, minAmount, maxAmount, minPackages, maxPackages };
  let sprayVolumeLiters = null;
  if (profile.foliar) {
    const volume = parseSurface(sprayVolumeLHa);
    if (!foliarConfirmed || volume === null || volume < profile.sprayVolumeRangeLHa.min || volume > profile.sprayVolumeRangeLHa.max) {
      return { ...common, ...blocked('needs_foliar_context', 'Confirmez le contexte foliaire et le volume de bouillie de 400 à 800 L/ha.') };
    }
    sprayVolumeLiters = area * volume / 10000;
  }
  const hasChosenRate = rate !== undefined && rate !== null && String(rate).trim() !== '';
  const chosenRate = hasChosenRate ? parseSurface(rate) : context.min === context.max ? context.min : null;
  if (hasChosenRate && (chosenRate === null || chosenRate < context.min || chosenRate > context.max)) {
    return { ...common, ...blocked('invalid_rate', `Choisissez une dose entre ${context.min} et ${context.max} ${profile.rateUnit}.`) };
  }
  if (chosenRate === null) {
    const packageCount = minPackages === maxPackages ? minPackages : null;
    return { ...common, status: 'range', rate: null, amount: null, packageCount, canAdd: packageCount !== null && packageCount >= 1 && packageCount <= 99, sprayVolumeLiters };
  }
  const amount = area * chosenRate / 1000;
  const packageCount = ceilPackages(amount);
  return { ...common, status: 'ready', rate: chosenRate, amount, packageCount, canAdd: packageCount >= 1 && packageCount <= 99, sprayVolumeLiters };
}

export function formatDosageNumber(value) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
}

export function formatDosageAmount(value, unit) {
  return value < 1 ? `${formatDosageNumber(value * 1000)} ${unit === 'kg' ? 'g' : 'ml'}` : `${formatDosageNumber(value)} ${unit}`;
}
