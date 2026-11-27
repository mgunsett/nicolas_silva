import { useRef, useState, useEffect, useCallback } from 'react'
import { Box, Flex, Grid, Heading, IconButton, Image, Text } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { playerData } from '../../data/playerData'
import { EASE, useReveal } from '../../lib/motion'
import SectionHeader from '../UI/SectionHeader'


const pad = (n) => String(n).padStart(2, '0')
// "2022 — 2023" → "2022–23"; "2024 — Actualidad" → "2024–Hoy"
const yearsShort = (y) => {
  const [a, b] = y.split(' — ')
  if (!b) return a
  return `${a}–${/^\d{4}$/.test(b) ? b.slice(2) : 'Hoy'}`
}

function ArrowButton({ dir, label, disabled, onClick }) {
  return (
    <IconButton
      aria-label={label} isDisabled={disabled} onClick={onClick} icon={dir < 0 ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      variant="unstyled" display="grid" placeItems="center" minW={0} boxSize={{ base: '44px', tab: '52px' }} borderRadius="full"
      border="1.5px solid" borderColor="brand.amber" color="brand.amber" bg="transparent"
      transition="background-color .2s, color .2s, transform .16s ease-out, opacity .2s"
      _active={{ transform: 'scale(.94)' }} _disabled={{ opacity: 0.3, cursor: 'default' }}
      sx={{ '@media (hover:hover) and (pointer:fine)': { '&:not(:disabled):hover': { bg: 'brand.amber', color: 'brand.onAcc' } } }}
    />
  )
}

function ClubCard({ club, index, total }) {
  const current = index === 0
  const tag = current ? 'Ultimo club' : club.info && club.info.length < 14 ? club.info : ''
  const title = club.titles[0]?.replace('Campeón de la ', 'Campeón ')
  const ink = current ? 'brand.onAcc' : undefined
  return (
    <Flex
      as="article" position="relative" direction="column" overflow="hidden" borderRadius="20px" border="1px solid"
      flex={{ base: '0 0 68vw', tab: '0 0 clamp(240px,22vw,300px)' }} p={{ base: '18px', tab: '22px' }} 
      borderColor={current ? 'brand.amber' : 'brand.line'} bg={current ? 'brand.amber' : undefined}
      bgGradient={current ? undefined : 'linear(170deg, #221d16, var(--chakra-colors-brand-bg2) 60%)'}
      color={current ? 'brand.onAcc' : 'brand.bone'} transition="border-color .3s"
      sx={{
        aspectRatio: '3 / 4.2', scrollSnapAlign: 'start',
        '@media (hover:hover) and (pointer:fine)': { '&:hover img': { transform: 'translateY(-6px) scale(1.04)' }, ...(current ? {} : { '&:hover': { borderColor: '#d6ae4e99' } }) },
      }}
    >
      <Box
        position="absolute" left="50%" top="40%" w="80%" transform="translate(-50%,-50%)" borderRadius="full" pointerEvents="none" sx={{ aspectRatio: '1' }}
        bg={current ? 'radial-gradient(closest-side,#fff6,transparent)' : 'radial-gradient(closest-side,#d6ae4e26,transparent)'}
      />
      <Flex justify="space-between" fontSize="10px" fontWeight={700} letterSpacing=".24em" textTransform="uppercase" color={ink || 'brand.gray'}>
        <Text as="span">{pad(index + 1)} / {pad(total)}</Text>
        <Text as="b" color={ink || 'brand.terra'}>{tag}</Text>
      </Flex>
      {title && (
        <Text
          position="absolute" top={{ base: '46px', tab: '52px' }} left={{ base: '18px', tab: '22px' }} right={{ base: '18px', tab: '22px' }} zIndex={1}
          textAlign="center" fontSize="11px" fontWeight={700} letterSpacing=".06em" color="brand.onAcc" bg="brand.amber" borderRadius="full" p="6px 10px"
        >
          ★ {title}
        </Text>
      )}
      <Image
        src={club.logo} alt={`Escudo de ${club.name}`} loading="lazy" draggable={false} position="relative" w="58%" objectFit="contain" m="auto" maxW="none"
        filter="drop-shadow(0 16px 24px #000a)" transition={`transform .5s ${EASE}`} sx={{ aspectRatio: '1' }}
      />
      <Box>
        <Text
          fontSize={{ base: '36px', tab: '44px' }} fontWeight={700} lineHeight={0.9} letterSpacing="-.01em" color="transparent"
          sx={{ WebkitTextStroke: `1px var(--chakra-colors-brand-${current ? 'onAcc' : 'amber'})` }}
        >
          {yearsShort(club.years)}
        </Text>
        <Heading as="h3" mt="10px" fontFamily="display" fontWeight={700} fontSize={{ base: '17px', tab: '20px' }} textTransform="uppercase" lineHeight={1.05}>{club.name}</Heading>
        <Text mt="6px" fontSize="10px" letterSpacing=".2em" textTransform="uppercase" color={ink || 'brand.gray'}>{club.country}</Text>
      </Box>
    </Flex>
  )
}

export default function ClubsSection() {
  const clubs = playerData.clubs
  const N = clubs.length
  const track = useRef(null)
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [st, setSt] = useState({ idx: 1, p: 0.08, start: true, end: false })
  const { ref, rv } = useReveal()

  const step = () => {
    const c = track.current?.children
    return c && c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : 1
  }
  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setSt({
      idx: Math.min(N, Math.round(el.scrollLeft / step()) + 1),
      p: Math.max(0.08, max ? el.scrollLeft / max : 1),
      start: el.scrollLeft < 4,
      end: el.scrollLeft > max - 4,
    })
  }, [N])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const by = (d) => track.current?.scrollBy({ left: d * step(), behavior: 'smooth' })

  // Arrastre con mouse (en touch el swipe es nativo)
  useEffect(() => {
    const move = (e) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      if (Math.abs(dx) > 4 && !d.moved) { d.moved = true; setDragging(true) }
      if (d.moved) track.current.scrollLeft = d.start - dx
    }
    const up = () => {
      const d = drag.current
      if (!d) return
      if (d.moved) {
        setDragging(false)
        track.current.scrollTo({ left: Math.round(track.current.scrollLeft / step()) * step(), behavior: 'smooth' })
      }
      drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  return (
    <Box as="section" id="clubes" aria-label="Clubes" ref={ref} position="relative" bg="brand.dark" color="brand.bone" fontFamily="display" overflow="hidden" p={{ base: '64px 20px', tab: '96px 60px' }}>
      <Flex justify="space-between" align="flex-end" gap="20px" maxW="1320px" mx="auto" {...rv()}>
        <SectionHeader kicker="Trayectoria" title="Clubes" />
        <Flex gap="10px">
          <ArrowButton dir={-1} label="Club anterior" disabled={st.start} onClick={() => by(-1)} />
          <ArrowButton dir={1} label="Club siguiente" disabled={st.end} onClick={() => by(1)} />
        </Flex>
      </Flex>

      <Flex
        ref={track} tabIndex={0} role="region" aria-label="Clubes de su carrera, deslizables" onScroll={() => requestAnimationFrame(update)}
        onPointerDown={(e) => { if (e.pointerType === 'mouse') drag.current = { x: e.clientX, start: track.current.scrollLeft, moved: false } }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); by(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); by(-1) }
        }}
        mt={{ base: '28px', tab: '40px' }} mx={{ base: '-20px', tab: '-60px' }} px={{ base: '20px', tab: '60px' }} pb="6px" gap={{ base: '12px', tab: '18px' }}
        overflowX="auto" cursor={dragging ? 'grabbing' : 'grab'} {...rv(0.15)}
        sx={{
          scrollSnapType: dragging ? 'none' : 'x mandatory', scrollPaddingInline: { base: '20px', tab: '60px' }, scrollbarWidth: 'none',
          overscrollBehaviorX: 'contain', '&::-webkit-scrollbar': { display: 'none' }, ...(dragging ? { '& *': { pointerEvents: 'none' } } : {}),
        }}
      >
        {clubs.map((c, i) => <ClubCard key={`${c.name}-${c.years}`} club={c} index={i} total={N} />)}
      </Flex>

      <Flex mt="26px" align="center" gap="20px" maxW="1320px" mx="auto">
        <Box flex={1} h="2px" bg="brand.line" position="relative" overflow="hidden">
          <Box position="absolute" inset={0} bg="brand.amber" transformOrigin="left" transition={`transform .3s ${EASE}`} transform={`scaleX(${st.p})`} />
        </Box>
        <Text fontSize="12px" fontWeight={700} letterSpacing=".2em" color="brand.gray" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          <Text as="b" color="brand.bone">{pad(st.idx)}</Text> / {pad(N)}
        </Text>
      </Flex>
    </Box>
  )
}
