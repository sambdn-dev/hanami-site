/**
 * opengraph-image.tsx — Image OpenGraph générée dynamiquement
 *
 * Next.js détecte ce fichier et expose automatiquement une image PNG
 * 1200×630 à l'URL /opengraph-image. Elle est injectée dans toutes les
 * balises <meta property="og:image"> et <meta property="twitter:image">
 * des pages de l'app.
 *
 * Typographie fidèle au site :
 * - Fraunces (serif, 600) pour le wordmark "hanami." et la tagline
 * - DM Sans (400/600) pour les sous-titres et le CTA
 * - Espace Mono non utilisé ici pour rester lisible à petite taille social
 *
 * Les polices sont récupérées via l'API CSS Google Fonts au build.
 * Satori (moteur d'ImageResponse) n'accepte que ttf/otf/woff — sans header
 * User-Agent, Google Fonts renvoie un TTF ✓.
 *
 * Pour tester localement : http://localhost:3000/opengraph-image
 * Pour valider le rendu social : https://www.opengraph.xyz
 */

import { ImageResponse } from 'next/og'

export const alt = 'Hanami — Coach gazon dans votre poche'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Télécharge un fichier TTF depuis Google Fonts pour l'utiliser dans Satori.
 * Sans User-Agent, l'API renvoie un `src: url(...) format('truetype')`.
 *
 * Supporte les axes variables (ex: Fraunces avec `opsz`) via le paramètre
 * `axes`. Exemple : loadGoogleFont('Fraunces', 600, 'opsz,wght@144,600')
 * renvoie le cut "display" optical-size, plus fin et plus élégant à grande
 * taille — c'est ce que rend le site via next/font/google.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  axes?: string,
): Promise<ArrayBuffer> {
  const spec = axes ?? `wght@${weight}`
  const url  = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${spec}`
  const css  = await (await fetch(url)).text()
  const match = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)
  if (!match) throw new Error(`Impossible de charger ${family}:${weight}`)
  const fontRes = await fetch(match[1])
  return fontRes.arrayBuffer()
}

export default async function Image() {
  const [fraunces600, dmSans400, dmSans600] = await Promise.all([
    // Fraunces display-cut (opsz=144) — mêmes proportions que la Navbar
    loadGoogleFont('Fraunces', 600, 'opsz,wght@144,600'),
    loadGoogleFont('DM Sans',  400),
    loadGoogleFont('DM Sans',  600),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: 'linear-gradient(135deg, #fafaf9 0%, #e8f0e6 100%)',
          fontFamily: '"DM Sans"',
          position: 'relative',
        }}
      >
        {/* ── Décor — grand brin d'herbe filigrané en arrière-plan ────── */}
        <svg
          width="520"
          height="520"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            right: -80,
            bottom: -140,
            opacity: 0.08,
          }}
        >
          <path d="M9 28 C8 21 7 13 9.5 6 C11 13 11.5 21 11.5 28 Z" fill="#2d5a27" />
          <path d="M15 28 C14 19 14.5 10 16 2 C17.5 10 18 19 17 28 Z" fill="#2d5a27" />
          <path d="M20.5 28 C20 21 21 14 22.5 8 C24 14 24.5 21 23.5 28 Z" fill="#2d5a27" />
        </svg>

        {/* ── Haut — signature logo + wordmark ───────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {/* Logo brins d'herbe identique à la Navbar */}
          <svg width="86" height="86" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 28 C8 21 7 13 9.5 6 C11 13 11.5 21 11.5 28 Z" fill="#4a8c3f" />
            <path d="M15 28 C14 19 14.5 10 16 2 C17.5 10 18 19 17 28 Z" fill="#2d5a27" />
            <path d="M20.5 28 C20 21 21 14 22.5 8 C24 14 24.5 21 23.5 28 Z" fill="#4a8c3f" />
            <rect x="5" y="28.5" width="22" height="1.5" rx="0.75" fill="#1a2e1a" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontFamily: '"Fraunces"',
                fontSize: 82,
                fontWeight: 600,
                color: '#1a2e1a',
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
              }}
            >
              hanami.
            </span>
            <span
              style={{
                fontFamily: '"DM Sans"',
                fontSize: 16,
                fontWeight: 600,
                color: '#4a8c3f',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              Expert Gazon
            </span>
          </div>
        </div>

        {/* ── Milieu — tagline hero, seul centre d'attention ─────────── */}
        <span
          style={{
            fontFamily: '"Fraunces"',
            fontSize: 84,
            fontWeight: 600,
            color: '#1a2e1a',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            maxWidth: 1000,
          }}
        >
          Votre gazon mérite un expert, pas une étiquette en jardinerie.
        </span>

        {/* ── Bas — CTA discret en accent ─────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 28px',
              borderRadius: 999,
              background: '#2d5a27',
              color: 'white',
              fontFamily: '"DM Sans"',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 12px rgba(45, 90, 39, 0.25)',
            }}
          >
            Diagnostic gratuit
            <span style={{ fontSize: 22, transform: 'translateY(-1px)' }}>→</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces600, weight: 600, style: 'normal' },
        { name: 'DM Sans',  data: dmSans400,   weight: 400, style: 'normal' },
        { name: 'DM Sans',  data: dmSans600,   weight: 600, style: 'normal' },
      ],
    },
  )
}
