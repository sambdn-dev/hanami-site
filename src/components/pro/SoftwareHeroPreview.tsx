import Image from 'next/image'
import { CalendarDays, FolderOpen, Layers3 } from 'lucide-react'

/** A deliberately partial, read-only preview using a fictitious garden. */
export default function SoftwareHeroPreview() {
  return (
    <figure className="relative min-w-0">
      <div className="overflow-hidden rounded-lg border border-brand-forest/20 bg-brand-cream shadow-[0_24px_70px_rgba(15,61,40,0.12)]">
        <div className="flex items-center justify-between gap-3 bg-brand-forest px-5 py-4 text-brand-cream">
          <span className="text-sm font-semibold tracking-wide">Hanami Pro</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-brand-sage">Espace de démonstration</span>
        </div>
        <div className="grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[3.5rem_minmax(0,1fr)]">
          <div aria-hidden="true" className="flex flex-col items-center gap-6 border-r border-brand-forest/10 bg-brand-sage/10 pt-6 text-brand-forest/45">
            <CalendarDays size={18} strokeWidth={1.5} />
            <FolderOpen size={18} strokeWidth={1.5} />
            <span className="rounded-md bg-brand-forest p-2 text-brand-cream"><Layers3 size={18} strokeWidth={1.5} /></span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-forest/10 px-4 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-brand-forest/60">Studio · Projet fictif</p>
                <p className="mt-1 font-[family-name:var(--font-fraunces)] text-xl">Jardin témoin</p>
              </div>
              <span className="rounded border border-brand-forest/15 px-2 py-1 font-[family-name:var(--font-space-mono)] text-xs">Vue 3D</span>
            </div>
            <div className="relative aspect-[1/1] bg-[#9ea7a5] sm:aspect-[6/5]">
              <Image
                src="/brand/2026/studio-jardin-fictif-3d.png"
                alt="Aperçu du module Studio montrant le rendu 3D d’un jardin fictif"
                fill
                priority
                sizes="(max-width: 1023px) 85vw, 36vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2 border-t border-brand-forest/10 px-4 py-3 text-xs text-brand-forest/65">
              <FolderOpen size={14} aria-hidden="true" /> Dans le même dossier chantier
            </div>
          </div>
        </div>
      </div>
      <div className="relative -mt-4 ml-5 mr-5 max-w-xs rounded-md border border-brand-forest/15 bg-brand-cream p-4 shadow-[0_8px_24px_rgba(15,61,40,0.08)] sm:ml-8 sm:mr-0 lg:-ml-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-forest/60"><CalendarDays size={14} aria-hidden="true" /> Planning · Aperçu</div>
        <p className="mt-2 text-sm font-semibold">Mercredi 23 · 08:30</p>
        <p className="mt-1 text-xs text-brand-forest/70">Intervention · Jardin témoin · Équipe A</p>
      </div>
      <figcaption className="mt-5 text-xs leading-relaxed text-brand-forest/65">
        Aperçu du prototype · Données et jardin fictifs.
      </figcaption>
    </figure>
  )
}
