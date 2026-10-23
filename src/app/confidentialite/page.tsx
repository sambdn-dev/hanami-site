import type { Metadata } from 'next'
import Link from 'next/link'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import CookiePreferencesButton from '@/components/shared/CookiePreferencesButton'

export const metadata: Metadata = {
  title: 'Confidentialité et données personnelles',
  description: 'Comment Hanami utilise vos coordonnées, vos photos de jardin et vos choix de consentement.',
  robots: { index: false, follow: true },
}

const heading = 'font-[family-name:var(--font-fraunces)] text-2xl text-brand-forest mb-4'

export default function ConfidentialitePage() {
  return <>
    <SeasonalBanner />
    <Navbar variant="light" />
    <main id="contenu" className="flex-1 bg-brand-cream pt-36 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <p className="section-label mb-5">Vos données chez Hanami</p>
        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl sm:text-5xl text-brand-forest mb-6">Confidentialité et données personnelles</h1>
        <p className="text-stone-700 leading-relaxed mb-12">Vous nous confiez vos coordonnées et parfois des photos de votre jardin. Cette page explique leur utilisation sur le site public hanami-gazon.fr.</p>
        <div className="space-y-10 text-sm text-stone-700 leading-relaxed">
          <section aria-labelledby="privacy-owner">
            <h2 id="privacy-owner" className={heading}>Qui est responsable ?</h2>
            <p>TROTT SASU, exploitant la marque Hanami, SIREN 891 868 143, est responsable des traitements décrits ici. Son siège est au 58 avenue du Général Eisenhower, 51100 Reims. Vous pouvez contacter Sami Bouden au <a className="underline underline-offset-4" href="tel:+33667277614">+33 6 67 27 76 14</a> ou par <a className="underline underline-offset-4" href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
            <p className="mt-3"><Link className="underline underline-offset-4" href="/mentions-legales">Consulter les mentions légales</Link>.</p>
          </section>
          <section aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className={heading}>Vos demandes et vos photos</h2>
            <p>Les formulaires de contact et de simulation recueillent les informations que vous renseignez : identité, email, téléphone facultatif, commune ou code postal, surface, description du projet et photos facultatives. Nous les utilisons pour répondre à votre demande, établir un diagnostic ou préparer un devis, puis assurer le suivi de notre échange. Ces démarches préalables à une prestation sont réalisées à votre demande.</p>
            <p className="mt-3">Les messages et leurs photos sont transmis à Hanami par le service d’email Resend. Le site est hébergé par Vercel. Vos photos servent à comprendre votre jardin ; leur publication ou leur partage à des fins de communication nécessite votre accord. Évitez d’inclure des personnes, plaques d’immatriculation ou documents personnels dans vos photos.</p>
          </section>
          <section aria-labelledby="privacy-newsletter">
            <h2 id="privacy-newsletter" className={heading}>Les conseils par email</h2>
            <p>Lorsque vous demandez à recevoir les conseils Hanami, votre adresse email est transmise à Hanami via Resend. Cette inscription repose sur votre consentement. Vous pouvez le retirer à tout moment en nous contactant ou en répondant à un email reçu. Le navigateur mémorise également l’adresse saisie après une inscription réussie, dans son stockage local.</p>
          </section>
          <section aria-labelledby="privacy-measurement">
            <h2 id="privacy-measurement" className={heading}>Cookies et mesure du site</h2>
            <p>Axeptio recueille et mémorise vos préférences. Vercel Analytics mesure la fréquentation et les interactions ; Vercel Speed Insights mesure les performances des pages. Ces deux outils fonctionnent sans cookies et sont chargés uniquement après votre accord pour la finalité correspondante. Leur refus laisse le site accessible.</p>
            <p className="mt-3">Vous pouvez modifier vos choix à tout moment avec le bouton ci-dessous ou dans le pied de page.</p>
            <div className="mt-4"><CookiePreferencesButton /></div>
          </section>
          <section aria-labelledby="privacy-access">
            <h2 id="privacy-access" className={heading}>Accès, conservation et prestataires</h2>
            <p>Vos informations sont destinées à Hanami et aux prestataires techniques nécessaires au fonctionnement des services décrits. Elles ne sont pas vendues. Certains prestataires, notamment Vercel et Resend, sont établis aux États-Unis ; leur intervention peut impliquer un traitement hors de l’Union européenne.</p>
            <p className="mt-3">La conservation dépend du traitement de votre demande, de la relation commerciale qui en découle et des obligations légales applicables. Pour connaître les données conservées dans votre dossier ou demander leur suppression lorsque ces obligations le permettent, contactez Hanami.</p>
          </section>
          <section aria-labelledby="privacy-rights">
            <h2 id="privacy-rights" className={heading}>Vos droits</h2>
            <p>Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation du traitement ou, selon la situation, vous y opposer et demander leur portabilité. Vous pouvez également retirer un consentement. Contactez Hanami par les coordonnées indiquées en haut de page, en précisant votre demande. Vous pouvez adresser une réclamation à la <a className="underline underline-offset-4" href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
          </section>
          <p className="border-t border-stone-200 pt-5 text-xs text-stone-500">Dernière mise à jour : 23 octobre 2026.</p>
        </div>
      </div>
    </main>
    <Footer localOffers />
  </>
}
