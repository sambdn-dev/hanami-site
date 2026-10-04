import type { Metadata } from 'next'
import LocalSitePage from '@/components/local/LocalSitePage'

export const metadata: Metadata = {
  title: { absolute: 'Hanami — Entretien agronomique & rénovation du gazon au Vésinet' },
  description: 'Hanami intervient chez vous au Vésinet et alentours : rénovation express sans retourner le sol, nutrition régulière et programmes agronomiques sur mesure, sur forfait ou abonnement.',
  openGraph: { title: 'Hanami — Votre gazon, entre de bonnes mains.', description: 'Rénovation express et interventions agronomiques à domicile. Une surface mesurée, un soin sur mesure.' },
}

export default function HomePage() { return <LocalSitePage /> }
