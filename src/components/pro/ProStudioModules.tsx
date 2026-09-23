import Link from 'next/link'
import CalendlyButton from '@/components/shared/CalendlyButton'
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  ContactRound,
  FileText,
  UsersRound,
} from 'lucide-react'

const modules = [
  {
    icon: CalendarDays,
    number: '01',
    title: 'Planning',
    description: 'Voir les chantiers à venir, les échéances et les disponibilités dans un calendrier lisible.',
  },
  {
    icon: UsersRound,
    number: '02',
    title: 'Équipes',
    description: 'Savoir qui intervient, où et quand, sans multiplier les messages et les tableaux.',
  },
  {
    icon: ClipboardList,
    number: '03',
    title: 'Interventions',
    description: 'Garder le contexte du chantier, les tâches à réaliser et un historique exploitable.',
  },
  {
    icon: CalendarCheck2,
    number: '04',
    title: 'Rendez-vous',
    description: 'Relier les demandes entrantes à des créneaux et à un suivi clair du prospect.',
  },
  {
    icon: ContactRound,
    number: '05',
    title: 'CRM',
    description: 'Retrouver clients, jardins, échanges et prochaines actions au même endroit.',
  },
  {
    icon: FileText,
    number: '06',
    title: 'Devis',
    description: 'Préparer une proposition cohérente à partir du besoin et du contexte du chantier.',
  },
] as const

export default function ProStudioModules() {
  return (
    <>
      <section className="bg-brand-cream py-20 text-brand-forest lg:py-28" aria-labelledby="pro-modules-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-8 border-b border-brand-forest/15 pb-10 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-forest/65">Le quotidien des paysagistes</p>
              <h2 id="pro-modules-title" className="font-[family-name:var(--font-fraunces)] text-4xl leading-tight tracking-tight sm:text-5xl">
                Six besoins. Une vision plus simple.
              </h2>
            </div>
            <p className="max-w-sm leading-relaxed text-brand-forest/70">
              Ces besoins orientent Hanami Pro. Le prototype actuel relie déjà planning, dossier chantier et Studio ; le reste sera priorisé avec les professionnels.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-sm border border-brand-forest/15 bg-brand-forest/15 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ icon: Icon, number, title, description }) => (
              <article key={title} className="min-h-56 bg-brand-cream p-7 transition-colors hover:bg-white/75 lg:p-9">
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-[family-name:var(--font-space-mono)] text-xs text-brand-forest/55">{number}</span>
                  <Icon aria-hidden="true" className="text-brand-forest" size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-forest/70">{description}</p>
              </article>
            ))}
          </div>
          <Link href="/pro/logiciel" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:no-underline">
            Voir le périmètre de la V1 <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-brand-forest py-20 text-brand-cream lg:py-24" aria-labelledby="pro-expertise-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-sage">Ce qui existe déjà</p>
            <h2 id="pro-expertise-title" className="font-[family-name:var(--font-fraunces)] text-4xl leading-tight tracking-tight sm:text-5xl">
              L’expertise terrain reste notre point de départ.
            </h2>
          </div>
          <div className="grid gap-7 text-brand-cream/80 sm:grid-cols-2">
            <div className="border-t border-brand-cream/25 pt-5">
              <h3 className="mb-3 font-[family-name:var(--font-fraunces)] text-2xl text-brand-cream">Diagnostic &amp; protocole</h3>
              <p className="text-sm leading-relaxed">Identifier la cause, choisir le geste, la dose et le bon moment pour chaque chantier gazon.</p>
            </div>
            <div className="border-t border-brand-cream/25 pt-5">
              <h3 className="mb-3 font-[family-name:var(--font-fraunces)] text-2xl text-brand-cream">Dosage par zone</h3>
              <p className="text-sm leading-relaxed">Préparer des quantités adaptées aux surfaces et à l’état réel de chaque zone.</p>
            </div>
            <div className="border-t border-brand-cream/25 pt-5">
              <h3 className="mb-3 font-[family-name:var(--font-fraunces)] text-2xl text-brand-cream">Suivi saisonnier</h3>
              <p className="text-sm leading-relaxed">Adapter les interventions aux saisons et aux conditions de chaque chantier, avec un interlocuteur agronomique.</p>
            </div>
            <div className="border-t border-brand-cream/25 pt-5">
              <h3 className="mb-3 font-[family-name:var(--font-fraunces)] text-2xl text-brand-cream">Partenariat paysagiste</h3>
              <p className="text-sm leading-relaxed">Confier le diagnostic et le protocole gazon à Hanami tout en gardant la relation avec vos clients.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 sm:col-span-2">
              <CalendlyButton
                utmSource="pro-expertise-terrain"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-cream px-5 text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-sage"
              >
                Réserver un appel expertise (30 min)
              </CalendlyButton>
              <Link href="/calculatrice" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cream underline underline-offset-4 hover:no-underline">
                Explorer la calculatrice de dosages <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
