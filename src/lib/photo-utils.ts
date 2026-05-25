/**
 * photo-utils.ts — Compression et conversion de photos côté navigateur
 *
 * Utilisé par la calculatrice de dosages (photos par zone) et potentiellement
 * d'autres features futures.
 *
 * Pipeline :
 *   1. Si HEIC (iPhone), convertir en JPEG via heic-to (WASM, marche partout)
 *   2. Charger dans un ImageBitmap pour avoir width/height intrinsèques
 *   3. Redimensionner via canvas (max côté = MAX_DIMENSION px)
 *   4. Réencoder en JPEG qualité QUALITY (~0.75 = bon compromis)
 *
 * Résultat : ~80-150 KB par photo, conserve le ratio d'origine.
 */

import { heicTo, isHeic } from 'heic-to'

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
 * Compresse une photo prise par l'utilisateur. Gère HEIC (iPhone) sur
 * tous les navigateurs grâce à heic-to (WASM).
 *
 * @throws Error si le fichier n'est pas une image décodable
 */
export async function compressPhoto(file: File): Promise<CompressedPhoto> {
  // ── 1. Conversion HEIC → JPEG si nécessaire ──────────────────────────────
  // Détection robuste : heic-to.isHeic lit les magic bytes du fichier (plus
  // fiable que le MIME type, qui peut être vide ou mal renseigné par iOS).
  let blob: Blob = file
  const looksHeicByExt = /\.(heic|heif)$/i.test(file.name)
  const looksHeicByMime = file.type === 'image/heic' || file.type === 'image/heif'

  if (looksHeicByExt || looksHeicByMime || (await isHeic(file).catch(() => false))) {
    try {
      blob = await heicTo({ blob: file, type: 'image/jpeg', quality: HEIC_QUALITY })
    } catch (err) {
      // Fallback : si la conversion échoue, on tente quand même de charger
      // le fichier original — certains navigateurs (Safari) gèrent HEIC nativement.
      console.warn('[photo-utils] heic-to failed, fallback to direct decode', err)
    }
  }

  // ── 2. Décodage en bitmap pour obtenir les dimensions natives ────────────
  const bitmap = await createImageBitmap(blob).catch((err) => {
    throw new Error(`Image illisible (${err?.message ?? 'erreur inconnue'})`)
  })

  // ── 3. Resize via canvas, en préservant le ratio d'origine ───────────────
  const { width: srcW, height: srcH } = bitmap
  const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH))
  const dstW = Math.round(srcW * scale)
  const dstH = Math.round(srcH * scale)

  const canvas = document.createElement('canvas')
  canvas.width = dstW
  canvas.height = dstH
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) throw new Error('Canvas 2D non disponible')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, dstW, dstH)

  // Important : libérer le bitmap (sinon fuite mémoire sur photos répétées)
  bitmap.close()

  // ── 4. Encodage final JPEG ────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)

  return {
    dataUrl,
    width: dstW,
    height: dstH,
    // Approximation : base64 ≈ 1.37× taille binaire, dataUrl a un préfixe ~30 chars
    bytesApprox: Math.ceil((dataUrl.length - 30) * 0.75),
  }
}

/** Format human-readable d'un nombre d'octets : 1234 → "1.2 KB" */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}
