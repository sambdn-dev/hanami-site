'use client'

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Check, CircleHelp, Clock3, LoaderCircle, PackageCheck } from 'lucide-react'
import { RENTAL_PRODUCTS, quoteRental, type RentalDuration, type RentalFulfillment, type RentalQuote } from '@/lib/rentals'
import styles from './RentalBooking.module.css'

type RentalBookingProps = {
  itemIds?: string[]
  productId?: string
  pack?: boolean
}

type AvailabilityResult = {
  key: string
  quote?: RentalQuote
  failed?: boolean
}

type ReceivedRequest = {
  reference: string
  quote: RentalQuote
}

class BookingRequestError extends Error {}

const durations: { id: RentalDuration; label: string; hint: string }[] = [
  { id: '24h', label: '24 h', hint: 'Une journée' },
  { id: '48h', label: '48 h', hint: 'Deux journées' },
  { id: 'weekend', label: 'Week-end', hint: 'Prenez votre temps' },
]

const spreaders = [
  { id: 'epandeur-ryobi-batterie', label: 'Ryobi à main sur batterie', detail: 'Épandage assisté par batterie. Deux batteries supplémentaires et un chargeur inclus.' },
  { id: 'epandeur-gardena-l', label: 'Gardena L — en ligne', detail: 'À pousser : les graines ou granulés sont déposés en ligne sous l’appareil.' },
  { id: 'epandeur-rotatif-gardena', label: 'Gardena XL — rotatif', detail: 'À pousser : les graines ou granulés sont répartis latéralement par rotation.' },
]

const packExtras = [
  { id: 'landzie-compost-spreader', label: 'Landzie Compost Spreader', detail: 'Pour répartir un amendement ou un terreau adapté.' },
  { id: 'scarificateur-ryobi', label: 'Scarificateur Ryobi', detail: 'Pour préparer le gazon, si son état le nécessite.' },
]

function priceLabel(cents: number | null | undefined) {
  return cents == null ? 'Tarif à confirmer' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function isQuote(value: unknown): value is RentalQuote {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<RentalQuote>
  return typeof candidate.valid === 'boolean'
    && Array.isArray(candidate.items)
    && Array.isArray(candidate.errors)
    && ['available', 'unavailable', 'unknown'].includes(candidate.availability ?? '')
}

export default function RentalBooking({ itemIds, productId, pack = false }: RentalBookingProps) {
  const id = useId()
  const [duration, setDuration] = useState<RentalDuration>('24h')
  const [startLocal, setStartLocal] = useState('')
  const [fulfillment, setFulfillment] = useState<RentalFulfillment>('to-confirm')
  const [spreader, setSpreader] = useState(spreaders[0].id)
  const [extras, setExtras] = useState<string[]>([])
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null)
  const [sending, setSending] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [received, setReceived] = useState<ReceivedRequest | null>(null)
  const receivedHeading = useRef<HTMLHeadingElement>(null)

  const chosenIds = useMemo(() => pack
    ? ['landzie-overseeding-tool', spreader, ...extras]
    : itemIds?.length ? itemIds : productId ? [productId] : [], [pack, spreader, extras, itemIds, productId])
  const input = useMemo(() => ({ itemIds: chosenIds, duration, startLocal, fulfillment }), [chosenIds, duration, startLocal, fulfillment])
  const localQuote = useMemo(() => quoteRental(input), [input])
  const selectionKey = JSON.stringify(input)
  const currentResult = availabilityResult?.key === selectionKey ? availabilityResult : null
  const checking = Boolean(startLocal && localQuote.valid && !currentResult)
  const quote = currentResult?.quote ?? localQuote
  const unavailable = quote.availability === 'unavailable'
  const canSubmit = Boolean(startLocal && quote.valid && !unavailable && !checking && !sending)
  const selectedProducts = chosenIds.flatMap(itemId => {
    const product = RENTAL_PRODUCTS.find(product => product.id === itemId)
    return product ? [product] : []
  })

  useEffect(() => {
    if (!startLocal || !localQuote.valid) return
    const controller = new AbortController()
    let active = true
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({
        startLocal: input.startLocal,
        duration: input.duration,
        items: input.itemIds.join(','),
        fulfillment: input.fulfillment,
      })
      try {
        const response = await fetch(`/api/location/disponibilites?${params}`, { signal: controller.signal, cache: 'no-store' })
        const result: unknown = await response.json()
        if (!isQuote(result) || (!response.ok && response.status !== 400)) throw new Error('Vérification indisponible')
        if (active) setAvailabilityResult({ key: selectionKey, quote: result })
      } catch {
        if (active && !controller.signal.aborted) setAvailabilityResult({ key: selectionKey, failed: true })
      }
    }, 250)
    return () => {
      active = false
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [input, localQuote.valid, selectionKey, startLocal])

  useEffect(() => {
    if (received) receivedHeading.current?.focus()
  }, [received])

  function toggleExtra(itemId: string) {
    setExtras(previous => previous.includes(itemId) ? previous.filter(id => id !== itemId) : [...previous, itemId])
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    const fields = new FormData(event.currentTarget)
    setSending(true)
    setSubmissionError(null)
    try {
      const response = await fetch('/api/location/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          fullName: String(fields.get('fullName') ?? '').trim(),
          email: String(fields.get('email') ?? '').trim(),
          phone: String(fields.get('phone') ?? '').trim(),
          notes: String(fields.get('notes') ?? '').trim(),
          consent: fields.get('consent') === 'on',
        }),
      })
      const result: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const errorResult = result && typeof result === 'object' ? result as { error?: unknown; message?: unknown; quote?: unknown } : null
        if (isQuote(errorResult?.quote)) setAvailabilityResult({ key: selectionKey, quote: errorResult.quote })
        const message = typeof errorResult?.error === 'string' ? errorResult.error : errorResult?.message
        throw new BookingRequestError(typeof message === 'string' ? message : 'Votre demande n’a pas pu être transmise. Merci de réessayer.')
      }
      const success = result && typeof result === 'object' ? result as { status?: unknown; reference?: unknown; quote?: unknown } : null
      if (success?.status !== 'request_received' || typeof success.reference !== 'string' || !isQuote(success.quote)) {
        throw new BookingRequestError('La réception de votre demande n’a pas pu être vérifiée. Contactez Hanami avant de renouveler votre demande.')
      }
      setReceived({ reference: success.reference, quote: success.quote })
    } catch (error) {
      setSubmissionError(error instanceof BookingRequestError ? error.message : 'La réception de votre demande n’a pas pu être vérifiée. Vos informations sont conservées ; contactez Hanami avant de renouveler votre demande.')
    } finally {
      setSending(false)
    }
  }

  if (received) return <section className={styles.received} aria-labelledby={`${id}-received`}>
    <span className={styles.receivedIcon}><Check size={26} aria-hidden="true" /></span>
    <p className={styles.eyebrow}>LA SUITE, EN DIRECT AVEC HANAMI</p>
    <h2 id={`${id}-received`} ref={receivedHeading} tabIndex={-1}>Demande de réservation reçue.</h2>
    <p>Je vérifie les disponibilités et reviens vers vous avec le tarif et les modalités de remise du matériel.</p>
    <div className={styles.receivedReference}><span>Votre référence</span><strong>{received.reference}</strong></div>
    <dl className={styles.receivedDates}><div><dt>Départ souhaité</dt><dd>{received.quote.startLabel}</dd></div><div><dt>Retour prévu</dt><dd>{received.quote.endLabel || 'À convenir avec Hanami'}</dd></div></dl>
    <p className={styles.finePrint}>Cette demande ne confirme pas encore la réservation et ne bloque pas le matériel. Aucun paiement n’a été effectué.</p>
    <Link href="/boutique/location" className={styles.returnLink}>Découvrir les autres outils <ArrowUpRight size={16} aria-hidden="true" /></Link>
  </section>

  return <section className={styles.booking} aria-labelledby={`${id}-title`}>
    <div className={styles.heading}><p className={styles.eyebrow}>VOTRE LOCATION HANAMI</p><h2 id={`${id}-title`}>Choisissez votre créneau.</h2><p>Le bon matériel, le temps qu’il vous faut.</p></div>
    <form onSubmit={submit} className={styles.form}>
      <fieldset disabled={sending} className={styles.formFieldset}>
        {pack && <fieldset className={styles.packFieldset}><legend className={styles.stepLabel}><span>01</span>Composez votre pack</legend>
          <div className={styles.includedTool}><Check size={17} aria-hidden="true" /><div><strong>Landzie Overseeding Tool</strong><p>La base du pack regarnissage, incluse dans votre sélection.</p></div><span>Inclus</span></div>
          <fieldset className={styles.spreaderFieldset}><legend>Votre épandeur</legend><div className={styles.spreaderOptions}>{spreaders.map(option => <label key={option.id} className={`${styles.spreaderOption} ${spreader === option.id ? styles.optionSelected : ''}`}><input type="radio" name="packSpreader" value={option.id} checked={spreader === option.id} onChange={() => setSpreader(option.id)} /><span><strong>{option.label}</strong><small>{option.detail}</small></span></label>)}</div></fieldset>
          <fieldset className={styles.extrasFieldset}><legend>À ajouter selon votre jardin</legend>{packExtras.map(option => <label key={option.id} className={styles.extraOption}><input type="checkbox" checked={extras.includes(option.id)} onChange={() => toggleExtra(option.id)} /><span><strong>{option.label}</strong><small>{option.detail}</small></span><span className={styles.optionalLabel}>Option</span></label>)}</fieldset>
          <p className={styles.fieldHint}>Les mêmes dates s’appliquent à tous les outils. Les semences et produits ne sont pas compris.</p>
        </fieldset>}

        <fieldset className={styles.durationFieldset}><legend className={styles.stepLabel}><span>{pack ? '02' : '01'}</span>Choisissez votre durée</legend><div className={styles.durationOptions}>{durations.map(option => <button type="button" key={option.id} className={`${styles.durationOption} ${duration === option.id ? styles.durationSelected : ''}`} aria-pressed={duration === option.id} onClick={() => setDuration(option.id)}><strong>{option.label}</strong><small>{option.hint}</small></button>)}</div></fieldset>

        <div className={styles.dateSection}><label className={styles.stepLabel} htmlFor={`${id}-start`}><span>{pack ? '03' : '02'}</span>Prévoyez vos dates</label><label className={styles.fieldLabel} htmlFor={`${id}-start`}>Départ souhaité <span aria-hidden="true">*</span></label><div className={styles.dateInput}><CalendarDays size={18} aria-hidden="true" /><input id={`${id}-start`} name="startLocal" type="datetime-local" value={startLocal} onChange={event => setStartLocal(event.target.value)} required aria-describedby={`${id}-date-help${startLocal && !quote.valid ? ` ${id}-date-errors` : ''}`} aria-invalid={Boolean(startLocal && !quote.valid)} /></div><p className={styles.fieldHint} id={`${id}-date-help`}>Date et heure locales de Paris (Europe/Paris). Le créneau de remise sera confirmé avec vous.</p>
          <div className={styles.returnDate}><Clock3 size={17} aria-hidden="true" /><div><span>Retour {duration === 'weekend' && !quote.weekendConfigured ? 'à convenir' : 'prévu'}</span><strong>{quote.endLabel || (duration === 'weekend' ? 'Horaires à confirmer avec Hanami' : 'Choisissez votre date de départ')}</strong></div></div>
          {duration === 'weekend' && !quote.weekendConfigured && <p className={styles.weekendNote}>Les horaires de la formule week-end seront précisés avant la confirmation de votre location.</p>}
          {startLocal && !quote.valid && <div className={styles.validationError} role="alert" id={`${id}-date-errors`}>{quote.errors.map((error, index) => <p key={`${index}-${error}`}>{error}</p>)}</div>}
        </div>

        <div className={`${styles.availability} ${unavailable ? styles.availabilityUnavailable : quote.availability === 'available' && currentResult?.quote ? styles.availabilityAvailable : ''}`} role="status" aria-live="polite">
          {checking ? <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" /> : unavailable ? <CalendarDays size={18} aria-hidden="true" /> : quote.availability === 'available' && currentResult?.quote ? <PackageCheck size={18} aria-hidden="true" /> : <CircleHelp size={18} aria-hidden="true" />}
          <div><strong>{!startLocal ? 'Choisissez une date pour vérifier le matériel' : checking ? 'Vérification des disponibilités…' : !quote.valid ? 'Vérifiez les dates choisies' : unavailable ? 'Un outil est indisponible sur ce créneau' : quote.availability === 'available' && currentResult?.quote ? 'Matériel disponible sur ce créneau' : 'Disponibilité à confirmer avec Hanami'}</strong><p>{currentResult?.failed ? 'La vérification est momentanément indisponible. Vous pouvez transmettre votre demande pour une confirmation personnelle.' : unavailable ? 'Modifiez les dates ou la composition de votre pack avant de transmettre votre demande.' : quote.availability === 'available' && currentResult?.quote ? 'La disponibilité sera vérifiée à nouveau lors de votre demande. Le matériel n’est pas encore réservé.' : 'Votre demande sera étudiée avant toute réservation ferme.'}</p></div>
        </div>

        <div className={styles.fulfillmentSection}><label className={styles.fieldLabel} htmlFor={`${id}-fulfillment`}>Comment récupérer le matériel ?</label><select id={`${id}-fulfillment`} name="fulfillment" value={fulfillment} onChange={event => setFulfillment(event.target.value as RentalFulfillment)} aria-describedby={`${id}-fulfillment-help`}><option value="to-confirm">À convenir avec Hanami</option><option value="pickup">Retrait du matériel</option><option value="delivery">Livraison du matériel</option></select><p id={`${id}-fulfillment-help`} className={styles.fieldHint}>Lieu, horaires, zone de livraison, retour et éventuels frais à confirmer avant votre accord.</p></div>

        <section className={styles.summary} aria-labelledby={`${id}-summary`}><div className={styles.summaryTitle}><h3 id={`${id}-summary`}>Votre sélection</h3><span>{durations.find(option => option.id === duration)?.label}</span></div><ul className={styles.summaryItems}>{selectedProducts.map(product => {
          const itemQuote = quote.items.find(item => item.id === product.id)
          return <li key={product.id}><div><strong>{product.name}</strong>{itemQuote?.availability === 'unavailable' && <small className={styles.itemUnavailable}>Indisponible aux dates choisies</small>}</div><span>{priceLabel(itemQuote?.priceTtcCents)}</span></li>
        })}</ul>{fulfillment !== 'to-confirm' && <div className={styles.summaryFee}><span>{fulfillment === 'pickup' ? 'Retrait et retour' : 'Livraison et retour'}</span><strong>{priceLabel(quote.fulfillmentFeeTtcCents)}</strong></div>}<div className={styles.summaryTotal}><span>Total TTC</span><strong>{priceLabel(quote.totalTtcCents)}</strong></div><p className={styles.finePrint}>Les tarifs manquants et les modalités sont confirmés avant tout engagement. Aucun montant n’est prélevé à cette étape.</p></section>

        <section className={styles.contactSection} aria-labelledby={`${id}-contact`}><p className={styles.stepLabel}><span>{pack ? '04' : '03'}</span>Recevez ma réponse</p><h3 id={`${id}-contact`}>Parlons de votre projet.</h3><p className={styles.contactIntro}>Je vous réponds personnellement pour organiser la location.</p><div className={styles.contactGrid}>
          <label className={styles.fieldLabel} htmlFor={`${id}-name`}>Nom et prénom <span>*</span><input id={`${id}-name`} name="fullName" autoComplete="name" maxLength={80} required placeholder="Votre nom" /></label>
          <label className={styles.fieldLabel} htmlFor={`${id}-email`}>Email <span>*</span><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={150} required placeholder="vous@exemple.fr" /></label>
          <label className={styles.fieldLabel} htmlFor={`${id}-phone`}>Téléphone <small>facultatif</small><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Pour préparer la remise" /></label>
          <label className={styles.fieldLabel} htmlFor={`${id}-notes`}>Votre jardin, votre besoin <small>facultatif</small><textarea id={`${id}-notes`} name="notes" rows={3} maxLength={600} placeholder="Surface, état du gazon, besoin de conseil…" /><small className={styles.notesLimit}>600 caractères maximum</small></label>
        </div><label className={styles.consent}><input name="consent" type="checkbox" required /><span>J’accepte que Hanami utilise mes coordonnées pour répondre à cette demande. <Link href="/mentions-legales">Confidentialité</Link></span></label></section>

        <button className={styles.submitButton} type="submit" disabled={!canSubmit}>{sending ? <><LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />Envoi de votre demande…</> : <>Demander ma réservation <ArrowUpRight size={18} aria-hidden="true" /></>}</button><p className={styles.submitNote}>Sans paiement · confirmation personnelle avant réservation</p>
      </fieldset>
      {submissionError && <div className={styles.submissionError} role="alert"><strong>La demande n’a pas pu être confirmée.</strong><p>{submissionError}</p><p>Vos choix et coordonnées sont conservés. Vous pouvez réessayer ou <Link href="/interventions-locales#contact">contacter Hanami directement</Link>.</p></div>}
    </form>
  </section>
}
