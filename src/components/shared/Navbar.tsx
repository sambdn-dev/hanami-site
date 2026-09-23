'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import styles from './Navbar.module.css'

const links = [
  { href: '/', label: 'Particuliers' },
  { href: '/pro', label: 'Hanami Pro' },
  { href: '/mon-chantier', label: 'Mon chantier' },
  { href: '/blog', label: 'Le journal' },
  { href: '/pourquoi-hanami', label: 'Notre approche' },
]

export default function Navbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [bannerGone, setBannerGone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  const isPro = pathname === '/pro' || pathname.startsWith('/pro/')
  const isStudio = pathname === '/pro/studio'
  const ctaHref = isStudio ? '/pro/studio#contact' : isPro ? '/pro#contact' : '/coaching'
  const ctaText = isStudio ? 'Parler de Studio' : isPro ? 'Parler de Hanami Pro' : 'Découvrir le coaching'
  const dark = variant === 'dark'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    const onDismiss = () => setBannerGone(true)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hanami:banner-dismiss', onDismiss)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hanami:banner-dismiss', onDismiss)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (menuOpen) {
      wasOpenRef.current = true
      closeRef.current?.focus()
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setMenuOpen(false)
        if (event.key !== 'Tab' || !menuRef.current) return
        const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button'))
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
      document.addEventListener('keydown', onKey)
      return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false
      openerRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`${styles.nav} ${dark ? styles.dark : styles.light} ${scrolled ? styles.scrolled : ''}`} style={{ top: bannerGone ? 0 : 40 }} aria-label="Navigation principale">
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} aria-label="Hanami — accueil">
            <Image src={dark ? '/brand/2026/logo-principal-blanc.png' : '/brand/2026/logo-principal-vert.png'} alt="Hanami Expert Gazon" width={152} height={55} priority />
          </Link>
          <div className={styles.desktopLinks}>
            {links.map((link) => {
              const active = pathname === link.href || (link.href === '/pro' && isPro)
              return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={active ? styles.active : ''}>{link.label}</Link>
            })}
          </div>
          <Link href={ctaHref} className={styles.desktopCta}>{ctaText} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button ref={openerRef} type="button" className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded={menuOpen}><Menu size={25} aria-hidden="true" /></button>
        </div>
      </nav>

      <div className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div id="mobile-menu" ref={menuRef} className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} role="dialog" aria-modal="true" aria-label="Menu principal" inert={!menuOpen}>
        <div className={styles.mobileTop}><Image src="/brand/2026/logo-principal-vert.png" alt="Hanami Expert Gazon" width={138} height={50} /><button ref={closeRef} type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><X size={25} aria-hidden="true" /></button></div>
        <div className={styles.mobileLinks}>
          {links.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span>{String(index + 1).padStart(2, '0')}</span>{link.label}<ArrowUpRight size={19} aria-hidden="true" /></Link>)}
          <Link href="/pro/studio" onClick={() => setMenuOpen(false)}><span>06</span>Hanami Studio <strong>PRO</strong><ArrowUpRight size={19} aria-hidden="true" /></Link>
        </div>
        <div className={styles.mobileBottom}><Link href={ctaHref} onClick={() => setMenuOpen(false)}>{ctaText} <ArrowUpRight size={18} aria-hidden="true" /></Link><a href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">WhatsApp · +33 6 67 27 76 14</a></div>
      </div>
    </>
  )
}
