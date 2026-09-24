'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize2 } from 'lucide-react'
import PhotoLightbox from '@/components/shared/PhotoLightbox'
import styles from './ProEditorial.module.css'

type ProCaptureProps = {
  src: string
  alt: string
  caption: string
  width: number
  height: number
  className?: string
  sizes?: string
  priority?: boolean
}

export default function ProCapture({ src, alt, caption, width, height, className, sizes = '(max-width: 767px) 100vw, 50vw', priority = false }: ProCaptureProps) {
  const [open, setOpen] = useState(false)

  return (
    <figure className={className}>
      <button type="button" className={styles.captureButton} onClick={() => setOpen(true)} aria-label={`Agrandir : ${caption}`}>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} />
        <span className={styles.captureZoom}><Maximize2 size={15} aria-hidden="true" /> Agrandir</span>
      </button>
      <figcaption>{caption}</figcaption>
      <PhotoLightbox src={open ? src : null} caption={caption} onClose={() => setOpen(false)} />
    </figure>
  )
}
