'use client'

/**
 * TableOfContents.tsx — Sidebar sticky de navigation intra-article
 *
 * Reçoit les h2/h3 extraits au build par `extractHeadings()` dans
 * `src/lib/blog.ts`. Les `slug` correspondent aux `id` injectés par
 * `rehype-slug` dans le HTML final, donc les ancres `#slug` fonctionnent
 * directement.
 *
 * Un IntersectionObserver met en surbrillance le titre courant pendant
 * le scroll.
 */
import { useEffect, useState } from 'react'
import type { Heading } from '@/lib/blog'

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(headings[0]?.slug ?? null)

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map(h => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      entries => {
        // On prend le premier titre visible dans la moitié haute du viewport
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id)
        }
      },
      {
        // zone de déclenchement : haut 20% → haut 60% du viewport
        rootMargin: '-20% 0% -60% 0%',
        threshold: 0,
      },
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="Table des matières"
      className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-hanami-700 mb-4">
        Sommaire
      </p>
      <ul className="space-y-2 border-l border-stone-200">
        {headings.map(h => {
          const isActive = activeSlug === h.slug
          return (
            <li key={h.slug}>
              <a
                href={`#${h.slug}`}
                className={`block -ml-px pl-4 py-1 text-sm leading-snug transition-colors border-l-2 ${
                  h.level === 3 ? 'pl-7 text-[13px]' : ''
                } ${
                  isActive
                    ? 'border-hanami-500 text-hanami-700 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-hanami-700'
                }`}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
