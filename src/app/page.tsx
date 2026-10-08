import { pageMetadata } from '@/lib/seo'
import LocalSitePage from '@/components/local/LocalSitePage'

export const metadata = pageMetadata({
  title: 'Entretien gazon & arrosage automatique au Vésinet | Hanami',
  description: 'Au Vésinet et alentours, Hanami entretient et rénove votre gazon : nutrition sur mesure, rénovation sans retourner le sol et installation d’arrosage intelligent.',
  path: '/',
})

export default function HomePage() { return <LocalSitePage /> }
