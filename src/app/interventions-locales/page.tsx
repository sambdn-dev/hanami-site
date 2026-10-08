import { pageMetadata } from '@/lib/seo'
import LocalSitePage from '@/components/local/LocalSitePage'

// This entry point serves the same LocalSitePage as /: consolidate indexing.
export const metadata = pageMetadata({
  title: 'Entretien gazon & arrosage automatique au Vésinet | Hanami',
  description: 'Au Vésinet et alentours, Hanami entretient et rénove votre gazon : nutrition sur mesure, rénovation sans retourner le sol et installation d’arrosage intelligent.',
  path: '/interventions-locales',
  canonicalPath: '/',
})

export default function LocalInterventionsPage() { return <LocalSitePage /> }
