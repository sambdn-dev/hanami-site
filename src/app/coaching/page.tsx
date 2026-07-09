/**
 * page.tsx — Landing Coaching Hanami (route /coaching)
 *
 * Destination des campagnes coaching (le doc marketing référence
 * hanami-gazon.fr/coaching dans toutes les créas). Offre unique claire :
 * coaching annuel 29 €/mois, 1er mois d'essai offert.
 *
 * Ordre de scroll (pattern "Pricing-Focused Landing", offre unique) :
 * 1. Hero + carte protocole    5. FAQ (objections coaching)
 * 2. Bloc prix + ancrage       6. Réassurance
 * 3. Ce qui est inclus         7. Formulaire de contact (#contact)
 * 4. Comment ça marche
 */

import type { Metadata } from 'next'

import { localBusinessSchema, serviceSchemas } from '@/lib/structured-data'
import { FAQS } from '@/lib/faq-data'

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import GuaranteeBlock from '@/components/shared/GuaranteeBlock'
import ContactForm from '@/components/shared/ContactForm'

import CoachingContent from '@/components/coaching/CoachingContent'
import EspaceClientPreview from '@/components/coaching/EspaceClientPreview'
import Testimonials from '@/components/home/Testimonials'
import FAQ from '@/components/home/FAQ'

export const metadata: Metadata = {
  title: 'Coaching gazon annuel — 29 €/mois, protocole daté et suivi expert',
  description:
    'Un expert gazon dans votre poche toute l\'année : plan 3D, protocole 12 mois daté au jour près, produits professionnels, suivi illimité. 1er mois d\'essai offert.',
  openGraph: {
    title: 'Coaching gazon Hanami — 29 €/mois',
    description:
      'Plan 3D, protocole 12 mois daté, suivi illimité. Moins cher qu\'un sac d\'engrais en jardinerie. 1er mois d\'essai offert.',
  },
}

// Sous-ensemble FAQ pertinent pour l'objection coaching (l'intégralité — et le
// markup FAQPage — reste sur la home pour éviter le balisage dupliqué).
const COACHING_FAQ_QUESTIONS = [
  'Combien ça coûte ?',
  '29€/mois, c\'est rentable ?',
  'Je n\'y connais rien en gazon, c\'est un problème ?',
  'J\'ai besoin de quel matériel ?',
  'Et si ça ne marche pas ?',
  'Vous intervenez où ?',
]

export default function CoachingPage() {
  const coachingSchema = serviceSchemas().find(s =>
    (s['@id'] as string).endsWith('service-coaching'),
  )
  const coachingFaqs = FAQS.filter(f => COACHING_FAQ_QUESTIONS.includes(f.question))

  // LocalBusiness injecté à côté du Service : sa référence provider
  // (@id #localbusiness) serait pendante sinon — le nœud n'existe que
  // sur la home, et Google ne suit pas les @id inter-pages.
  const jsonLdBlocks = [localBusinessSchema(), ...(coachingSchema ? [coachingSchema] : [])]

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <SeasonalBanner />
      <Navbar variant="light" />

      <main className="flex-1">
        {/* 1-4. Hero, prix, inclus, comment ça marche */}
        <CoachingContent />

        {/* 5. Aperçu de l'espace client — rend le coaching tangible */}
        <EspaceClientPreview />

        {/* 6. Témoignages — tous clients coaching renouvelés */}
        <Testimonials />

        {/* 6. FAQ — objections spécifiques au coaching */}
        <FAQ items={coachingFaqs} />

        {/* 7. Réassurance puis formulaire (fin du tunnel) — source "coaching"
            pour distinguer les leads essai coaching dans l'email Resend */}
        <GuaranteeBlock />
        <ContactForm
          variant="particulier"
          source="coaching"
          title="Commencez votre mois d'essai offert"
          subtitle="Réponse sous 24h."
        />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}
