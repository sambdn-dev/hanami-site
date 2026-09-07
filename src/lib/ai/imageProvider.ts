/**
 * imageProvider.ts — Abstraction du modèle de transformation d'image
 *
 * ⚠️ SERVEUR UNIQUEMENT. Ne jamais importer depuis un composant client :
 * la clé API vit ici et ne doit jamais atteindre le navigateur.
 *
 * Fournisseur V1 : OpenAI « ChatGPT Images 2.0 » (endpoint images/edits,
 * modèle gpt-image-1). On isole tout l'accès au modèle derrière la seule
 * fonction `transformLawn()` : changer de fournisseur = changer ce fichier.
 *
 * Mode démo : si OPENAI_API_KEY n'est pas défini, on renvoie une photo
 * « après » d'exemple du dossier public/. Tout le tunnel (upload → slider →
 * gate email) est ainsi testable sans dépenser de crédits.
 *
 * Appel réseau via fetch natif (Node 18+/Next runtime nodejs) — pas de SDK,
 * donc aucune dépendance ajoutée.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'

export interface TransformInput {
  imageBuffer: Buffer
  /** MIME de l'image d'entrée (image/jpeg | image/png | image/webp) */
  mimeType: string
  /** Instruction d'édition (mappée depuis la saison, côté serveur) */
  prompt: string
}

export interface TransformOutput {
  /** Résultat en data URL prêt à afficher */
  image: string
  /** true si mode démo (pas de vraie génération) */
  stub: boolean
}

const OPENAI_EDITS_URL = 'https://api.openai.com/v1/images/edits'
// Vérifier l'identifiant de modèle courant côté OpenAI au moment du branchement.
const MODEL = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-1'
const SIZE = process.env.OPENAI_IMAGE_SIZE ?? 'auto'

/**
 * Transforme le gazon d'une photo selon `prompt`.
 * @throws Error si l'appel au modèle échoue (mappé en 502 par la route).
 */
export async function transformLawn(input: TransformInput): Promise<TransformOutput> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return stubTransform()

  const form = new FormData()
  form.append('model', MODEL)
  form.append(
    'image',
    new Blob([new Uint8Array(input.imageBuffer)], { type: input.mimeType }),
    `lawn.${extFromMime(input.mimeType)}`,
  )
  form.append('prompt', input.prompt)
  form.append('size', SIZE)
  form.append('n', '1')

  const res = await fetch(OPENAI_EDITS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    // On tronque et on ne relaie jamais la clé : le message reste interne (logs).
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300)}`)
  }

  const json = (await res.json()) as { data?: Array<{ b64_json?: string }> }
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('OpenAI: réponse sans image')

  return { image: `data:image/png;base64,${b64}`, stub: false }
}

/** Mode démo : renvoie une vraie photo « après » du site en data URL. */
async function stubTransform(): Promise<TransformOutput> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'apres-noel.jpg')
    const buf = await readFile(filePath)
    return { image: `data:image/jpeg;base64,${buf.toString('base64')}`, stub: true }
  } catch {
    // Filet ultime (ne devrait pas arriver en dev) : pixel transparent 1×1.
    return {
      image:
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      stub: true,
    }
  }
}

function extFromMime(mime: string): string {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'jpg'
}
