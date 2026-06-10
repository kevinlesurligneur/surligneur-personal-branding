import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Anime un effet "coup de surligneur" sur le texte enfant au scroll.
 * color : couleur du surlignage (rgba). Par défaut jaune surligneur.
 * delay : délai avant l'animation (secondes).
 */
export function HighlightWord({ children, color = 'rgba(253,224,71,0.45)', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <span
      ref={ref}
      style={{
        // Dégradé légèrement penché pour l'effet "trait de surligneur"
        backgroundImage: `linear-gradient(
          104deg,
          transparent 0.5%,
          ${color} 2%,
          ${color} 98%,
          transparent 99.5%
        )`,
        backgroundSize: isInView ? '100% 42%' : '0% 42%',
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
