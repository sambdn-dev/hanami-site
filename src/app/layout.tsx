import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import CookieBanner from '@/components/shared/CookieBanner'
import AnalyticsProvider from '@/components/shared/AnalyticsProvider'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { organizationSchema } from '@/lib/structured-data'
import { SITE_URL } from '@/lib/seo'
import { cn } from "@/lib/utils";

// Same typography roles as the Hanami Admin and boutique: Inter headings, Manrope body.
const inter = localFont({ src: '../fonts/inter-latin.woff2', variable: '--font-fraunces', weight: '100 900', display: 'swap' })
const manrope = localFont({ src: '../fonts/manrope.woff2', variable: '--font-dm-sans', weight: '200 800', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hanami — Expertise gazon, entretien et arrosage au Vésinet',
    template: '%s | Hanami',
  },
  description:
    'Entretien agronomique, rénovation du gazon et arrosage intelligent au Vésinet et alentours. Coaching gazon à distance partout en France.',
  // Canonical auto-référent par route : './' est résolu contre le pathname
  // de chaque page via metadataBase (voir "URL Composition" dans la doc
  // generate-metadata de Next) — chaque page pointe vers sa propre URL.
  alternates: {
    canonical: './',
  },
  keywords: [
    'coaching gazon',
    'agronomie pelouse',
    'diagnostic gazon',
    'entretien pelouse',
    'engrais professionnel',
    'Île-de-France',
    'France',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Hanami',
    title: 'Hanami — Expertise gazon',
    description:
      'Entretien agronomique, rénovation, arrosage intelligent et coaching gazon.',
    // L'image est générée par src/app/opengraph-image.tsx (PNG 1200×630
    // à partir du logo maître raster). On la référence explicitement ici
    // pour documenter la structure — Next.js l'injecte automatiquement.
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Hanami — Des pelouses plus belles, durablement.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={cn(manrope.variable, inter.variable, "font-sans")}
    >
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-dm-sans)]">
        {/* JSON-LD Organization — identité de marque sur tout le site */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        {/* Texture grain — élément DOM réel (pas body::before) pour que
            pointer-events: none fonctionne correctement sur iOS Safari */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <ScrollReveal />
        <CookieBanner />
        <AnalyticsProvider />
      </body>
    </html>
  )
}
