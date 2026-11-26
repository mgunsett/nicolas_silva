import { useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { playerData } from '../../data/playerData'
import useMatches from '../../hooks/useMatches'
import useSeasonStats from '../../hooks/useSeasonStats'
import { seasonTiles } from '../../lib/seasonTiles'

// Hero "Split en capas": texto a la izquierda; a la derecha una escena en profundidad.
// Atrás el dorsal gigante relleno con una foto de cancha; adelante, el recorte del jugador.

const EASE = 'cubic-bezier(0.23,1,0.32,1)'
const c = (k) => `var(--chakra-colors-brand-${k})`

const rv  = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}`
const seg = keyframes`from{opacity:0;transform:scaleY(.2)}`
const num = keyframes`from{opacity:0;transform:translate(-50%,-48%) scale(1.08)}`
const pl  = keyframes`from{opacity:0;transform:translateX(-10%)}`

// Tres cifras de la temporada: partidos (destacado), asistencias y valoración
const PICK = ['Partidos', 'Asistencias', 'Valoración']
function heroStats(season) {
  const tiles = season ? seasonTiles(season) : playerData.seasonStats
  const pickd = PICK.map((l) => tiles.find((t) => t.label === l)).filter(Boolean)
  return pickd.concat(tiles.filter((t) => !pickd.includes(t))).slice(0, 3)
}

const score = (m) => (m.homeScore ?? null) !== null && (m.awayScore ?? null) !== null

export default function Hero() {
  const season = useSeasonStats()
  const { matches } = useMatches()
  const stats = useMemo(() => heroStats(season), [season])
  const top = useMemo(() => [...playerData.stats].sort((a, b) => b.value - a.value)[0], [])
  const lit = Math.round(top.value / 5)
  const { last, next } = matches

  const d = (s) => ({ animationDelay: `${s}s` })

  return (
    <Box as="section" id="hero" aria-label="Presentación" sx={sx}>
      <div className="txt">
        <div className="club rv" style={d(.2)}>
          <img src={playerData.logoCurrentClub} alt={`Escudo de ${playerData.currentClub}`} width="52" height="52" />
          <div>
            <b>{playerData.position}</b>
            <span>{playerData.currentClub} · {playerData.league}</span>
          </div>
        </div>

        <h1>
          <span className="n1 rv" style={d(.3)}>{playerData.name}</span>
          <span className="n2 rv" style={d(.38)}>{playerData.fullName}</span>
        </h1>

        <div className="gauge rv" style={d(.54)}>
          <div className="hd"><span>{top.label}</span><b>{top.value}</b></div>
          <div className="bar" role="img" aria-label={`${top.label}: ${top.value} de 100`}>
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} className={i < lit ? 'on' : ''} style={{ animationDelay: `${0.9 + i * 0.03}s` }} />
            ))}
          </div>
        </div>

        <dl className="stats rv" style={d(.62)}>
          {stats.map((s, i) => (
            <div key={s.label} className={i === 0 ? 'hl' : ''}>
              <dd>{s.value}</dd>
              <dt>{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="ctas rv" style={d(.7)}>
          <a className="btn solid" href="#videos" onClick={go('#videos')}>Ver jugadas</a>
          <a className="btn" href="#contact" onClick={go('#contact')}>Contacto</a>
        </div>
      </div>

      <div className="scene" style={{ '--ph': `url(${playerData.heroWide})` }}>
        <div className="glow" />
        <div className="num" aria-hidden="true">{playerData.number}</div>
        <img
          className="pl" src={playerData.image} fetchpriority="high"
          alt={`${playerData.name} ${playerData.fullName}, ${playerData.position.toLowerCase()} de ${playerData.currentClub}`}
        />
        <div className="fade" />
        {last && next && (
          <div className="mt rv" style={d(1)}>
            <span>
              <small>Último</small>
              {last.home.name} {score(last) ? <em>{last.homeScore}-{last.awayScore}</em> : 'vs'} {last.away.name}
            </span>
            <i />
            <span><small>Próximo</small>{next.home.name} vs {next.away.name} · {next.date}</span>
          </div>
        )}
      </div>
    </Box>
  )
}

function go(href) {
  return (e) => {
    const t = document.querySelector(href)
    if (!t) return
    e.preventDefault()
    if (window.__lenis) window.__lenis.scrollTo(t, { offset: -20 })
    else t.scrollIntoView({ behavior: 'smooth' })
  }
}

const sx = {
  position: 'relative', height: 'calc(100 * var(--sv))', minHeight: '640px', overflow: 'hidden',
  display: 'grid', gridTemplateColumns: '.95fr 1.05fr', bg: 'brand.dark', fontFamily: 'display', color: 'brand.bone',
  '.rv': { opacity: 0, transform: 'translateY(28px)', animation: `${rv} 1s ${EASE} forwards` },
  '.txt': { position: 'relative', zIndex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: '96px 32px 40px 60px' },
  h1: { mt: '20px', fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.86 },
  '.n1': { display: 'block', fontSize: 'clamp(30px,3.4vw,58px)', color: 'brand.bone', letterSpacing: '.04em' },
  '.n2': { display: 'block', fontSize: 'clamp(84px,10.4vw,180px)', color: 'brand.amber', ml: '-.04em' },
  '.club': { display: 'flex', alignItems: 'center', gap: '14px' },
  '.club img': { w: '52px', h: '52px', objectFit: 'contain' },
  '.club b': { display: 'block', fontSize: '18px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'brand.bone' },
  '.club span': { display: 'block', mt: '4px', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'brand.gray' },
  // Atributo estrella en barra segmentada
  '.gauge': { mt: '26px', maxW: '440px' },
  '.gauge .hd': { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '10px', letterSpacing: '.24em', textTransform: 'uppercase', color: 'brand.gray' },
  '.gauge .hd b': { fontSize: '30px', letterSpacing: 0, color: 'brand.bone' },
  '.gauge .bar': { mt: '8px', display: 'grid', gridTemplateColumns: 'repeat(20,1fr)', gap: '3px' },
  '.gauge .bar span': { h: '10px', bg: 'brand.brownLight', animation: `${seg} .5s ${EASE} both` },
  '.gauge .bar span.on': { bg: 'brand.amber' },
  '.gauge .bar span.on:has(+ span:not(.on))': { bg: 'brand.terra' },
  '.stats': { display: 'flex', mt: '22px', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'brand.line', maxW: '440px' },
  '.stats div': { flex: 1, py: '12px', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-end' },
  '.stats div+div': { pl: '18px', borderLeft: '1px solid', borderColor: 'brand.line' },
  '.stats dd': { fontSize: '24px', fontWeight: 700, color: 'brand.bone', fontVariantNumeric: 'tabular-nums' },
  '.stats dt': { fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'brand.gray' },
  '.stats .hl dd': { color: 'brand.terra' },
  '.ctas': { display: 'flex', gap: '12px', mt: '26px' },
  '.btn': {
    fontWeight: 700, fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', p: '15px 24px', borderRadius: 'full',
    border: '1.5px solid', borderColor: 'brand.amber', color: 'brand.amber', textDecoration: 'none',
    transition: 'transform .16s ease-out, background-color .2s ease, color .2s ease',
  },
  '.btn.solid': { bg: 'brand.amber', color: 'brand.onAcc' },
  '.btn:active': { transform: 'scale(.97)' },
  '@media (hover:hover) and (pointer:fine)': {
    '.btn:hover': { bg: 'brand.amber', color: 'brand.onAcc' },
    '.btn.solid:hover': { bg: 'transparent', color: 'brand.amber' },
  },
  // Escena
  '.scene': { position: 'relative' },
  '.glow': {
    position: 'absolute', left: '50%', top: '52%', w: '120%', aspectRatio: '1', transform: 'translate(-50%,-50%)', borderRadius: '50%', zIndex: 0,
    background: 'radial-gradient(closest-side,#d6ae4e40,#d6ae4e10 55%,transparent 72%)',
  },
  '.num': {
    position: 'absolute', left: '44%', top: '50%', transform: 'translate(-50%,-54%)', fontWeight: 700, lineHeight: 0.8,
    letterSpacing: '-.04em', whiteSpace: 'nowrap', fontSize: 'min(100vh,50vw)', color: 'transparent',
    background: 'var(--ph) 50% 40%/cover', WebkitBackgroundClip: 'text', backgroundClip: 'text',
    WebkitTextStroke: `2px ${c('amber')}`, filter: 'grayscale(1) sepia(.7) brightness(.55) contrast(1.25)',
    animation: `${num} 1.6s ${EASE} .1s both`, userSelect: 'none',
  },
  '.pl': {
    position: 'absolute', left: '50%', bottom: 0, h: '90%', w: 'auto', maxW: 'none', transform: 'translateX(-50%)', zIndex: 4,
    filter: 'drop-shadow(0 30px 50px #000d)', animation: `${pl} 1.3s ${EASE} .35s both`,
  },
  '.fade': { position: 'absolute', inset: 'auto 0 0 0', h: '22%', background: `linear-gradient(transparent, ${c('dark')})`, zIndex: 5 },
  '.mt': {
    position: 'absolute', right: '28px', bottom: '28px', zIndex: 6, display: 'flex', gap: '18px', alignItems: 'center',
    fontSize: '12px', color: 'brand.bone', bg: '#0f0d0acc', border: '1px solid', borderColor: 'brand.line', borderRadius: 'full',
    p: '10px 18px', backdropFilter: 'blur(8px)',
  },
  '.mt small': { fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'brand.gray', mr: '6px' },
  '.mt em': { fontStyle: 'normal', color: 'brand.terra', fontWeight: 700 },
  '.mt i': { w: '1px', h: '14px', bg: 'brand.line' },
  '@media (prefers-reduced-motion: reduce)': {
    '.rv, .num, .pl, .gauge .bar span': { animation: 'none', opacity: 1 },
    '.rv': { transform: 'none' },
  },
  '@media (max-width: 820px)': {
    gridTemplateColumns: '1fr', gridTemplateRows: '50vh auto', height: 'auto', minHeight: 'calc(100 * var(--sv))',
    '.scene': { gridRow: 1, minHeight: '400px', overflow: 'hidden' },
    '.num': { left: '50%', fontSize: 'min(60vh,118vw)' },
    '.pl': { h: '94%' },
    '.mt': { display: 'none' },
    '.txt': { gridRow: 2, p: '0 20px 28px' },
    h1: { mt: '14px' },
    '.n1': { fontSize: '8vw' },
    '.n2': { fontSize: '22vw' },
    '.club img': { w: '40px', h: '40px' },
    '.club b': { fontSize: '14px' },
    '.club span': { fontSize: '9px' },
    '.gauge': { mt: '16px' },
    '.gauge .hd b': { fontSize: '24px' },
    '.gauge .bar span': { h: '8px' },
    '.stats': { mt: '16px' },
    '.stats dd': { fontSize: '20px' },
    '.ctas': { mt: '18px' },
    '.btn': { flex: 1, textAlign: 'center', p: '14px 10px' },
  },
}
