'use client'

import { useRef } from 'react'

/** Compatibility ref for existing sections. Content remains visible from SSR. */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T>(null)
}
