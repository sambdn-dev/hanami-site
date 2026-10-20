const STOP_WORDS = new Set('a au aux avec ce ces cet cette de des du d en et je j la le les l ma mes mon notre nos ou par pour que qu qui sur un une veux veut voudrais souhaite souhaiterais cherche chercher recherche trouver acheter avoir besoin moi me sans trop automne automnal automnale automnaux saison maintenant actuellement'.split(' '));
const SEED_NOUNS = new Set(['semence', 'semences', 'graine', 'graines']);
const FERTILIZER_NOUNS = new Set(['engrais', 'fertilisant', 'fertilisants', 'fertilisation']);

function withoutArea(value) {
  // Strip only a quantity explicitly followed by a surface unit. Bare numbers
  // remain meaningful for PRO 12 and nutrient formulas such as 19-5-18.
  return String(value ?? '').replace(/\b\d+(?:[ \u00a0\u202f]\d{3})*(?:[.,]\d+)?\s*(?:m\s*[²2]|m[eè]tres?\s+carr[eé]s?)(?=$|[\s,.;:!?])/giu, ' ');
}

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

const ALIASES = [
  { terms: ['res rpr', 'res plus rpr', 'resplus rpr'], ids: { 'resrpr-15': 240 } },
  { terms: ['floranid', 'fluranid'], ids: { 'fl-racines-25': 230 } },
  { terms: ['pro12', 'pro 12'], ids: { 'pro12-15': 240 } },
  { terms: ['sierrablen', 'sierrablend', 'sierra blen', 'sierra blend'], ids: { 'sierrablen-3m-25': 240 } },
  { terms: ['ferrotop', 'ferro top'], ids: { 'ferrotop-mini-25': 230, 'basfoliar-ferrotop-10l': 140 } },
  { terms: ['basfoliar'], ids: { 'basfoliar-ferrotop-10l': 260 } },
];

// These tags describe the six catalogue products; they do not diagnose a lawn
// or calculate a treatment. A need can return several alternatives.
const NEEDS = [
  { pattern: /\b(semis|semer|ensemencer)\b/, ids: { 'pro12-15': 100, 'resrpr-15': 100, 'fl-racines-25': 80 } },
  { pattern: /\b(racine|racines|enracinement|plantation|plantations|aeration)\b/, ids: { 'fl-racines-25': 160 } },
  { pattern: /\b(jaune|jauni|jaunie|jaunissement|reverdir|reverdissant|reverdissement|couleur|vert)\b/, ids: { 'basfoliar-ferrotop-10l': 140, 'ferrotop-mini-25': 130 } },
  { pattern: /\b(clairseme|clairsemee|clairsemes|clairsemees|regarnir|regarnissage|renover|renovation)\b/, ids: { 'resrpr-15': 150, 'pro12-15': 140 } },
  { pattern: /\b(fin|fine|fines|fins|finesse|dense|densite)\b/, ids: { 'pro12-15': 160 } },
  { pattern: /\b(pietinement|sollicite|sollicitee|passage|autorreparation|autoreparation)\b/, ids: { 'resrpr-15': 150 } },
];

function containsPhrase(text, phrase) {
  return (` ${text} `).includes(` ${phrase} `);
}

function words(value) {
  return normalizeSearch(value).split(' ').filter(Boolean);
}

function closeSpelling(a, b) {
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  if (a === b) return true;
  if (a.length === b.length) {
    const differences = [];
    for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) differences.push(i);
    if (differences.length === 1) return true;
    return differences.length === 2 && differences[1] === differences[0] + 1
      && a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]];
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let left = 0; let right = 0; let skipped = false;
  while (left < shorter.length && right < longer.length) {
    if (shorter[left] === longer[right]) { left += 1; right += 1; }
    else if (!skipped) { skipped = true; right += 1; }
    else return false;
  }
  return true;
}

function tokenMatches(token, candidates, allowTypo = false) {
  return candidates.some(word => word === token || (token.length >= 3 && word.startsWith(token))
    || (allowTypo && closeSpelling(token, word)));
}

/** Returns the original product objects, with stable, deterministic ranking. */
export function searchProducts(products, query, category = 'Tous') {
  if (!Array.isArray(products)) return [];
  const selectedCategory = normalizeSearch(category);
  let candidates = products.filter(product => product && (!selectedCategory || selectedCategory === 'tous'
    || (selectedCategory === 'uab' ? product.uab === true : normalizeSearch(product.category) === selectedCategory)));
  const normalized = normalizeSearch(withoutArea(query));
  if (!normalized) return candidates;
  // The catalogue contains no weedkiller. Generic "gazon" must not make one
  // of the nutrients appear as a weed treatment.
  if (/\b(desherbant|desherbants|desherber|herbicide|herbicides)\b/.test(normalized)
    || /\b(mauvaises herbes|anti mauvaises herbes)\b/.test(normalized)) return [];
  const queryWords = normalized.split(' ');
  const asksFertilizer = queryWords.some(word => FERTILIZER_NOUNS.has(word));
  const asksSeeds = queryWords.some(word => SEED_NOUNS.has(word));
  if (asksFertilizer) candidates = candidates.filter(product => normalizeSearch(product.category).startsWith('engrais'));
  else if (asksSeeds) candidates = candidates.filter(product => normalizeSearch(product.category) === 'semences');
  const tokens = queryWords.filter(token => !STOP_WORDS.has(token) && !SEED_NOUNS.has(token) && !FERTILIZER_NOUNS.has(token));
  if (!tokens.length) return candidates;
  const compactQuery = normalized.replace(/ /g, '');
  const aliases = ALIASES.filter(alias => alias.terms.some(term => containsPhrase(normalized, term)));
  const littleGrowth = /\b(peu de pousse|sans pousse|sans trop de pousse|peu de croissance)\b/.test(normalized);
  const needs = NEEDS.filter(need => need.pattern.test(normalized));
  // An explicitly requested fertiliser may accompany a reseeding operation.
  // A generic renovation query remains focused on the two seed mixtures.
  if (asksFertilizer && /\b(regarnir|regarnissage|semis|semer)\b/.test(normalized)) needs.push({ ids: { 'fl-racines-25': 160 } });
  if (littleGrowth) needs.push({ ids: { 'ferrotop-mini-25': 180, 'basfoliar-ferrotop-10l': 180 } });
  else if (/\b(pousse|croissance)\b/.test(normalized)) needs.push({ ids: { 'sierrablen-3m-25': 180, 'fl-racines-25': 70 } });

  return candidates.map((product, index) => {
    const identity = normalizeSearch([product.name, product.formula, product.manufacturer].filter(Boolean).join(' '));
    const identityWords = words(identity);
    const descriptionWords = words([product.category, product.role, product.copy, product.uab ? 'UAB agriculture biologique bio' : '',
      ...(Array.isArray(product.quickFacts) ? product.quickFacts : [])].filter(Boolean).join(' '));
    const aliasScore = Math.max(0, ...aliases.map(alias => alias.ids[product.id] || 0));
    const needScore = Math.max(0, ...needs.map(need => need.ids[product.id] || 0));
    const identityPhrase = containsPhrase(identity, normalized)
      || (compactQuery.length >= 3 && identity.replace(/ /g, '').includes(compactQuery));
    const allIdentityTokens = tokens.every(token => tokenMatches(token, identityWords, true));
    const allTokens = tokens.every(token => tokenMatches(token, identityWords, true)
      || tokenMatches(token, descriptionWords));
    const identityScore = identityPhrase ? 200 : allIdentityTokens ? 150 : 0;
    if (needs.length && !needScore && !aliasScore && !identityScore) return { product, index, score: 0 };
    if (!aliasScore && !needScore && !identityScore && !allTokens) return { product, index, score: 0 };
    let textScore = 0;
    for (const token of tokens) {
      if (tokenMatches(token, identityWords)) textScore += 24;
      else if (tokenMatches(token, identityWords, true)) textScore += 12;
      else if (tokenMatches(token, descriptionWords)) textScore += 5;
    }
    return { product, index, score: aliasScore + identityScore + needScore + textScore };
  }).filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index).map(result => result.product);
}
