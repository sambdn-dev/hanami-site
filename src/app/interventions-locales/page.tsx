import type { Metadata } from 'next'
import LocalSitePage from '@/components/local/LocalSitePage'

export const metadata: Metadata = {
  title: { absolute: 'Interventions locales — Nutrition & rénovation du gazon | Hanami' },
  description: 'Au Vésinet et alentours : interventions agronomiques, nutrition de fond, suivi premium et rénovation express. Programmes sur forfait ou abonnement, adaptés à votre jardin.',
  alternates: { canonical: '/interventions-locales' },
  openGraph: { title: 'Hanami — Les interventions locales pour votre gazon', description: 'Je réalise les interventions. Vous profitez de votre jardin.' },
}

export default function LocalInterventionsPage() { return <LocalSitePage /> }
