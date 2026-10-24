import { localBusinessSchema, faqPageSchema, localServiceSchema } from '@/lib/structured-data'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import HomeMobileCTA from '@/components/home/HomeMobileCTA'
import { LocalHero, LocalOffers, LocalMethod, LocalClimate, LocalApproach } from './LocalLanding'
import NutritionMotion from './NutritionMotion'
import BrandStrip from './BrandStrip'
import EquipmentSection from './EquipmentSection'
import LocalProof from './LocalProof'
import LocalFAQ, { LOCAL_FAQS } from './LocalFAQ'
import LocalContact from './LocalContact'
import IrrigationSection from './IrrigationSection'
import LocalJournal from './LocalJournal'
import GardenPreventionSection from './GardenPreventionSection'
import CoachingSpotlight from './CoachingSpotlight'
import styles from './LocalSite.module.css'

export default function LocalSitePage({ showCoachingSpotlight = false }: { showCoachingSpotlight?: boolean }) {
  const schemas = [
    localBusinessSchema(),
    ...[
      { id: 'interventions', name: 'Interventions agronomiques du gazon', description: 'Nutrition régulière, prévention et corrections ciblées du gazon, sur forfait ou abonnement au Vésinet et alentours.', path: '/#offres' },
      { id: 'arrosage', name: 'Installation d’arrosage automatique intelligent', description: 'Étude, installation et réglages d’un arrosage intelligent Aiper IrriSense 2 ou d’un réseau enterré Rain Bird, au Vésinet et alentours.', path: '/#arrosage-automatique' },
      { id: 'renovation-express', name: 'Rénovation express du gazon', description: 'Rénovation de la pelouse sans retourner le sol, avec semences adaptées et suivi au Vésinet et alentours.', path: '/renovation-express' },
    ].map(localServiceSchema),
    faqPageSchema(LOCAL_FAQS),
  ]

  return <div className={styles.page}>
    {schemas.map((schema,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />)}
    <a href="#contenu" className={styles.skip}>Aller au contenu</a>
    <SeasonalBanner /><Navbar variant="light" localOffers />
    <main id="contenu" tabIndex={-1}>
      <LocalHero promoteCoaching={showCoachingSpotlight} />{showCoachingSpotlight && <CoachingSpotlight />}<LocalOffers /><LocalJournal /><BrandStrip /><LocalMethod /><NutritionMotion /><LocalClimate /><IrrigationSection /><GardenPreventionSection /><LocalProof /><EquipmentSection /><LocalApproach /><LocalFAQ /><LocalContact />
    </main>
    <Footer localOffers /><WhatsAppButton /><HomeMobileCTA href="#contact" label="Parlons de votre jardin" reassurance="Interventions à domicile · Le Vésinet & alentours" />
  </div>
}
