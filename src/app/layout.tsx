import type { Metadata } from 'next'
import { Fraunces, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/shared/CookieBanner'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hanami-gazon.fr'),
  title: {
    default: 'Hanami — Coach gazon dans votre poche',
    template: '%s | Hanami',
  },
  description:
    'Diagnostic personnalisé, protocole daté, produits professionnels. Des résultats visibles pour votre gazon — partout en France.',
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
    url: 'https://hanami-gazon.fr',
    locale: 'fr_FR',
    siteName: 'Hanami',
    title: 'Hanami — Coach gazon dans votre poche',
    description:
      'Diagnostic personnalisé, protocole daté, produits professionnels. Des résultats visibles pour votre gazon.',
    // L'image est générée par src/app/opengraph-image.tsx (PNG 1200×630
    // à partir du logo brins d'herbe). On la référence explicitement ici
    // pour documenter la structure — Next.js l'injecte automatiquement.
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Hanami — Coach gazon dans votre poche',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanami — Coach gazon dans votre poche',
    description:
      'Diagnostic personnalisé, protocole daté, produits professionnels.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${fraunces.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-dm-sans)]">
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
