/**
 * opengraph-image.tsx — Image OpenGraph générée dynamiquement
 *
 * Next.js détecte ce fichier et expose automatiquement une image PNG
 * 1200×630 à l'URL /opengraph-image. Elle est injectée dans toutes les
 * balises <meta property="og:image"> et <meta property="twitter:image">
 * des pages de l'app.
 *
 * Visuel : reprend le logo brins d'herbe utilisé dans la Navbar + le
 * wordmark "hanami." en Fraunces, sur fond crème avec accent vert.
 *
 * Pour tester localement : http://localhost:3000/opengraph-image
 * Pour valider le rendu social : https://www.opengraph.xyz
 */

import { ImageResponse } from 'next/og'

export const alt = 'Hanami — Coach gazon dans votre poche'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 96px',
          background: 'linear-gradient(135deg, #fafaf9 0%, #e8f0e6 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Haut — logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Logo brins d'herbe (identique à Navbar.GrassLogo) */}
          <svg
            width="96"
            height="96"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 28 C8 21 7 13 9.5 6 C11 13 11.5 21 11.5 28 Z"
              fill="#4a8c3f"
            />
            <path
              d="M15 28 C14 19 14.5 10 16 2 C17.5 10 18 19 17 28 Z"
              fill="#2d5a27"
            />
            <path
              d="M20.5 28 C20 21 21 14 22.5 8 C24 14 24.5 21 23.5 28 Z"
              fill="#4a8c3f"
            />
            <rect x="5" y="28.5" width="22" height="1.5" rx="0.75" fill="#1a2e1a" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                fontSize: 88,
                fontWeight: 600,
                color: '#1a2e1a',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              hanami.
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#4a8c3f',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Expert Gazon
            </span>
          </div>
        </div>

        {/* Milieu — tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: '#1a2e1a',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Votre gazon mérite un expert, pas une étiquette en jardinerie.
          </span>
        </div>

        {/* Bas — URL + accent */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: '#78716c',
              letterSpacing: '0.05em',
            }}
          >
            hanami-gazon.fr
          </span>
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '12px 24px',
              borderRadius: 999,
              background: '#2d5a27',
              color: 'white',
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            Diagnostic gratuit
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
