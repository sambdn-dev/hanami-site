import type { Metadata } from 'next'
import { localBusinessSchema, serviceSchemas, faqPageSchema } from '@/lib/structured-data'
import { FAQS } from '@/lib/faq-data'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import ContactForm from '@/components/shared/ContactForm'
import Hero from '@/components/home/Hero'
import { HomeServices, HomeCaseStudies, HomeProcess, HomeTestimonials, HomeJournal } from '@/components/home/HomeEditorial'
import FAQ from '@/components/home/FAQ'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import styles from '@/components/home/HomeEditorial.module.css'

export const metadata: Metadata = {
  title: 'Coaching gazon — Des pelouses plus belles, durablement',
  description: 'Un expert pour votre pelouse : diagnostic personnalisé, protocole daté et suivi au fil des saisons. Coaching partout en France, rénovation en Île-de-France.',
  openGraph: {
    title: 'Hanami — Des pelouses plus belles, durablement.',
    description: 'Votre pelouse, notre expertise. Coaching personnalisé, rénovation et produits professionnels adaptés à votre jardin.',
  },
}

export default function HomePage() {
  const jsonLdBlocks = [localBusinessSchema(), ...serviceSchemas(), faqPageSchema(FAQS)]

  return (
    <div className={styles.page}>
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <a href="#contenu" className={styles.skipLink}>Aller au contenu</a>
      <SeasonalBanner />
      <Navbar variant="light" />
      <main id="contenu" tabIndex={-1}>
        <Hero />
        <HomeServices />
        <HomeCaseStudies />
        <HomeProcess />
        <HomeTestimonials />
        <HomeJournal />
        <div className={styles.faqWrap}><FAQ /></div>
        <div className={styles.contact}>
          <span className={styles.contactBlades} aria-hidden="true" />
          <ContactForm variant="particulier" title="Tout commence par votre jardin."
            subtitle="Quelques mots, une surface, vos photos si vous en avez. Parlons de ce dont votre pelouse a besoin. Réponse sous 24 h." />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA label="Découvrir le coaching" reassurance="" />
    </div>
  )
}
