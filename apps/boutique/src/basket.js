export const BASKET_STORAGE_KEY = 'hanami-boutique-cart-v1';
const MAX_QUANTITY = 99;

function validId(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function quantity(value) {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') return 0;
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(number))) : 0;
}

function cleanItems(items, allowedIds = null) {
  if (!Array.isArray(items)) return [];
  const quantities = new Map();
  for (const item of items) {
    const id = validId(item?.id);
    const count = quantity(item?.quantity);
    if (!id || !count || (allowedIds && !allowedIds.has(id))) continue;
    quantities.set(id, Math.min(MAX_QUANTITY, (quantities.get(id) || 0) + count));
  }
  return [...quantities].map(([id, quantity]) => ({ id, quantity }));
}

/** Unknown products are discarded using the current catalogue's IDs. */
export function loadBasket(storage, allowedIdsArray) {
  const allowedIds = new Set(Array.isArray(allowedIdsArray) || allowedIdsArray instanceof Set ? allowedIdsArray : []);
  try {
    const raw = storage?.getItem(BASKET_STORAGE_KEY);
    return raw ? cleanItems(JSON.parse(raw), allowedIds) : [];
  } catch { return []; }
}

/** Returns the clean basket even if the browser cannot persist it. */
export function saveBasket(storage, items) {
  const cleaned = cleanItems(items);
  try { storage?.setItem(BASKET_STORAGE_KEY, JSON.stringify(cleaned)); } catch { /* Keep the current in-memory basket usable. */ }
  return cleaned;
}

export function addItem(items, id) {
  const cleaned = cleanItems(items); const key = validId(id);
  if (!key) return cleaned;
  const existing = cleaned.find(item => item.id === key);
  return existing ? cleaned.map(item => item.id === key ? { id: key, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) } : item)
    : [...cleaned, { id: key, quantity: 1 }];
}

export function setQuantity(items, id, value) {
  const cleaned = cleanItems(items); const key = validId(id); const count = quantity(value);
  if (!key) return cleaned;
  if (!count) return cleaned.filter(item => item.id !== key);
  return cleaned.some(item => item.id === key) ? cleaned.map(item => item.id === key ? { id: key, quantity: count } : item)
    : [...cleaned, { id: key, quantity: count }];
}

export function removeItem(items, id) {
  return cleanItems(items).filter(item => item.id !== validId(id));
}

export function totalQuantity(items) {
  return cleanItems(items).reduce((sum, item) => sum + item.quantity, 0);
}
