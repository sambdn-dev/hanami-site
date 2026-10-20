// Public manufacturer documentation only. Rates describe an identified use,
// never a diagnosis or a universal garden programme. Reviewed 20 October 2026.
const source = (url, version, page, kind = 'technical_sheet') => ({ url, version, page, kind, verified: true, checkedAt: '2026-10-20' });
const seeds = 'Préparer le sol et maintenir les conditions nécessaires à la levée. Adapter la date du semis au sol et à la météo.';
const racines = source('https://compo-expert.com/sites/default/files/2022-11/Floranid%20Twin%20Racines_fiche%20technique_Fr_rue_11%202022.pdf', '11/2022', 2);
const ferro = source('https://compo-expert.com/fr-FR/print/pdf/node/146', '18/08/2026', 6, 'generated_product_page_pdf');
const basfoliar = source('https://compo-expert.com/fr-FR/print/pdf/node/237', '14/01/2025', 4, 'generated_product_page_pdf');
const context = (id, label, min, max, source, period, conditions = '') => ({ id, label, min, max, source, period, conditions });

export const DOSAGE_PROFILES = {
  'fl-racines-25': {
    unit: 'kg', rateUnit: 'g/m²', packageSize: 25, packageLabel: 'sac', defaultContextId: 'amenity',
    contexts: [
      context('amenity', 'Gazon d’espaces verts, parcs et jardins publics', 20, 30, racines, 'Mars à octobre', 'À employer en cas de besoin reconnu, selon le contexte du jardin.'),
      context('sports', 'Terrain de sport', 30, 50, racines, 'Mars à octobre'),
      context('play', 'Plaine de jeux ou hippodrome', 20, 30, racines, 'Mars à octobre'),
      context('golf-aeration', 'Green ou départ de golf : aération', 30, 40, racines, 'À l’aération'),
      context('turf-installation', 'Gazon de plaquage : mise en place', 30, 40, racines, 'À la mise en place'),
    ],
  },
  'resrpr-15': {
    unit: 'kg', rateUnit: 'g/m²', packageSize: 15, packageLabel: 'sac', defaultContextId: '',
    contexts: [
      context('creation', 'Créer une pelouse', 30, 30, source('https://gazon.barenbrug.fr/sites/barenbrug_gazon/files/2025-12/RES%2B%20RPR%20Barenbrug%202026_4.pdf', 'Composition 2026', 2), 'Selon les conditions de semis', seeds),
      context('overseeding', 'Regarnir une pelouse existante', 15, 20, source('https://gazon.barenbrug.fr/sites/barenbrug_gazon/files/2025-12/RES%2B%20RPR%20Barenbrug%202026_4.pdf', 'Composition 2026', 2), 'Selon les conditions de semis', seeds),
    ],
  },
  'pro12-15': {
    unit: 'kg', rateUnit: 'g/m²', packageSize: 15, packageLabel: 'sac', defaultContextId: '',
    contexts: [
      context('creation', 'Créer une pelouse', 25, 30, source('https://gazon.barenbrug.fr/sites/barenbrug_gazon/files/2025-12/PRO%2012%20Barenbrug%202026_2.pdf', 'Composition 2026', 2), 'Selon les conditions de semis', seeds),
      context('overseeding', 'Regarnir une pelouse existante', 15, 20, source('https://gazon.barenbrug.fr/sites/barenbrug_gazon/files/2025-12/PRO%2012%20Barenbrug%202026_2.pdf', 'Composition 2026', 2), 'Selon les conditions de semis', seeds),
    ],
  },
  'sierrablen-3m-25': {
    unit: 'kg', rateUnit: 'g/m²', packageSize: 25, packageLabel: 'sac', defaultContextId: 'growing-lawn',
    contexts: [context('growing-lawn', 'Gazon en période de croissance', 25, 35,
      source('https://icl-growingsolutions.com/fr-fr/wp-content/themes/icl-v2-repo/pdf-creator/pdf-getter.php?id=9161', '17/09/2026', 3),
      'En période de croissance', 'Appliquer sur feuillage sec, puis arroser. Ne pas appliquer en cas de gel ou de sécheresse. Faire un essai à petite échelle avant de changer de méthode ou de dosage.')],
  },
  'ferrotop-mini-25': {
    unit: 'kg', rateUnit: 'g/m²', packageSize: 25, packageLabel: 'sac', defaultContextId: 'amenity',
    contexts: [
      context('amenity', 'Gazon d’espaces verts', 20, 30, ferro, 'Février à décembre', 'En période de croissance ; ne pas appliquer en période chaude.'),
      context('sports', 'Terrain de sport ou hippodrome', 20, 30, { ...ferro, page: 5 }, 'Février à décembre', 'En période de croissance ; ne pas appliquer en période chaude.'),
      context('green', 'Green de golf', 15, 30, { ...ferro, page: 5 }, 'Février à décembre', 'En période de croissance ; ne pas appliquer en période chaude.'),
      context('tee', 'Départ de golf', 20, 30, { ...ferro, page: 5 }, 'Février à décembre', 'En période de croissance ; ne pas appliquer en période chaude.'),
    ],
  },
  'basfoliar-ferrotop-10l': {
    unit: 'L', rateUnit: 'ml/m²', packageSize: 10, packageLabel: 'bidon', defaultContextId: '', foliar: true,
    unsupportedContextMessage: 'La documentation retenue précise les golfs et terrains de sport. Pour un autre usage, faites valider le protocole avant de calculer une dose.',
    sprayVolumeRangeLHa: { min: 400, max: 800 },
    contexts: [
      { ...context('golf', 'Green ou départ de golf', 2, 2, basfoliar, 'Toute l’année hors conditions trop sèches ou trop chaudes', 'Application foliaire sur un gazon correctement nourri et alimenté en eau. Ne pas arroser immédiatement après.'), sourceRateLabel: '20 L/ha' },
      { ...context('sports', 'Terrain de sport', 3, 3, basfoliar, 'Toute l’année hors conditions trop sèches ou trop chaudes', 'Application foliaire sur un gazon correctement nourri et alimenté en eau. Ne pas arroser immédiatement après.'), sourceRateLabel: '30 L/ha' },
    ],
  },
};
