/**
 * useFadeIn — Hook d'animation au scroll
 *
 * Ce hook utilise l'API IntersectionObserver du navigateur pour détecter
 * quand un élément HTML entre dans le champ de vision de l'utilisateur.
 * Quand c'est le cas, il ajoute la classe CSS "visible" à l'élément,
 * ce qui déclenche l'animation fade-in définie dans globals.css.
 *
 * Utilisation dans un composant :
 *   const ref = useFadeIn()
 *   <div ref={ref} className="fade-in">...</div>
 */

'use client'

import { useEffect, useRef } from 'react'

export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  // On crée une "référence" vers l'élément HTML du composant
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // IntersectionObserver : observe quand l'élément devient visible à l'écran
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // L'élément est visible → on ajoute "visible" pour démarrer l'animation
          el.classList.add('visible')
          // On arrête d'observer une fois l'animation lancée (pas besoin de recommencer)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1, // L'animation se lance quand 10% de l'élément est visible
      }
    )

    observer.observe(el)

    // Nettoyage : on arrête d'observer si le composant est retiré de la page
    return () => observer.disconnect()
  }, [])

  return ref
}
