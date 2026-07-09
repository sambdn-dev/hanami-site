/**
 * ResultStep.tsx — Affichage du résultat avant/après + actions
 *
 * Réutilise BeforeAfterSlider (curseur avant/après déjà éprouvé). Les actions
 * « Télécharger » et « Régénérer » peuvent déclencher la capture email (gérée
 * par le parent via les callbacks).
 */

'use client'

import Link from 'next/link'
import { Download, RefreshCw, ImagePlus } from 'lucide-react'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'

interface Props {
  beforeSrc: string
  afterSrc: string
  stub: boolean
  onDownload: () => void
  onRegenerate: () => void
  onNewPhoto: () => void
}

export default function ResultStep({
  beforeSrc,
  afterSrc,
  stub,
  onDownload,
  onRegenerate,
  onNewPhoto,
}: Props) {
  return (
    <div>
      <div className="relative">
        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeAlt="Votre pelouse actuelle"
          afterAlt="Votre pelouse transformée par Hanami"
        />

        {stub && (
          <span className="absolute top-3 left-3 z-10 font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-white">
            Mode démo
          </span>
        )}
      </div>

      {stub && (
        <p className="text-xs text-stone-400 mt-3 text-center max-w-lg mx-auto">
          Aperçu de démonstration : le vrai moteur de transformation IA sera
          branché avec la clé du modèle. La photo « après » ci-dessus est un
          exemple, pas une transformation de votre photo.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Télécharger mon visuel
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-stone-200 text-stone-800 font-medium text-sm hover:border-hanami-500 hover:text-hanami-700 transition-colors bg-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Régénérer
        </button>
        <button
          type="button"
          onClick={onNewPhoto}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-stone-500 font-medium text-sm hover:text-hanami-700 transition-colors cursor-pointer"
        >
          <ImagePlus className="w-4 h-4" />
          Autre photo
        </button>
      </div>

      {/* Upsell coaching — pont vers la conversion */}
      <div className="mt-12 text-center border-t border-stone-100 pt-8">
        <p className="text-stone-600 leading-relaxed max-w-xl mx-auto">
          Ce résultat vous plaît ? Hanami peut le rendre réel : diagnostic,
          protocole daté et produits pros, pour{' '}
          <strong className="text-hanami-900">votre</strong> gazon.
        </p>
        <Link
          href="/coaching"
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors mt-4"
        >
          Découvrir le coaching — 1ᵉʳ mois offert
        </Link>
      </div>
    </div>
  )
}
