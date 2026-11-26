import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Box } from '@chakra-ui/react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { keyframes } from '@emotion/react'
import { playerData } from '../../data/playerData'

// Galería "Mosaico con pestañas": mosaico que cierra sin huecos (una foto 2x2 + 4 chicas, en grupos),
// pestañas por categoría con conteo, "Ver más" y visor con flechas, teclado y swipe.

const EASE = [0.23, 1, 0.32, 1]
const CSS_EASE = 'cubic-bezier(0.23,1,0.32,1)'
const rise = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}`

// Formas [ancho, alto] que cierran la grilla: grupos de 5 (una grande + 4 chicas) y el resto ajustado
function shapesFor(n, cols) {
  const out = []
  while (n - out.length >= 5) out.push([2, 2], [1, 1], [1, 1], [1, 1], [1, 1])
  const r = n - out.length
  const tail = cols === 4
    ? { 1: [[4, 1]], 2: [[2, 1], [2, 1]], 3: [[2, 1], [1, 1], [1, 1]], 4: [[1, 1], [1, 1], [1, 1], [1, 1]] }
    : { 1: [[2, 1]], 2: [[1, 1], [1, 1]], 3: [[2, 1], [1, 1], [1, 1]], 4: [[1, 1], [1, 1], [1, 1], [1, 1]] }
  ;(tail[r] || []).forEach((s) => out.push(s))
  return out
}

function useCols() {
  const [cols, setCols] = useState(4)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const f = () => setCols(mq.matches ? 2 : 4)
    f()
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return cols
}

function Viewer({ list, index, onClose, onIndex }) {
  const closeRef = useRef(null)
  const touch = useRef(null)
  const n = list.length
  const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex])
  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    window.__lenis?.stop()
    closeRef.current?.focus()
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start() }
  }, [onClose, prev, next])

  const photo = list[index]
  return (
    <motion.div
      className="lb" role="dialog" aria-modal="true" aria-label="Foto ampliada"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      onClick={onClose}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)()
      }}
    >
      <motion.img
        key={index} src={photo.src} alt={photo.alt}
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      />
      <button ref={closeRef} type="button" className="x" aria-label="Cerrar" onClick={onClose}>✕</button>
      <button type="button" className="p" aria-label="Foto anterior" onClick={(e) => { e.stopPropagation(); prev() }}>←</button>
      <button type="button" className="n" aria-label="Foto siguiente" onClick={(e) => { e.stopPropagation(); next() }}>→</button>
      <div className="c">{index + 1} / {n}</div>
    </motion.div>
  )
}

export default function GallerySection() {
  const { gallery, galleryCats } = playerData
  const cols = useCols()
  const [cat, setCat] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const [viewer, setViewer] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  const counts = useMemo(
    () => Object.fromEntries(galleryCats.map(([k]) => [k, gallery.filter((g) => k === 'all' || g.c === k).length])),
    [gallery, galleryCats],
  )
  const list = useMemo(() => gallery.filter((g) => cat === 'all' || g.c === cat), [gallery, cat])
  const first = cols === 4 ? 10 : 6
  const show = expanded ? list : list.slice(0, first)
  const shapes = shapesFor(show.length, cols)

  if (!gallery.length) return null

  return (
    <Box as="section" id="galeria" ref={ref} className={inView ? 'in' : ''} sx={sx}>
      <div className="top rv">
        <div className="sh">
          <div className="k">Fotos</div>
          <h2>Galería</h2>
        </div>
        <div className="tabs" role="tablist" aria-label="Categorías de la galería">
          {galleryCats.map(([k, label]) => (
            <button
              key={k} type="button" role="tab" aria-selected={cat === k}
              onClick={() => { setCat(k); setExpanded(false) }}
            >
              {label}<span>{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="m" role="tabpanel">
        {show.map((g, i) => {
          const [w, h] = shapes[i]
          // En desktop, los grupos impares espejan la foto grande a la derecha
          const flip = cols === 4 && Math.floor(i / 5) % 2 && i % 5 === 0
          return (
            <button
              key={`${cat}-${g.alt}`} type="button" aria-label={`Ampliar: ${g.alt}`}
              style={{ gridColumn: flip ? `span ${w} / -1` : `span ${w}`, gridRow: `span ${h}`, animationDelay: `${(i % 10) * 0.04}s` }}
              onClick={() => setViewer(i)}
            >
              <img src={g.src} alt={g.alt} loading="lazy" />
            </button>
          )
        })}
      </div>

      <div className="foot">
        <span>{show.length} de {list.length} fotos</span>
        {list.length > first && (
          <button type="button" className="more" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Ver menos' : 'Ver más fotos'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {viewer !== null && <Viewer list={show} index={viewer} onClose={() => setViewer(null)} onIndex={setViewer} />}
      </AnimatePresence>
    </Box>
  )
}

const sx = {
  position: 'relative', bg: 'brand.dark', color: 'brand.bone', fontFamily: 'display',
  p: { base: '64px 20px', lg: '96px 60px' },
  '& > *': { maxW: '1320px', mx: 'auto' },
  '.rv': { opacity: 0 },
  '&.in .rv': { animation: `${rise} 1s ${CSS_EASE} both` },
  '.top': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap', mb: '28px' },
  '.sh .k': { fontSize: '11px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: 'brand.terra' },
  '.sh h2': { fontWeight: 700, fontSize: 'clamp(44px,5.4vw,84px)', lineHeight: 0.9, color: 'brand.amber', textTransform: 'uppercase', mt: '8px' },
  '.tabs': { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  '.tabs button': {
    fontSize: '11px', fontWeight: 700, lineHeight: 1, letterSpacing: '.16em', textTransform: 'uppercase', p: '12px 16px', borderRadius: 'full',
    border: '1px solid', borderColor: 'brand.line', bg: 'transparent', color: 'brand.gray', cursor: 'pointer',
    transition: `transform .16s ease-out, background-color .2s, color .2s, border-color .2s`,
  },
  '.tabs button:active, .more:active': { transform: 'scale(.97)' },
  '.tabs button[aria-selected="true"]': { bg: 'brand.amber', color: 'brand.onAcc', borderColor: 'brand.amber' },
  '.tabs button span': { opacity: 0.6, ml: '6px' },
  '.m': {
    display: 'grid', gridAutoFlow: 'dense', gridTemplateColumns: { base: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
    gridAutoRows: { base: '42vw', md: 'clamp(150px,15vw,230px)' }, gap: { base: '6px', md: '8px' },
  },
  '.m button': {
    position: 'relative', p: 0, border: 0, bg: '#000', overflow: 'hidden', cursor: 'zoom-in', animation: `${rise} .7s ${CSS_EASE} both`,
  },
  '.m img': { w: '100%', h: '100%', objectFit: 'cover', objectPosition: '50% 25%', transition: `transform .7s ${CSS_EASE}`, maxW: 'none' },
  '.m button:after': { content: '""', position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 0 var(--chakra-colors-brand-amber)', transition: `box-shadow .3s ${CSS_EASE}` },
  '.foot': { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '22px', fontSize: '12px', color: 'brand.gray', letterSpacing: '.12em' },
  '.more': {
    fontSize: '12px', fontWeight: 700, lineHeight: 1, letterSpacing: '.18em', textTransform: 'uppercase', p: '14px 22px', borderRadius: 'full',
    border: '1.5px solid', borderColor: 'brand.amber', color: 'brand.amber', bg: 'transparent', cursor: 'pointer',
    transition: 'transform .16s ease-out, background-color .2s, color .2s',
  },
  'button:focus-visible': { outline: '2px solid', outlineColor: 'brand.terra', outlineOffset: '2px' },
  '@media (hover:hover) and (pointer:fine)': {
    '.m button:hover img': { transform: 'scale(1.05)' },
    '.m button:hover:after': { boxShadow: 'inset 0 0 0 3px var(--chakra-colors-brand-amber)' },
    '.more:hover': { bg: 'brand.amber', color: 'brand.onAcc' },
    '.tabs button[aria-selected="false"]:hover': { color: 'brand.amber', borderColor: '#d6ae4e99' },
  },
  // Visor
  '.lb': { position: 'fixed', inset: 0, zIndex: 2000, bg: '#0F0D0Af2', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { base: '70px 12px', md: '60px 70px' } },
  '.lb img': { maxW: '100%', maxH: '100%', objectFit: 'contain' },
  '.lb button': {
    position: 'absolute', bg: 'transparent', border: '1.5px solid', borderColor: 'brand.amber', color: 'brand.amber', w: '46px', h: '46px',
    borderRadius: 'full', fontSize: '18px', cursor: 'pointer', transition: 'transform .16s ease-out, background-color .2s, color .2s',
  },
  '.lb button:active': { transform: 'scale(.94)' },
  '.lb .x': { top: '16px', right: '16px' },
  '.lb .p': { left: '14px', top: { base: 'auto', md: '50%' }, bottom: { base: '12px', md: 'auto' } },
  '.lb .n': { right: '14px', top: { base: 'auto', md: '50%' }, bottom: { base: '12px', md: 'auto' } },
  '.lb .c': { position: 'absolute', bottom: '18px', left: 0, right: 0, textAlign: 'center', fontSize: '13px', color: '#e6dcc8' },
  '@media (prefers-reduced-motion: reduce)': { '.rv': { opacity: 1, animation: 'none !important' }, '.m button': { animation: 'none' } },
}
