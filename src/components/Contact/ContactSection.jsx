import { Box } from '@chakra-ui/react'
import { useRef } from 'react'
import { keyframes } from '@emotion/react'
import { useInView } from 'framer-motion'
import { FaInstagram } from 'react-icons/fa'
import { playerData } from '../../data/playerData'

// Contacto "Tarjetas": cuatro tarjetas grandes y clicables — Instagram, Transfermarkt y los dos
// contactos profesionales (el representante deportivo destacado en oro).

const CSS_EASE = 'cubic-bezier(0.23,1,0.32,1)'
const rise = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}`

export default function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const { socialMedia, contact, name } = playerData
  const ig = socialMedia.find((s) => s.label === 'Instagram')
  const tm = socialMedia.find((s) => s.label === 'TransferMarkt')
  const [rep, mkt] = contact

  const cards = [
    ig && { role: `Directo con ${name[0]}${name.slice(1).toLowerCase()}`, n: 'Instagram', h: ig.handle, u: ig.url, logo: <FaInstagram aria-hidden="true" /> },
    tm && { role: 'Ficha profesional', n: 'Transfermarkt', h: 'Trayectoria y valor de mercado', u: tm.url, img: tm.image },
    rep && { role: rep.title === 'Representante Deportivo' ? 'Representante deportivo' : rep.title, n: rep.label, h: rep.handle, f: 'Clubes y transferencias', u: rep.url, img: rep.image, hl: true },
    mkt && { role: 'Contacto de marketing', n: mkt.label, h: mkt.handle, f: 'Marcas y acciones comerciales', u: mkt.url, img: mkt.image },
  ].filter(Boolean)

  return (
    <Box as="section" id="contact" ref={ref} className={inView ? 'in' : ''} sx={sx}>
      <div className="hd rv">
        <div className="k">Hablemos</div>
        <h2>Contacto</h2>
      </div>

      <div className="g">
        {cards.map((c, i) => (
          <a
            key={c.n} href={c.u} target="_blank" rel="noopener noreferrer" className={`card rv${c.hl ? ' hl' : ''}`}
            style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            aria-label={`${c.n}: ${c.h}. Se abre en una pestaña nueva`}
          >
            <span className="wm" aria-hidden="true">{c.img ? <img src={c.img} alt="" /> : c.logo}</span>
            <div className="top">
              <span className="lg">{c.img ? <img src={c.img} alt="" /> : c.logo}</span>
              <span className="ar" aria-hidden="true">↗</span>
            </div>
            <div>
              <div className="r">{c.role}</div>
              <h3>{c.n}</h3>
              <div className="h">{c.h}{c.f ? ` · ${c.f}` : ''}</div>
            </div>
          </a>
        ))}
      </div>
    </Box>
  )
}

const sx = {
  position: 'relative', bg: 'brand.dark', color: 'brand.bone', fontFamily: 'display', overflow: 'hidden',
  p: { base: '64px 20px', lg: '96px 60px' },
  '& > *': { maxW: '1320px', mx: 'auto' },
  '.rv': { opacity: 0 },
  '&.in .rv': { animation: `${rise} 1s ${CSS_EASE} both` },
  '.hd': { mb: { base: '28px', lg: '44px' } },
  '.hd .k': { fontSize: '11px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: 'brand.terra' },
  '.hd h2': { fontWeight: 700, fontSize: 'clamp(44px,5.4vw,84px)', lineHeight: 0.9, color: 'brand.amber', textTransform: 'uppercase', mt: '8px' },
  '.g': { display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '12px' },
  '.card': {
    position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minH: { base: '200px', md: '260px' },
    p: { base: '22px', md: '30px' }, bg: 'brand.bg2', color: 'brand.bone', textDecoration: 'none', overflow: 'hidden', borderRadius: '16px',
    border: '1px solid', borderColor: 'brand.line', transition: `background-color .35s ${CSS_EASE}, transform .16s ease-out`,
  },
  '.card:active': { transform: 'scale(.99)' },
  '.card.hl': { bg: 'brand.amber', borderColor: 'brand.amber', color: 'brand.onAcc' },
  '.top': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  '.lg': { w: '64px', h: '64px', borderRadius: 'full', bg: 'brand.dark', display: 'grid', placeItems: 'center', color: 'brand.amber', fontSize: '28px', overflow: 'hidden' },
  '.lg img': { w: '80%', h: '80%', objectFit: 'contain', maxW: 'none' },
  '.ar': {
    w: '48px', h: '48px', borderRadius: 'full', border: '1.5px solid currentColor', display: 'grid', placeItems: 'center', fontSize: '18px',
    transition: `transform .35s ${CSS_EASE}`,
  },
  '.r': { fontSize: '11px', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'brand.terra' },
  '.card.hl .r': { color: 'brand.onAcc', opacity: 0.7 },
  '.card h3': { mt: '8px', fontSize: 'clamp(26px,2.6vw,40px)', textTransform: 'uppercase', lineHeight: 1, fontWeight: 700 },
  '.h': { mt: '8px', fontSize: '14px', opacity: 0.75 },
  '.wm': {
    position: 'absolute', right: '-24px', bottom: '-34px', w: { base: '140px', md: '190px' }, h: { base: '140px', md: '190px' }, display: 'grid', placeItems: 'center',
    fontSize: { base: '140px', md: '190px' }, lineHeight: 0, opacity: 0.08, pointerEvents: 'none', color: 'brand.bone',
  },
  '.wm img': { w: '100%', h: '100%', objectFit: 'contain', maxW: 'none', filter: 'grayscale(1) brightness(1.6)' },
  '.card.hl .wm': { opacity: 0.22, color: 'brand.onAcc' },
  '.card.hl .wm img': { filter: 'grayscale(1) brightness(.4)', mixBlendMode: 'multiply' },
  'a:focus-visible': { outline: '2px solid', outlineColor: 'brand.terra', outlineOffset: '2px' },
  '@media (hover:hover) and (pointer:fine)': {
    '.card:not(.hl):hover': { bg: '#221d16', borderColor: '#d6ae4e99' },
    '.card:hover .ar': { transform: 'rotate(45deg)' },
  },
  '@media (prefers-reduced-motion: reduce)': { '.rv': { opacity: 1, animation: 'none !important' } },
}
