import { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { keyframes } from '@emotion/react'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { playerData } from '../../data/playerData'

// Videos "Highlight + reels": arriba un video principal de YouTube en formato cine que se
// reproduce en el lugar; abajo 3 reels de Instagram que se abren en un visor.

const EASE = [0.23, 1, 0.32, 1]
const CSS_EASE = 'cubic-bezier(0.23,1,0.32,1)'
const rise = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}`
const ring = keyframes`0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(1.6);opacity:0}`

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
)

function Featured({ video }) {
  const [playing, setPlaying] = useState(false)
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`)
  const name = `${playerData.name} ${playerData.fullName}`

  return (
    <div className="feat rv" style={{ animationDelay: '.1s' }}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`${name}: ${video.title}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="poster" onClick={() => setPlaying(true)} aria-label={`Reproducir ${video.title} de ${name}`}>
          <img
            src={poster} alt="" loading="lazy"
            // maxres no existe en todos los videos; si falla, la foto local
            onError={() => setPoster(video.cover)}
          />
          <span className="shade" />
          <span className="play"><i /><PlayIcon /></span>
          <span className="info">
            <span className="k"><FaYoutube aria-hidden="true" /> Highlight principal</span>
            <span className="t">{video.title}</span>
            <span className="s">{video.subtitle}</span>
          </span>
        </button>
      )}
    </div>
  )
}

function Reel({ v, i, onOpen }) {
  return (
    <button type="button" className="reel rv" style={{ animationDelay: `${0.25 + i * 0.08}s` }} onClick={() => onOpen(v)} aria-label={`Ver reel: ${v.title}`}>
      <img src={v.cover} alt="" loading="lazy" />
      <span className="shade" />
      <span className="top">
        <span className="n">0{i + 1}</span>
        <FaInstagram aria-hidden="true" />
      </span>
      <span className="mini"><PlayIcon /></span>
      <span className="info">
        <span className="c">{v.category}</span>
        <span className="t">{v.title}</span>
      </span>
    </button>
  )
}

export default function VideosSection() {
  const featured = playerData.featuredVideo
  const reels = playerData.videos.slice(0, 3)
  const instagram = playerData.socialMedia.find((s) => s.label === 'Instagram')
  const [open, setOpen] = useState(null)
  const ref = useRef(null)
  const closeRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })

  // Visor: Escape cierra, foco en cerrar, scroll de fondo en pausa
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    window.__lenis?.stop()
    closeRef.current?.focus()
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start() }
  }, [open])

  if (!featured && !reels.length) return null

  return (
    <Box as="section" id="videos" ref={ref} className={inView ? 'in' : ''} sx={sx}>
      <div className="hd rv">
        <div>
          <div className="k">Highlights</div>
          <h2>Videos</h2>
        </div>
        <a className="yt" href={`https://youtu.be/${featured.youtubeId}`} target="_blank" rel="noopener noreferrer">
          <FaYoutube aria-hidden="true" /> Ver en YouTube
        </a>
      </div>

      {featured && <Featured video={featured} />}

      {reels.length > 0 && (
        <>
          <div className="rh rv" style={{ animationDelay: '.2s' }}>
            <span>Reels</span>
            {instagram && (
              <a href={instagram.url} target="_blank" rel="noopener noreferrer"><FaInstagram aria-hidden="true" /> {instagram.handle}</a>
            )}
          </div>
          <div className="reels">
            {reels.map((v, i) => <Reel key={v.id} v={v} i={i} onOpen={setOpen} />)}
          </div>
        </>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="viewer" role="dialog" aria-modal="true" aria-label={open.title}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            onClick={() => setOpen(null)}
            style={vStyle}
          >
            <button ref={closeRef} type="button" aria-label="Cerrar video" onClick={() => setOpen(null)} style={closeStyle}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={frameStyle}
            >
              <iframe
                src={`https://www.instagram.com/reel/${open.instagramId}/embed`}
                title={open.fullTitle || open.title}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

// Visor (estilos en línea porque se monta fuera del flujo del sx)
const vStyle = {
  position: 'fixed', inset: 0, zIndex: 2000, background: '#070605f2', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 16px 24px',
}
const closeStyle = {
  position: 'absolute', top: 16, right: 16, width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center',
  background: '#1A1712', color: '#F4EDE0', border: '1px solid #d6ae4e40', cursor: 'pointer',
}
const frameStyle = {
  width: 'min(420px, 100%, calc((100svh - 100px) * 9 / 16))', aspectRatio: '9 / 16', borderRadius: 16, overflow: 'hidden',
  background: '#000', boxShadow: '0 40px 120px #000c',
}

const sx = {
  position: 'relative', bg: 'brand.dark', color: 'brand.bone', fontFamily: 'display',
  p: { base: '64px 20px', lg: '96px 60px' },
  '& > *': { maxW: '1320px', mx: 'auto' },
  '.rv': { opacity: 0 },
  '&.in .rv': { animation: `${rise} 1s ${CSS_EASE} both` },
  '.hd': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', mb: { base: '24px', lg: '36px' } },
  '.hd .k': { fontSize: '11px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: 'brand.terra' },
  '.hd h2': { fontWeight: 700, fontSize: 'clamp(44px,5.4vw,84px)', lineHeight: 0.9, color: 'brand.amber', textTransform: 'uppercase', mt: '8px' },
  '.yt': {
    display: { base: 'none', md: 'inline-flex' }, alignItems: 'center', gap: '10px', p: '13px 20px', borderRadius: 'full',
    border: '1.5px solid', borderColor: 'brand.line', color: 'brand.bone', fontSize: '11px', fontWeight: 700, letterSpacing: '.18em',
    textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color .2s, color .2s',
  },
  '.yt svg': { color: 'brand.terra', fontSize: '16px' },

  // Highlight principal
  '.feat': {
    position: 'relative', aspectRatio: { base: '4/5', md: '16/9' }, maxH: '78svh', w: '100%', borderRadius: { base: '16px', lg: '22px' },
    overflow: 'hidden', bg: 'brand.deep', border: '1px solid', borderColor: 'brand.line', boxShadow: '0 40px 90px #000a',
  },
  '.feat iframe': { position: 'absolute', inset: 0, w: '100%', h: '100%', border: 0 },
  '.poster': { position: 'absolute', inset: 0, w: '100%', h: '100%', p: 0, border: 0, bg: 'transparent', cursor: 'pointer', textAlign: 'left', color: 'inherit' },
  '.poster img': { position: 'absolute', inset: 0, w: '100%', h: '100%', objectFit: 'cover', transition: `transform 1.2s ${CSS_EASE}` },
  '.poster .shade': {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg,#0F0D0A55 0%,transparent 30%,transparent 45%,#0F0D0Aee 100%), linear-gradient(90deg,#0F0D0Acc 0%,transparent 55%)',
  },
  '.poster .play': {
    position: 'absolute', left: '50%', top: { base: '40%', md: '50%' }, transform: 'translate(-50%,-50%)', w: { base: '72px', lg: '104px' }, h: { base: '72px', lg: '104px' },
    borderRadius: 'full', bg: 'brand.amber', color: 'brand.onAcc', display: 'grid', placeItems: 'center',
    boxShadow: '0 20px 50px #000a', transition: `transform .4s ${CSS_EASE}`,
  },
  '.poster .play svg': { w: '38%', h: '38%', ml: '6%' },
  '.poster .play i': { position: 'absolute', inset: 0, borderRadius: 'full', border: '2px solid', borderColor: 'brand.amber', animation: `${ring} 2.4s ease-out infinite` },
  '.poster .info': { position: 'absolute', left: { base: '18px', lg: '40px' }, right: { base: '18px', lg: '40px' }, bottom: { base: '16px', lg: '34px' }, display: 'flex', flexDirection: 'column' },
  '.poster .k': { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: { base: '9px', lg: '11px' }, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: 'brand.amber' },
  '.poster .k svg': { color: 'brand.terra', fontSize: '1.4em' },
  '.poster .t': { mt: '8px', fontSize: { base: '28px', md: '44px', lg: '64px' }, fontWeight: 700, lineHeight: 0.9, textTransform: 'uppercase', color: 'brand.bone' },
  '.poster .s': { mt: '10px', fontSize: { base: '10px', lg: '12px' }, letterSpacing: '.2em', textTransform: 'uppercase', color: 'brand.gray' },

  // Reels
  '.rh': {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: { base: '36px', lg: '56px' }, mb: '16px',
    pb: '12px', borderBottom: '1px solid', borderColor: 'brand.line',
  },
  '.rh span': { fontSize: '11px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: 'brand.gray' },
  '.rh a': { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '.08em', color: 'brand.amber', textDecoration: 'none' },
  '.reels': {
    display: 'grid', gridTemplateColumns: { base: 'repeat(3, 72vw)', md: 'repeat(3,1fr)' }, gap: { base: '12px', lg: '20px' },
    overflowX: { base: 'auto', md: 'visible' }, scrollSnapType: 'x mandatory', mx: { base: '-20px', md: 'auto' }, px: { base: '20px', md: 0 },
    scrollPaddingInline: '20px', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
  },
  '.reel': {
    position: 'relative', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', border: '1px solid', borderColor: 'brand.line',
    bg: 'brand.bg2', p: 0, cursor: 'pointer', textAlign: 'left', color: 'inherit', scrollSnapAlign: 'start',
    transition: `transform .16s ease-out, border-color .3s`,
  },
  '.reel:active': { transform: 'scale(.98)' },
  '.reel img': { position: 'absolute', inset: 0, w: '100%', h: '100%', objectFit: 'cover', objectPosition: 'center 35%', transition: `transform .9s ${CSS_EASE}` },
  '.reel .shade': { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0F0D0A88 0%,transparent 28%,transparent 50%,#0F0D0Af2 100%)' },
  '.reel .top': { position: 'absolute', top: '14px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'brand.bone', fontSize: '18px' },
  '.reel .n': { fontSize: '11px', fontWeight: 700, letterSpacing: '.24em', color: 'brand.amber' },
  '.reel .mini': {
    position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', w: '56px', h: '56px', borderRadius: 'full',
    bg: '#0F0D0A99', border: '1.5px solid', borderColor: 'brand.amber', color: 'brand.amber', display: 'grid', placeItems: 'center',
    backdropFilter: 'blur(6px)', transition: `background-color .3s, color .3s, transform .4s ${CSS_EASE}`,
  },
  '.reel .mini svg': { w: '22px', h: '22px', ml: '3px' },
  '.reel .info': { position: 'absolute', left: '16px', right: '16px', bottom: '16px', display: 'flex', flexDirection: 'column' },
  '.reel .c': { fontSize: '9px', fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: 'brand.terra' },
  '.reel .t': { mt: '6px', fontSize: { base: '17px', lg: '20px' }, fontWeight: 700, lineHeight: 1.05, textTransform: 'uppercase', color: 'brand.bone' },

  '@media (hover:hover) and (pointer:fine)': {
    '.yt:hover': { borderColor: 'brand.amber', color: 'brand.amber' },
    '.poster:hover img': { transform: 'scale(1.04)' },
    '.poster:hover .play': { transform: 'translate(-50%,-50%) scale(1.06)' },
    '.reel:hover': { borderColor: '#d6ae4e99' },
    '.reel:hover img': { transform: 'scale(1.05)' },
    '.reel:hover .mini': { bg: 'brand.amber', color: 'brand.onAcc', transform: 'translate(-50%,-50%) scale(1.06)' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '.rv': { opacity: 1, animation: 'none !important' },
    '.poster .play i': { animation: 'none' },
  },
}
