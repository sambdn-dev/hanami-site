'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavbarProps {
  variant?: 'light' | 'dark'
}

/** Hauteur fixe du bandeau saisonnier (px) */
const BANNER_H = 40

export default function Navbar({ variant = 'light' }: NavbarProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [bannerGone, setBannerGone] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleDismiss = () => setBannerGone(true)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('hanami:banner-dismiss', handleDismiss)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hanami:banner-dismiss', handleDismiss)
    }
  }, [])

  const isPro = variant === 'dark'

  const navBg = scrolled
    ? isPro
      ? 'bg-hanami-900/95 backdrop-blur-md shadow-lg'
      : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
    : isPro
      ? 'bg-transparent'
      : 'bg-white/90 backdrop-blur-sm border-b border-stone-100/80'

  const textColor = isPro
    ? 'text-white'
    : 'text-stone-700'

  const logoColor = isPro ? 'text-white' : 'text-hanami-900'

  function scrollToContact(e: React.MouseEvent) {
    e.preventDefault()
    const target = document.getElementById('contact')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/#contact'
    }
  }

  // Le top de la navbar : sous le bandeau quand il est visible, à 0 dès qu'on scroll ou qu'il est fermé
  const navTop = bannerGone ? 0 : BANNER_H

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      style={{ top: `${navTop}px` }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className={`font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight ${logoColor} hover:opacity-80 transition-opacity`}
          >
            hanami.
          </Link>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-7 ${textColor}`}>
            {[
              { href: '/',                label: 'Particuliers'  },
              { href: '/pro',             label: 'Professionnels' },
              { href: '/calculatrice',    label: 'Calculatrice'  },
              { href: '/pourquoi-hanami', label: 'Pourquoi Hanami ?' },
            ].map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm font-medium transition-colors hover:text-hanami-600 ${
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
            <button
              onClick={scrollToContact}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-hanami-700 text-white hover:bg-hanami-900 transition-colors cursor-pointer shadow-sm"
            >
              Contact
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/calculatrice"
              className={`text-xs font-medium transition-colors hover:text-hanami-600 ${
                pathname === '/calculatrice' ? 'text-hanami-600' : textColor
              }`}
            >
              Calculatrice
            </Link>
            <Link
              href="/pro"
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/pro'
                  ? 'bg-hanami-900 text-white'
                  : 'bg-hanami-700 text-white hover:bg-hanami-900'
              }`}
            >
              Professionnels
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
