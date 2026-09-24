import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Camera, Cuboid, MessageSquareText, Sparkles } from 'lucide-react'
import ProProductNav from './ProProductNav'
import StudioShowcase from './StudioShowcase'
import styles from './ProEditorial.module.css'

const stages = [
  { number: '01', icon: Camera, title: 'Vos photos', text: 'Le paysagiste importe les vues du jardin existant. La réalité du lieu devient le point de départ.' },
  { number: '02', icon: MessageSquareText, title: 'Vos consignes', text: 'Ambiance, usages, matériaux, plantations : quelques instructions décrivent le projet souhaité.' },
  { number: '03', icon: Sparkles, title: 'Une image à valider', text: 'Une proposition photoréaliste aide le client à se projeter avant d’engager la modélisation.' },
  { number: '04', icon: Cuboid, title: 'Puis la 3D', text: 'Une fois la direction validée, le projet peut passer au rendu en volume et aux détails.' },
] as const

export default function StudioLanding() {
  return (
    <>
      <section className={styles.studioHero} aria-labelledby="studio-title">
        <div className={styles.container}>
          <ProProductNav active="studio" />
          <div className={styles.studioHeroGrid}>
            <div className={styles.studioHeroCopy}>
              <p className={styles.kicker}><span /> HANAMI STUDIO · PRO / VISION CRÉATIVE</p>
              <h1 id="studio-title">Imaginez le jardin.<br /><em>Montrez-le.</em></h1>
              <p>Une idée de chantier devient d’abord une image photoréaliste que votre client peut comprendre et valider. La 3D vient ensuite, quand la direction est claire.</p>
              <div className={styles.proHeroActions}><a href="#parcours" className={styles.darkButton}>Voir le parcours <ArrowDown size={18} aria-hidden="true" /></a><a href="#contact" className={styles.studioTextLink}>Parler de Studio <ArrowUpRight size={18} aria-hidden="true" /></a></div>
              <span className={styles.studioDevelopmentNote}>Vision de produit · Visuels conceptuels, non générés en direct</span>
            </div>
            <figure className={styles.studioHeroImage}><Image src="/images/studio/jardin-a-contemporain.jpg" alt="Jardin contemporain fictif avec pelouse centrale, pas japonais, massifs fleuris et bouleaux" fill loading="eager" sizes="(max-width: 767px) 100vw, 50vw" /><div className={styles.studioImageBadge}><Sparkles size={17} aria-hidden="true" /><span>PROPOSITION VISUELLE</span></div><figcaption>Jardin fictif · Trois études à explorer plus bas</figcaption></figure>
          </div>
          <div className={styles.studioHeroBottom}><span>PHOTO RÉELLE</span><span>→</span><span>IMAGE PHOTORÉALISTE</span><span>→</span><span>VALIDATION</span><span>→</span><span>3D</span></div>
        </div>
      </section>

      <section id="parcours" className={styles.studioFlow} aria-labelledby="studio-flow-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading} data-reveal><div><p className={styles.sectionKicker}>01 / UN FLUX PLUS SIMPLE</p><h2 id="studio-flow-title">D’abord l’idée.<br /><em>Ensuite le volume.</em></h2></div><p>Un parcours pensé pour vendre un projet sans perdre du temps à modéliser une piste que le client n’a pas encore choisie.</p></div>
          <div className={styles.studioStages}>{stages.map(({ number, icon: Icon, title, text }, index) => <article key={number} data-reveal data-reveal-delay={String(index % 3 + 1)}><div><span>{number}</span><Icon size={26} strokeWidth={1.4} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <StudioShowcase />

      <section className={styles.studioEnd} aria-labelledby="studio-end-title"><div className={styles.container}><div data-reveal><p className={styles.sectionKicker}>HANAMI STUDIO · PRO</p><h2 id="studio-end-title">Le projet se vend mieux quand il se voit.</h2></div><div data-reveal data-reveal-delay="1"><p>Studio est imaginé comme un module créatif distinct, relié à Hanami Pro pour garder les photos, les échanges et l’historique du client au même endroit.</p><Link href="/pro" className={styles.lightLink}>Découvrir Hanami Pro <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div></section>
    </>
  )
}
