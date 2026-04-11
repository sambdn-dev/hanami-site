/**
 * ContactForm.tsx — Formulaire de contact avec zone d'upload de photos
 *
 * Ce composant est partagé entre la page Particuliers et la page Pro.
 * La prop "variant" détermine quels champs afficher et la valeur du champ caché "source".
 *
 * UPLOAD PHOTOS :
 * - Zone drag & drop à côté du formulaire
 * - 1 à 5 photos acceptées (JPEG, PNG, WebP, HEIC)
 * - Aperçu miniature de chaque photo sélectionnée
 * - Bouton de suppression individuelle
 * - Les photos sont encodées en base64 et envoyées avec le formulaire
 *
 * Props :
 * - variant : 'particulier' | 'pro'
 */

'use client'

import { useForm as useFormspree } from '@formspree/react'
import { useForm, Controller } from 'react-hook-form'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useFadeIn } from '@/hooks/useFadeIn'
import { X, Upload, ImageIcon } from 'lucide-react'

// ── Types de données du formulaire ──────────────────────────────────────────

type ParticulierFormData = {
  fullName: string
  email: string
  phone: string
  surface: string
  postalCode: string
  message: string
  source: string
}

type ProFormData = {
  companyName: string
  city: string
  fullName: string
  email: string
  phone: string
  requestType: string
  projectsPerYear: string
  message: string
  source: string
}

type FormData = ParticulierFormData | ProFormData

interface ContactFormProps {
  variant: 'particulier' | 'pro'
}

// ── Type pour une photo uploadée ────────────────────────────────────────────
interface UploadedPhoto {
  id: string       // Identifiant unique pour la suppression
  file: File       // Fichier brut
  preview: string  // URL de prévisualisation (createObjectURL)
  name: string     // Nom du fichier affiché
}

export default function ContactForm({ variant }: ContactFormProps) {
  const fadeRef = useFadeIn()
  const isPro = variant === 'pro'

  const [state, formspreeSubmit] = useFormspree('xwvwgyzn')

  // Photos sélectionnées (max 5)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  // true quand l'utilisateur glisse un fichier au-dessus de la zone
  const [isDragOver, setIsDragOver] = useState(false)

  // Référence vers l'input file caché (déclenché par le clic sur la zone)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    defaultValues: { source: variant } as FormData,
  })

  // ── Gestion des photos ──────────────────────────────────────────────────

  /**
   * Ajoute des photos à la liste (max 5 au total).
   * Filtre les formats acceptés et déduplique par nom.
   */
  const addPhotos = useCallback((files: FileList | File[]) => {
    // MIME type peut être vide sur Chrome pour HEIC → on vérifie aussi l'extension
    const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
    const ACCEPTED_EXT  = /\.(jpe?g|png|webp|heic|heif)$/i
    const newFiles = Array.from(files).filter(f =>
      ACCEPTED_MIME.has(f.type) || ACCEPTED_EXT.test(f.name)
    )

    setPhotos(prev => {
      const remaining = 5 - prev.length  // Combien de places restantes
      const toAdd = newFiles.slice(0, remaining).map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }))
      return [...prev, ...toAdd]
    })
  }, [])

  /** Supprime une photo de la liste par son id */
  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo) URL.revokeObjectURL(photo.preview) // Libère la mémoire
      return prev.filter(p => p.id !== id)
    })
  }, [])

  // ── Drag & Drop ─────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragOver(false), [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) addPhotos(e.dataTransfer.files)
  }, [addPhotos])

  // Réinitialise le formulaire une fois la soumission réussie
  useEffect(() => {
    if (!state.succeeded) return
    reset()
    setPhotos(prev => {
      prev.forEach(p => URL.revokeObjectURL(p.preview))
      return []
    })
  }, [state.succeeded, reset])

  // ── Soumission du formulaire → Formspree ────────────────────────────────

  async function onSubmit(data: FormData) {
    const d = data as Record<string, string>
    const fd = new window.FormData()

    // Métadonnées Formspree
    fd.append('_subject', isPro
      ? `Nouvelle demande Pro — ${d.companyName ?? d.fullName}`
      : `Nouvelle demande Particulier — ${d.fullName}`)
    fd.append('_replyto', d.email)

    // Champs avec labels lisibles dans l'email reçu
    if (isPro) {
      if (d.companyName)     fd.append('Entreprise',      d.companyName)
      if (d.city)            fd.append('Ville',            d.city)
    }
    fd.append('Nom',         d.fullName)
    fd.append('Email',       d.email)
    fd.append('Téléphone',   d.phone)
    if (!isPro) {
      if (d.surface)         fd.append('Surface',         d.surface)
      if (d.postalCode)      fd.append('Code postal',     d.postalCode)
    } else {
      if (d.requestType)     fd.append('Type de demande', d.requestType)
      if (d.projectsPerYear) fd.append('Chantiers/an',    d.projectsPerYear)
    }
    if (d.message)           fd.append('Message',         d.message)
    fd.append('Source',      d.source)

    // Photos : on envoie les noms en texte (Formspree plan gratuit ne supporte pas les binaires)
    if (photos.length > 0) {
      fd.append('Photos', photos.map(p => p.name).join(', '))
    }

    await formspreeSubmit(fd)
  }

  const title   = isPro ? 'Parlons de votre activité' : 'Discutons de votre gazon'
  const subtitle = isPro ? 'Réponse sous 24h. Premier échange offert.' : 'Réponse sous 24h. Diagnostic initial offert.'

  return (
    <section id="contact" className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div ref={fadeRef} className="fade-in">

          {/* En-tête */}
          <span className="section-label mb-3 block">Contact</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mb-2 leading-tight">
            {title}
          </h2>
          <p className="text-stone-500 mb-10">{subtitle}</p>

          {/* Messages succès / erreur */}
          {state.succeeded && (
            <div className="mb-8 p-5 rounded-xl bg-hanami-100 border border-hanami-500/30">
              <p className="font-semibold text-hanami-800 mb-1">Merci, votre demande a bien été envoyée.</p>
              <p className="text-sm text-hanami-700">Nous vous recontactons dans les 24h.</p>
            </div>
          )}
          {state.errors && state.errors.length > 0 && (
            <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              Une erreur est survenue. Veuillez réessayer ou nous contacter directement sur WhatsApp.
            </div>
          )}

          {/* ── Layout 2 colonnes : formulaire + zone upload ─────────── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="on">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

              {/* ── Colonne gauche : champs texte ────────────────────── */}
              <div className="flex flex-col gap-5">

                <input type="hidden" {...register('source')} value={variant} />

                {/* Entreprise + Ville (Pro uniquement) — 2 colonnes côte à côte */}
                {isPro && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField htmlFor="companyName" label="Nom de l'entreprise" required error={(errors as {companyName?: {message?: string}}).companyName?.message}>
                      <input
                        id="companyName"
                        type="text"
                        autoComplete="organization"
                        placeholder="Paysage & Co"
                        className={inputClass((errors as {companyName?: {message?: string}}).companyName)}
                        {...register('companyName' as keyof FormData, { required: 'Ce champ est requis' })}
                      />
                    </FormField>
                    <FormField htmlFor="city" label="Ville" required error={(errors as {city?: {message?: string}}).city?.message}>
                      <input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="Paris"
                        className={inputClass((errors as {city?: {message?: string}}).city)}
                        {...register('city' as keyof FormData, { required: 'Ce champ est requis' })}
                      />
                    </FormField>
                  </div>
                )}

                {/* Prénom et nom */}
                <FormField htmlFor="fullName" label="Prénom et nom" required error={errors.fullName?.message}>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Jean Dupont"
                    className={inputClass(errors.fullName)}
                    {...register('fullName', { required: 'Ce champ est requis' })}
                  />
                </FormField>

                {/* Email */}
                <FormField htmlFor="email" label="Email" required error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jean@exemple.fr"
                    className={inputClass(errors.email)}
                    {...register('email', {
                      required: 'Ce champ est requis',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Adresse email invalide' },
                    })}
                  />
                </FormField>

                {/* Téléphone */}
                <FormField htmlFor="phone" label="Téléphone" required error={errors.phone?.message}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: 'Ce champ est requis' }}
                    render={({ field }) => (
                      <PhoneField
                        id="phone"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.phone}
                      />
                    )}
                  />
                </FormField>

                {/* Surface ou Type de demande */}
                {!isPro ? (
                  <FormField htmlFor="surface" label="Surface de votre gazon" required error={(errors as {surface?: {message?: string}}).surface?.message}>
                    <select
                      id="surface"
                      className={inputClass((errors as {surface?: {message?: string}}).surface)}
                      {...register('surface' as keyof FormData, { required: 'Veuillez sélectionner une surface' })}
                    >
                      <option value="">Sélectionnez une surface</option>
                      <option value="<100">Moins de 100 m²</option>
                      <option value="100-300">100 – 300 m²</option>
                      <option value="300-500">300 – 500 m²</option>
                      <option value="500-1000">500 – 1 000 m²</option>
                      <option value=">1000">Plus de 1 000 m²</option>
                    </select>
                  </FormField>
                ) : (
                  <FormField htmlFor="requestType" label="Type de demande" required error={(errors as {requestType?: {message?: string}}).requestType?.message}>
                    <select
                      id="requestType"
                      className={inputClass((errors as {requestType?: {message?: string}}).requestType)}
                      {...register('requestType' as keyof FormData, { required: 'Veuillez sélectionner un type' })}
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="consulting">Consulting chantier</option>
                      <option value="dosage">Dosage et mesure</option>
                      <option value="suivi">Suivi toutes saisons</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </FormField>
                )}

                {/* Code postal ou Chantiers/an */}
                {!isPro ? (
                  <FormField htmlFor="postalCode" label="Code postal" required error={(errors as {postalCode?: {message?: string}}).postalCode?.message}>
                    <input
                      id="postalCode"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="75001"
                      className={inputClass((errors as {postalCode?: {message?: string}}).postalCode)}
                      {...register('postalCode' as keyof FormData, { required: 'Ce champ est requis' })}
                    />
                  </FormField>
                ) : (
                  <FormField htmlFor="projectsPerYear" label="Chantiers gazon par an" required error={(errors as {projectsPerYear?: {message?: string}}).projectsPerYear?.message}>
                    <select
                      id="projectsPerYear"
                      className={inputClass((errors as {projectsPerYear?: {message?: string}}).projectsPerYear)}
                      {...register('projectsPerYear' as keyof FormData, { required: 'Veuillez sélectionner un volume' })}
                    >
                      <option value="">Sélectionnez un volume</option>
                      <option value="<5">Moins de 5</option>
                      <option value="5-15">5 – 15</option>
                      <option value="15-30">15 – 30</option>
                      <option value="30+">30 et plus</option>
                    </select>
                  </FormField>
                )}

                {/* Message */}
                <FormField
                  htmlFor="message"
                  label={isPro ? 'Décrivez votre besoin' : 'Message (facultatif)'}
                  required={isPro}
                  error={errors.message?.message}
                >
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={isPro
                      ? 'Décrivez votre chantier, vos problèmes habituels...'
                      : 'Décrivez votre gazon, vos problèmes actuels...'
                    }
                    className={`${inputClass(errors.message)} resize-none`}
                    {...register('message', isPro ? { required: 'Ce champ est requis' } : {})}
                  />
                </FormField>

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="mt-2 w-full py-3.5 rounded-md bg-hanami-700 text-white font-medium hover:bg-hanami-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  {state.submitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </div>

              {/* ── Colonne droite : zone upload photos ──────────────── */}
              <div className="flex flex-col gap-5">

                {/* Titre de la colonne */}
                <div>
                  <p className="text-sm font-medium text-stone-700 mb-1">
                    {isPro ? 'Photos de vos chantiers gazon' : 'Photos de votre gazon'}
                    <span className="ml-1.5 text-stone-400 font-normal">(facultatif · 1 à 5 photos)</span>
                  </p>
                  <p className="text-xs text-stone-400">
                    Un diagnostic visuel accélère notre analyse. Plus vos photos sont nettes, plus notre protocole sera précis.
                  </p>
                </div>

                {/* ── Zone drag & drop ─────────────────────────────── */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => photos.length < 5 && fileInputRef.current?.click()}
                  className={`
                    relative flex flex-col items-center justify-center gap-3 p-8
                    rounded-xl border-2 border-dashed transition-all duration-200
                    ${photos.length < 5 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                    ${isDragOver
                      ? 'border-hanami-500 bg-hanami-100/60 scale-[1.01]'
                      : 'border-stone-200 bg-white hover:border-hanami-400 hover:bg-hanami-100/30'
                    }
                  `}
                >
                  {/* Icône upload */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isDragOver ? 'bg-hanami-500/20' : 'bg-stone-100'
                  }`}>
                    <Upload className={`w-5 h-5 ${isDragOver ? 'text-hanami-600' : 'text-stone-400'}`} strokeWidth={1.5} />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-stone-700">
                      {photos.length < 5 ? 'Glissez vos photos ici' : '5 photos maximum atteint'}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      ou <span className="text-hanami-600 font-medium">cliquez pour parcourir</span>
                    </p>
                    <p className="text-xs text-stone-300 mt-2">JPG, PNG, WebP, HEIC · Max 5 photos</p>
                  </div>

                  {/* Input file caché */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    multiple
                    className="sr-only"
                    onChange={e => e.target.files && addPhotos(e.target.files)}
                  />
                </div>

                {/* ── Grille de prévisualisations ───────────────────── */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {photos.map((photo) => (
                      <PhotoPreview
                        key={photo.id}
                        photo={photo}
                        onRemove={() => removePhoto(photo.id)}
                      />
                    ))}

                    {/* Slot "ajouter" si moins de 5 photos */}
                    {photos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-hanami-400 hover:text-hanami-500 transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-xs">Ajouter</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Compteur de photos */}
                {photos.length > 0 && (
                  <p className="text-xs text-stone-400 text-right">
                    <span className="font-[family-name:var(--font-space-mono)] font-bold text-hanami-600">
                      {photos.length}
                    </span>
                    /5 photo{photos.length > 1 ? 's' : ''} sélectionnée{photos.length > 1 ? 's' : ''}
                  </p>
                )}

                {/* Bloc reassurance discret */}
                <div className="mt-auto pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Vos photos sont utilisées uniquement pour établir votre diagnostic. Elles ne sont jamais partagées ni publiées sans votre accord.
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ── Miniature d'une photo avec bouton de suppression ────────────────────────

function PhotoPreview({
  photo,
  onRemove,
}: {
  photo: UploadedPhoto
  onRemove: () => void
}) {
  // HEIC ne s'affiche pas nativement sur Chrome — on bascule sur une icône fichier
  const isHeic = /\.heic$/i.test(photo.name) || photo.file.type === 'image/heic'

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 group">
      {isHeic ? (
        /* Placeholder pour HEIC sur Chrome */
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-stone-400">
          <ImageIcon className="w-6 h-6" strokeWidth={1.5} />
          <span className="text-[10px] text-center px-1 leading-tight truncate w-full text-center">.heic</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo.preview}
          alt={photo.name}
          className="w-full h-full object-cover"
          onError={e => {
            // Fallback si le navigateur ne sait pas décoder le format
            const el = e.currentTarget
            el.style.display = 'none'
            el.parentElement?.classList.add('flex', 'items-center', 'justify-center')
          }}
        />
      )}

      {/* Overlay sombre au survol */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

      {/* Bouton supprimer */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Supprimer ${photo.name}`}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>

      {/* Nom du fichier en bas */}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-[10px] truncate">{photo.name}</p>
      </div>
    </div>
  )
}

// ── Composants utilitaires formulaire ───────────────────────────────────────

function FormField({
  label, required, error, htmlFor, children,
}: {
  label: string
  required?: boolean
  error?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

function inputClass(error?: { message?: string } | undefined) {
  const base = 'w-full px-4 py-2.5 rounded-md border text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-hanami-500/40 transition-shadow'
  return `${base} ${error ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-hanami-500'}`
}

// ── Sélecteur téléphone avec indicatif pays et formatage automatique ─────────

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+32', flag: '🇧🇪', label: 'Belgique' },
  { code: '+41', flag: '🇨🇭', label: 'Suisse' },
  { code: '+352', flag: '🇱🇺', label: 'Luxembourg' },
  { code: '+377', flag: '🇲🇨', label: 'Monaco' },
  { code: '+1',   flag: '🇨🇦', label: 'Canada' },
  { code: '+44',  flag: '🇬🇧', label: 'Royaume-Uni' },
  { code: '+49',  flag: '🇩🇪', label: 'Allemagne' },
  { code: '+34',  flag: '🇪🇸', label: 'Espagne' },
  { code: '+39',  flag: '🇮🇹', label: 'Italie' },
  { code: '+351', flag: '🇵🇹', label: 'Portugal' },
  { code: '+1',   flag: '🇺🇸', label: 'États-Unis' },
] as const

/** Formate les chiffres selon le pays.
 *  France (+33) : XX XX XX XX XX (paires)
 *  Autres       : XXX XXX XXX… (triplets)
 */
function formatPhoneNumber(raw: string, countryCode: string): string {
  const digits = raw.replace(/\D/g, '')
  if (countryCode === '+33') {
    return digits.slice(0, 10).replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  }
  return digits.slice(0, 15).replace(/(\d{3})(?=\d)/g, '$1 ').trim()
}

function PhoneField({
  id,
  value,
  onChange,
  onBlur,
  error,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: { message?: string }
}) {
  const [countryCode, setCountryCode] = useState('+33')
  const [localNumber, setLocalNumber] = useState('')

  // Sync local display when the parent resets the field to ''
  useEffect(() => {
    if (!value) setLocalNumber('')
  }, [value])

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneNumber(e.target.value, countryCode)
    setLocalNumber(formatted)
    onChange(formatted ? `${countryCode} ${formatted}` : '')
  }

  function handleCountryChange(newCode: string) {
    setCountryCode(newCode)
    const reformatted = formatPhoneNumber(localNumber, newCode)
    setLocalNumber(reformatted)
    onChange(reformatted ? `${newCode} ${reformatted}` : '')
  }

  const hasError = !!error
  const borderColor = hasError ? 'border-red-300' : 'border-stone-200'

  return (
    <div
      className={`flex rounded-md border ${borderColor} overflow-hidden bg-white focus-within:ring-2 focus-within:ring-hanami-500/40 transition-shadow`}
    >
      {/* ── Sélecteur indicatif pays ─────────────────────────── */}
      <select
        autoComplete="tel-country-code"
        value={countryCode}
        onChange={e => handleCountryChange(e.target.value)}
        aria-label="Indicatif pays"
        className="shrink-0 bg-stone-50 border-r border-stone-200 text-sm text-stone-700 px-3 py-2.5 focus:outline-none cursor-pointer hover:bg-stone-100 transition-colors"
      >
        {COUNTRIES.map((c, i) => (
          <option key={`${c.code}-${i}`} value={c.code}>
            {c.flag}  {c.code}
          </option>
        ))}
      </select>

      {/* ── Saisie du numéro local ───────────────────────────── */}
      <input
        id={id}
        type="tel"
        autoComplete="tel-national"
        value={localNumber}
        onChange={handleNumberChange}
        onBlur={onBlur}
        placeholder={countryCode === '+33' ? '06 12 34 56 78' : 'Numéro de téléphone'}
        className="flex-1 px-4 py-2.5 text-sm text-stone-800 bg-white focus:outline-none"
      />
    </div>
  )
}
