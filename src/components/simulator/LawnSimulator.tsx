'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Camera, Check, ImagePlus, LoaderCircle, Trash2, LockKeyhole, ArrowRight, Leaf, Sparkles } from 'lucide-react'
import SimulationProcessing from './SimulationProcessing'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'
import { compressPhoto } from '@/lib/photo-utils'
import { isSimulationJob, simulationImage, type LawnSimulationJob } from './types'
import styles from './Simulator.module.css'

const API = '/api/gazon-simulations'
const MAX_INPUT = 10 * 1024 * 1024
const MAX_UPLOAD = 2 * 1024 * 1024
const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif'
const DISCLAIMER = 'Simulation IA indicative — le résultat réel dépend du terrain et des travaux.'
let sessionBinding: string | null = null

interface PreparedPhoto {
  src: string
  file: File
  width: number
  height: number
  requestId: string
}

async function requestJson(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const headers = new Headers(init?.headers)
  const method = init?.method?.toUpperCase() ?? 'GET'
  if (sessionBinding && (method === 'POST' || method === 'DELETE')) headers.set('x-hanami-simulation-session', sessionBinding)
  const load = () => fetch(`${API}${path}`, { cache: 'no-store', ...init, headers })
  // Share first-cookie initialization across tabs on browsers with Web Locks
  // (including current Safari/iPadOS), before any tab can create a paid job.
  const response = path === '' && method === 'GET' && typeof navigator !== 'undefined' && navigator.locks
    ? await navigator.locks.request('hanami-lawn-session-bootstrap', load)
    : await load()
  const binding = response.headers.get('x-hanami-simulation-session')
  if (binding && /^[a-f0-9]{24}$/.test(binding)) sessionBinding = binding
  const body: unknown = await response.json().catch(() => null)
  if (!body || typeof body !== 'object') throw new Error('Le service ne répond pas correctement. Réessayez dans un instant.')
  const data = body as Record<string, unknown>
  if (!response.ok) {
    const detail = data.error && typeof data.error === 'object' ? data.error as Record<string, unknown> : null
    throw new Error(typeof detail?.message === 'string' ? detail.message : typeof data.message === 'string' ? data.message : 'Le service est momentanément indisponible. Votre demande n’a pas été confirmée.')
  }
  return data
}

function readJob(data: Record<string, unknown>) {
  if (!isSimulationJob(data.job)) throw new Error('L’état de la simulation n’a pas pu être confirmé. Actualisez son suivi.')
  return data.job
}

const dateLabel = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function LawnSimulator() {
  const [photo, setPhoto] = useState<PreparedPhoto | null>(null)
  const [finish, setFinish] = useState<'natural' | 'manicured'>('natural')
  const [height, setHeight] = useState<'source' | 'short' | 'comfortable'>('source')
  const [authorized, setAuthorized] = useState(false)
  const [job, setJob] = useState<LawnSimulationJob | null>(null)
  const [jobs, setJobs] = useState<LawnSimulationJob[]>([])
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'uploading' | 'starting' | 'deleting'>('idle')
  const [error, setError] = useState('')
  const [sessionError, setSessionError] = useState('')
  const [pollError, setPollError] = useState('')
  const [imageErrorId, setImageErrorId] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [sessionReady, setSessionReady] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactBusy, setContactBusy] = useState(false)
  const [contactError, setContactError] = useState('')
  const actionLock = useRef(false)
  const selection = useRef(0)
  const libraryInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const photoHeading = useRef<HTMLHeadingElement>(null)
  const selectedPhotoSrc = photo?.src

  const busy = phase !== 'idle'
  const working = job?.status === 'running'
  const activeJobId = job?.id
  const activeJobStatus = job?.status
  const canGenerate = !loadingHistory && sessionReady && !!photo && authorized


  const updateJob = useCallback((next: LawnSimulationJob) => {
    setJob(next)
    setJobs(previous => [next, ...previous.filter(item => item.id !== next.id)].slice(0, 20))
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    requestJson('', { signal: controller.signal })
      .then(data => {
        if (!Array.isArray(data.jobs)) throw new Error('L’historique n’a pas pu être chargé.')
        setSessionReady(sessionBinding !== null)
        const history = data.jobs.filter(isSimulationJob)
        setJobs(previous => [...previous, ...history.filter(item => !previous.some(existing => existing.id === item.id))].slice(0, 20))
        if (selection.current === 0) setJob(previous => previous ?? history[0] ?? null)
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setSessionError(cause instanceof Error ? cause.message : 'Impossible de retrouver vos simulations.')
      })
      .finally(() => { if (!controller.signal.aborted) setLoadingHistory(false) })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!activeJobId || activeJobStatus !== 'running') return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    let failures = 0
    const id = activeJobId
    async function poll() {
      try {
        const next = readJob(await requestJson(`/${id}`, { signal: controller.signal }))
        if (controller.signal.aborted) return
        updateJob(next)
        setPollError('')
        failures = 0
        if (next.status === 'running') timer = setTimeout(poll, 2500)
      } catch {
        if (controller.signal.aborted) return
        failures += 1
        setPollError('La connexion au suivi est interrompue. Le traitement peut continuer ; aucune nouvelle génération n’est lancée.')
        timer = setTimeout(poll, Math.min(30000, 2500 * 2 ** failures))
      }
    }
    timer = setTimeout(poll, 1000)
    return () => { controller.abort(); clearTimeout(timer) }
  }, [activeJobId, activeJobStatus, updateJob])

  useEffect(() => {
    if (selectedPhotoSrc) photoHeading.current?.focus()
  }, [selectedPhotoSrc])

  useEffect(() => {
    if (job?.status === 'completed') resultHeading.current?.focus({ preventScroll: true })
  }, [job?.id, job?.status])

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || actionLock.current || working) return
    const revision = ++selection.current
    setError('')
    if (file.size > MAX_INPUT) { setError('Cette photo dépasse 10 Mo. Choisissez une version plus légère.'); return }
    if (!/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name) && !/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type)) {
      setError('Choisissez une photo JPEG, PNG, WebP, HEIC ou HEIF.'); return
    }
    setPhase('preparing')
    try {
      const compressed = await compressPhoto(file)
      const blob = await (await fetch(compressed.dataUrl)).blob()
      if (revision !== selection.current) return
      if (blob.size > MAX_UPLOAD) throw new Error('Cette photo reste trop lourde après préparation. Essayez une autre photo ou une résolution plus petite.')
      if (compressed.width < 320 || compressed.height < 320) throw new Error('Cette photo est trop petite. Utilisez une photo d’au moins 320 pixels de côté, nette et bien éclairée.')
      setPhoto({ src: compressed.dataUrl, file: new File([blob], 'jardin.jpg', { type: 'image/jpeg' }), width: compressed.width, height: compressed.height, requestId: crypto.randomUUID() })
      setAuthorized(false)
      setJob(null)
      setContactSent(false)
      setConfirmDelete(false)
      setPollError('')
    } catch (cause) {
      if (revision === selection.current) setError(cause instanceof Error ? cause.message : 'Cette photo ne peut pas être lue. Essayez une photo JPEG.')
    } finally { if (revision === selection.current) setPhase('idle') }
  }

  async function start(saved: LawnSimulationJob) {
    if (saved.status !== 'queued' || saved.stage !== 'ready') {
      updateJob(saved)
      if (saved.status === 'queued') setError('L’envoi de cette photo est incomplet. Importez-la à nouveau pour préparer une nouvelle simulation. Aucun traitement IA n’a été lancé.')
      return
    }
    setPhase('starting')
    try {
      const next = readJob(await requestJson(`/${saved.id}/start`, { method: 'POST' }))
      updateJob(next)
      setPhoto(null)
      setPollError('')
    } catch (cause) {
      // A lost acknowledgement never creates a second job or automatic paid retry.
      setError(cause instanceof Error ? cause.message : 'Le lancement n’a pas pu être confirmé.')
      try { updateJob(readJob(await requestJson(`/${saved.id}`))) } catch { /* Preserve the saved job and explicit refresh action. */ }
    }
  }

  async function generate() {
    if (!photo || !canGenerate || actionLock.current) return
    actionLock.current = true
    setError('')
    setPhase('uploading')
    try {
      const form = new FormData()
      form.append('original', photo.file)
      form.append('idempotencyKey', photo.requestId)
      form.append('photoAuthorization', 'true')
      form.append('options', JSON.stringify({ finish, height }))
      const saved = readJob(await requestJson('', { method: 'POST', body: form }))
      updateJob(saved)
      setPhoto(null)
      await start(saved)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'La photo n’a pas pu être envoyée. Réessayez sans changer de photo.')
    } finally { actionLock.current = false; setPhase('idle') }
  }

  async function resume() {
    if (!job || job.status !== 'queued' || job.stage !== 'ready' || actionLock.current) return
    actionLock.current = true
    setError('')
    try { await start(job) } finally { actionLock.current = false; setPhase('idle') }
  }

  async function refresh() {
    if (!job || actionLock.current) return
    try {
      updateJob(readJob(await requestJson(`/${job.id}`)))
      setPollError('')
      setError('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Le suivi n’est pas disponible.') }
  }

  async function deleteSimulation() {
    if (!job || actionLock.current || job.status === 'running') return
    actionLock.current = true
    setPhase('deleting')
    setError('')
    try {
      const data = await requestJson(`/${job.id}`, { method: 'DELETE' })
      if (data.success !== true) throw new Error('La suppression n’a pas été confirmée.')
      setJobs(previous => previous.filter(item => item.id !== job.id))
      setJob(null)
      setConfirmDelete(false)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'La suppression n’a pas abouti.') }
    finally { actionLock.current = false; setPhase('idle') }
  }

  async function sendContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!job || job.status !== 'completed' || contactBusy) return
    const form = new FormData(event.currentTarget)
    if (form.get('attachSimulation') !== 'on') return
    setContactBusy(true)
    setContactError('')
    try {
      const data = await requestJson(`/${job.id}/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: String(form.get('name') ?? '').trim(), email: String(form.get('email') ?? '').trim(), message: String(form.get('message') ?? '').trim(), attachSimulation: true }),
      })
      if (data.success !== true) throw new Error('Votre demande n’a pas été confirmée. Réessayez ou contactez Hanami.')
      setContactSent(true)
    } catch (cause) { setContactError(cause instanceof Error ? cause.message : 'Votre demande n’a pas pu être envoyée.') }
    finally { setContactBusy(false) }
  }

  return <div className={styles.simulator}>
    <div className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.eyebrow}>LE GAZON, SOUS UN NOUVEAU JOUR</span>
        <h1>Et si votre gazon changeait tout ?</h1>
        <p className={styles.heroLead}>Votre photo. Votre jardin.<br />Une pelouse à imaginer.</p>
        <div className={styles.import}>
          <button type="button" className={styles.primary} onClick={() => libraryInput.current?.click()} disabled={busy || working}><ImagePlus size={20} aria-hidden="true" /> {photo || job ? 'Choisir une autre photo' : 'Ajouter ma photo'} <ArrowRight size={18} aria-hidden="true" /></button>
          <button type="button" className={styles.secondary} onClick={() => cameraInput.current?.click()} disabled={busy || working}><Camera size={20} aria-hidden="true" /> Prendre une photo</button>
          <input ref={libraryInput} type="file" accept={PHOTO_ACCEPT} onChange={choosePhoto} aria-label="Choisir une photo du jardin" className={styles.fileInput} tabIndex={-1} />
          <input ref={cameraInput} type="file" accept={PHOTO_ACCEPT} capture="environment" onChange={choosePhoto} aria-label="Photographier le jardin" className={styles.fileInput} tabIndex={-1} />
        </div>
        <p className={styles.photoTips}>En journée, avec le gazon et ses bordures visibles.<br />JPEG, PNG, WebP, HEIC ou HEIF · 10 Mo maximum</p>
        <p className={styles.trust}><LockKeyhole size={19} aria-hidden="true" /><span>Sans compte. Vos photos restent privées.<br />Vous choisissez ensuite de les partager avec Hanami.</span></p>
        {sessionError && <div className={styles.serviceNotice} role="status">La génération est momentanément indisponible. Vous pouvez préparer votre photo sans l’envoyer. <button type="button" className={styles.textButton} onClick={() => window.location.reload()}>Réessayer</button></div>}
        {error && !photo && !job && <div className={styles.error} role="alert">{error}</div>}
      </div>
      <figure className={styles.heroVisual}>
        {/* An illustrative asset, never substituted for a customer's actual result. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/simulator/garden-illustration.webp" alt="Illustration d’un même jardin, avec une pelouse clairsemée à gauche et plus dense à droite" width={1400} height={1100} fetchPriority="high" />

        <figcaption>Exemple illustratif créé par IA — ce n’est pas votre simulation.</figcaption>
      </figure>
    </div>
    <ol className={styles.journey} aria-label="Les étapes de votre simulation">
      <li><ImagePlus size={24} aria-hidden="true" /><div><strong>Votre photo</strong><p>Le point de départ, c’est votre jardin.</p></div></li>
      <li><Sparkles size={24} aria-hidden="true" /><div><strong>Votre simulation</strong><p>Une pelouse plus belle, sur votre photo.</p></div></li>
      <li><Leaf size={24} aria-hidden="true" /><div><strong>Votre projet</strong><p>Les bons conseils pour passer à l’action.</p></div></li>
    </ol>

    {phase === 'preparing' && <p className={styles.status} role="status"><LoaderCircle className={styles.spinner} size={18} aria-hidden="true" /> Préparation de votre photo…</p>}

    {photo && <section className={styles.selection} aria-labelledby="lawn-photo-heading">
      <div className={styles.stepHeading}><span className={styles.number}>02 / VOTRE PHOTO</span><h2 id="lawn-photo-heading" ref={photoHeading} tabIndex={-1}>Le même jardin, avec une belle pelouse.</h2></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} width={photo.width} height={photo.height} alt="Votre photo avant la simulation" style={{width: '100%', height: 'auto', maxHeight: 650, objectFit: 'contain'}} />
      <details className={styles.preferences}>
        <summary>Personnaliser le rendu <span>Facultatif</span></summary>
        <p>Choisissez l’aspect du gazon. La saison, la lumière et le reste du jardin restent ceux de votre photo.</p>
        <fieldset disabled={busy}><legend>Finition du gazon</legend><div className={styles.optionRow}>{([['natural', 'Naturel'], ['manicured', 'Très soigné']] as const).map(([value, label]) => <label key={value}><input type="radio" name="finish" value={value} checked={finish === value} onChange={() => { setFinish(value); setPhoto(current => current ? { ...current, requestId: crypto.randomUUID() } : null) }} />{label}</label>)}</div></fieldset>
        <fieldset disabled={busy}><legend>Hauteur de tonte</legend><div className={styles.optionRow}>{([['source', 'Selon ma photo'], ['short', 'Tonte courte'], ['comfortable', 'Tonte plus haute']] as const).map(([value, label]) => <label key={value}><input type="radio" name="height" value={value} checked={height === value} onChange={() => { setHeight(value); setPhoto(current => current ? { ...current, requestId: crypto.randomUUID() } : null) }} />{label}</label>)}</div></fieldset>
        <p>Indications visuelles uniquement : la hauteur de tonte adaptée se choisit après un diagnostic.</p>
      </details>
      <label className={styles.consent}><input type="checkbox" checked={authorized} onChange={event => setAuthorized(event.target.checked)} disabled={busy} /><span>Je suis autorisé à utiliser cette photo et je demande son traitement par IA pour cette simulation. Mes photos ne seront pas utilisées à des fins marketing.</span></label>
      {error && <div className={styles.error} role="alert">{error}</div>}
      <div className={styles.launch}>
        <button type="button" className={styles.primary} onClick={generate} disabled={!canGenerate || busy}>{busy && <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" />}{phase === 'uploading' ? 'Envoi de votre photo…' : phase === 'starting' ? 'Lancement du traitement…' : 'Visualiser mon gazon'}</button>
        <p>L’IA améliore la pelouse visible en conservant le cadrage et les autres éléments du jardin. La photo n’est envoyée qu’au lancement.</p>
      </div>
      {!loadingHistory && !sessionReady && <p className={styles.error} role="status">Le service n’a pas encore confirmé votre session. <button type="button" className={styles.textButton} onClick={() => window.location.reload()}>Actualiser le suivi</button> Le lancement reste désactivé jusqu’à cette confirmation.</p>}
      <p className={styles.privacy}>Votre photo n’est pas encore envoyée. Après le lancement, votre simulation privée reste accessible 7 jours ; vous pouvez la supprimer ici. <Link href="/confidentialite">En savoir plus sur vos données</Link>.</p>
    </section>}

    {loadingHistory && <p className={styles.help} role="status">Recherche de vos simulations précédentes…</p>}

    {job && !photo && <section className={styles.result} aria-labelledby="simulation-result-heading">
      <div className={styles.stepHeading}><span className={styles.number}>03 / VOTRE PROJECTION</span><h2 id="simulation-result-heading" ref={resultHeading} tabIndex={-1}>{job.status === 'completed' ? 'Le même jardin. Un autre regard.' : job.status === 'failed' ? 'La simulation n’a pas abouti.' : job.status === 'queued' ? job.stage === 'ready' ? 'Votre photo est enregistrée.' : 'L’envoi de votre photo est incomplet.' : 'Votre projection prend forme.'}</h2></div>

      {error && <div className={styles.error} role="alert">{error}</div>}
      {job.status === 'completed' ? <>
        <BeforeAfterSlider beforeSrc={simulationImage(job.id, 'original')} afterSrc={simulationImage(job.id, 'result')} beforeAlt="Votre jardin avant simulation" afterAlt="Projection IA de votre jardin avec une pelouse améliorée" aspectRatio={job.width && job.height ? job.width / job.height : 4 / 3} unoptimized onImageError={() => setImageErrorId(job.id)} className={styles.comparison} />
        <p className={styles.help}>Glissez la séparation, ou utilisez les flèches du clavier sur la poignée, pour comparer.</p>
      </> : job.status === 'running' ? <SimulationProcessing key={job.id} originalSrc={simulationImage(job.id, 'original')} startedAt={job.startedAt} tips={job.tips} phase={job.processingPhase} connectionLost={!!pollError} onImageError={() => setImageErrorId(job.id)} /> : <div className={styles.waitingPhoto}>
        {/* Authenticated photos are served directly; the shared optimizer cannot forward the private session. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {job.stage !== 'upload' && <img src={simulationImage(job.id, 'original')} alt="Votre photo de jardin enregistrée" onError={() => setImageErrorId(job.id)} />}
        <div className={styles.processing} role="status">
          <p>{job.status === 'queued' ? job.stage === 'ready' ? 'Votre photo est sauvegardée. Lancez le traitement lorsque vous êtes prêt.' : 'La photo n’a pas été entièrement enregistrée. Importez à nouveau votre photo pour préparer une nouvelle simulation. Aucun traitement IA n’a été lancé.' : job.error?.message || 'Aucun résultat n’a été enregistré. Contactez Hanami si le problème persiste.'}</p>
        </div>
      </div>}
      {imageErrorId === job.id && <div className={styles.error} role="alert">L’image n’a pas pu être affichée. Elle peut avoir expiré ou la connexion a été interrompue. <button type="button" className={styles.textButton} onClick={() => window.location.reload()}>Actualiser l’affichage</button> Aucun nouveau traitement ne sera lancé.</div>}
      <p className={styles.disclaimer}>{DISCLAIMER}</p>
      {job.options && <p className={styles.help}>Rendu : {job.options.finish === 'manicured' ? 'très soigné' : 'naturel'} · {({source: 'hauteur selon la photo', short: 'tonte courte', comfortable: 'tonte plus haute'})[job.options.height]}</p>}
      <p className={styles.help}>Cette image ne mesure pas la surface et ne remplace pas un diagnostic agronomique.</p>
      {pollError && <p className={styles.error} role="status">{pollError}</p>}
      {job.status === 'queued' && job.stage === 'ready' && <button type="button" className={styles.primary} disabled={busy} onClick={resume}>Lancer cette simulation</button>}
      {(job.status === 'running' || pollError) && <button type="button" className={styles.secondary} disabled={busy} onClick={refresh}>Actualiser le suivi</button>}
      {job.status === 'failed' && <p className={styles.help}>{job.error?.retryable ? 'Vous pouvez sélectionner à nouveau votre photo pour préparer une nouvelle simulation.' : 'Nous évitons de relancer automatiquement un traitement dont l’issue est incertaine. Contactez Hanami en indiquant la référence ci-dessous.'}</p>}
      <div className={styles.jobMeta}>
        <p>Référence : <span>{job.id}</span>{job.expiresAt && <> · Disponible jusqu’au {dateLabel(job.expiresAt)}</>}</p>
        {job.status !== 'running' && (!confirmDelete ? <button type="button" className={styles.textButton} onClick={() => setConfirmDelete(true)} disabled={busy}><Trash2 size={15} aria-hidden="true" /> Supprimer cette simulation</button> : <div className={styles.actions}><span>Supprimer la photo et le résultat ?</span><button type="button" className={styles.secondary} onClick={deleteSimulation} disabled={busy}>{phase === 'deleting' ? 'Suppression…' : 'Oui, supprimer'}</button><button type="button" className={styles.textButton} onClick={() => setConfirmDelete(false)} disabled={busy}>Conserver</button></div>)}
      </div>

      {job.status === 'completed' && <div className={styles.contact}>
        <div><span className={styles.number}>ET DANS VOTRE JARDIN ?</span><h2>Passons de l’image au bon programme.</h2><p>Un diagnostic permet de choisir les travaux et les gestes adaptés à votre terrain. Laissez un message à Hanami, sans engagement.</p></div>
        {contactSent ? <p className={styles.sent} role="status"><Check size={20} aria-hidden="true" /> Votre demande et la référence de votre simulation ont été envoyées à Hanami.</p> : <form onSubmit={sendContact} className={styles.contactForm}>
          <label>Prénom et nom<input name="name" autoComplete="name" required maxLength={100} /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label className={styles.full}>Votre projet <span>(facultatif)</span><textarea name="message" rows={3} maxLength={2000} placeholder="Votre commune, votre pelouse, vos attentes…" /></label>
          <label className={`${styles.consent} ${styles.full}`}><input type="checkbox" name="attachSimulation" required /><span>Je demande à Hanami de me recontacter et de consulter cette simulation, avec ma photo, pour étudier mon projet.</span></label>
          {contactError && <p className={`${styles.error} ${styles.full}`} role="alert">{contactError}</p>}
          <button type="submit" className={styles.primary} disabled={contactBusy}>{contactBusy ? 'Envoi en cours…' : 'Demander un diagnostic ou un devis'}</button>
          <p className={`${styles.privacy} ${styles.full}`}>Cette demande transmet vos coordonnées et la référence de la simulation à Hanami. Elle ne crée pas automatiquement de compte ou de fiche prospect. <Link href="/confidentialite">Vos données</Link>.</p>
        </form>}
      </div>}
    </section>}

    {jobs.length > 0 && <section className={styles.history} aria-labelledby="simulation-history-heading"><h2 id="simulation-history-heading">Vos simulations sur ce navigateur</h2><div className={styles.historyList}>{jobs.map(item => <button type="button" key={item.id} className={styles.historyItem} aria-pressed={job?.id === item.id && !photo} disabled={busy || working} onClick={() => { setJob(item); setPhoto(null); setError(''); setPollError(''); setContactSent(false); setContactError(''); setConfirmDelete(false) }}><span>{dateLabel(item.createdAt)}</span><strong>{item.status === 'queued' && item.stage !== 'ready' ? 'Envoi incomplet' : ({ queued: 'En attente', running: 'En cours', completed: 'Terminée', failed: 'Échouée' })[item.status]}</strong><span className={styles.help}>Ouvrir</span></button>)}</div></section>}
  </div>
}
