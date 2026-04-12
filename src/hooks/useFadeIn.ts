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
 *
 * Stratégie anti-bug iOS Safari :
 * iOS Safari ne déclenche pas toujours le callback IntersectionObserver
 * pour les éléments déjà dans le viewport au chargement. On utilise trois
 * couches de sécurité :
 *   1. IntersectionObserver (comportement normal)
 *   2. requestAnimationFrame : vérif viewport après le premier paint
 *   3. setTimeout 600ms : fallback dur — si l'élément est encore invisible
 *      après 600ms, on le rend visible de force.
 */

'use client'

import { useEffect, useRef } from 'react'

export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  // On crée une "référence" vers l'élément HTML du composant
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Garde pour éviter d'appeler show() plusieurs fois
    let done = false

    const show = () => {
      if (done) return
      done = true
      el.classList.add('visible')
      observer.disconnect()
      cancelAnimationFrame(rafId)
      clearTimeout(fallbackId)
    }

    // 1. IntersectionObserver — comportement principal
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) show() },
      { threshold: 0 }
    )
    observer.observe(el)

    // 2. rAF — vérification viewport après le premier paint du navigateur.
    //    Corrige le cas iOS Safari où getBoundingClientRect() retourne 0
    //    si appelé synchronement au montage (avant layout).
    const rafId = requestAnimationFrame(() => {
      if (!done && el.getBoundingClientRect().top < window.innerHeight) {
        show()
      }
    })

    // 3. Fallback dur — après 600ms, on force visible.
    //    Couvre les cas extrêmes (iOS low-power mode, lent, Safari bugs).
    const fallbackId = setTimeout(() => {
      if (!done) show()
    }, 600)

    return () => {
      done = true
      observer.disconnect()
      cancelAnimationFrame(rafId)
      clearTimeout(fallbackId)
    }
  }, [])

  return ref
}
