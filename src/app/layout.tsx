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
    default: 'Hanami — Coaching agronomique pour votre gazon',
    template: '%s | Hanami',
  },
  description:
    'Diagnostic personnalisé, protocole daté, produits professionnels. Des résultats visibles pour votre gazon — Île-de-France, France, Belgique, Suisse et pays francophones.',
  keywords: [
    'coaching gazon',
    'agronomie pelouse',
    'diagnostic gazon',
    'entretien pelouse',
    'engrais professionnel',
    'Île-de-France', 'Belgique', 'Suisse', 'pays francophones',
  ],
  openGraph: {
    type: 'website',
    url: 'https://hanami-gazon.fr',
    locale: 'fr_FR',
    siteName: 'Hanami',
    title: 'Hanami — Coaching agronomique pour votre gazon',
    description:
      'Diagnostic personnalisé, protocole daté, produits professionnels. Des résultats visibles pour votre gazon.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanami — Coaching agronomique pour votre gazon',
    description:
      'Diagnostic personnalisé, protocole daté, produits professionnels.',
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
