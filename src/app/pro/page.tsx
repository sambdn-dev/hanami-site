/**
 * page.tsx — Page Professionnels (/pro)
 *
 * Destinée aux paysagistes et entrepreneurs en espaces verts.
 * Suit le même pattern que la page Particuliers avec des composants pro-spécifiques.
 *
 * Ordre des 14 sections :
 * 1.  SeasonalBanner    — Bandeau saisonnier
 * 2.  Navbar            — Navigation variante sombre (fond vert au scroll)
 * 3.  ProHero           — Hero fond vert foncé, texte blanc
 * 4.  gradient-separator
 * 5.  ProSocialProofBanner — 3 stats pro
 * 6.  ProPainPoints     — 4 cartes pain points
 * 7.  IntermediateCTA   — "On en parle ?"
 * 8.  ProServices       — 4 services fond vert foncé
 * 9.  IntermediateCTA   — "Testez sur votre prochain chantier"
 * 10. ProCaseStudies    — Ronan + Baptiste
 * 11. IntermediateCTA   — "Prêt à gagner du temps ?"
 * 12. ProWhyHanami      — 5 raisons fond vert pâle
 * 13. ProFAQ            — 4 questions pro
 * 14. GuaranteeBlock    — Réassurance
 * 15. ContactForm       — Formulaire pro (ancre #contact)
 */

import type { Metadata } from 'next'

// Composants partagés
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import IntermediateCTA from '@/components/shared/IntermediateCTA'
import GuaranteeBlock from '@/components/shared/GuaranteeBlock'
import ContactForm from '@/components/shared/ContactForm'

// Composants spécifiques à la page Pro
import ProHero from '@/components/pro/ProHero'
import ProSocialProofBanner from '@/components/pro/ProSocialProofBanner'
import ProPainPoints from '@/components/pro/ProPainPoints'
import ProServices from '@/components/pro/ProServices'
import ProCaseStudies from '@/components/pro/ProCaseStudies'
import ProWhyHanami from '@/components/pro/ProWhyHanami'
import ProFAQ from '@/components/pro/ProFAQ'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'

export const metadata: Metadata = {
  title: 'Hanami Pro — Expertise agronomique pour paysagistes',
  description:
    'Consulting chantier, dosages précis, suivi météo agricole jour par jour. Transformez le gazon en levier de satisfaction, de renouvellement et de marge.',
  openGraph: {
    title: 'Hanami Pro — Expertise agronomique pour paysagistes',
    description:
      'Paysagistes et entrepreneurs en espaces verts : expertise agronomique terrain, dosages précis, suivi toutes saisons.',
  },
}

export default function ProPage() {
  return (
    <>
      {/* Bandeau saisonnier */}
      <SeasonalBanner />

      {/* Navigation — variante sombre pour la page Pro */}
      <Navbar variant="dark" />

      <main className="flex-1">

        {/* 1. Hero Pro — fond vert foncé */}
        <ProHero />

        {/* Barre de séparation gradient */}
        <div className="gradient-separator" />

        {/* 2. Bandeau preuve sociale pro */}
        <ProSocialProofBanner />

        {/* 3. Pain points — 4 cartes */}
        <ProPainPoints />

        {/* CTA intermédiaire 1 — Calendly (prise de RDV directe, pas de friction) */}
        <IntermediateCTA
          message="On en parle ? 30 min offertes pour cadrer votre besoin."
          ctaLabel="Réserver un appel"
          useCalendly
          utmSource="pro-cta-1"
        />

        {/* 4. Services Pro — fond vert foncé */}
        <ProServices />

        {/* CTA intermédiaire 2 — Calendly */}
        <IntermediateCTA
          message="Testez sur votre prochain chantier."
          ctaLabel="Réserver un appel"
          variant="dark"
          useCalendly
          utmSource="pro-cta-2"
        />

        {/* 5. Cas terrain — Ronan + Baptiste */}
        <ProCaseStudies />

        {/* CTA intermédiaire 3 — Calendly */}
        <IntermediateCTA
          message="Prêt à gagner du temps sur vos chantiers ?"
          ctaLabel="Réserver un appel"
          useCalendly
          utmSource="pro-cta-3"
        />

        {/* 6. Pourquoi Hanami — 5 raisons */}
        <ProWhyHanami />

        {/* 7. FAQ Pro */}
        <ProFAQ />

        {/* 8. Bloc garantie */}
        <GuaranteeBlock />

        {/* 9. Formulaire de contact Pro */}
        <ContactForm variant="pro" />

      </main>

      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  )
}
