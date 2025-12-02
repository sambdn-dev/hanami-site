export interface Product {
  id: number;
  brand: string;
  name: string;
  category: string;
  weight: string;
  weight_value: number;
  weight_unit: string;
  price: number;
  price_per_unit: number;
  highlights: string[];
}

export const productsData: Product[] = [
  { id: 1, brand: 'Barenbrug', name: 'Pro 12', category: 'Semences', weight: '15kg', weight_value: 15, weight_unit: 'kg', price: 91.00, price_per_unit: 6.07, highlights: ['Usage professionnel', 'Résistance optimale', 'Croissance rapide', 'Zones intensives'] },
  { id: 2, brand: 'Barenbrug', name: 'RES+Elite', category: 'Semences', weight: '15kg', weight_value: 15, weight_unit: 'kg', price: 0, price_per_unit: 0, highlights: ['Qualité supérieure', 'Croissance rapide', 'Résistant au piétinement', 'Densité exceptionnelle'] },
  { id: 3, brand: 'Barenbrug', name: 'RES+RPR', category: 'Semences', weight: '15kg', weight_value: 15, weight_unit: 'kg', price: 105.36, price_per_unit: 7.02, highlights: ['Régénération rapide', 'Résistant au piétinement', 'Auto-réparation', 'Germination express'] },
  { id: 4, brand: 'Barenbrug', name: 'PRO SOS', category: 'Semences', weight: '15kg', weight_value: 15, weight_unit: 'kg', price: 108.23, price_per_unit: 7.22, highlights: ['Réparation express', 'Usage intensif', 'Germination 7 jours', 'Tolérance sécheresse'] },
  { id: 5, brand: 'Frayssinet', name: 'ORGASYL REGARNISSAGE', category: 'Amendements', weight: '25kg', weight_value: 25, weight_unit: 'kg', price: 16.87, price_per_unit: 0.67, highlights: ['100% naturel', 'Régarnissage efficace', 'Enrichit le sol', 'Bio-compatible'] },
  { id: 6, brand: 'ICL', name: 'Vitalnova StressBuster', category: 'Engrais', weight: '10kg', weight_value: 10, weight_unit: 'kg', price: 111.58, price_per_unit: 11.16, highlights: ['Anti-stress', 'Résistance à la sécheresse', 'Récupération rapide', 'Formule renforcée'] },
  { id: 7, brand: 'SOBAC', name: 'Bacteriosol Universel', category: 'Amendements', weight: '15kg', weight_value: 15, weight_unit: 'kg', price: 26.69, price_per_unit: 1.78, highlights: ['Enrichit le sol', 'Longue durée', 'Vie microbienne', 'Application facile'] },
  { id: 8, brand: 'Compo Expert', name: 'Floranid Twin Racines', category: 'Engrais', weight: '25kg', weight_value: 25, weight_unit: 'kg', price: 83.33, price_per_unit: 3.33, highlights: ['Développement racinaire', 'Formule pro', 'Libération contrôlée', 'Effet 3 mois'] },
  { id: 9, brand: 'Compo Expert', name: 'Super Floranid Twin Gazon BS', category: 'Engrais', weight: '20kg', weight_value: 20, weight_unit: 'kg', price: 70.09, price_per_unit: 3.50, highlights: ['Effet longue durée', 'Gazon dense', 'Vert intense', 'Formule équilibrée'] },
  { id: 10, brand: 'Compo Expert', name: 'Floranid Twin Permanent', category: 'Engrais', weight: '25kg', weight_value: 25, weight_unit: 'kg', price: 63.80, price_per_unit: 2.55, highlights: ['Usage permanent', 'Vert intense', '3-4 mois d\'effet', 'Tous gazons'] },
  { id: 11, brand: 'Compo Expert', name: 'Floranid Twin Club', category: 'Engrais', weight: '25kg', weight_value: 25, weight_unit: 'kg', price: 65.47, price_per_unit: 2.62, highlights: ['Qualité club', 'Croissance équilibrée', 'NPK optimisé', 'Usage intensif'] },
  { id: 12, brand: 'Compo Expert', name: 'Floranid Twin Eagle NK BS', category: 'Engrais', weight: '25kg', weight_value: 25, weight_unit: 'kg', price: 124.20, price_per_unit: 4.97, highlights: ['Formule premium', 'Résultats rapides', 'Technologie Twin', 'Gazon de prestige'] },
  { id: 13, brand: 'ICL', name: 'Sierraform GT Stress Control', category: 'Engrais', weight: '20kg', weight_value: 20, weight_unit: 'kg', price: 83.46, price_per_unit: 4.17, highlights: ['Gestion du stress', 'Technologie avancée', 'Protection été', 'Formule GT'] },
  { id: 14, brand: 'ICL', name: 'H2Pro TriSmart', category: 'Liquides', weight: '5L', weight_value: 5, weight_unit: 'L', price: 188.23, price_per_unit: 37.65, highlights: ['Application liquide', 'Absorption rapide', 'Économie d\'eau', 'Pénétration optimale'] },
  { id: 15, brand: 'ICL', name: 'H2Pro FlowSmart', category: 'Liquides', weight: '10L', weight_value: 10, weight_unit: 'L', price: 303.80, price_per_unit: 30.38, highlights: ['Technologie FlowSmart', 'Efficacité maximale', 'Rétention d\'eau', 'Format professionnel'] },
  { id: 16, brand: 'Frayssinet', name: 'VEGETHUMUS', category: 'Amendements', weight: '25kg', weight_value: 25, weight_unit: 'kg', price: 0, price_per_unit: 0, highlights: ['Humus naturel', 'Fertilité durable', 'Structure du sol', 'Matière organique'] },
  { id: 17, brand: 'Citepro', name: 'TERREAU CITEPRO GAZON Sac', category: 'Terreaux', weight: '40L', weight_value: 40, weight_unit: 'L', price: 6.32, price_per_unit: 0.16, highlights: ['Terreau spécial gazon', 'Prêt à l\'emploi', 'pH équilibré', 'Enrichi en nutriments'] },
  { id: 18, brand: 'Citepro', name: 'TERREAU CITEPRO GAZON Big Bag', category: 'Terreaux', weight: '1000L', weight_value: 1000, weight_unit: 'L', price: 154.00, price_per_unit: 0.15, highlights: ['Format big bag', 'Économique', 'Grandes surfaces', 'Livraison sur palette'] }
];

export const categories = ['Tous', 'Semences', 'Engrais', 'Amendements', 'Liquides', 'Terreaux'];
export const brands = ['Toutes', 'Barenbrug', 'Compo Expert', 'ICL', 'Frayssinet', 'SOBAC', 'Citepro'];
