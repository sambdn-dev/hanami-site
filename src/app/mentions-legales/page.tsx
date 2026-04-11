import type { Metadata } from 'next'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site hanami-gazon.fr — TROTT SASU, SIREN 891 868 143.',
  robots: { index: false, follow: false },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />
      <main className="flex-1 pt-24 pb-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">

          {/* En-tête */}
          <div className="mb-12 pt-8">
            <span className="section-label mb-4 block">Informations légales</span>
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold text-hanami-900 mb-4">
              Mentions légales
            </h1>
            <p className="text-stone-500 text-sm">
              Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
            </p>
          </div>

          <div className="space-y-10">

            {/* Article 1 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                1. Éditeur du site
              </h2>
              <dl className="space-y-2 text-sm text-stone-700">
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Raison sociale</dt>
                  <dd className="font-medium">TROTT SASU</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Forme juridique</dt>
                  <dd>Société par Actions Simplifiée Unipersonnelle (SASU)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Capital social</dt>
                  <dd>5 000 €</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Siège social</dt>
                  <dd>58 Av. du Général Eisenhower, 51 100 Reims</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">SIREN</dt>
                  <dd>891 868 143</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">RCS</dt>
                  <dd>Reims</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Contact</dt>
                  <dd>
                    <a
                      href="https://wa.me/33667277614"
                      className="text-hanami-700 hover:text-hanami-900 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +33 6 67 27 76 14
                    </a>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                2. Directeur de la publication
              </h2>
              <p className="text-sm text-stone-700">
                Sami Bouden, en qualité de Président de TROTT SASU.
              </p>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                3. Hébergement
              </h2>
              <dl className="space-y-2 text-sm text-stone-700">
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Hébergeur</dt>
                  <dd className="font-medium">Vercel Inc.</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Adresse</dt>
                  <dd>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-40 shrink-0 text-stone-500">Site</dt>
                  <dd>
                    <a
                      href="https://vercel.com"
                      className="text-hanami-700 hover:text-hanami-900 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      vercel.com
                    </a>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                4. Propriété intellectuelle
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                L'ensemble des contenus présents sur le site hanami-gazon.fr (textes, photographies, visuels, logos, calculatrice de dosages, protocoles) sont la propriété exclusive de TROTT SASU, sauf mention contraire expresse.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed mt-3">
                Toute reproduction, représentation, modification, publication ou transmission, totale ou partielle, de ces contenus, par quelque procédé que ce soit, est strictement interdite sans l'autorisation écrite préalable de TROTT SASU.
              </p>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                5. Données personnelles (RGPD)
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                Les données collectées via le formulaire de contact (nom, e-mail, description du projet) sont utilisées exclusivement pour répondre à votre demande et ne sont pas cédées à des tiers.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed mt-3">
                Le formulaire est traité par <strong>Formspree Inc.</strong> (San Francisco, États-Unis), soumis au Privacy Shield UE-USA. Les données sont conservées le temps nécessaire au traitement de votre demande.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed mt-3">
                Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679), vous disposez des droits suivants :
              </p>
              <ul className="mt-2 space-y-1 text-sm text-stone-700 list-disc list-inside pl-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement (« droit à l'oubli »)</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit d'opposition</li>
              </ul>
              <p className="text-sm text-stone-700 leading-relaxed mt-3">
                Pour exercer ces droits, contactez-nous via WhatsApp au{' '}
                <a
                  href="https://wa.me/33667277614"
                  className="text-hanami-700 hover:text-hanami-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +33 6 67 27 76 14
                </a>
                .
              </p>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                6. Cookies
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                Le site utilise des cookies pour mémoriser vos préférences de navigation et améliorer votre expérience. Ces cookies ne collectent aucune donnée personnelle identifiable.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed mt-3">
                Vous pouvez accepter ou refuser les cookies via la bannière affichée lors de votre première visite. Le refus des cookies n'affecte pas l'accès aux contenus du site.
              </p>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mb-4 pb-2 border-b border-stone-200">
                7. Responsabilité
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                TROTT SASU s'efforce de maintenir les informations publiées sur ce site à jour et exactes. Toutefois, les dosages et protocoles agronomiques présentés sont fournis à titre indicatif et ne sauraient se substituer à un diagnostic personnalisé. TROTT SASU ne saurait être tenu responsable de tout préjudice résultant de l'utilisation des informations disponibles sur ce site sans accompagnement professionnel.
              </p>
            </section>

            {/* Date */}
            <p className="text-xs text-stone-400 pt-4 border-t border-stone-200">
              Dernière mise à jour : avril 2026
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
