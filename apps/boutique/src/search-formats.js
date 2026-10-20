import { searchProducts } from './search.js';
import { getVariants, getProductForVariant } from './variants.js';

// A format in the query is a catalogue constraint, not a guessed pack size.
export function searchProductFormats(products, query) {
  const requested = String(query ?? '').match(/\b(\d+(?:[.,]\d+)?)\s*(kg|l)\b/iu);
  const text = requested ? String(query).replace(requested[0], ' ') : query;
  const parents = searchProducts(products, text);
  if (!requested) return parents;
  const amount = Number(requested[1].replace(',', '.'));
  const unit = requested[2].toLowerCase();
  return parents.flatMap(parent => {
    const format = getVariants(parent).find(v => v.packageSize === amount && v.unit.toLowerCase() === unit);
    return format ? [getProductForVariant(format.id)] : [];
  });
}
