import { useMemo } from 'react'
import { Box, Flex, Grid, Text, chakra } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { playerData } from '../../data/playerData'
import useSeasonStats from '../../hooks/useSeasonStats'
import { seasonTiles, seasonTitle } from '../../lib/seasonTiles'
import { EASE, useReveal } from '../../lib/motion'
import SectionHeader from '../UI/SectionHeader'

// Estadísticas "Radar central": el radar de atributos al centro con la media,
// las cifras de la temporada a los lados y la ficha física en una franja abajo.

const grow = keyframes`from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}`

// Geometría del radar (viewBox -100 -10 600 420)
const C = 200, R = 140, MIN = 50
const ang = (i, n) => -Math.PI / 2 + (i * 2 * Math.PI) / n
const pt = (i, n, v) => {
  const r = (R * (v - MIN)) / (100 - MIN)
  return [C + r * Math.cos(ang(i, n)), C + r * Math.sin(ang(i, n))]
}
const poly = (n, f) => Array.from({ length: n }, (_, i) => pt(i, n, f(i)).map((x) => x.toFixed(1)).join(',')).join(' ')

const svgText = { fontFamily: 'display', fontWeight: 700 }

function Radar({ attrs, play, reduced }) {
  const n = attrs.length
  return (
    <chakra.svg
      viewBox="-100 -10 600 420" w="100%" h="auto" display="block" overflow="visible" role="img"
      aria-label={`Radar de atributos: ${attrs.map((a) => `${a.label} ${a.value}`).join(', ')}`}
    >
      {[60, 70, 80, 90, 100].map((v) => (
        <Box as="polygon" key={v} points={poly(n, () => v)} fill="none" stroke={v === 100 ? '#d6ae4e66' : '#ffffff14'} />
      ))}
      <Box as="text" x={C + 4} y={pt(0, n, 100)[1] - 4} fontFamily="display" fontSize="9px" fill="brand.gray">100</Box>
      <Box as="text" x={C + 4} y={pt(0, n, 75)[1]} fontFamily="display" fontSize="9px" fill="brand.gray">75</Box>
      {attrs.map((_, i) => {
        const [x, y] = pt(i, n, 100)
        return <Box as="line" key={i} x1={C} y1={C} x2={x} y2={y} stroke="#ffffff14" />
      })}
      <Box
        as="polygon" points={poly(n, (i) => attrs[i].value)} fill="brand.amber" fillOpacity=".9" stroke="brand.amber" strokeWidth="2"
        transformOrigin="200px 200px" opacity={play || reduced ? 1 : 0}
        animation={play && !reduced ? `${grow} 1.2s ${EASE} both` : undefined}
      />
      {attrs.map((a, i) => {
        const [x, y] = pt(i, n, 118)
        const side = Math.abs(x - C) >= 5
        const anchor = !side ? 'middle' : x > C ? 'start' : 'end'
        // A los costados, los rótulos de varias palabras van en dos líneas para no salirse
        const words = a.label.toUpperCase().split(' ')
        const lines = side && words.length > 1 ? [words.slice(0, -1).join(' '), words.at(-1)] : [words.join(' ')]
        return (
          <Box as="text" key={a.label} x={x} y={y - (lines.length - 1) * 8} textAnchor={anchor} {...svgText}>
            {lines.map((l, k) => (
              <Box as="tspan" key={l} x={x} dy={k ? '1.15em' : 0} fontSize={{ base: '17px', tab: '11px' }} letterSpacing=".12em" fill="#e6dcc8">{l}</Box>
            ))}
            <Box as="tspan" x={x} dy="1.25em" fontSize={{ base: '21px', tab: '15px' }} fill="brand.amber">{a.value}</Box>
          </Box>
        )
      })}
    </chakra.svg>
  )
}

function Figure({ item, hl, last }) {
  return (
    <Box pb={last ? 0 : '20px'} borderBottom={last ? 0 : '1px solid'} borderColor="brand.line">
      <Text as="b" display="block" fontSize={{ base: '40px', tab: 'clamp(48px,5vw,78px)' }} fontWeight={700} lineHeight={0.9} color={hl ? 'brand.terra' : 'brand.bone'} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {item.value}
      </Text>
      <Text as="small" fontSize="11px" letterSpacing=".24em" color="brand.gray" textTransform="uppercase">{item.label}</Text>
    </Box>
  )
}

function Side({ items, offset, align, rv, delay }) {
  return (
    <Grid gap="26px" textAlign={{ base: 'left', tab: align }} {...rv(delay)}>
      {items.map((s, i) => <Figure key={s.label} item={s} hl={offset + i === 0} last={i === items.length - 1} />)}
    </Grid>
  )
}

export default function StatsSection() {
  // Con totales de la API se muestra la temporada en curso; si no, los fijos de playerData.
  const season = useSeasonStats()
  const tiles = useMemo(() => (season ? seasonTiles(season) : playerData.seasonStats), [season])
  const half = Math.ceil(tiles.length / 2)
  const media = Math.round(playerData.stats.reduce((a, s) => a + s.value, 0) / playerData.stats.length)
  const { ref, inView, rv, reduced } = useReveal()

  const facts = [
    ['Posición', playerData.position],
    ['Pie', playerData.foot],
    ['Edad', `${playerData.age} años`],
    ['Altura', playerData.height],
    ['Peso', playerData.weight],
    ['Origen', playerData.birthPlaceShort],
  ]

  return (
    <Box as="section" id="estadisticas" ref={ref} position="relative" bg="brand.dark" color="brand.bone" fontFamily="display" overflow="hidden" p={{ base: '64px 20px', tab: '96px 60px' }}>
      <Box maxW="1320px" mx="auto">
        <SectionHeader kicker={seasonTitle(season, 'Temporada 2025 / 2026')} title="Estadísticas" {...rv()} />

        <Grid
          mt={{ base: '28px', tab: '44px' }} templateColumns={{ base: '1fr 1fr', tab: '1fr minmax(320px,520px) 1fr' }}
          gap={{ base: '20px', tab: '40px' }} alignItems="center"
        >
          <Side items={tiles.slice(0, half)} offset={0} align="left" rv={rv} delay={0.15} />
          <Box position="relative" gridColumn={{ base: '1 / -1', tab: 'auto' }} gridRow={{ base: 1, tab: 'auto' }} maxW={{ base: '420px', tab: 'none' }} mx={{ base: 'auto', tab: 0 }} mb={{ base: '10px', tab: 0 }} w="100%">
            <Radar attrs={playerData.stats} play={inView} reduced={reduced} />
            <Box position="absolute" left="50%" top="50%" transform="translate(-50%,-50%)" textAlign="center" pointerEvents="none" color="brand.onAcc">
              <Text as="b" display="block" fontSize="64px" lineHeight={0.85} fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>{media}</Text>
              <Text as="small" fontSize="10px" fontWeight={700} letterSpacing=".24em">MEDIA</Text>
            </Box>
          </Box>
          <Side items={tiles.slice(half)} offset={half} align="right" rv={rv} delay={0.25} />
        </Grid>

        <Grid
          as="dl" mt={{ base: '36px', tab: '56px' }} templateColumns={{ base: 'repeat(2,1fr)', tab: 'repeat(6,1fr)' }}
          borderTop="2px solid" borderColor="brand.amber" bgGradient="linear(to-b, var(--chakra-colors-brand-bg2), transparent)" {...rv(0.35)}
        >
          {facts.map(([k, v], i) => (
            <Flex
              key={k} direction="column" gap="8px" p={{ base: '14px 16px', tab: '20px 22px' }}
              borderLeft={{ base: i % 2 ? '1px solid' : 0, tab: i ? '1px solid' : 0 }} borderTop={{ base: i > 1 ? '1px solid' : 0, tab: 0 }} borderColor="brand.line"
            >
              <Text as="dt" fontSize="10px" fontWeight={700} letterSpacing=".24em" textTransform="uppercase" color="brand.gray">{k}</Text>
              <Text as="dd" fontSize={{ base: '18px', tab: '22px' }} fontWeight={700} letterSpacing=".02em" color={i === 0 ? 'brand.amber' : 'brand.bone'}>{v}</Text>
            </Flex>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
