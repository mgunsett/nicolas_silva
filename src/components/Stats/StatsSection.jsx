import { useMemo, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useInView } from 'framer-motion'
import { playerData } from '../../data/playerData'
import useSeasonStats from '../../hooks/useSeasonStats'
import { seasonTiles, seasonTitle } from '../../lib/seasonTiles'

// Estadísticas "Radar central": el radar de atributos al centro con la media,
// las cifras de la temporada a los lados y la ficha física en una franja abajo.

const EASE = 'cubic-bezier(0.23,1,0.32,1)'
const c = (k) => `var(--chakra-colors-brand-${k})`
const grow = keyframes`from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}`
const rise = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}`

// Geometría del radar (viewBox -100 -10 600 420)
const C = 200, R = 140, MIN = 50
const ang = (i, n) => -Math.PI / 2 + (i * 2 * Math.PI) / n
const pt = (i, n, v) => {
  const r = (R * (v - MIN)) / (100 - MIN)
  return [C + r * Math.cos(ang(i, n)), C + r * Math.sin(ang(i, n))]
}
const poly = (n, f) => Array.from({ length: n }, (_, i) => pt(i, n, f(i)).map((x) => x.toFixed(1)).join(',')).join(' ')

function Radar({ attrs, play }) {
  const n = attrs.length
  return (
    <svg viewBox="-100 -10 600 420" role="img" aria-label={`Radar de atributos: ${attrs.map((a) => `${a.label} ${a.value}`).join(', ')}`}>
      {[60, 70, 80, 90, 100].map((v) => (
        <polygon key={v} points={poly(n, () => v)} fill="none" stroke={v === 100 ? '#d6ae4e66' : '#ffffff14'} />
      ))}
      <text className="scale" x={C + 4} y={pt(0, n, 100)[1] - 4}>100</text>
      <text className="scale" x={C + 4} y={pt(0, n, 75)[1]}>75</text>
      {attrs.map((_, i) => {
        const [x, y] = pt(i, n, 100)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="#ffffff14" />
      })}
      <polygon
        className={`poly${play ? ' play' : ''}`} points={poly(n, (i) => attrs[i].value)}
        fill={c('amber')} fillOpacity=".9" stroke={c('amber')} strokeWidth="2"
      />
      {attrs.map((a, i) => {
        const [x, y] = pt(i, n, 118)
        const side = Math.abs(x - C) >= 5
        const anchor = !side ? 'middle' : x > C ? 'start' : 'end'
        // A los costados, los rótulos de varias palabras van en dos líneas para no salirse
        const words = a.label.toUpperCase().split(' ')
        const lines = side && words.length > 1 ? [words.slice(0, -1).join(' '), words.at(-1)] : [words.join(' ')]
        const y0 = y - (lines.length - 1) * 8
        return (
          <g key={a.label}>
            <text className="lbl" x={x} y={y0} textAnchor={anchor}>
              {lines.map((l, k) => <tspan key={k} x={x} dy={k ? '1.15em' : 0}>{l}</tspan>)}
              <tspan className="val" x={x} dy="1.25em">{a.value}</tspan>
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function StatsSection() {
  // Con totales de la API se muestra la temporada en curso; si no, los fijos de playerData.
  const season = useSeasonStats()
  const tiles = useMemo(() => (season ? seasonTiles(season) : playerData.seasonStats), [season])
  const half = Math.ceil(tiles.length / 2)
  const media = Math.round(playerData.stats.reduce((a, s) => a + s.value, 0) / playerData.stats.length)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })

  const cell = (s, i) => (
    <div key={s.label} className={`n${i === 0 ? ' hl' : ''}`}>
      <b>{s.value}</b>
      <small>{s.label}</small>
    </div>
  )
  const pills = [
    ['Posición', playerData.position],
    ['Pie', playerData.foot],
    ['Edad', `${playerData.age} años`],
    ['Altura', playerData.height],
    ['Peso', playerData.weight],
    ['Origen', playerData.birthPlaceShort],
  ]

  return (
    <Box as="section" id="estadisticas" ref={ref} className={inView ? 'in' : ''} sx={sx}>
      <div className="sh rv">
        <div className="k">{seasonTitle(season, 'Temporada 2025 / 2026')}</div>
        <h2>Estadísticas</h2>
      </div>

      <div className="wrap">
        <div className="side rv" style={{ animationDelay: '.15s' }}>{tiles.slice(0, half).map((s, i) => cell(s, i))}</div>
        <div className="radar">
          <Radar attrs={playerData.stats} play={inView} />
          <div className="media"><b>{media}</b><small>MEDIA</small></div>
        </div>
        <div className="side r rv" style={{ animationDelay: '.25s' }}>{tiles.slice(half).map((s, i) => cell(s, i + half))}</div>
      </div>

      <dl className="pills rv" style={{ animationDelay: '.35s' }}>
        {pills.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>

    </Box>
  )
}

const sx = {
  position: 'relative', bg: 'brand.dark', color: 'brand.bone', fontFamily: 'display', overflow: 'hidden',
  p: { base: '64px 20px', lg: '96px 60px' },
  '& > *': { maxW: '1320px', mx: 'auto' },
  '.rv': { opacity: 0 },
  '&.in .rv': { animation: `${rise} 1s ${EASE} both` },
  '.sh': { mb: { base: '28px', lg: '44px' } },
  '.sh .k': { fontSize: '11px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: 'brand.terra' },
  '.sh h2': { fontWeight: 700, fontSize: 'clamp(44px,5.4vw,84px)', lineHeight: 0.9, color: 'brand.amber', textTransform: 'uppercase', mt: '8px' },
  '.wrap': { display: 'grid', gridTemplateColumns: '1fr minmax(320px,520px) 1fr', gap: '40px', alignItems: 'center' },
  '.side': { display: 'grid', gap: '26px' },
  '.side.r': { textAlign: 'right' },
  '.n': { pb: '20px', borderBottom: '1px solid', borderColor: 'brand.line' },
  '.side .n:last-child': { border: 0, pb: 0 },
  '.n b': { display: 'block', fontSize: 'clamp(48px,5vw,78px)', fontWeight: 700, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' },
  '.n small': { fontSize: '11px', letterSpacing: '.24em', color: 'brand.gray', textTransform: 'uppercase' },
  '.n.hl b': { color: 'brand.terra' },
  '.radar': { position: 'relative' },
  '.radar svg': { w: '100%', h: 'auto', display: 'block', overflow: 'visible' },
  '.poly': { transformOrigin: '200px 200px', opacity: 0 },
  '.poly.play': { animation: `${grow} 1.2s ${EASE} both` },
  '.media': { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none', color: 'brand.onAcc' },
  '.media b': { display: 'block', fontSize: '64px', lineHeight: 0.85, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  '.media small': { fontSize: '10px', fontWeight: 700, letterSpacing: '.24em' },
  '.lbl': { font: '700 11px Nippo, sans-serif', letterSpacing: '.12em', fill: '#e6dcc8' },
  '.val': { font: '700 15px Nippo, sans-serif', fill: c('amber') },
  '.scale': { font: '400 9px Nippo, sans-serif', fill: c('gray') },
  '.pills': {
    display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', mt: '56px', borderTop: '2px solid', borderColor: 'brand.amber',
    background: `linear-gradient(180deg, ${c('bg2')}, transparent)`,
  },
  '.pills div': {
    display: 'flex', flexDirection: 'column', gap: '8px', p: '20px 22px', borderLeft: '1px solid', borderColor: 'brand.line',
  },
  '.pills div:first-of-type': { borderLeft: 0 },
  '.pills dt': { fontSize: '10px', fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: 'brand.gray' },
  '.pills dd': { fontSize: '22px', letterSpacing: '.02em', color: 'brand.bone', fontWeight: 700 },
  '.pills div:first-of-type dd': { color: 'brand.amber' },
  '@media (max-width: 980px)': {
    '.wrap': { gridTemplateColumns: '1fr 1fr', gap: '20px' },
    '.radar': { gridColumn: '1/-1', gridRow: 1, maxW: '420px', m: '0 auto 10px', w: '100%' },
    '.side.r': { textAlign: 'left' },
    '.n b': { fontSize: '40px' },
    '.lbl': { fontSize: '17px' },
    '.val': { fontSize: '21px' },
    '.pills': { gridTemplateColumns: 'repeat(2,1fr)', mt: '36px' },
    '.pills div': { p: '14px 16px' },
    '.pills div:nth-of-type(odd)': { borderLeft: 0 },
    '.pills div:nth-of-type(n+3)': { borderTop: '1px solid', borderColor: 'brand.line' },
    '.pills dd': { fontSize: '18px' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '.rv, .poly': { opacity: 1, animation: 'none !important' },
  },
}
