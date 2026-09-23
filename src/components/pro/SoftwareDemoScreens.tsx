import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, FolderOpen, Layers3 } from 'lucide-react'

export default function SoftwareDemoScreens({ showDetailsLink = false }: { showDetailsLink?: boolean }) {
  return (
    <section className="bg-brand-cream pb-20 text-brand-forest lg:pb-28" aria-labelledby="demo-screens-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 border-t border-brand-forest/15 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-forest/65">Quelques écrans, en avant-première</p>
            <h2 id="demo-screens-title" className="font-[family-name:var(--font-fraunces)] text-4xl leading-tight tracking-tight sm:text-5xl">
              Le projet prend forme.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-brand-forest/65">
            Écrans de démonstration · Données fictives · Prototype en développement
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col overflow-hidden rounded-lg border border-brand-forest/15 bg-white/85 shadow-[0_15px_45px_rgba(15,61,40,0.06)]">
            <header className="flex items-center justify-between border-b border-brand-forest/10 px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-semibold"><CalendarDays aria-hidden="true" size={17} /> Planning</span>
              <span className="text-[11px] uppercase tracking-wider text-brand-forest/55">Aperçu 01</span>
            </header>
            <div className="flex-1 px-5 py-6">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
                <p className="font-[family-name:var(--font-fraunces)] text-2xl">Semaine du 21 septembre</p>
                <span className="text-xs text-brand-forest/60">3 passages</span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-[3.5rem_1fr] gap-3 border-t border-brand-forest/10 pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest/55">Lun 21</span>
                  <div className="border-l-2 border-brand-forest pl-3"><p className="text-sm font-semibold">Diagnostic initial</p><p className="mt-1 text-xs text-brand-forest/60">Jardin témoin · 09:00</p></div>
                </div>
                <div className="grid grid-cols-[3.5rem_1fr] gap-3 border-t border-brand-forest/10 pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest/55">Mer 23</span>
                  <div className="border-l-2 border-brand-sage pl-3"><p className="text-sm font-semibold">Intervention équipe A</p><p className="mt-1 text-xs text-brand-forest/60">Jardin témoin · 08:30</p></div>
                </div>
                <div className="grid grid-cols-[3.5rem_1fr] gap-3 border-t border-brand-forest/10 pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest/55">Ven 25</span>
                  <div className="border-l-2 border-brand-forest/30 pl-3"><p className="text-sm font-semibold">Visite de suivi</p><p className="mt-1 text-xs text-brand-forest/60">Jardin témoin · 14:00</p></div>
                </div>
              </div>
            </div>
            <p className="mt-auto border-t border-brand-forest/10 bg-brand-sage/10 px-5 py-3 text-xs text-brand-forest/65">Parcours illustratif · Données fictives.</p>
          </article>

          <article className="flex flex-col overflow-hidden rounded-lg border border-brand-forest/15 bg-white/85 shadow-[0_15px_45px_rgba(15,61,40,0.06)]">
            <header className="flex items-center justify-between border-b border-brand-forest/10 px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-semibold"><FolderOpen aria-hidden="true" size={17} /> Dossier chantier</span>
              <span className="text-[11px] uppercase tracking-wider text-brand-forest/55">Aperçu 02</span>
            </header>
            <div className="flex-1 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-forest/55">Projet fictif</p>
              <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl">Jardin témoin</h3>
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-sm bg-brand-sage/20">
                <Image src="/brand/2026/ambiance-jardin-fictif.png" alt="Jardin d’ambiance fictif illustrant le dossier de démonstration" fill sizes="(max-width: 1023px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <p className="border-t border-brand-forest/10 pt-3"><span className="block text-brand-forest/55">Prochain passage</span><strong className="mt-1 block text-sm font-semibold">23 septembre</strong></p>
                <p className="border-t border-brand-forest/10 pt-3"><span className="block text-brand-forest/55">Pièces jointes</span><strong className="mt-1 block text-sm font-semibold">Photos &amp; notes</strong></p>
              </div>
            </div>
            <p className="mt-auto border-t border-brand-forest/10 bg-brand-sage/10 px-5 py-3 text-xs text-brand-forest/65">Photo d’ambiance générée, sans lien avec un chantier client.</p>
          </article>

          <article className="flex flex-col overflow-hidden rounded-lg border border-brand-forest/15 bg-white/85 shadow-[0_15px_45px_rgba(15,61,40,0.06)]">
            <header className="flex items-center justify-between border-b border-brand-forest/10 px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-semibold"><Layers3 aria-hidden="true" size={17} /> Hanami Studio</span>
              <span className="text-[11px] uppercase tracking-wider text-brand-forest/55">Aperçu 03</span>
            </header>
            <div className="flex-1 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-forest/55">Projet fictif · Module intégré</p>
              <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl">Du plan à la perspective</h3>
              <div className="mt-5 grid h-48 grid-cols-[0.42fr_0.58fr] gap-2 overflow-hidden">
                <div className="relative overflow-hidden rounded-sm bg-brand-sage/20"><Image src="/brand/2026/studio-jardin-fictif-2d.png" alt="Plan 2D d’un jardin fictif de démonstration" fill sizes="160px" className="object-cover object-center" /></div>
                <div className="relative overflow-hidden rounded-sm bg-brand-sage/20"><Image src="/brand/2026/studio-jardin-fictif-3d.png" alt="Perspective 3D du même jardin fictif" fill sizes="240px" className="object-cover object-center" /></div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-brand-forest/70">Un aperçu du travail 2D/3D. Le prototype se découvre lors d’une démonstration accompagnée.</p>
            </div>
            <p className="mt-auto border-t border-brand-forest/10 bg-brand-sage/10 px-5 py-3 text-xs text-brand-forest/65">Rendus d’un jardin fictif réalisés dans le prototype.</p>
          </article>
        </div>
        {showDetailsLink && (
          <Link href="/pro/logiciel" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 hover:no-underline">
            Voir le parcours de démonstration
          </Link>
        )}
      </div>
    </section>
  )
}
