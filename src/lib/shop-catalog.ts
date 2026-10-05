/**
 * Boutique Hanami — brouillon commercial, distinct du catalogue de dosage.
 * Aucun coût d'achat fournisseur ne figure ici. Les champs null restent à
 * renseigner avant ouverture : prix de vente TTC, formats, stock, livraison.
 */
export type ShopFormat = {
  id: string
  label: string
  weightGrams: number | null
  packaging: 'original' | 'hanami-repacked' | 'to-confirm'
  priceTtcCents: number | null
  stock: { status: 'available' | 'on-request' | 'to-confirm'; quantity: number | null }
}

export type ShopProduct = {
  id: string
  slug: string
  name: string
  brand: string
  category: 'seeds'
  eyebrow: string
  tagline: string
  description: string
  needs: string[]
  advice: string
  illustration: 'shade' | 'resilience'
  formats: ShopFormat[]
  delivery: { mode: 'hanami' | 'supplier-direct' | 'to-confirm'; priceTtcCents: number | null; leadTime: string | null }
}

const pendingFormat = (): ShopFormat => ({
  id: 'format-a-confirmer',
  label: 'Conditionnement à confirmer avec Hanami',
  weightGrams: null,
  packaging: 'to-confirm',
  priceTtcCents: null,
  stock: { status: 'to-confirm', quantity: null },
})

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'barenbrug-pro-ombre', slug: 'barenbrug-pro-ombre', name: 'PRO OMBRE', brand: 'Barenbrug', category: 'seeds',
    eyebrow: 'POUR LES JARDINS OMBRAGÉS', tagline: 'Un choix éclairé. Même à l’ombre.',
    description: 'Un mélange professionnel de semences conçu pour les zones ombragées. Le choix se prépare selon la lumière disponible, le sol et l’usage de votre jardin.',
    needs: ['Zones ombragées', 'Lisières et abords d’arbres', 'Création de gazon'],
    advice: 'À l’ombre, la hauteur de tonte et la lumière réellement disponible comptent autant que le choix des graines. Je vous aide à vérifier que ce mélange convient à votre jardin.',
    illustration: 'shade', formats: [pendingFormat()],
    delivery: { mode: 'to-confirm', priceTtcCents: null, leadTime: null },
  },
  {
    id: 'barenbrug-pro-24p', slug: 'barenbrug-pro-24p', name: 'PRO 24P', brand: 'Barenbrug', category: 'seeds',
    eyebrow: 'POUR UN GAZON RÉSILIENT', tagline: 'Des racines pour durer.',
    description: 'Un mélange professionnel riche en fétuque élevée, avec des semences pelliculées. Une piste à étudier pour les jardins soumis au piétinement et aux périodes sèches.',
    needs: ['Jardins sollicités', 'Résistance à la sécheresse', 'Création ou regarnissage'],
    advice: 'Un mélange résistant à la sécheresse a aussi besoin d’un semis réussi et d’un sol bien préparé. Je vous conseille sur le bon moment, la dose et l’arrosage de démarrage.',
    illustration: 'resilience', formats: [pendingFormat()],
    delivery: { mode: 'to-confirm', priceTtcCents: null, leadTime: null },
  },
]

export function getShopProduct(slug: string) {
  return SHOP_PRODUCTS.find(product => product.slug === slug)
}

export function formatShopPrice(cents: number | null) {
  return cents === null ? 'Prix à confirmer' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}
