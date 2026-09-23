import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Hanami — Des pelouses plus belles, durablement.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadHeadingFont(): Promise<ArrayBuffer> {
  const cssResponse = await fetch('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@144,500')
  if (!cssResponse.ok) throw new Error('Impossible de charger la police de partage')
  const css = await cssResponse.text()
  const fontUrl = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
  if (!fontUrl) throw new Error('Format de police de partage indisponible')
  const response = await fetch(fontUrl)
  if (!response.ok) throw new Error('Police de partage indisponible')
  return response.arrayBuffer()
}

export default async function OpenGraphImage() {
  const [logo, font] = await Promise.all([
    readFile(join(process.cwd(), 'public/brand/2026/logo-principal-vert.png')),
    loadHeadingFont(),
  ])

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 76px', background: '#F8F6EF', color: '#0F3D28' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* The approved raster is embedded unchanged; the logo is never typeset. */}
          <img src={`data:image/png;base64,${logo.toString('base64')}`} width={276} height={100} alt="Hanami Expert Gazon" style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: 18, letterSpacing: 4 }}>L’EXPERTISE AU NATUREL</span>
        </div>
        <div style={{ display: 'flex', maxWidth: 970, fontFamily: 'Fraunces', fontSize: 86, fontWeight: 500, lineHeight: 1.08, letterSpacing: -3 }}>
          Des pelouses plus belles, durablement.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #A7C29A', paddingTop: 22, fontSize: 20 }}>
          <span>Nature · Expertise · Résultats durables</span>
          <span>hanami-gazon.fr</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Fraunces', data: font, weight: 500, style: 'normal' }] },
  )
}
