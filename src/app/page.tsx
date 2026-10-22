import { pageMetadata } from '@/lib/seo'
import LocalSitePage from '@/components/local/LocalSitePage'

export const metadata = pageMetadata({
  title: 'Entretien gazon au Vésinet & coaching à distance | Hanami',
  description: 'Interventions et arrosage au Vésinet et alentours, coaching gazon à distance partout en France. Découvrez les deux accompagnements Hanami et les 2 mois de coaching offerts.',
  path: '/',
})

export default function HomePage() { return <LocalSitePage showCoachingSpotlight /> }
