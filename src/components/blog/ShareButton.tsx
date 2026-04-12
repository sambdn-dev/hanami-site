'use client'

/**
 * ShareButton.tsx — Partage d'article
 *
 * Sur mobile, utilise l'API Web Share native (bouton "partager" système,
 * qui propose WhatsApp/Messages/Mail/etc.). Sur desktop (où Web Share
 * n'est généralement pas disponible), copie l'URL dans le presse-papier
 * et affiche un feedback "Lien copié".
 */
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
  title: string
  excerpt?: string
}

export default function ShareButton({ title, excerpt }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = {
      title,
      text: excerpt ?? title,
      url,
    }

    if (typeof navigator === 'undefined') return

    // Mobile / navigateurs supportant Web Share
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // utilisateur a annulé — on ne fait rien
        return
      }
    }

    // Fallback desktop : clipboard
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // clipboard bloquée — rien à faire
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-700 hover:border-hanami-500 hover:text-hanami-700 transition-colors"
      aria-label="Partager cet article"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-hanami-600" aria-hidden="true" />
          Lien copié
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Partager
        </>
      )}
    </button>
  )
}
