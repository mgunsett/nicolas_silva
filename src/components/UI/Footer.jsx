import { Box, Link } from '@chakra-ui/react'
import { LiaLaptopCodeSolid } from 'react-icons/lia'
import { playerData } from '../../data/playerData'

// Footer "Firma": el apellido gigante a todo el ancho (las dos últimas letras en contorno),
// con escudo, links de contacto y "Volver arriba" encima. Crédito del desarrollador al pie.

const CSS_EASE = 'cubic-bezier(0.23,1,0.32,1)'

function toTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: reduced })
  else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

export default function Footer() {
  const { fullName, name, position, currentClub, logoCurrentClub, socialMedia, contact } = playerData
  const links = [
    ...socialMedia.map((s) => ({ n: s.label === 'TransferMarkt' ? 'Transfermarkt' : s.label, u: s.url })),
    ...contact.map((c) => ({ n: c.label.replace(/\b\w/g, (m) => m.toUpperCase()), u: c.url })),
  ]
  const L = fullName
  // El apellido ocupa todo el ancho: el tamaño se reparte según la cantidad de letras
  const size = `${(164.5 / L.length).toFixed(2)}vw`

  return (
    <Box as="footer" sx={sx}>
      <div className="top">
        <div className="id">
          <img src={logoCurrentClub} alt={`Escudo de ${currentClub}`} width="68" height="68" />
          <p>{position}<br /><em>{currentClub}</em></p>
        </div>
        <button type="button" className="up" onClick={toTop}>
          Volver arriba <i aria-hidden="true">↑</i>
        </button>
      </div>

      <nav className="lk" aria-label="Contacto y perfiles">
        {links.map((l) => (
          <a key={l.n} href={l.u} target="_blank" rel="noopener noreferrer">{l.n} ↗</a>
        ))}
      </nav>

      <div className="word" aria-hidden="true" style={{ fontSize: size }}>
        {L.slice(0, -2)}<span>{L.slice(-2)}</span>
      </div>

      <div className="bar">
        <span className="cp">© {new Date().getFullYear()} {name} {fullName} · Todos los derechos reservados</span>
        <span className="dev">
          Desarrollo Web -{' '}
          <Link href="https://matiasgunsett.netlify.app/" isExternal>
            Matias Gunsett <LiaLaptopCodeSolid aria-hidden="true" />
          </Link>
        </span>
      </div>
    </Box>
  )
}

const sx = {
  bg: 'brand.deep', color: 'brand.bone', fontFamily: 'display', position: 'relative', overflow: 'hidden',
  p: { base: '44px 20px 0', lg: '56px 60px 0' },
  '.top, .lk': { position: 'relative', zIndex: 2 },
  '.top': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' },
  '.id': { display: 'flex', alignItems: 'center', gap: '18px' },
  '.id img': { w: { base: '52px', lg: '68px' }, h: { base: '52px', lg: '68px' }, objectFit: 'contain' },
  '.id p': { fontSize: 'clamp(22px,2.4vw,34px)', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05, maxW: '20ch' },
  '.id em': { fontStyle: 'normal', color: 'brand.amber' },
  '.up': {
    display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase',
    color: 'brand.amber', bg: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit',
  },
  '.up i': {
    fontStyle: 'normal', w: '54px', h: '54px', borderRadius: 'full', border: '1.5px solid', borderColor: 'brand.amber', display: 'grid', placeItems: 'center',
    fontSize: '20px', transition: `transform .35s ${CSS_EASE}, background-color .35s ${CSS_EASE}, color .35s ${CSS_EASE}`,
  },
  '.up:active i': { transform: 'scale(.94)' },
  '.lk': { display: 'flex', gap: { base: '18px', lg: '26px' }, mt: '30px', flexWrap: 'wrap' },
  '.lk a': {
    color: 'brand.bone', fontSize: '12px', letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none',
    borderBottom: '1px solid', borderColor: 'brand.line', pb: '4px', transition: 'color .2s, border-color .2s',
  },
  '.word': {
    fontWeight: 700, lineHeight: 0.74, letterSpacing: '-.02em', color: 'brand.amber', textTransform: 'uppercase', m: { base: '32px -.04em 0', lg: '44px -.04em 0' },
    whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', transform: 'translateY(8%)',
  },
  '.word span': { color: 'transparent', WebkitTextStroke: '2px var(--chakra-colors-brand-amber)' },
  '.bar': {
    position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
    p: { base: '16px 20px 20px', lg: '18px 60px 22px' }, mx: { base: '-20px', lg: '-60px' }, bg: 'brand.deep', color: 'brand.gray',
    borderTop: '2px solid', borderColor: 'brand.amber', flexDirection: { base: 'column', lg: 'row' },
  },
  '.cp': { fontSize: '12px', letterSpacing: '.12em', textTransform: 'uppercase', textAlign: 'center' },
  '.dev': { fontSize: '12px', letterSpacing: '.05em', color: 'brand.bone' },
  '.dev a': {
    color: 'dev.green', fontSize: '18px', fontFamily: '"Shadows Into Light", cursive', ml: '2px', transition: 'color .3s', textDecoration: 'none',
  },
  '.dev a svg': { display: 'inline-block', verticalAlign: 'middle', fontSize: '20px', color: 'dev.cream', ml: '2px' },
  'a:focus-visible, button:focus-visible': { outline: '2px solid', outlineColor: 'brand.terra', outlineOffset: '3px' },
  '@media (hover:hover) and (pointer:fine)': {
    '.up:hover i': { transform: 'translateY(-4px)', bg: 'brand.amber', color: 'brand.onAcc' },
    '.lk a:hover': { color: 'brand.amber', borderColor: 'brand.amber' },
    '.dev a:hover': { color: 'rgba(232,213,163,0.5)' },
  },
}
