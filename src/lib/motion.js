import { useRef } from 'react'
import { keyframes } from '@emotion/react'
import { usePrefersReducedMotion } from '@chakra-ui/react'
import { useInView } from 'framer-motion'

// Curva y keyframes compartidos por las secciones (solo transform y opacity)
export const EASE = 'cubic-bezier(0.23,1,0.32,1)'
export const EASE_ARR = [0.23, 1, 0.32, 1]
export const rise = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}`

// El hover solo existe con mouse: en táctil no queda "pegado" tras un toque
export const fine = (styles) => ({
  '@media (hover:hover) and (pointer:fine)': { '&:hover': styles },
})

// Hover con mouse sobre el propio elemento (`self`) y/o sobre hijos (`kids`: selector → estilos)
export const hoverKids = (self = {}, kids = {}) => ({
  '@media (hover:hover) and (pointer:fine)': {
    '&:hover': self,
    ...Object.fromEntries(Object.entries(kids).map(([sel, st]) => [`&:hover ${sel}`, st])),
  },
})

// Animación de entrada inmediata (hero, navbar). Respeta "reducir movimiento".
export function useEnter() {
  const reduced = usePrefersReducedMotion()
  return (kf, dur = 1, delay = 0) => (reduced ? {} : { animation: `${kf} ${dur}s ${EASE} ${delay}s both` })
}

// Revelado al entrar en pantalla: `ref` va en la sección y `rv(delay)` se esparce en cada bloque.
export function useReveal(margin = '0px 0px -15% 0px') {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin })
  const reduced = usePrefersReducedMotion()
  const rv = (delay = 0) => {
    if (reduced) return {}
    return inView ? { animation: `${rise} 1s ${EASE} ${delay}s both` } : { opacity: 0 }
  }
  return { ref, inView, rv, reduced }
}
