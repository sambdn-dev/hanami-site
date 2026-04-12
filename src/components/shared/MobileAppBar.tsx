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
import { ChevronLeft } from 'lucide-react'

function GrassLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" aria-hidden="true">
      <path d="M9 28 C8 21 7 13 9.5 6 C11 13 11.5 21 11.5 28 Z"  fill="#4a8c3f" />
      <path d="M15 28 C14 19 14.5 10 16 2 C17.5 10 18 19 17 28 Z" fill="#2d5a27" />
      <path d="M20.5 28 C20 21 21 14 22.5 8 C24 14 24.5 21 23.5 28 Z" fill="#4a8c3f" />
      <rect x="5" y="28.5" width="22" height="1.5" rx="0.75" fill="#1a2e1a" />
    </svg>
  )
}

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

      {/* Logo centré */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <GrassLogo />
        <div className="flex flex-col leading-none gap-0.5">
          <span className="font-[family-name:var(--font-fraunces)] text-base font-semibold tracking-tight text-hanami-900">
            hanami.
          </span>
          <span className="text-[8px] font-semibold tracking-[0.18em] uppercase text-hanami-500">
            Expert Gazon
          </span>
        </div>
      </div>

    </header>
  )
}
