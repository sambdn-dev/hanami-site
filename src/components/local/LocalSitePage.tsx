import { localBusinessSchema, faqPageSchema } from '@/lib/structured-data'
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
import styles from './LocalSite.module.css'

export default function LocalSitePage() {
  const schemas = [
    { ...localBusinessSchema(), name: 'Hanami — Expertise et entretien du gazon' },
    { '@context': 'https://schema.org', '@type': 'Service', name: 'Interventions agronomiques du gazon', description: 'Nutrition régulière, prévention et corrections ciblées du gazon, sur forfait ou abonnement au Vésinet et alentours.', areaServed: { '@type': 'City', name: 'Le Vésinet et alentours' }, provider: { '@id': 'https://hanami-gazon.fr/#localbusiness' }, url: 'https://hanami-gazon.fr/interventions-locales' },
    faqPageSchema(LOCAL_FAQS),
  ]

  return <div className={styles.page}>
    {schemas.map((schema,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />)}
    <a href="#contenu" className={styles.skip}>Aller au contenu</a>
    <SeasonalBanner /><Navbar variant="light" localOffers />
    <main id="contenu" tabIndex={-1}>
      <LocalHero /><LocalOffers /><LocalJournal /><BrandStrip /><LocalMethod /><NutritionMotion /><LocalClimate /><IrrigationSection /><LocalProof /><EquipmentSection /><LocalApproach /><LocalFAQ /><LocalContact />
    </main>
    <Footer localOffers /><WhatsAppButton /><HomeMobileCTA href="#contact" label="Parlons de votre jardin" reassurance="Interventions à domicile · Le Vésinet & alentours" />
  </div>
}
