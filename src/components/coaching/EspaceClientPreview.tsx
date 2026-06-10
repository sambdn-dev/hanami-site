/**
 * EspaceClientPreview.tsx — Section "Votre espace client" sur /coaching
 *
 * Montre l'espace client en action pour rendre le coaching tangible et
 * justifier le prix. Un toggle Web / Mobile bascule l'affichage entre les
 * captures desktop (cadres navigateur) et mobile (cadres téléphone) : sur
 * petit écran, une capture desktop rétrécie serait illisible — le mode
 * Mobile montre les vraies vues mobiles, lisibles.
 *
 * Captures actuelles = prototype (à remplacer par les vraies captures de
 * l'app au lancement, cf. AppScreen — juste échanger les fichiers).
 *
 * Garde-fous respectés : aucune donnée non-V1 (météo ETP masquée),
 * compte démo anonymisé, accroches centrées sur l'expert (pas la feature).
 */

'use client'

import { useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { useFadeIn } from '@/hooks/useFadeIn'
import AppScreen from './AppScreen'

type Device = 'web' | 'mobile'

export default function EspaceClientPreview() {
  const headRef = useFadeIn()
  // Défaut Web partout ; le bouton Mobile reste disponible (les captures
  // desktop restent lisibles : sur petit écran on les remplace via le toggle).
  const [device, setDevice] = useState<Device>('web')

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête + toggle Web / Mobile */}
        <div ref={headRef} className="fade-in mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="section-label mb-3 block">Votre espace client</span>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 leading-tight">
              Tout votre coaching, réuni au même endroit
            </h2>
            <p className="text-stone-500 leading-relaxed mt-4">
              Pas un logiciel de plus : le moyen pour Hanami de vous suivre toute
              l&apos;année sans se déplacer. Votre plan, votre sol, vos échanges —
              du bureau comme du jardin.
            </p>
          </div>

          {/* Toggle Web / Mobile */}
          <div
            className="inline-flex shrink-0 p-1 bg-stone-100 border border-stone-200 rounded-full"
            role="tablist"
            aria-label="Format d'affichage de l'espace client"
          >
            <ToggleBtn active={device === 'web'} onClick={() => setDevice('web')} icon={<Monitor className="w-4 h-4" />} label="Web" />
            <ToggleBtn active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={<Smartphone className="w-4 h-4" />} label="Mobile" />
          </div>
        </div>

        {/* ── Affichage WEB (cadres navigateur, layout asymétrique) ── */}
        {device === 'web' && (
          <div>
            {/* Tableau de bord */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-10 lg:gap-14 items-center mb-20 lg:mb-28">
              <div>
                <span className="font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-widest text-hanami-500">
                  Tableau de bord
                </span>
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-hanami-900 leading-snug mt-2 mb-4">
                  La prochaine action, le bon produit, la bonne dose.
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  À chaque connexion, vous savez exactement quoi faire — avec le
                  produit recommandé et la dose calculée sur votre surface réelle.
                  Plus de doute, plus de PDF oublié dans un tiroir.
                </p>
              </div>
              <AppScreen
                src="/landing/screens/dashboard.webp"
                alt="Tableau de bord de l'espace client Hanami : prochaine étape, produit recommandé et dose calculée sur la surface du jardin"
                width={1600}
                height={1307}
                variant="browser"
              />
            </div>

            {/* Diagnostic sol (asymétrie inverse) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 lg:gap-14 items-center mb-20 lg:mb-28">
              <div className="lg:order-1 order-2">
                <AppScreen
                  src="/landing/screens/diagnostic.webp"
                  alt="Diagnostic de sol Hanami : type de sol, composition sable/limons/argile et implications agronomiques"
                  width={1600}
                  height={1494}
                  variant="browser"
                />
              </div>
              <div className="lg:order-2 order-1">
                <span className="font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-widest text-hanami-500">
                  Diagnostic sol
                </span>
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-hanami-900 leading-snug mt-2 mb-4">
                  On analyse votre sol avant de recommander quoi que ce soit.
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  La méthode du bocal révèle la vraie nature de votre terre. Hanami
                  en tire les implications concrètes : arrosage, fertilisation,
                  scarification, pH. Le protocole part de votre sol, pas d&apos;une
                  recette générique.
                </p>
              </div>
            </div>

            {/* Plan d'action (asymétrie : texte gauche, écran droite) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-10 lg:gap-14 items-center mb-20 lg:mb-28">
              <div>
                <span className="font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-widest text-hanami-500">
                  Plan d&apos;action
                </span>
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-hanami-900 leading-snug mt-2 mb-4">
                  Votre saison entière, datée au jour près.
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  Chaque intervention à sa date, avec le produit et la dose
                  exacts. Vous cochez au fur et à mesure, Hanami ajuste si la
                  météo ou votre gazon l&apos;exigent. Le PDF figé, c&apos;est fini.
                </p>
              </div>
              <AppScreen
                src="/landing/screens/plan.webp"
                alt="Plan d'action Hanami : timeline de la saison, interventions datées et dosées, tags Intervention Hanami"
                width={1600}
                height={1822}
                variant="browser"
              />
            </div>

            {/* Bandeau galerie — calendrier + boutique (vignettes recadrées) */}
            <div className="mb-4">
              <h3 className="font-[family-name:var(--font-fraunces)] text-xl lg:text-2xl font-semibold text-hanami-900 mb-8">
                Et tout ce qu&apos;il faut pour passer à l&apos;action.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <div>
                  <AppScreen
                    src="/landing/screens/calendrier.webp"
                    alt="Calendrier Hanami : interventions planifiées, export agenda Google / Apple / Outlook, rappels"
                    width={1200}
                    height={1243}
                    variant="browser"
                    cropHeight={300}
                  />
                  <p className="text-sm text-stone-500 mt-4">
                    <strong className="text-stone-700">Calendrier &amp; rappels</strong> — vos interventions synchronisées avec votre agenda, rappel 24h avant.
                  </p>
                </div>
                <div>
                  <AppScreen
                    src="/landing/screens/boutique.webp"
                    alt="Boutique Hanami : produits professionnels sélectionnés par l'expert, doses pré-calculées sur la surface"
                    width={1200}
                    height={2103}
                    variant="browser"
                    cropHeight={300}
                  />
                  <p className="text-sm text-stone-500 mt-4">
                    <strong className="text-stone-700">Les produits pros</strong> — sélectionnés par Hanami, dosés sur vos m², introuvables en jardinerie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Affichage MOBILE (cadres téléphone) ── */}
        {device === 'mobile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-10 max-w-4xl mx-auto">
            <PhoneBlock
              src="/landing/screens/dashboard-mobile.webp"
              alt="Tableau de bord Hanami sur mobile : prochaine étape, produit et dose"
              width={720} height={1420}
              title="Le tableau de bord"
              text="La prochaine action, le bon produit, la dose sur vos m²."
            />
            <PhoneBlock
              src="/landing/screens/plan-mobile.webp"
              alt="Plan d'action Hanami sur mobile : interventions datées et dosées, statuts à cocher"
              width={720} height={1708}
              title="Le plan d'action"
              text="Chaque étape datée, dosée, cochée une fois faite."
            />
            <PhoneBlock
              src="/landing/screens/messages-mobile.webp"
              alt="Messagerie avec l'expert Hanami sur mobile : conseils agronomiques en direct"
              width={720} height={1290}
              title="Hanami vous répond"
              text="Directement, sous 24h, avec le bon dosage et le bon timing."
            />
            <PhoneBlock
              src="/landing/screens/calendrier-mobile.webp"
              alt="Calendrier Hanami sur mobile : interventions de la semaine, rappels et export agenda"
              width={720} height={1766}
              title="Le calendrier"
              text="Vos interventions synchronisées avec votre agenda."
            />
            <PhoneBlock
              src="/landing/screens/boutique-mobile.webp"
              alt="Boutique Hanami sur mobile : produits professionnels dosés sur la surface du jardin"
              width={720} height={1506}
              title="Les produits pros"
              text="Sélectionnés et dosés pour vous, livrés chez vous."
            />
          </div>
        )}

        {/* Note honnête : aperçu de l'interface en cours de finalisation */}
        <p className="font-[family-name:var(--font-space-mono)] text-[11px] text-stone-400 mt-16 text-center">
          Aperçu de l&apos;espace client inclus dans votre coaching.
        </p>
      </div>
    </section>
  )
}

function ToggleBtn({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
        active ? 'bg-white text-hanami-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function PhoneBlock({ src, alt, width, height, title, text }: {
  src: string; alt: string; width: number; height: number; title: string; text: string
}) {
  return (
    <div>
      <AppScreen src={src} alt={alt} width={width} height={height} variant="phone" />
      <p className="text-center text-sm text-stone-500 mt-5 max-w-[260px] mx-auto">
        <strong className="text-stone-700">{title}</strong> — {text}
      </p>
    </div>
  )
}
