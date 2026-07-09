/**
 * UploadStep.tsx — Zone de dépôt de la photo à transformer
 *
 * Reprend le pattern drag & drop de StepPhotos (types acceptés JPG/PNG/WebP/
 * HEIC). Renvoie le File brut au parent, qui s'occupe de la compression via
 * compressPhoto().
 */

'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload } from 'lucide-react'

const ACCEPTED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])
const ACCEPTED_EXT = /\.(jpe?g|png|webp|heic|heif)$/i

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

export default function UploadStep({ onFile, disabled = false }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pick = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      const file = Array.from(files).find(
        (f) => ACCEPTED_MIME.has(f.type) || ACCEPTED_EXT.test(f.name),
      )
      if (file) onFile(file)
    },
    [onFile],
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (!disabled) pick(e.dataTransfer.files)
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-4 p-10 sm:p-14 rounded-2xl border-2 border-dashed transition-all duration-200 ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${
        isDragOver
          ? 'border-hanami-500 bg-hanami-100/60 scale-[1.01]'
          : 'border-stone-300 bg-white hover:border-hanami-400 hover:bg-hanami-100/30'
      }`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          isDragOver ? 'bg-hanami-500/20' : 'bg-stone-100'
        }`}
      >
        <Upload
          className={`w-6 h-6 ${isDragOver ? 'text-hanami-600' : 'text-stone-400'}`}
          strokeWidth={1.5}
        />
      </div>

      <div className="text-center">
        <p className="text-base font-medium text-stone-700">
          Glissez une photo de votre pelouse
        </p>
        <p className="text-sm text-stone-400 mt-1">
          ou <span className="text-hanami-600 font-medium">cliquez pour parcourir</span>
        </p>
        <p className="text-xs text-stone-300 mt-3">
          JPG, PNG, WebP, HEIC (iPhone) · 10 Mo max
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="sr-only"
        onChange={(e) => pick(e.target.files)}
        disabled={disabled}
      />
    </div>
  )
}
