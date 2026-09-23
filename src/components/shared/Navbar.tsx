'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronRight, X, Menu } from 'lucide-react'

interface NavbarProps {
  variant?: 'light' | 'dark'
}

/** Hauteur fixe du bandeau saisonnier (px) */
const BANNER_H = 40

const NAV_LINKS = [
  { href: '/',                label: 'Particuliers'       },
  { href: '/pro',             label: 'Professionnels'     },
  { href: '/mon-chantier',    label: 'Mon chantier'       },
  { href: '/calculatrice',    label: 'Dosage Intelligent' },
  { href: '/blog',            label: 'Journal'            },
  { href: '/pourquoi-hanami', label: 'Pourquoi Hanami ?'  },
]

export default function Navbar({ variant = 'light' }: NavbarProps) {
  const pathname = usePathname()
  const isProRoute = pathname === '/pro' || pathname.startsWith('/pro/') || pathname === '/studio'
  const [scrolled, setScrolled]     = useState(false)
  const [bannerGone, setBannerGone] = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)

  // Gestion du focus du drawer (accessibilité clavier / lecteur d'écran)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef  = useRef<HTMLButtonElement>(null)
  const wasOpenRef   = useRef(false)

  useEffect(() => {
    const handleScroll  = () => setScrolled(window.scrollY > 20)
    const handleDismiss = () => setBannerGone(true)
    window.addEventListener('scroll',               handleScroll,  { passive: true })
    window.addEventListener('hanami:banner-dismiss', handleDismiss)
    return () => {
      window.removeEventListener('scroll',               handleScroll)
      window.removeEventListener('hanami:banner-dismiss', handleDismiss)
    }
  }, [])

  // Bloquer le scroll body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Accessibilité du drawer : Échap ferme, focus déplacé sur "Fermer" à
  // l'ouverture, puis rendu au bouton hamburger à la fermeture.
  useEffect(() => {
    if (menuOpen) {
      wasOpenRef.current = true
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false)
      }
      document.addEventListener('keydown', onKey)
      closeBtnRef.current?.focus()
      return () => document.removeEventListener('keydown', onKey)
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false
      hamburgerRef.current?.focus()
    }
  }, [menuOpen])

  const isPro = variant === 'dark'

  const navBg = scrolled
    ? isPro
      ? 'bg-hanami-900/95 backdrop-blur-md shadow-lg'
      : 'bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-brand-forest/10'
    : isPro
      ? 'bg-transparent'
      : 'bg-brand-cream/90 backdrop-blur-sm border-b border-brand-forest/10'

  const textColor = isPro ? 'text-white' : 'text-stone-700'

  const navTop = bannerGone ? 0 : BANNER_H

  return (
    <>
      {/* ── Barre de navigation ─────────────────────────────────────────── */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        style={{ top: `${navTop}px` }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="Hanami — accueil">
              <Image
                src={isPro ? '/brand/2026/logo-principal-blanc.png' : '/brand/2026/logo-principal-vert.png'}
                alt="Hanami Expert Gazon"
                width={142}
                height={51}
                priority
                className="h-auto w-[142px]"
              />
            </Link>

            {/* Le menu complet nécessite 1280 px avec ses six liens et son CTA. */}
            <div className={`hidden xl:flex items-center gap-7 ${textColor}`}>
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative text-sm font-medium whitespace-nowrap transition-colors hover:text-hanami-600 ${
                      active ? 'text-hanami-600' : ''
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] rounded-full bg-hanami-500" />
                    )}
                  </Link>
                )
              })}
              {/* CTA adapté au parcours professionnel sans modifier la couleur de la nav. */}
              <Link
                href={isProRoute ? '/pro/logiciel#contact' : '/coaching'}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-forest text-brand-cream hover:bg-brand-forest-hover transition-colors cursor-pointer shadow-sm"
              >
                {isProRoute ? 'Demander une démo' : 'Découvrir le coaching'}
              </Link>
            </div>

            {/* Mobile — bouton hamburger */}
            <button
              ref={hamburgerRef}
              className="xl:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className={`w-5 h-5 ${isPro ? 'text-white' : 'text-stone-700'}`} />
            </button>

          </div>
        </div>
      </nav>

      {/* ── Drawer mobile plein écran ───────────────────────────────────── */}
      {/* Fond semi-transparent */}
      <div
        className={`fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Panneau coulissant depuis la droite */}
      {/* `inert` retire le panneau du parcours Tab et des lecteurs d'écran
          quand il est fermé (il reste dans le DOM, juste hors-champ). */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-brand-cream z-[100] shadow-2xl flex flex-col transition-transform duration-300 ease-out xl:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        inert={!menuOpen}
      >

        {/* En-tête du drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)} aria-label="Hanami — accueil">
            <Image src="/brand/2026/logo-principal-vert.png" alt="Hanami Expert Gazon" width={142} height={51} className="h-auto w-[142px]" />
          </Link>
          <button
            ref={closeBtnRef}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-widest uppercase">Fermer</span>
          </button>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-4 border-b border-stone-100 transition-colors ${
                  active
                    ? 'text-hanami-700 bg-hanami-100/40'
                    : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span className="font-medium text-base">{label}</span>
                <ChevronRight className={`w-4 h-4 ${active ? 'text-hanami-500' : 'text-stone-300'}`} />
              </Link>
            )
          })}
        </nav>

        {/* CTA en bas */}
        <div className="px-6 py-6 border-t border-stone-100 flex flex-col gap-3">
          <Link
            href={isProRoute ? '/pro/logiciel#contact' : '/coaching'}
            onClick={() => setMenuOpen(false)}
            className="w-full py-3.5 rounded-xl bg-brand-forest text-brand-cream font-semibold text-sm hover:bg-brand-forest-hover transition-colors text-center"
          >
            {isProRoute ? 'Demander une démonstration' : 'Découvrir le coaching — 1ᵉʳ mois offert'}
          </Link>
          <a
            href="https://wa.me/33667277614"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl border border-stone-200 text-stone-700 font-medium text-sm flex items-center justify-center gap-2 hover:border-hanami-500 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>

      </div>
    </>
  )
}
