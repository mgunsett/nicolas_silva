import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, chakra } from '@chakra-ui/react'
import { playerData } from '../../data/playerData'

// Navbar "Cápsula con dorsal": cápsula flotante centrada con el dorsal, una píldora
// dorada que se desliza al link de la sección visible y, en mobile, una hoja inferior.

const EASE = 'cubic-bezier(0.23,1,0.32,1)'

const navLinks = [
  { label: 'Estadísticas', href: '#estadisticas' },
  { label: 'Clubes',       href: '#clubes' },
  { label: 'Videos',       href: '#videos' },
  { label: 'Galería',      href: '#galeria' },
]
const sheetLinks = [...navLinks, { label: 'Contacto', href: '#contact' }]
const instagram = playerData.socialMedia.find((s) => s.label === 'Instagram')

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -20 })
  else target.scrollIntoView({ behavior: 'smooth' })
}

const A = chakra('a')

export default function Navbar() {
  const [active, setActive] = useState(null)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen]     = useState(false)
  const [pill, setPill]     = useState({ x: 0, w: 0, on: false })
  const linksRef            = useRef(null)
  const openRef             = useRef(false)
  openRef.current = open

  // Sección visible → link activo
  useEffect(() => {
    // La activa es la última sección cuyo borde superior ya cruzó el 40% de la pantalla
    const ids = ['#hero', ...sheetLinks.map((l) => l.href)]
    let raf = 0
    const check = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let cur = null
      ids.forEach((h) => {
        const el = document.querySelector(h)
        if (el && el.getBoundingClientRect().top <= line) cur = h
      })
      setActive(cur)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Se esconde al bajar (pasados 400px) y vuelve al subir
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 400 && !openRef.current)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Píldora: se mueve al link activo
  const placePill = useCallback(() => {
    const a = linksRef.current?.querySelector(`a[href="${active}"]`)
    if (a && a.offsetParent) setPill({ x: a.offsetLeft, w: a.offsetWidth, on: true })
    else setPill((p) => ({ ...p, on: false }))
  }, [active])
  useEffect(() => {
    placePill()
    window.addEventListener('resize', placePill)
    return () => window.removeEventListener('resize', placePill)
  }, [placePill])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }
  const current = (href) => (active === href ? { 'aria-current': 'true' } : {})

  return (
    <>
      <Box
        as="nav"
        aria-label="Principal"
        position="fixed"
        top="18px"
        left={{ base: '12px', lg: '50%' }}
        right={{ base: '12px', lg: 'auto' }}
        zIndex={1000}
        display="flex"
        alignItems="center"
        justifyContent={{ base: 'space-between', lg: 'flex-start' }}
        gap="6px"
        p="6px"
        borderRadius="full"
        bg="brand.dark3"
        border="1px solid"
        borderColor="brand.line"
        backdropFilter="blur(14px) saturate(160%)"
        boxShadow="0 10px 40px #07060522"
        fontFamily="display"
        transform={{
          base: hidden ? 'translateY(-140%)' : 'none',
          lg: hidden ? 'translate(-50%,-140%)' : 'translateX(-50%)',
        }}
        transition={`transform .5s ${EASE}`}
      >
        <A href="#hero" onClick={(e) => go(e, '#hero')} display="flex" alignItems="center" gap="10px" pr="14px" textDecoration="none" aria-label={`${playerData.displayName}, ir al inicio`}>
          <Box
            as="span" position="relative" w="40px" h="40px" borderRadius="full" bg="brand.amber" color="brand.onAcc"
            display="grid" placeItems="center" fontWeight={700} fontSize="18px"
            _after={{ content: '""', position: 'absolute', right: '-1px', bottom: '-1px', w: '12px', h: '12px', borderRadius: 'full', bg: 'brand.terra', border: '2px solid', borderColor: 'brand.bone' }}
          >
            {playerData.number}
          </Box>
          <Box as="b" fontWeight={700} fontSize="14px" letterSpacing=".08em" textTransform="uppercase" color="brand.amber">
            {playerData.fullName} <Box as="span" color="brand.gray" fontWeight={400}>· {playerData.positionShort}</Box>
          </Box>
        </A>

        <Box ref={linksRef} position="relative" display={{ base: 'none', lg: 'flex' }}>
          <Box
            as="span" aria-hidden="true" position="absolute" top={0} left={0} h="100%" borderRadius="full" bg="brand.amber" zIndex={0}
            style={{ width: pill.w, transform: `translateX(${pill.x}px)`, opacity: pill.on ? 1 : 0 }}
            transition={`transform .5s ${EASE}, width .5s ${EASE}, opacity .3s`}
          />
          {navLinks.map((l) => (
            <A
              key={l.href} href={l.href} onClick={(e) => go(e, l.href)} {...current(l.href)}
              position="relative" zIndex={1} px="16px" py="11px" fontSize="11px" fontWeight={500} letterSpacing=".16em"
              textTransform="uppercase" textDecoration="none" color="brand.gray" transition="color .3s"
              sx={{
                '&[aria-current]': { color: 'brand.onAcc' },
                '@media (hover:hover) and (pointer:fine)': { '&:not([aria-current]):hover': { color: 'brand.amber' } },
              }}
            >
              {l.label}
            </A>
          ))}
        </Box>

        <A
          href="#contact" onClick={(e) => go(e, '#contact')} display={{ base: 'none', lg: 'block' }} ml="4px" px="18px" py="12px"
          borderRadius="full" bg="brand.terra" color="brand.bone" fontSize="11px" fontWeight={700} letterSpacing=".16em"
          textTransform="uppercase" textDecoration="none" transition={`transform .25s ${EASE}`}
          sx={{ '@media (hover:hover) and (pointer:fine)': { '&:hover': { transform: 'translateY(-1px)' } } }}
        >
          Contacto
        </A>

        <chakra.button
          display={{ base: 'block', lg: 'none' }} w="44px" h="44px" borderRadius="full" bg="brand.amber" position="relative"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="menu-hoja"
          onClick={() => setOpen((v) => !v)}
          sx={{
            i: { position: 'absolute', left: '14px', right: '14px', h: '2px', bg: 'brand.onAcc', transition: `transform .4s ${EASE}` },
            'i:nth-of-type(1)': { top: '17px', transform: open ? 'translateY(4px) rotate(45deg)' : 'none' },
            'i:nth-of-type(2)': { top: '25px', transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none' },
          }}
        >
          <i /><i />
        </chakra.button>
      </Box>

      {/* Hoja inferior (mobile) */}
      <Box
        display={{ base: 'block', lg: 'none' }} position="fixed" inset={0} zIndex={990} bg="#07060566"
        opacity={open ? 1 : 0} pointerEvents={open ? 'auto' : 'none'} transition="opacity .4s"
        onClick={() => setOpen(false)}
      />
      <Box
        id="menu-hoja" role="dialog" aria-label="Menú" aria-hidden={!open}
        display={{ base: 'block', lg: 'none' }} position="fixed" left="10px" right="10px" bottom="10px" zIndex={995}
        bg="brand.bg2" borderRadius="24px" p="10px 10px 14px" boxShadow="0 -10px 50px #07060533" fontFamily="display"
        transform={open ? 'none' : 'translateY(110%)'} transition={`transform .55s ${EASE}`}
        visibility={open ? 'visible' : 'hidden'}
        sx={{ transitionProperty: 'transform, visibility', transitionDuration: open ? '.55s, 0s' : '.55s, 0s', transitionDelay: open ? '0s, 0s' : '0s, .55s' }}
      >
        <Box w="44px" h="4px" borderRadius="4px" bg="brand.line" mx="auto" mt="4px" mb="10px" />
        {sheetLinks.map((l, i) => (
          <A
            key={l.href} href={l.href} onClick={(e) => go(e, l.href)} {...current(l.href)}
            display="flex" alignItems="baseline" gap="14px" px="14px" py="13px" borderRadius="14px" textDecoration="none"
            fontWeight={700} fontSize="26px" textTransform="uppercase" color="brand.amber"
            sx={{ '&[aria-current]': { bg: 'brand.bgRef' } }}
          >
            <Box as="small" fontSize="11px" color="brand.terra" letterSpacing=".1em" fontWeight={500}>0{i + 1}</Box>
            {l.label}
          </A>
        ))}
        <Box display="flex" gap="8px" mt="8px">
          <A
            href="#contact" onClick={(e) => go(e, '#contact')} flex={1} textAlign="center" p="14px" borderRadius="full"
            fontSize="11px" fontWeight={700} letterSpacing=".16em" textTransform="uppercase" textDecoration="none"
            bg="brand.amber" color="brand.onAcc"
          >
            Contacto
          </A>
          {instagram && (
            <A
              href={instagram.url} target="_blank" rel="noopener noreferrer" flex={1} textAlign="center" p="14px" borderRadius="full"
              fontSize="11px" fontWeight={700} letterSpacing=".16em" textTransform="uppercase" textDecoration="none"
              bg="brand.bgRef" color="brand.amber"
            >
              {instagram.handle}
            </A>
          )}
        </Box>
      </Box>
    </>
  )
}
