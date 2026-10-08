import { pageMetadata } from '@/lib/seo'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import HomeMobileCTA from '@/components/home/HomeMobileCTA'
import RenovationLanding from '@/components/local/RenovationLanding'
import LocalProof from '@/components/local/LocalProof'
import LocalContact from '@/components/local/LocalContact'
import BrandStrip from '@/components/local/BrandStrip'
import IrrigationSection from '@/components/local/IrrigationSection'
import styles from '@/components/local/LocalSite.module.css'

export const metadata = pageMetadata({
  title: 'Rénovation gazon sans retourner le sol au Vésinet | Hanami',
  description: 'Rénover votre gazon sans retourner le sol. Environ 200 m² en une demi-journée à une journée selon le terrain. Diagnostic, semences adaptées et suivi au Vésinet et alentours.',
  path: '/renovation-express',
})

export default function RenovationExpressPage() {
  return <div className={styles.page}><a href="#contenu" className={styles.skip}>Aller au contenu</a><SeasonalBanner /><Navbar variant="dark" localOffers /><main id="contenu" tabIndex={-1}><RenovationLanding /><IrrigationSection /><BrandStrip /><LocalProof /><LocalContact express /></main><Footer localOffers /><WhatsAppButton /><HomeMobileCTA href="#contact" label="Parlons de votre rénovation" reassurance="Sans retourner le sol · Le Vésinet & alentours" /></div>
}
