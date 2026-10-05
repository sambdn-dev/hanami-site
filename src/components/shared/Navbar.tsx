'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { SHOP_ENABLED } from '@/lib/site-features'
import styles from './Navbar.module.css'

const links = [
  { href: '/', label: 'Particuliers' },
  { href: '/pro', label: 'Hanami Pro' },
  { href: '/mon-chantier', label: 'Mon chantier' },
  { href: '/calculatrice', label: 'Dosage Intelligent' },
  { href: '/blog', label: 'Le journal' },
  { href: '/pourquoi-hanami', label: 'Notre approche' },
]

const localLinks = [
  { href: '/interventions-locales#offres', label: 'Interventions agronomiques' },
  { href: '/interventions-locales#arrosage-automatique', label: 'Arrosage intelligent' },
  { href: '/coaching', label: 'Coaching' },
  ...(SHOP_ENABLED ? [{ href: '/boutique', label: 'Boutique' }] : []),
]

const localSecondaryGroups = [
  {
    label: 'Rénovation & outils',
    links: [
      { href: '/renovation-express', label: 'Rénovation express' },
      { href: '/mon-chantier', label: 'Mon chantier' },
      { href: '/calculatrice', label: 'Dosage intelligent' },
    ],
  },
  {
    label: 'Découvrir Hanami',
    links: [
      { href: '/blog', label: 'Le journal' },
      { href: '/pourquoi-hanami', label: 'Notre approche' },
      { href: '/pro', label: 'Hanami Pro' },
      { href: '/pro/studio', label: 'Hanami Studio' },
    ],
  },
]

function LocalDesktopNavigation({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!moreOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !moreRef.current?.contains(event.target)) setMoreOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setMoreOpen(false)
      moreButtonRef.current?.focus()
    }
    const media = window.matchMedia('(min-width: 1100px)')
    const onViewportChange = () => { if (!media.matches) setMoreOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onViewportChange)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', onViewportChange)
    }
  }, [moreOpen])

  return (
    <div className={`${styles.desktopLinks} ${styles.localDesktopLinks}`}>
      {localLinks.map((link) => {
        const active = link.href.endsWith('#offres')
          ? pathname === '/' || pathname === '/interventions-locales'
          : pathname === link.href
        return <Link key={link.href} href={link.href} onClick={() => setMoreOpen(false)} aria-current={active ? 'page' : undefined} className={active ? styles.active : ''}>{link.label}</Link>
      })}
      <div
        className={styles.more}
        ref={moreRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMoreOpen(false)
        }}
      >
        <button
          ref={moreButtonRef}
          type="button"
          className={styles.moreButton}
          aria-expanded={moreOpen}
          aria-controls={panelId}
          onClick={() => setMoreOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowDown') return
            event.preventDefault()
            setMoreOpen(true)
            requestAnimationFrame(() => moreRef.current?.querySelector<HTMLElement>('a')?.focus())
          }}
        >
          Plus <ChevronDown size={14} aria-hidden="true" />
        </button>
        <div
          id={panelId}
          className={styles.morePanel}
          hidden={!moreOpen}
          inert={!moreOpen}
          onKeyDown={(event) => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
            const items = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('a'))
            const current = items.indexOf(document.activeElement as HTMLAnchorElement)
            if (current < 0) return
            event.preventDefault()
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
            items[next]?.focus()
          }}
        >
          {localSecondaryGroups.map((group) => (
            <div className={styles.moreGroup} key={group.label}>
              <p>{group.label}</p>
              {group.links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMoreOpen(false)} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Navbar({ variant = 'light', localOffers = false }: { variant?: 'light' | 'dark'; localOffers?: boolean }) {
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
  const ctaHref = isStudio ? '/pro/studio#contact' : isPro ? '/pro#contact' : localOffers ? '#contact' : '/coaching'
  const ctaText = isStudio ? 'Parler de Studio' : isPro ? 'Parler de Hanami Pro' : localOffers ? 'Parlons de votre jardin' : 'Découvrir le coaching'
  const displayLinks = localOffers ? localLinks : links
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
      <nav className={`${styles.nav} ${dark ? styles.dark : styles.light} ${scrolled ? styles.scrolled : ''} ${localOffers ? styles.localNav : ''}`} style={{ top: bannerGone ? 0 : 40 }} aria-label="Navigation principale">
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} aria-label="Hanami — accueil">
            <Image src={dark ? '/brand/2026/logo-principal-blanc.png' : '/brand/2026/logo-principal-vert.png'} alt="Hanami Expert Gazon" width={100} height={36} priority />
          </Link>
          {localOffers ? <LocalDesktopNavigation key={pathname} pathname={pathname} /> : <div className={styles.desktopLinks}>
            {displayLinks.map((link) => {
              const active = pathname === link.href || (link.href === '/pro' && isPro) || (localOffers && pathname === '/' && link.href === '/interventions-locales')
              return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={active ? styles.active : ''}>{link.label}</Link>
            })}
          </div>}
          <Link href={ctaHref} className={styles.desktopCta}>{ctaText} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button ref={openerRef} type="button" className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded={menuOpen}><Menu size={25} aria-hidden="true" /></button>
        </div>
      </nav>

      <div className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div id="mobile-menu" ref={menuRef} className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} role="dialog" aria-modal="true" aria-label="Menu principal" inert={!menuOpen}>
        <div className={styles.mobileTop}><Image src="/brand/2026/logo-principal-vert.png" alt="Hanami Expert Gazon" width={100} height={36} /><button ref={closeRef} type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><X size={25} aria-hidden="true" /></button></div>
        <div className={`${styles.mobileLinks} ${localOffers ? styles.localMobileLinks : ''}`}>
          {localOffers && <p className={styles.mobileGroupLabel}>Nos offres pour votre gazon</p>}
          {displayLinks.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span>{String(index + 1).padStart(2, '0')}</span>{link.label}<ArrowUpRight size={19} aria-hidden="true" /></Link>)}
          {!localOffers && <Link href="/pro/studio" onClick={() => setMenuOpen(false)}><span>{String(displayLinks.length + 1).padStart(2, '0')}</span>Hanami Studio <strong>PRO</strong><ArrowUpRight size={19} aria-hidden="true" /></Link>}
        </div>
        {localOffers && <div className={styles.mobileSecondary}>
          {localSecondaryGroups.map((group) => <div key={group.label}><p className={styles.mobileGroupLabel}>{group.label}</p>{group.links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div>)}
        </div>}
        <div className={styles.mobileBottom}><Link href={ctaHref} onClick={() => setMenuOpen(false)}>{ctaText} <ArrowUpRight size={18} aria-hidden="true" /></Link><a href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">WhatsApp · +33 6 67 27 76 14</a></div>
      </div>
    </>
  )
}
