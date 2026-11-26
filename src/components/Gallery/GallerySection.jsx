import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Box, Flex, Grid, Image, Text, chakra, useMediaQuery } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { playerData } from '../../data/playerData'
import { EASE, EASE_ARR, fine, rise, useReveal } from '../../lib/motion'
import SectionHeader from '../UI/SectionHeader'

// Galería "Mosaico con pestañas": mosaico que cierra sin huecos (una foto 2x2 + 4 chicas, en grupos),
// pestañas por categoría con conteo, "Ver más" y visor con flechas, teclado y swipe.

const MotionBox = motion(Box)
const MotionImage = motion(Image)

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

const pillButton = {
  fontFamily: 'display', fontSize: '12px', fontWeight: 700, lineHeight: 1, letterSpacing: '.16em', textTransform: 'uppercase', borderRadius: 'full', cursor: 'pointer',
  transition: 'transform .16s ease-out, background-color .2s, color .2s, border-color .2s',
}

function CategoryTab({ label, count, selected, onClick }) {
  return (
    <chakra.button
      type="button" role="tab" aria-selected={selected} onClick={onClick} {...pillButton} fontSize="11px" p="12px 16px" border="1px solid"
      borderColor={selected ? 'brand.amber' : 'brand.line'} bg={selected ? 'brand.amber' : 'transparent'} color={selected ? 'brand.onAcc' : 'brand.gray'}
      _active={{ transform: 'scale(.97)' }} sx={selected ? {} : fine({ color: 'brand.amber', borderColor: '#d6ae4e99' })}
    >
      {label}<Text as="span" opacity={0.6} ml="6px">{count}</Text>
    </chakra.button>
  )
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
  const round = {
    position: 'absolute', boxSize: '46px', borderRadius: 'full', bg: 'transparent', border: '1.5px solid', borderColor: 'brand.amber', color: 'brand.amber',
    fontSize: '18px', cursor: 'pointer', transition: 'transform .16s ease-out', _active: { transform: 'scale(.94)' },
  }
  const side = { top: { base: 'auto', tab: '50%' }, bottom: { base: '12px', tab: 'auto' } }
  return (
    <MotionBox
      role="dialog" aria-modal="true" aria-label="Foto ampliada" position="fixed" inset={0} zIndex={2000} bg="#0F0D0Af2" display="flex" alignItems="center" justifyContent="center"
      p={{ base: '70px 12px', tab: '60px 70px' }} onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)()
      }}
    >
      <MotionImage
        key={index} src={photo.src} alt={photo.alt} maxW="100%" maxH="100%" objectFit="contain" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE_ARR }}
      />
      <chakra.button ref={closeRef} type="button" aria-label="Cerrar" onClick={onClose} {...round} top="16px" right="16px">✕</chakra.button>
      <chakra.button type="button" aria-label="Foto anterior" onClick={(e) => { e.stopPropagation(); prev() }} {...round} left="14px" {...side}>←</chakra.button>
      <chakra.button type="button" aria-label="Foto siguiente" onClick={(e) => { e.stopPropagation(); next() }} {...round} right="14px" {...side}>→</chakra.button>
      <Text position="absolute" bottom="18px" left={0} right={0} textAlign="center" fontSize="13px" color="#e6dcc8" pointerEvents="none">{index + 1} / {n}</Text>
    </MotionBox>
  )
}

export default function GallerySection() {
  const { gallery, galleryCats } = playerData
  const [wide] = useMediaQuery('(min-width: 821px)')
  const cols = wide ? 4 : 2
  const [cat, setCat] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const [viewer, setViewer] = useState(null)
  const { ref, rv, reduced } = useReveal()

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
    <Box as="section" id="galeria" ref={ref} position="relative" bg="brand.dark" color="brand.bone" fontFamily="display" p={{ base: '64px 20px', tab: '96px 60px' }}>
      <Box maxW="1320px" mx="auto">
        <Flex justify="space-between" align="flex-end" gap="20px" wrap="wrap" mb="28px" {...rv()}>
          <SectionHeader kicker="Fotos" title="Galería" />
          <Flex gap="6px" wrap="wrap" role="tablist" aria-label="Categorías de la galería">
            {galleryCats.map(([k, label]) => (
              <CategoryTab key={k} label={label} count={counts[k]} selected={cat === k} onClick={() => { setCat(k); setExpanded(false) }} />
            ))}
          </Flex>
        </Flex>

        <Grid role="tabpanel" templateColumns={{ base: 'repeat(2,1fr)', tab: 'repeat(4,1fr)' }} gap={{ base: '6px', tab: '8px' }} autoRows={{ base: '42vw', tab: 'clamp(150px,15vw,230px)' }} sx={{ gridAutoFlow: 'dense' }}>
          {show.map((g, i) => {
            const [w, h] = shapes[i]
            // En desktop, los grupos impares espejan la foto grande a la derecha
            const flip = cols === 4 && Math.floor(i / 5) % 2 && i % 5 === 0
            return (
              <chakra.button
                key={`${cat}-${g.alt}`} type="button" aria-label={`Ampliar: ${g.alt}`} onClick={() => setViewer(i)}
                position="relative" p={0} border={0} bg="#000" overflow="hidden" cursor="zoom-in" gridColumn={flip ? `span ${w} / -1` : `span ${w}`} gridRow={`span ${h}`}
                animation={reduced ? undefined : `${rise} .7s ${EASE} ${(i % 10) * 0.04}s both`}
                _after={{ content: '""', position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 0 var(--chakra-colors-brand-amber)', transition: `box-shadow .3s ${EASE}` }}
                sx={{ '@media (hover:hover) and (pointer:fine)': { '&:hover img': { transform: 'scale(1.05)' }, '&:hover::after': { boxShadow: 'inset 0 0 0 3px var(--chakra-colors-brand-amber)' } } }}
                _focusVisible={{ outline: '2px solid', outlineColor: 'brand.terra', outlineOffset: '2px' }}
              >
                <Image src={g.src} alt={g.alt} loading="lazy" w="100%" h="100%" objectFit="cover" objectPosition="50% 25%" maxW="none" transition={`transform .7s ${EASE}`} />
              </chakra.button>
            )
          })}
        </Grid>

        <Flex justify="space-between" align="center" mt="22px" fontSize="12px" color="brand.gray" letterSpacing=".12em">
          <Text as="span">{show.length} de {list.length} fotos</Text>
          {list.length > first && (
            <chakra.button
              type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)} {...pillButton} letterSpacing=".18em" p="14px 22px" border="1.5px solid" borderColor="brand.amber"
              color="brand.amber" bg="transparent" _active={{ transform: 'scale(.97)' }} sx={fine({ bg: 'brand.amber', color: 'brand.onAcc' })}
            >
              {expanded ? 'Ver menos' : 'Ver más fotos'}
            </chakra.button>
          )}
        </Flex>
      </Box>

      <AnimatePresence>
        {viewer !== null && <Viewer list={show} index={viewer} onClose={() => setViewer(null)} onIndex={setViewer} />}
      </AnimatePresence>
    </Box>
  )
}
