import { useRef, useState, useEffect, useCallback } from 'react'
import { Box } from '@chakra-ui/react'
import { playerData } from '../../data/playerData'

// Clubes "Slider de cards": una card alta por club, con flechas, arrastre (mouse) o swipe (touch)
// sobre scroll-snap. El club actual abre la fila en oro. Barra de progreso y contador abajo.

const EASE = 'cubic-bezier(0.23,1,0.32,1)'
const pad = (n) => String(n).padStart(2, '0')
// "2022 — 2023" → "2022–23"; "2024 — Actualidad" → "2024–Hoy"
const yr = (y) => {
  const [a, b] = y.split(' — ')
  if (!b) return a
  return `${a}–${/^\d{4}$/.test(b) ? b.slice(2) : 'Hoy'}`
}

const Arrow = ({ dir, ...p }) => (
  <button type="button" {...p}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={dir < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  </button>
)

export default function ClubsSection() {
  const clubs = playerData.clubs
  const N = clubs.length
  const tr = useRef(null)
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [st, setSt] = useState({ idx: 1, p: 0.08, start: true, end: false })

  const step = () => {
    const c = tr.current?.children
    return c && c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : 1
  }
  const update = useCallback(() => {
    const el = tr.current
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

  const by = (d) => tr.current?.scrollBy({ left: d * step(), behavior: 'smooth' })

  // Arrastre con mouse (en touch el swipe es nativo)
  useEffect(() => {
    const move = (e) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      if (Math.abs(dx) > 4 && !d.m) { d.m = true; setDragging(true) }
      if (d.m) tr.current.scrollLeft = d.s - dx
    }
    const up = () => {
      const d = drag.current
      if (!d) return
      if (d.m) {
        setDragging(false)
        tr.current.scrollTo({ left: Math.round(tr.current.scrollLeft / step()) * step(), behavior: 'smooth' })
      }
      drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  return (
    <Box as="section" id="clubes" aria-label="Clubes" sx={sx}>
      <div className="hd">
        <div className="sh">
          <div className="k">Trayectoria</div>
          <h2>Clubes</h2>
        </div>
        <div className="ar">
          <Arrow dir={-1} aria-label="Club anterior" disabled={st.start} onClick={() => by(-1)} />
          <Arrow dir={1} aria-label="Club siguiente" disabled={st.end} onClick={() => by(1)} />
        </div>
      </div>

      <div
        ref={tr} className={`track${dragging ? ' drag' : ''}`} tabIndex={0} role="region"
        aria-label="Clubes de su carrera, deslizables"
        onScroll={() => requestAnimationFrame(update)}
        onPointerDown={(e) => { if (e.pointerType === 'mouse') drag.current = { x: e.clientX, s: tr.current.scrollLeft, m: false } }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); by(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); by(-1) }
        }}
      >
        {clubs.map((c, i) => (
          <article key={`${c.name}-${c.years}`} className={`c${i === 0 ? ' cur' : ''}`}>
            <div className="no">
              <span>{pad(i + 1)} / {pad(N)}</span>
              <b>{i === 0 ? 'Actual' : c.info && c.info.length < 14 ? c.info : ''}</b>
            </div>
            {c.titles[0] && <div className="tt">★ {c.titles[0].replace('Campeón de la ', 'Campeón ')}</div>}
            <img src={c.logo} alt={`Escudo de ${c.name}`} loading="lazy" draggable="false" />
            <div>
              <div className="yr">{yr(c.years)}</div>
              <h3>{c.name}</h3>
              <div className="ct">{c.country}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="ft">
        <div className="bar"><i style={{ transform: `scaleX(${st.p})` }} /></div>
        <div className="cnt"><b>{pad(st.idx)}</b> / {pad(N)}</div>
      </div>
    </Box>
  )
}

const sx = {
  position: 'relative', bg: 'brand.dark', color: 'brand.bone', fontFamily: 'display', overflow: 'hidden',
  p: { base: '64px 20px', lg: '96px 60px' },
  '.hd': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', maxW: '1320px', mx: 'auto' },
  '.sh .k': { fontSize: '11px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: 'brand.terra' },
  '.sh h2': { fontWeight: 700, fontSize: 'clamp(44px,5.4vw,84px)', lineHeight: 0.9, color: 'brand.amber', textTransform: 'uppercase', mt: '8px' },
  '.ar': { display: 'flex', gap: '10px' },
  '.ar button': {
    w: { base: '44px', md: '52px' }, h: { base: '44px', md: '52px' }, borderRadius: 'full', border: '1.5px solid', borderColor: 'brand.amber',
    bg: 'transparent', color: 'brand.amber', display: 'grid', placeItems: 'center', cursor: 'pointer',
    transition: `background-color .2s, color .2s, transform .16s ease-out, opacity .2s`,
  },
  '.ar button:active': { transform: 'scale(.94)' },
  '.ar button:disabled': { opacity: 0.3, cursor: 'default' },
  '.ar svg': { w: '20px', h: '20px' },
  '@media (hover:hover) and (pointer:fine)': {
    '.ar button:not(:disabled):hover': { bg: 'brand.amber', color: 'brand.onAcc' },
    '.c:not(.cur):hover': { borderColor: '#d6ae4e99' },
    '.c:hover img': { transform: 'translateY(-6px) scale(1.04)' },
  },
  '.track': {
    mt: { base: '28px', lg: '40px' }, mx: { base: '-20px', lg: '-60px' }, px: { base: '20px', lg: '60px' }, pb: '6px',
    display: 'flex', gap: { base: '12px', lg: '18px' }, overflowX: 'auto', scrollSnapType: 'x mandatory',
    scrollPaddingInline: { base: '20px', lg: '60px' }, scrollbarWidth: 'none', cursor: 'grab', overscrollBehaviorX: 'contain',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  '.track.drag': { cursor: 'grabbing', scrollSnapType: 'none' },
  '.track.drag *': { pointerEvents: 'none' },
  '.c': {
    flex: { base: '0 0 68vw', md: '0 0 clamp(240px,22vw,300px)' }, aspectRatio: '3/4.2', scrollSnapAlign: 'start', position: 'relative',
    borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(170deg,#221d16,#1A1712 60%)', border: '1px solid', borderColor: 'brand.line',
    p: { base: '18px', lg: '22px' }, display: 'flex', flexDirection: 'column',
    transition: `border-color .3s`,
  },
  '.c:before': {
    content: '""', position: 'absolute', left: '50%', top: '40%', w: '80%', aspectRatio: '1', transform: 'translate(-50%,-50%)',
    borderRadius: '50%', background: 'radial-gradient(closest-side,#d6ae4e26,transparent)', pointerEvents: 'none',
  },
  '.c .no': { display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: 'brand.gray' },
  '.c .no b': { color: 'brand.terra' },
  '.c img': {
    position: 'relative', w: '58%', aspectRatio: '1', objectFit: 'contain', m: 'auto', maxW: 'none',
    filter: 'drop-shadow(0 16px 24px #000a)', transition: `transform .5s ${EASE}`,
  },
  '.c .yr': { fontSize: { base: '36px', lg: '44px' }, fontWeight: 700, lineHeight: 0.9, color: 'transparent', WebkitTextStroke: '1px var(--chakra-colors-brand-amber)', letterSpacing: '-.01em' },
  '.c h3': { mt: '10px', fontSize: { base: '17px', lg: '20px' }, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05 },
  '.c .ct': { mt: '6px', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'brand.gray' },
  '.c .tt': {
    position: 'absolute', top: { base: '46px', lg: '52px' }, left: { base: '18px', lg: '22px' }, right: { base: '18px', lg: '22px' }, textAlign: 'center',
    fontSize: '11px', color: 'brand.onAcc', bg: 'brand.amber', borderRadius: 'full', p: '6px 10px', fontWeight: 700, letterSpacing: '.06em', zIndex: 1,
  },
  '.c.cur': { bg: 'brand.amber', borderColor: 'brand.amber', color: 'brand.onAcc' },
  '.c.cur:before': { background: 'radial-gradient(closest-side,#fff6,transparent)' },
  '.c.cur .no, .c.cur .ct, .c.cur .no b': { color: 'brand.onAcc' },
  '.c.cur .yr': { WebkitTextStroke: '1px var(--chakra-colors-brand-onAcc)' },
  '.ft': { mt: '26px', display: 'flex', alignItems: 'center', gap: '20px', maxW: '1320px', mx: 'auto' },
  '.bar': { flex: 1, h: '2px', bg: 'brand.line', position: 'relative', overflow: 'hidden' },
  '.bar i': { position: 'absolute', inset: 0, bg: 'brand.amber', transformOrigin: 'left', transition: `transform .3s ${EASE}` },
  '.cnt': { fontSize: '12px', fontWeight: 700, letterSpacing: '.2em', color: 'brand.gray', fontVariantNumeric: 'tabular-nums' },
  '.cnt b': { color: 'brand.bone' },
}
