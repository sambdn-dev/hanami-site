/** Adresses des pelouses visibles depuis la rue, publiées à la demande de Hanami. */
interface ShowcaseGarden {
  id: string
  name: string
  kind: string
  street: string
  postalCode: string
  city: string
}

export const SHOWCASE_GARDENS: readonly ShowcaseGarden[] = [
  {
    id: 'hanami',
    name: 'La vitrine Hanami',
    kind: 'Le jardin de référence',
    street: '6 route de la Villa Hériot',
    postalCode: '78110',
    city: 'Le Vésinet',
  },
  {
    id: 'susan',
    name: 'Chez Susan',
    kind: 'Une réalisation chez un client',
    street: '17 avenue de la Prise d’Eau',
    postalCode: '78110',
    city: 'Le Vésinet',
  },
]

export function showcaseDirectionsUrl(garden: ShowcaseGarden): string {
  const destination = `${garden.street}, ${garden.postalCode} ${garden.city}, France`
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination })}`
}
