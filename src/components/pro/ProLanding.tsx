import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, CalendarDays, Camera, Clock3, FolderOpen, MessageSquareText, ShieldCheck, Smartphone, UsersRound, Zap } from 'lucide-react'
import GrassField from '@/components/shared/GrassField'
import ProProductNav from './ProProductNav'
import styles from './ProEditorial.module.css'

function DashboardPreview() {
  return (
    <figure className={styles.dashboardWrap}>
      <div className={styles.dashboard}>
        <div className={styles.dashboardTop}><span><b>h.</b> hanami <strong>PRO</strong></span><small>APERÇU CONCEPTUEL</small></div>
        <div className={styles.dashboardBody}>
          <div className={styles.dashboardRail} aria-hidden="true"><span>▦</span><CalendarDays size={17} /><FolderOpen size={17} /><UsersRound size={17} /><MessageSquareText size={17} /></div>
          <div className={styles.dashboardMain}>
            <div className={styles.dashboardGreeting}><div><small>TABLEAU DE BORD / JEUDI 24 SEPTEMBRE</small><h3>Une longueur d’avance.</h3></div><span><span /> En direct</span></div>
            <div className={styles.dashboardStats}><div><strong>04</strong><span>interventions<br />aujourd’hui</span></div><div><strong>12</strong><span>contrats<br />à suivre</span></div><div><strong>02</strong><span>demandes<br />à traiter</span></div></div>
            <div className={styles.dashboardPanel}><div className={styles.dashboardPanelHead}><strong>Planning du jour</strong><span>Voir le calendrier →</span></div><div className={styles.dashboardRow}><time>08:30</time><span className={styles.dashboardDot} /><div><b>Entretien mensuel</b><small>Jardin Martin · Équipe A</small></div><span className={styles.dashboardStatus}>En cours</span></div><div className={styles.dashboardRow}><time>11:00</time><span className={styles.dashboardDot} /><div><b>Diagnostic gazon</b><small>Jardin témoin · Équipe B</small></div><span className={styles.dashboardStatusMuted}>À venir</span></div><div className={styles.dashboardRow}><time>14:30</time><span className={styles.dashboardDot} /><div><b>Visite de suivi</b><small>Jardin Dubois · Équipe A</small></div><span className={styles.dashboardStatusMuted}>À venir</span></div></div>
            <div className={styles.dashboardAlert}><Zap size={15} aria-hidden="true" /><span>Une question gazon sur le chantier ?</span><strong>Urgence gazon →</strong></div>
          </div>
        </div>
      </div>
      <div className={styles.phonePreview}><div className={styles.phoneTop}><span>ÉQUIPE A / TERRAIN</span><span>●</span></div><strong>Jardin Martin</strong><small>Entretien mensuel · 08:30</small><div className={styles.phonePhoto}><Image src="/images/apres-verop.jpg" alt="Aperçu de photo de suivi dans une application d’équipe conceptuelle" fill sizes="160px" /></div><span className={styles.phoneAction}><Camera size={13} aria-hidden="true" /> Ajouter une photo</span></div>
      <figcaption>Aperçu conceptuel · Données de démonstration</figcaption>
    </figure>
  )
}

export default function ProLanding() {
  return (
    <>
      <section className={styles.proHero} aria-labelledby="pro-title">
        <div className={styles.container}>
          <ProProductNav active="pro" />
          <div className={styles.proHeroGrid}>
            <div className={styles.proHeroCopy}>
              <p className={styles.kicker}><span /> HANAMI PRO / POUR LES PAYSAGISTES</p>
              <h1 id="pro-title">Le terrain avance.<br /><em>Votre activité aussi.</em></h1>
              <p>Planning, contrats d’entretien, équipes, photos et messages clients : une vision claire de chaque chantier, même quand vous êtes ailleurs.</p>
              <div className={styles.proHeroActions}><a href="#contact" className={styles.goldButton}>Parler de Hanami Pro <ArrowUpRight size={18} aria-hidden="true" /></a><a href="#fonctionnalites" className={styles.lightLink}>Explorer la vision <ArrowDown size={17} aria-hidden="true" /></a></div>
              <span className={styles.developmentNote}>Vision produit en développement · Démonstration accompagnée</span>
            </div>
            <DashboardPreview />
          </div>
          <div className={styles.heroMicro}><span>MOINS D’ALLERS-RETOURS</span><span>PLUS DE TEMPS SUR LE TERRAIN</span><span>UN EXPERT GAZON À PORTÉE DE MAIN</span></div>
        </div>
        <GrassField tone="dark" className={styles.proGrass} />
      </section>

      <section id="fonctionnalites" className={styles.features} aria-labelledby="features-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading} data-reveal><div><p className={styles.sectionKicker}>01 / L’OUTIL MÉTIER</p><h2 id="features-title">Votre entreprise.<br /><em>Au même endroit.</em></h2></div><p>Une journée de paysagiste se joue sur le terrain. Hanami Pro est pensé pour que les informations suivent le chantier, de la première demande au dernier passage.</p></div>
          <div className={styles.featureGrid}>
            <article className={`${styles.featureCard} ${styles.featureWide}`} data-reveal><div className={styles.featureHead}><span>01 / ORGANISATION</span><CalendarDays size={26} strokeWidth={1.4} aria-hidden="true" /></div><h3>Le planning qui connaît<br />vos contrats.</h3><p>Passages récurrents, rendez-vous et rappels automatisés, équipes affectées : le calendrier devient le centre de vos opérations.</p><div className={styles.scheduleDemo}><div><small>LUN</small><b>21</b><span>Entretien · Équipe A</span></div><div><small>MAR</small><b>22</b><span>Diagnostic · Équipe B</span></div><div><small>MER</small><b>23</b><span>Suivi · Équipe A</span></div></div></article>
            <article className={styles.featureCard} data-reveal data-reveal-delay="1"><div className={styles.featureHead}><span>02 / TERRAIN</span><Smartphone size={26} strokeWidth={1.4} aria-hidden="true" /></div><h3>Le bureau dans la poche de l’équipe.</h3><p>Interventions du jour, consignes, photos avant/après et compte rendu depuis le jardin. Le dirigeant suit l’avancement à distance.</p><div className={styles.featureTiny}><span><Camera size={15} aria-hidden="true" /> 3 photos ajoutées</span><span>Intervention terminée ✓</span></div></article>
            <article className={styles.featureCard} data-reveal data-reveal-delay="1"><div className={styles.featureHead}><span>03 / CLIENTS</span><FolderOpen size={26} strokeWidth={1.4} aria-hidden="true" /></div><h3>Toute l’histoire du jardin, en un dossier.</h3><p>Coordonnées, contrats, visites, photos, échanges et prochains gestes. Le contexte reste accessible en quelques secondes.</p><div className={styles.featureTiny}><span><MessageSquareText size={15} aria-hidden="true" /> 2 messages récents</span><span><Camera size={15} aria-hidden="true" /> Photos du jardin</span></div></article>
            <article className={`${styles.featureCard} ${styles.featureWide} ${styles.featureWarm}`} data-reveal><div className={styles.featureHead}><span>04 / DIRECTION</span><UsersRound size={26} strokeWidth={1.4} aria-hidden="true" /></div><h3>Une vision d’ensemble.<br />Même à distance.</h3><p>Suivez les équipes, les rendez-vous et les chantiers en cours sans perdre le fil des demandes clients. La bonne information arrive à la bonne personne.</p><div className={styles.directionPoints}><span><Clock3 size={16} aria-hidden="true" /> Rendez-vous récurrents</span><span><ShieldCheck size={16} aria-hidden="true" /> Historique centralisé</span><span><UsersRound size={16} aria-hidden="true" /> Vue dirigeant &amp; équipe</span></div></article>
          </div>
          <p className={styles.featureDisclaimer}>Fonctionnalités visées pour Hanami Pro · Le périmètre sera validé avec les professionnels pilotes.</p>
        </div>
      </section>

      <section className={styles.expertise} aria-labelledby="expertise-title">
        <div className={styles.container}>
          <div className={styles.expertiseGrid}>
            <div data-reveal><p className={styles.sectionKicker}>02 / L’EXPERTISE GAZON</p><h2 id="expertise-title">Une urgence gazon ?<br /><em>Sami répond.</em></h2><p>Création, entretien, rénovation ou problème imprévu : vous gardez la relation client, Hanami vous aide à prendre la bonne décision technique et à guider vos équipes.</p><a className={styles.goldButton} href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">Contacter Sami sur WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></a></div>
            <div className={styles.expertiseCards} data-reveal data-reveal-delay="1"><article><span>UN BESOIN PONCTUEL</span><h3>Un chantier. Une réponse précise.</h3><p>Diagnostic, choix des produits, doses et calendrier adaptés à votre chantier gazon.</p></article><article className={styles.premiumCard}><span>HANAMI PRO / PREMIUM · OFFRE ENVISAGÉE</span><h3>Votre expert gazon dans l’équipe.</h3><p>Un accompagnement récurrent pour vos créations, vos entretiens et les problèmes qui surgissent sur le terrain.</p><strong>Assistance directe · Protocoles · Suivi</strong></article></div>
          </div>
          <div className={styles.expertiseFoot}><span>Le bouton « Urgence gazon » est prévu dans l’application Pro.</span><span>Le contact WhatsApp est disponible dès aujourd’hui.</span></div>
        </div>
      </section>

      <section className={styles.studioTeaser} aria-labelledby="studio-teaser-title">
        <div className={styles.container}>
          <div data-reveal><p className={styles.sectionKicker}>03 / POUR ALLER PLUS LOIN</p><h2 id="studio-teaser-title">Le jardin de demain,<br /><em>visible dès aujourd’hui.</em></h2><p>Hanami Studio · Pro explore une autre étape : partir des photos et de vos consignes, proposer une image photoréaliste, puis approfondir le projet en 3D après validation.</p><Link href="/pro/studio" className={styles.darkButton}>Découvrir Hanami Studio <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <figure className={styles.studioTeaserImage} data-reveal data-reveal-delay="1"><Image src="/brand/2026/ambiance-jardin-fictif.png" alt="Jardin photoréaliste illustratif pour la vision Hanami Studio Pro" fill sizes="(max-width: 767px) 100vw, 50vw" /><figcaption>Projection illustrative · Jardin fictif</figcaption></figure>
        </div>
      </section>
    </>
  )
}
