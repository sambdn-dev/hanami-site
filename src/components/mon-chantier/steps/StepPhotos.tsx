/**
 * StepPhotos.tsx — Étape 5 : upload photos réelles (optionnel, max 5)
 *
 * Reprend le pattern du ContactForm partagé : drag & drop + fallback clic,
 * miniatures avec bouton suppression, types acceptés JPG/PNG/WebP/HEIC.
 *
 * Cette étape est SKIPPABLE : on peut continuer sans photo.
 */

'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, ImageIcon, X, SkipForward } from 'lucide-react'
import StepNav from '../StepNav'
import type { ChantierFormState, UploadedPhoto } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
  stepNumber: number
}

const MAX_PHOTOS = 5
const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const ACCEPTED_EXT = /\.(jpe?g|png|webp|heic|heif)$/i

export default function StepPhotos({ state, onUpdate, onNext, onBack, stepNumber }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photos = state.photosFiles

  const addPhotos = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(
      f => ACCEPTED_MIME.has(f.type) || ACCEPTED_EXT.test(f.name)
    )

    const remaining = MAX_PHOTOS - photos.length
    const toAdd: UploadedPhoto[] = newFiles.slice(0, remaining).map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    onUpdate({ photosFiles: [...photos, ...toAdd] })
  }, [photos, onUpdate])

  const removePhoto = useCallback((id: string) => {
    const target = photos.find(p => p.id === id)
    if (target) URL.revokeObjectURL(target.preview)
    onUpdate({ photosFiles: photos.filter(p => p.id !== id) })
  }, [photos, onUpdate])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) addPhotos(e.dataTransfer.files)
  }

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape {stepNumber}
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Quelques photos de votre gazon
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        <strong>Facultatif</strong>, mais très utile : 1 à 5 photos nettes me permettent
        d&apos;affiner mon estimation. Si l&apos;upload pose problème, vous pourrez
        m&apos;envoyer vos photos sur WhatsApp après l&apos;envoi du formulaire.
      </p>

      {/* Zone drag & drop */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => photos.length < MAX_PHOTOS && fileInputRef.current?.click()}
        className={`mt-8 relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all duration-200 ${
          photos.length < MAX_PHOTOS ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
        } ${
          isDragOver
            ? 'border-hanami-500 bg-hanami-100/60 scale-[1.01]'
            : 'border-stone-200 bg-white hover:border-hanami-400 hover:bg-hanami-100/30'
        }`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isDragOver ? 'bg-hanami-500/20' : 'bg-stone-100'
        }`}>
          <Upload className={`w-5 h-5 ${isDragOver ? 'text-hanami-600' : 'text-stone-400'}`} strokeWidth={1.5} />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-stone-700">
            {photos.length < MAX_PHOTOS ? 'Glissez vos photos ici' : `${MAX_PHOTOS} photos maximum atteint`}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            ou <span className="text-hanami-600 font-medium">cliquez pour parcourir</span>
          </p>
          <p className="text-xs text-stone-300 mt-2">JPG, PNG, WebP, HEIC · 10 Mo max par photo</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="sr-only"
          onChange={e => e.target.files && addPhotos(e.target.files)}
        />
      </div>

      {/* Miniatures */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
          {photos.map(photo => {
            const isHeic = /\.heic$/i.test(photo.name) || photo.file.type === 'image/heic'
            return (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 group border border-stone-200">
                {isHeic ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-stone-400">
                    <ImageIcon className="w-6 h-6" strokeWidth={1.5} />
                    <span className="text-[10px] truncate w-full text-center px-1">.heic</span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={photo.preview} alt={photo.name} className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Supprimer ${photo.name}`}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Skip + Continuer */}
      <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-stone-500 hover:text-hanami-700 transition-colors cursor-pointer"
        >
          ← Retour
        </button>
        <div className="flex items-center gap-3">
          {photos.length === 0 && (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-hanami-700 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
              Passer cette étape
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}
