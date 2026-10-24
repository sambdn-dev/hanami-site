/**
 * photo-utils.ts — Compression et conversion de photos côté navigateur
 *
 * Partagé par le simulateur de gazon et la calculatrice de dosages.
 *
 * Pipeline :
 *   1. Décodage natif, puis conversion HEIC via heic-to en secours
 *   2. Vérifier les dimensions et conserver l’orientation du décodage
 *   3. Redimensionner via canvas (max côté = MAX_DIMENSION px)
 *   4. Réencoder en JPEG qualité QUALITY (~0.75 = bon compromis)
 *
 * Conserve les proportions ; le poids final dépend du contenu de la photo.
 */

export const MAX_PHOTO_INPUT_BYTES = 50 * 1024 * 1024
const MAX_PHOTO_PIXELS = 64_000_000 // Includes ordinary 48 MP iPhone photographs.

const MAX_DIMENSION = 1200      // Max côté long (px)
const QUALITY = 0.78            // Qualité JPEG (0..1)
const HEIC_QUALITY = 0.92       // Qualité de la conversion HEIC→JPEG (avant resize)

export interface CompressedPhoto {
  /** data:image/jpeg;base64,... */
  dataUrl: string
  /** Dimensions finales après resize */
  width: number
  height: number
  /** Taille du dataUrl en octets (approx) — utile pour alerter si trop gros */
  bytesApprox: number
}

/**
 * Compresse une photo prise par l'utilisateur. Gère HEIC (iPhone) avec décodage natif
 * et conversion heic-to (WASM) en secours. La compatibilité dépend du navigateur.
 *
 * @throws Error si le fichier n'est pas une image décodable
 */
export async function compressPhoto(file: File): Promise<CompressedPhoto> {
  if (!file.size) throw new Error('Cette photo est vide. Choisissez une autre photo.')
  if (file.size > MAX_PHOTO_INPUT_BYTES) throw new Error('Cette photo dépasse 50 Mo. Choisissez une photo plus légère ou désactivez le mode RAW de votre appareil.')

  // Prefer the native decoder, particularly Safari's HEIC support. Avoid loading
  // the WASM converter (and a second full-resolution buffer) for ordinary photos.
  async function prepare(blob: Blob): Promise<CompressedPhoto> {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    try {
      image.src = url
      await image.decode().catch(() => { throw new Error('PHOTO_DECODE_FAILED') })
      const srcW = image.naturalWidth, srcH = image.naturalHeight
      if (!srcW || !srcH || srcW * srcH > MAX_PHOTO_PIXELS) throw new Error('La résolution dépasse 64 mégapixels. Choisissez une photo en résolution standard.')
      const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH))
      const width = Math.max(1, Math.round(srcW * scale)), height = Math.max(1, Math.round(srcH * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const context = canvas.getContext('2d', {alpha: false})
      if (!context) throw new Error('Votre navigateur ne peut pas préparer cette photo. Essayez Safari ou Chrome à jour.')
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height)
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high'
      // The browser applies the source photo's orientation when decoding it.
      context.drawImage(image, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)
      return {dataUrl, width, height, bytesApprox: Math.ceil((dataUrl.length - dataUrl.indexOf(',') - 1) * .75)}
    } finally { image.src = ''; URL.revokeObjectURL(url) }
  }
  try { return await prepare(file) }
  catch (error) {
    // A supported but oversized image is not a reason to allocate a HEIC decoder.
    if (!(error instanceof Error) || error.message !== 'PHOTO_DECODE_FAILED') throw error
  }
  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer())
  const brands = new TextDecoder('ascii').decode(header)
  const looksHeic = /\.(heic|heif)$/i.test(file.name) || /^image\/(heic|heif)$/.test(file.type) ||
    (brands.slice(4, 8) === 'ftyp' && /heic|heix|hevc|hevx|heim|heis|mif1|msf1/.test(brands.slice(8)))
  if (looksHeic) {
    try {
      const {heicTo} = await import('heic-to')
      return await prepare(await heicTo({blob: file, type: 'image/jpeg', quality: HEIC_QUALITY}))
    } catch { throw new Error('Cette photo HEIC n’a pas pu être convertie sur cet appareil. Essayez de la sélectionner depuis Photos dans Safari, ou choisissez une copie JPEG.') }
  }
  throw new Error('Cette photo ne peut pas être lue. Choisissez une photo JPEG, PNG, WebP, AVIF ou HEIC. Les fichiers RAW/DNG ne sont pas pris en charge.')
}

/** Format human-readable d'un nombre d'octets : 1234 → "1.2 KB" */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}
