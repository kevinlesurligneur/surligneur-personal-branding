import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

/**
 * Anime un effet "coup de surligneur" sur le texte enfant.
 *
 * scrollOnly : si true, se déclenche uniquement après que l'utilisateur
 *              a scrollé (idéal pour les éléments visibles dès le chargement).
 * color      : couleur du surlignage (rgba).
 * delay      : délai avant l'animation (secondes).
 */
export function HighlightWord({
  children,
  color = 'rgba(253,224,71,0.45)',
  delay = 0,
  scrollOnly = false,
}) {
  // Mode scroll-only : attend que l'utilisateur ait scrollé avant d'activer
  const [hasScrolled, setHasScrolled] = useState(false)
  useEffect(() => {
    if (!scrollOnly) return
    const handler = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true)
        window.removeEventListener('scroll', handler)
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [scrollOnly])

  // Mode normal : useInView
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const active = scrollOnly ? hasScrolled : isInView

  return (
    <span
      ref={ref}
      style={{
        backgroundImage: `linear-gradient(
          104deg,
          transparent 0.5%,
          ${color} 2%,
          ${color} 98%,
          transparent 99.5%
        )`,
        backgroundSize: active ? '100% 42%' : '0% 42%',
        backgroundPosition: '0 88%',
        backgroundRepeat: 'no-repeat',
        transition: `background-size 0.75s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        display: 'inline',
        WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone',
      }}
    >
      {children}
    </span>
  )
}
