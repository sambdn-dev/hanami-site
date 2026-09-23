/**
 * MobileAppBar.tsx — Barre d'application minimale pour mobile
 *
 * Remplace la Navbar complète sur les pages "app" comme la calculatrice.
 * Visible uniquement en dessous du breakpoint sm (< 640px).
 * Design : fond blanc/95 + blur, même style que la Navbar au scroll.
 *
 * Contenu : lien "← Accueil" à gauche + logo centré.
 */

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'

export default function MobileAppBar() {
  return (
    <header className="sm:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 flex items-center px-4">

      {/* Lien retour */}
      <Link
        href="/"
        className="flex items-center gap-0.5 text-xs text-stone-500 hover:text-hanami-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Accueil
      </Link>

      {/* Logo officiel centré, au même format discret que la navigation */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center" aria-label="Hanami — accueil">
        <Image src="/brand/2026/logo-principal-vert.png" alt="Hanami Expert Gazon" width={94} height={34} priority />
      </Link>

    </header>
  )
}
