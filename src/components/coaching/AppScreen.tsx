/**
 * AppScreen.tsx — Capture de l'espace client habillée d'un cadre.
 *
 * Le cadre (navigateur ou téléphone) est construit en CSS AUTOUR de l'image,
 * pas aplati dans le PNG : il reste net en responsive et léger. Pour passer
 * des captures du prototype aux vraies captures de l'app, il suffit de
 * remplacer les fichiers dans /public/landing/screens — aucun code à toucher.
 */

import Image from 'next/image'

interface AppScreenProps {
  src: string
  alt: string
  width: number
  height: number
  variant?: 'browser' | 'phone'
  priority?: boolean
  className?: string
}

export default function AppScreen({
  src,
  alt,
  width,
  height,
  variant = 'browser',
  priority = false,
  className = '',
}: AppScreenProps) {
  if (variant === 'phone') {
    return (
      <figure
        className={`mx-auto w-full max-w-[260px] rounded-[2.2rem] border-[7px] border-hanami-900 bg-hanami-900 shadow-2xl overflow-hidden ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="260px"
          priority={priority}
          className="w-full h-auto block"
        />
      </figure>
    )
  }

  // Cadre navigateur minimaliste
  return (
    <figure
      className={`rounded-xl overflow-hidden border border-stone-200 bg-white shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 border-b border-stone-200">
        <span className="w-2.5 h-2.5 rounded-full bg-stone-300" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-stone-300" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-stone-300" aria-hidden="true" />
        <span className="ml-3 font-[family-name:var(--font-space-mono)] text-[11px] text-stone-400 truncate">
          app.hanami-gazon.fr
        </span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 720px"
        priority={priority}
        className="w-full h-auto block"
      />
    </figure>
  )
}
