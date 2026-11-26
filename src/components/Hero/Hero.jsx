import { useMemo } from 'react'
import { Box, Flex, Grid, Heading, Image, Text, chakra } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { playerData } from '../../data/playerData'
import useMatches from '../../hooks/useMatches'
import useSeasonStats from '../../hooks/useSeasonStats'
import { seasonTiles } from '../../lib/seasonTiles'
import { EASE, fine, rise, useEnter } from '../../lib/motion'
import { scrollToId } from '../../lib/scroll'

// Hero "Split en capas": texto a la izquierda; a la derecha una escena en profundidad.
// Atrás el dorsal gigante relleno con una foto de cancha; adelante, el recorte del jugador.

const seg = keyframes`from{opacity:0;transform:scaleY(.2)}`
const num = keyframes`from{opacity:0;transform:translate(-50%,-48%) scale(1.08)}`
const slide = keyframes`from{opacity:0;transform:translateX(-10%)}`

// Tres cifras de la temporada: partidos (destacado), asistencias y valoración
const PICK = ['Partidos', 'Asistencias', 'Valoración']
function heroStats(season) {
  const tiles = season ? seasonTiles(season) : playerData.seasonStats
  const first = PICK.map((l) => tiles.find((t) => t.label === l)).filter(Boolean)
  return first.concat(tiles.filter((t) => !first.includes(t))).slice(0, 3)
}

const hasScore = (m) => m.homeScore != null && m.awayScore != null

function CtaButton({ solid, href, children }) {
  return (
    <chakra.a
      href={href}
      onClick={(e) => { e.preventDefault(); scrollToId(href) }}
      flex={{ base: 1, tab: 'initial' }}
      textAlign="center"
      fontWeight={700}
      fontSize="11px"
      letterSpacing=".2em"
      textTransform="uppercase"
      p={{ base: '14px 10px', tab: '15px 24px' }}
      borderRadius="full"
      border="1.5px solid"
      borderColor="brand.amber"
      bg={solid ? 'brand.amber' : 'transparent'}
      color={solid ? 'brand.onAcc' : 'brand.amber'}
      textDecoration="none"
      transition="transform .16s ease-out, background-color .2s ease, color .2s ease"
      _active={{ transform: 'scale(.97)' }}
      sx={fine(solid ? { bg: 'transparent', color: 'brand.amber' } : { bg: 'brand.amber', color: 'brand.onAcc' })}
    >
      {children}
    </chakra.a>
  )
}

function StarGauge({ attr }) {
  const enter = useEnter()
  const lit = Math.round(attr.value / 5)
  return (
    <Box mt={{ base: '16px', tab: '26px' }} maxW="440px" {...enter(rise, 1, 0.54)}>
      <Flex justify="space-between" align="baseline" fontSize="10px" letterSpacing=".24em" textTransform="uppercase" color="brand.gray">
        <Text as="span">{attr.label}</Text>
        <Text as="b" fontSize={{ base: '24px', tab: '30px' }} letterSpacing={0} color="brand.bone">{attr.value}</Text>
      </Flex>
      <Grid mt="8px" templateColumns="repeat(20,1fr)" gap="3px" role="img" aria-label={`${attr.label}: ${attr.value} de 100`}>
        {Array.from({ length: 20 }, (_, i) => (
          <Box
            key={i}
            h={{ base: '8px', tab: '10px' }}
            bg={i === lit - 1 ? 'brand.terra' : i < lit ? 'brand.amber' : 'brand.brownLight'}
            {...enter(seg, 0.5, 0.9 + i * 0.03)}
          />
        ))}
      </Grid>
    </Box>
  )
}

function SeasonFigures({ items }) {
  const enter = useEnter()
  return (
    <Flex as="dl" mt={{ base: '16px', tab: '22px' }} maxW="440px" borderY="1px solid" borderColor="brand.line" {...enter(rise, 1, 0.62)}>
      {items.map((s, i) => (
        <Flex
          key={s.label} flex={1} direction="column" py="12px"
          pl={i ? '18px' : 0} borderLeft={i ? '1px solid' : 0} borderColor="brand.line"
        >
          <Text as="dt" fontSize="9px" letterSpacing=".2em" textTransform="uppercase" color="brand.gray">{s.label}</Text>
          <Text as="dd" fontSize={{ base: '20px', tab: '24px' }} fontWeight={700} color={i === 0 ? 'brand.terra' : 'brand.bone'} sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {s.value}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}

const matchLabel = { fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'brand.gray' }

// Escudo del equipo; si no hay escudo cargado, se muestra el nombre
function TeamCrest({ team, size }) {
  if (!team.shield) return <Text as="span" fontSize="12px">{team.name}</Text>
  return <Image src={team.shield} alt={team.name} title={team.name} boxSize={size} objectFit="contain" loading="lazy" />
}

// Escudo local · resultado (o "vs") · escudo visitante
function Fixture({ match, size = '22px' }) {
  return (
    <Flex as="span" align="center" gap="10px">
      <TeamCrest team={match.home} size={size} />
      {hasScore(match)
        ? <Text as="em" fontStyle="normal" fontWeight={700} color="brand.terra" sx={{ fontVariantNumeric: 'tabular-nums' }}>{match.homeScore}-{match.awayScore}</Text>
        : <Text as="span" fontSize="11px" color="brand.gray">vs</Text>}
      <TeamCrest team={match.away} size={size} />
    </Flex>
  )
}

// Desktop: cápsula flotante sobre la escena
function MatchPill({ last, next }) {
  const enter = useEnter()
  return (
    <Flex
      display={{ base: 'none', tab: 'flex' }} position="absolute" right="28px" bottom="28px" zIndex={6} gap="18px" align="center"
      fontSize="12px" color="brand.bone" bg="#0f0d0acc" border="1px solid" borderColor="brand.line" borderRadius="full" p="10px 18px"
      backdropFilter="blur(8px)" {...enter(rise, 1, 1)}
    >
      <Flex as="span" align="center" gap="8px">
        <Text as="small" {...matchLabel}>Último</Text>
        <Fixture match={last} />
      </Flex>
      <Box w="1px" h="14px" bg="brand.line" />
      <Flex as="span" align="center" gap="8px">
        <Text as="small" {...matchLabel}>Próximo</Text>
        <Fixture match={next} />
        <Text as="span">· {next.date}</Text>
      </Flex>
    </Flex>
  )
}

// Mobile: tarjeta de dos filas en lugar de los CTA
function MatchCard({ last, next }) {
  const enter = useEnter()
  const rows = [['Último', last], ['Próximo', next]]
  return (
    <Box
      display={{ base: 'block', tab: 'none' }} mt="18px" bg="brand.bg2" border="1px solid" borderColor="brand.line"
      borderRadius="14px" overflow="hidden" {...enter(rise, 1, 0.7)}
    >
      {rows.map(([label, match], i) => (
        <Grid
          key={label} templateColumns="70px 1fr auto" alignItems="center" gap="10px" px="16px" py="12px"
          borderTop={i ? '1px solid' : 0} borderColor="brand.line" fontSize="14px"
        >
          <Text as="span" {...matchLabel} color={i ? 'brand.amber' : 'brand.gray'}>{label}</Text>
          <Fixture match={match} size="28px" />
          <Text as="span" fontSize="10px" letterSpacing=".08em" textTransform="uppercase" color="brand.gray">{match.date}</Text>
        </Grid>
      ))}
    </Box>
  )
}

export default function Hero() {
  const enter = useEnter()
  const season = useSeasonStats()
  const { matches } = useMatches()
  const stats = useMemo(() => heroStats(season), [season])
  const top = useMemo(() => [...playerData.stats].sort((a, b) => b.value - a.value)[0], [])
  const { name, fullName, position, currentClub, league, logoCurrentClub, image, heroWide, number } = playerData

  return (
    <Grid
      as="section" id="hero" aria-label="Presentación" position="relative" overflow="hidden"
      h={{ base: 'auto', tab: 'calc(100 * var(--sv))' }} minH={{ base: 'calc(100 * var(--sv))', tab: '640px' }}
      templateColumns={{ base: '1fr', tab: '.95fr 1.05fr' }} templateRows={{ base: '50vh auto', tab: 'auto' }}
      bg="brand.dark" color="brand.bone" fontFamily="display"
    >
      <Flex
        gridRow={{ base: 2, tab: 'auto' }} position="relative" zIndex={6} direction="column" justify="center"
        p={{ base: '0 20px 28px', tab: '96px 32px 40px 60px' }}
      >
        <Flex align="center" gap="14px" {...enter(rise, 1, 0.2)}>
          <Image src={logoCurrentClub} alt={`Escudo de ${currentClub}`} boxSize={{ base: '40px', tab: '52px' }} objectFit="contain" />
          <Box>
            <Text as="b" display="block" fontSize={{ base: '14px', tab: '18px' }} fontWeight={700} letterSpacing=".12em" textTransform="uppercase">{position}</Text>
            <Text as="span" display="block" mt="4px" fontSize={{ base: '9px', tab: '11px' }} letterSpacing=".2em" textTransform="uppercase" color="brand.gray">
              {currentClub} · {league}
            </Text>
          </Box>
        </Flex>

        <Heading as="h1" mt={{ base: '14px', tab: '20px' }} fontFamily="display" fontWeight={700} textTransform="uppercase" lineHeight={0.86}>
          <Text as="span" display="block" fontSize={{ base: '8vw', tab: 'clamp(30px,3.4vw,58px)' }} letterSpacing=".04em" {...enter(rise, 1, 0.3)}>{name}</Text>
          <Text as="span" display="block" ml="-.04em" color="brand.amber" fontSize={{ base: '22vw', tab: 'clamp(84px,10.4vw,180px)' }} {...enter(rise, 1, 0.38)}>{fullName}</Text>
        </Heading>

        <StarGauge attr={top} />
        <SeasonFigures items={stats} />

        {/* CTA solo en desktop; en mobile su lugar lo ocupa la tarjeta de partidos */}
        <Flex display={{ base: 'none', tab: 'flex' }} gap="12px" mt="26px" {...enter(rise, 1, 0.7)}>
          <CtaButton solid href="#videos">Ver jugadas</CtaButton>
          <CtaButton href="#contact">Contacto</CtaButton>
        </Flex>
        {matches.last && matches.next && <MatchCard last={matches.last} next={matches.next} />}
      </Flex>

      <Box position="relative" gridRow={{ base: 1, tab: 'auto' }} minH={{ base: '400px', tab: 0 }} overflow={{ base: 'hidden', tab: 'visible' }}>
        <Box
          position="absolute" left="50%" top="52%" w="120%" transform="translate(-50%,-50%)" borderRadius="50%" zIndex={0} sx={{ aspectRatio: '1' }}
          bg="radial-gradient(closest-side,#d6ae4e40,#d6ae4e10 55%,transparent 72%)"
        />
        <Box
          aria-hidden="true" position="absolute" top="50%" left={{ base: '50%', tab: '44%' }} transform="translate(-50%,-54%)"
          fontWeight={700} lineHeight={0.8} letterSpacing="-.04em" whiteSpace="nowrap" userSelect="none"
          fontSize={{ base: 'min(52vh,102vw)', tab: 'min(100vh,50vw)' }} color="transparent"
          bgImage={`url(${heroWide})`} bgSize="cover" bgPosition="50% 40%" bgClip="text"
          filter="grayscale(1) sepia(.7) brightness(.55) contrast(1.25)"
          sx={{ WebkitTextStroke: '2px var(--chakra-colors-brand-amber)' }}
          {...enter(num, 1.6, 0.1)}
        >
          {number}
        </Box>
        <Image
          src={image} fetchpriority="high" alt={`${name} ${fullName}, ${position.toLowerCase()} de ${currentClub}`}
          position="absolute" left="50%" bottom={{ base: '-8%', tab: 0 }} h={{ base: '94%', tab: '90%' }} w="auto" maxW="none" transform="translateX(-50%)" zIndex={4}
          filter="drop-shadow(0 30px 50px #000d)" {...enter(slide, 1.3, 0.35)}
        />
        <Box position="absolute" left={0} right={0} bottom={0} h="22%" zIndex={5} bgGradient="linear(to-b, transparent, var(--chakra-colors-brand-dark))" />
        {matches.last && matches.next && <MatchPill last={matches.last} next={matches.next} />}
      </Box>
    </Grid>
  )
}
