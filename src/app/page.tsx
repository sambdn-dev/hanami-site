/**
 * page.tsx — Page d'accueil Particuliers (route /)
 *
 * C'est la page principale du site Hanami, destinée aux particuliers
 * qui souhaitent améliorer leur gazon.
 *
 * Les 17 sections s'affichent dans l'ordre défini par le cahier des charges :
 * 1.  SeasonalBanner   — Bandeau saisonnier (hors main, au-dessus de la nav)
 * 2.  Navbar           — Navigation fixe
 * 3.  Hero             — Section principale avec titre et CTA
 * 4.  gradient-separator — Barre décorative verte→ambrée
 * 5.  SocialProofBanner — Chiffres clés
 * 6.  Arguments        — 6 cartes "Ce que la jardinerie ne vous dira jamais"
 * 7.  IntermediateCTA  — Appel à l'action intermédiaire
 * 8.  Savings          — Ce que vous économisez (budget, temps, eau)
 * 9.  Services         — 4 services Hanami (fond vert foncé)
 * 10. SeasonalMoments  — Carousel 5 moments clés de l'année
 * 11. IntermediateCTA  — Appel à l'action intermédiaire
 * 12. CaseStudies      — 3 études de cas clients
 * 13. Testimonials     — 3 témoignages
 * 14. IntermediateCTA  — Appel à l'action intermédiaire
 * 15. HowItWorks       — 4 étapes du processus
 * 16. FAQ              — 7 questions fréquentes (accordéon)
 * 17. GuaranteeBlock   — 3 éléments de réassurance
 * 18. ContactForm      — Formulaire de contact (ancre #contact)
 * 19. MobileStickyCTA  — Barre fixe mobile (apparaît après 400px de scroll)
 */

import type { Metadata } from 'next'

// Composants partagés (utilisés aussi sur la page Pro)
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import IntermediateCTA from '@/components/shared/IntermediateCTA'
import GuaranteeBlock from '@/components/shared/GuaranteeBlock'
import ContactForm from '@/components/shared/ContactForm'

// Composants spécifiques à la page Particuliers
import Hero from '@/components/home/Hero'
import SocialProofBanner from '@/components/home/SocialProofBanner'
import Arguments from '@/components/home/Arguments'
import Savings from '@/components/home/Savings'
import Services from '@/components/home/Services'
import SeasonalMoments from '@/components/home/SeasonalMoments'
import CaseStudies from '@/components/home/CaseStudies'
import Testimonials from '@/components/home/Testimonials'
import HowItWorks from '@/components/home/HowItWorks'
import FAQ from '@/components/home/FAQ'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import NewsletterSection from '@/components/home/NewsletterSection'
import LatestArticles from '@/components/home/LatestArticles'

// Métadonnées SEO spécifiques à cette page
export const metadata: Metadata = {
  title: 'Coaching agronomique pour votre gazon — Hanami',
  description:
    'Votre gazon mérite un expert, pas une étiquette en jardinerie. Diagnostic personnalisé, protocole daté, produits professionnels. Partout en France.',
  openGraph: {
    title: 'Hanami — Coaching agronomique pour votre gazon',
    description:
      'Diagnostic personnalisé, protocole daté, produits professionnels. Des résultats visibles pour votre gazon.',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Bandeau saisonnier — au-dessus de tout, fermable */}
      <SeasonalBanner />

      {/* Navigation fixe — variante claire pour la page Particuliers */}
      <Navbar variant="light" />

      {/* Contenu principal */}
      <main className="flex-1">

        {/* 1. Hero — headline + CTA + photo décalée */}
        <Hero />

        {/* 2. Bandeau preuve sociale — chiffres clés */}
        <SocialProofBanner />

        {/* 3. Arguments — "Ce que la jardinerie ne vous dira jamais" */}
        <Arguments />

        {/* CTA intermédiaire 1 */}
        <IntermediateCTA message="Prêt à changer de méthode ? Demandez votre diagnostic gratuit" />

        {/* 4. Ce que vous économisez */}
        <Savings />

        {/* 5. Services Hanami — fond vert foncé */}
        <Services />

        {/* 6. Carousel saisonnier — 5 moments clés */}
        <SeasonalMoments />

        {/* CTA intermédiaire 2 */}
        <IntermediateCTA message="Vous aussi, passez à la méthode pro. Contactez-nous" />

        {/* 7. Études de cas — Susan, Véronique, Noël */}
        <CaseStudies />

        {/* 8. Témoignages — Luc, Joséphine, Guy */}
        <Testimonials />

        {/* CTA intermédiaire 3 */}
        <IntermediateCTA message="C'est simple. Commencez maintenant." />

        {/* 9. Comment ça marche — 4 étapes */}
        <HowItWorks />

        {/* 10. Articles récents — 3 derniers billets du Journal */}
        <LatestArticles />

        {/* 11. FAQ — 7 questions fréquentes */}
        <FAQ />

        {/* 11. Bloc de réassurance — juste avant le formulaire */}
        <GuaranteeBlock />

        {/* 12. Section newsletter + CTA diagnostic */}
        <NewsletterSection />

        {/* 13. Formulaire de contact — ancre #contact */}
        <ContactForm variant="particulier" />

      </main>

      {/* Footer partagé */}
      <Footer />

      {/* Bouton WhatsApp flottant — toujours visible */}
      <WhatsAppButton />

      {/* Barre CTA fixe mobile — apparaît après 400px de scroll */}
      <MobileStickyCTA />
    </>
  )
}
