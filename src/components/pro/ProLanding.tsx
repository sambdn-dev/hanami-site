import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, CalendarDays, Camera, Clock3, FolderOpen, MessageSquareText, ShieldCheck, Smartphone, UsersRound } from 'lucide-react'
import GrassField from '@/components/shared/GrassField'
import ProProductNav from './ProProductNav'
import ProCapture from './ProCapture'
import captures from './pro-captures.json'
import styles from './ProEditorial.module.css'

const proScreens = captures.screens

export default function ProLanding() {
  return (
    <>
      <section className={styles.proHero} aria-labelledby="pro-title">
        <div className={styles.container}>
          <ProProductNav active="pro" />
          <div className={styles.proHeroGrid}>
            <div className={styles.proHeroCopy}>
              <p className={styles.kicker}><span /> HANAMI PRO / POUR LES PAYSAGISTES</p>
              <h1 id="pro-title">Chaque chantier avance.<br /><em>Vous gardez la main.</em></h1>
              <p>Contrats, tournées, équipes et suivi client réunis dans un seul espace. Le matin, chacun sait où aller. Le soir, vous savez ce qui a été fait.</p>
              <div className={styles.proHeroActions}><a href="#contact" className={styles.goldButton}>Demander une démonstration <ArrowUpRight size={18} aria-hidden="true" /></a><a href="#demo" className={styles.lightLink}>Voir les écrans <ArrowDown size={17} aria-hidden="true" /></a></div>
              <span className={styles.developmentNote}>Prototype en développement · Captures réelles du prototype, données de démonstration</span>
            </div>
            <div className={styles.heroCaptureWrap}>
              <span className={styles.heroCaptureEyebrow}>LA JOURNÉE EN UN REGARD / VUE DIRIGEANT</span>
              <ProCapture src={proScreens['briefing-dirigeant'].src} alt="Capture réelle du prototype Hanami Pro : briefing du dirigeant, équipes en tournée et alertes du jour" caption="Briefing du matin · Prototype Hanami Pro" width={proScreens['briefing-dirigeant'].width} height={proScreens['briefing-dirigeant'].height} className={styles.heroCapture} sizes="(max-width: 767px) 100vw, 52vw" priority />
            </div>
          </div>
          <div className={styles.heroMicro}><span>MOINS D’ALLERS-RETOURS</span><span>PLUS DE TEMPS SUR LE TERRAIN</span><span>UN EXPERT GAZON À PORTÉE DE MAIN</span></div>
        </div>
        <GrassField tone="dark" className={styles.proGrass} />
      </section>

      <section id="demo" className={styles.proDemo} aria-labelledby="pro-demo-title">
        <div className={styles.container}>
          <div className={styles.demoIntro} data-reveal>
            <div><p className={styles.sectionKicker}>01 / LE PRODUIT EN IMAGES</p><h2 id="pro-demo-title">Du contrat au passage.<br /><em>Sans perdre le fil.</em></h2></div>
            <p>Voici les écrans du prototype actuel. Ils montrent comment l’information circule entre le bureau, les équipes et le client. Cliquez sur une capture pour la voir en grand.</p>
          </div>
          <div className={styles.demoGrid}>
            <article className={`${styles.demoCard} ${styles.demoCardWide}`} data-reveal>
              <div className={styles.demoCardCopy}><span>01 / CONTRATS & TOURNÉES</span><h3>Vos passages planifiés, contrat par contrat.</h3><p>Une vue pour repérer ce qui est confirmé, ce qui attend une réponse et ce qu’il faut replanifier.</p></div>
              <ProCapture src="/images/pro/contrats-mois.png" alt="Capture du wireframe Hanami Pro : tableau des contrats d’entretien par mois avec états de confirmation" caption="Contrats × Mois · Wireframe avancé" width={2051} height={1726} className={styles.demoCaptureWide} sizes="(max-width: 767px) 100vw, 70vw" />
            </article>
            <article className={styles.demoCard} data-reveal>
              <div className={styles.demoCardCopy}><span>02 / ÉQUIPE</span><h3>Chaque équipe part avec la bonne tournée.</h3><p>Arrêts, horaires, consignes et matériel à emporter dans une vue simple.</p></div>
              <ProCapture src={proScreens['briefing-equipe'].src} alt="Capture réelle du prototype : briefing de l’équipe, arrêts de la tournée et matériel à charger" caption="Briefing de l’équipe · Prototype" width={proScreens['briefing-equipe'].width} height={proScreens['briefing-equipe'].height} className={styles.demoCapture} />
            </article>
            <article className={styles.demoCard} data-reveal>
              <div className={styles.demoCardCopy}><span>03 / SUR LE TERRAIN</span><h3>Le prochain arrêt, dans la poche.</h3><p>L’application terrain garde l’essentiel lisible sur téléphone, même au milieu d’une journée chargée.</p></div>
              <ProCapture src={proScreens['tournee-mobile'].src} alt="Capture mobile réelle du prototype Hanami Pro Terrain : tournée et prochain arrêt" caption="Hanami Pro Terrain · Prototype mobile" width={proScreens['tournee-mobile'].width} height={proScreens['tournee-mobile'].height} className={`${styles.demoCapture} ${styles.demoCapturePhone}`} sizes="(max-width: 767px) 70vw, 240px" />
            </article>
            <article className={styles.demoCard} data-reveal>
              <div className={styles.demoCardCopy}><span>04 / PREUVES & SUIVI</span><h3>Les photos racontent ce qui a été fait.</h3><p>Avant/après, note agronomique et signature restent attachés au passage et au site.</p></div>
              <ProCapture src="/images/pro/fil-activite.png" alt="Capture réelle du prototype : fil d’activité avec photos avant après, notes agronomiques et validation client" caption="Fil d’activité · Prototype" width={977} height={1125} className={`${styles.demoCapture} ${styles.demoCaptureFeed}`} />
            </article>
            <article className={styles.demoCard} data-reveal>
              <div className={styles.demoCardCopy}><span>05 / CÔTÉ CLIENT</span><h3>Un créneau choisi sans aller-retour.</h3><p>Le client indique sa disponibilité ; le bureau garde la maîtrise de l’organisation.</p></div>
              <ProCapture src="/images/pro/choix-creneau-client.png" alt="Capture réelle du prototype : page de choix du créneau d’un contrat d’entretien" caption="Choix du créneau · Prototype client Pro" width={638} height={983} className={`${styles.demoCapture} ${styles.demoCaptureBooking}`} />
            </article>
          </div>
          <p className={styles.demoFoot}>Écrans de travail du prototype. Les parcours et fonctions montrés sont en cours de conception ; les données affichées servent à la démonstration.</p>
          <a href="#contact" className={styles.darkButton}>Voir comment cela s’appliquerait à mon entreprise <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section id="fonctionnalites" className={styles.features} aria-labelledby="features-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading} data-reveal><div><p className={styles.sectionKicker}>02 / L’OUTIL MÉTIER</p><h2 id="features-title">Votre entreprise.<br /><em>Au même endroit.</em></h2></div><p>Une journée de paysagiste se joue sur le terrain. Hanami Pro est pensé pour que les informations suivent le chantier, de la première demande au dernier passage.</p></div>
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
            <div data-reveal><p className={styles.sectionKicker}>03 / L’EXPERTISE GAZON</p><h2 id="expertise-title">Une urgence gazon ?<br /><em>Hanami répond.</em></h2><p>Création, entretien, rénovation ou problème imprévu : vous gardez la relation client, Hanami vous aide à prendre la bonne décision technique et à guider vos équipes.</p><a className={styles.goldButton} href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">Contacter Hanami sur WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></a></div>
            <div className={styles.expertiseCards} data-reveal data-reveal-delay="1"><article><span>UN BESOIN PONCTUEL</span><h3>Un chantier. Une réponse précise.</h3><p>Diagnostic, choix des produits, doses et calendrier adaptés à votre chantier gazon.</p></article><article className={styles.premiumCard}><span>HANAMI PRO / PREMIUM · OFFRE ENVISAGÉE</span><h3>Votre expert gazon dans l’équipe.</h3><p>Un accompagnement récurrent pour vos créations, vos entretiens et les problèmes qui surgissent sur le terrain.</p><strong>Assistance directe · Protocoles · Suivi</strong></article></div>
          </div>
          <div className={styles.expertiseFoot}><span>Le bouton « Urgence gazon » est prévu dans l’application Pro.</span><span>Le contact WhatsApp est disponible dès aujourd’hui.</span></div>
        </div>
      </section>

      <section className={styles.studioTeaser} aria-labelledby="studio-teaser-title">
        <div className={styles.container}>
          <div data-reveal><p className={styles.sectionKicker}>04 / POUR ALLER PLUS LOIN</p><h2 id="studio-teaser-title">Le jardin de demain,<br /><em>visible dès aujourd’hui.</em></h2><p>Hanami Studio · Pro explore une autre étape : partir des photos et de vos consignes, proposer une image photoréaliste, puis approfondir le projet en 3D après validation.</p><Link href="/pro/studio" className={styles.darkButton}>Découvrir Hanami Studio <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <figure className={styles.studioTeaserImage} data-reveal data-reveal-delay="1"><Image src="/images/studio/jardin-a-contemporain.jpg" alt="Jardin contemporain fictif avec pelouse délimitée, pas japonais et massifs" fill sizes="(max-width: 767px) 100vw, 50vw" /><figcaption>Étude fictive · Une des trois variantes à explorer dans Studio</figcaption></figure>
        </div>
      </section>
    </>
  )
}
