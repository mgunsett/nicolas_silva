import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Grid, Image, Link, Text, chakra } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { keyframes } from '@emotion/react'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { playerData } from '../../data/playerData'
import { EASE, EASE_ARR, fine, hoverKids, useReveal } from '../../lib/motion'
import SectionHeader from '../UI/SectionHeader'

// Videos "Highlight + reels": arriba un video principal de YouTube en formato cine que se
// reproduce en el lugar; abajo 3 reels de Instagram que se abren en un visor.

const MotionBox = motion(Box)
const ring = keyframes`0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(1.6);opacity:0}`

const PlayIcon = (props) => (
  <chakra.svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></chakra.svg>
)

function FeaturedVideo({ video }) {
  const [playing, setPlaying] = useState(false)
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`)
  const name = `${playerData.name} ${playerData.fullName}`

  return (
    <Box
      position="relative" w="100%" maxH="78svh" overflow="hidden" bg="brand.deep" border="1px solid" borderColor="brand.line"
      borderRadius={{ base: '16px', tab: '22px' }} boxShadow="0 40px 90px #000a" sx={{ aspectRatio: { base: '4 / 5', tab: '16 / 9' } }}
    >
      {playing ? (
        <chakra.iframe
          position="absolute" inset={0} w="100%" h="100%" border={0}
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`${name}: ${video.title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
        />
      ) : (
        <chakra.button
          type="button" onClick={() => setPlaying(true)} aria-label={`Reproducir ${video.title} de ${name}`}
          position="absolute" inset={0} w="100%" h="100%" p={0} border={0} bg="transparent" cursor="pointer" textAlign="left" color="inherit"
          sx={hoverKids({}, { '[data-zoom]': { transform: 'scale(1.04)' }, '[data-play]': { transform: 'translate(-50%,-50%) scale(1.06)' } })}
        >
          <Image
            data-zoom src={poster} alt="" loading="lazy" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" maxW="none"
            transition={`transform 1.2s ${EASE}`}
            // maxres no existe en todos los videos; si falla, la foto local
            onError={() => setPoster(video.cover)}
          />
          <Box
            position="absolute" inset={0}
            bg="linear-gradient(180deg,#0F0D0A55 0%,transparent 30%,transparent 45%,#0F0D0Aee 100%), linear-gradient(90deg,#0F0D0Acc 0%,transparent 55%)"
          />
          <Box
            data-play position="absolute" left="50%" top={{ base: '40%', tab: '50%' }} transform="translate(-50%,-50%)" boxSize={{ base: '72px', tab: '104px' }}
            borderRadius="full" bg="brand.amber" color="brand.onAcc" display="grid" placeItems="center" boxShadow="0 20px 50px #000a" transition={`transform .4s ${EASE}`}
          >
            <Box position="absolute" inset={0} borderRadius="full" border="2px solid" borderColor="brand.amber" animation={`${ring} 2.4s ease-out infinite`} sx={{ '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />
            <PlayIcon w="38%" h="38%" ml="6%" />
          </Box>
          <Flex position="absolute" left={{ base: '18px', tab: '40px' }} right={{ base: '18px', tab: '40px' }} bottom={{ base: '16px', tab: '34px' }} direction="column">
            <Flex as="span" align="center" gap="8px" fontSize={{ base: '9px', tab: '11px' }} fontWeight={700} letterSpacing=".26em" textTransform="uppercase" color="brand.amber">
              <Box as={FaYoutube} color="brand.terra" fontSize="1.4em" aria-hidden="true" /> Highlight principal
            </Flex>
            <Text as="span" mt="8px" fontSize={{ base: '28px', md: '44px', tab: '64px' }} fontWeight={700} lineHeight={0.9} textTransform="uppercase" color="brand.bone">{video.title}</Text>
            <Text as="span" mt="10px" fontSize={{ base: '10px', tab: '12px' }} letterSpacing=".2em" textTransform="uppercase" color="brand.gray">{video.subtitle}</Text>
          </Flex>
        </chakra.button>
      )}
    </Box>
  )
}

function ReelCard({ video, index, onOpen, rv }) {
  return (
    <chakra.button
      type="button" onClick={() => onOpen(video)} aria-label={`Ver reel: ${video.title}`}
      position="relative" overflow="hidden" p={0} textAlign="left" color="inherit" cursor="pointer" borderRadius="16px" border="1px solid" borderColor="brand.line" bg="brand.bg2"
      transition="transform .16s ease-out, border-color .3s" _active={{ transform: 'scale(.98)' }}
      sx={{ aspectRatio: '4 / 5', scrollSnapAlign: 'start', ...hoverKids({ borderColor: '#d6ae4e99' }, { '[data-zoom]': { transform: 'scale(1.05)' }, '[data-mini]': { bg: 'brand.amber', color: 'brand.onAcc', transform: 'translate(-50%,-50%) scale(1.06)' } }) }}
      {...rv(0.25 + index * 0.08)}
    >
      <Image data-zoom src={video.cover} alt="" loading="lazy" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" objectPosition="center 35%" maxW="none" transition={`transform .9s ${EASE}`} />
      <Box position="absolute" inset={0} bg="linear-gradient(180deg,#0F0D0A88 0%,transparent 28%,transparent 50%,#0F0D0Af2 100%)" />
      <Flex position="absolute" top="14px" left="16px" right="16px" justify="space-between" align="center" color="brand.bone" fontSize="18px">
        <Text as="span" fontSize="11px" fontWeight={700} letterSpacing=".24em" color="brand.amber">0{index + 1}</Text>
        <FaInstagram aria-hidden="true" />
      </Flex>
      <Box
        data-mini position="absolute" left="50%" top="46%" transform="translate(-50%,-50%)" boxSize="56px" borderRadius="full" bg="#0F0D0A99" border="1.5px solid" borderColor="brand.amber"
        color="brand.amber" display="grid" placeItems="center" backdropFilter="blur(6px)" transition={`background-color .3s, color .3s, transform .4s ${EASE}`}
      >
        <PlayIcon boxSize="22px" ml="3px" />
      </Box>
      <Flex position="absolute" left="16px" right="16px" bottom="16px" direction="column">
        <Text as="span" fontSize="9px" fontWeight={700} letterSpacing=".24em" textTransform="uppercase" color="brand.terra">{video.category}</Text>
        <Text as="span" mt="6px" fontSize={{ base: '17px', tab: '20px' }} fontWeight={700} lineHeight={1.05} textTransform="uppercase" color="brand.bone">{video.title}</Text>
      </Flex>
    </chakra.button>
  )
}

function ReelViewer({ video, onClose }) {
  const closeRef = useRef(null)
  // Escape cierra, el foco va al botón de cerrar y el scroll de fondo queda en pausa
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    window.__lenis?.stop()
    closeRef.current?.focus()
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start() }
  }, [onClose])

  return (
    <MotionBox
      role="dialog" aria-modal="true" aria-label={video.title} position="fixed" inset={0} zIndex={2000} bg="#070605f2" backdropFilter="blur(10px)"
      display="flex" alignItems="center" justifyContent="center" p="64px 16px 24px" onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
    >
      <chakra.button
        ref={closeRef} type="button" aria-label="Cerrar video" onClick={onClose} position="absolute" top="16px" right="16px" boxSize="48px" borderRadius="full"
        display="grid" placeItems="center" bg="brand.bg2" color="brand.bone" border="1px solid" borderColor="brand.line" cursor="pointer"
      >
        <FiX size={22} aria-hidden="true" />
      </chakra.button>
      <MotionBox
        w="min(420px, 100%, calc((100svh - 100px) * 9 / 16))" borderRadius="16px" overflow="hidden" bg="#000" boxShadow="0 40px 120px #000c" sx={{ aspectRatio: '9 / 16' }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45, ease: EASE_ARR }}
      >
        <chakra.iframe
          w="100%" h="100%" border={0} src={`https://www.instagram.com/reel/${video.instagramId}/embed`} title={video.fullTitle || video.title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
        />
      </MotionBox>
    </MotionBox>
  )
}

export default function VideosSection() {
  const featured = playerData.featuredVideo
  const reels = playerData.videos.slice(0, 3)
  const instagram = playerData.socialMedia.find((s) => s.label === 'Instagram')
  const [open, setOpen] = useState(null)
  const { ref, rv } = useReveal('0px 0px -20% 0px')

  if (!featured && !reels.length) return null

  return (
    <Box as="section" id="videos" ref={ref} position="relative" bg="brand.dark" color="brand.bone" fontFamily="display" p={{ base: '64px 20px', tab: '96px 60px' }}>
      <Box maxW="1320px" mx="auto">
        <Flex justify="space-between" align="flex-end" gap="20px" mb={{ base: '24px', tab: '36px' }} {...rv()}>
          <SectionHeader kicker="Highlights" title="Videos" />
          {featured && (
            <Link
              href={`https://youtu.be/${featured.youtubeId}`} isExternal display={{ base: 'none', md: 'inline-flex' }} alignItems="center" gap="10px" p="13px 20px" borderRadius="full"
              border="1.5px solid" borderColor="brand.line" color="brand.bone" fontSize="11px" fontWeight={700} letterSpacing=".18em" textTransform="uppercase" textDecoration="none"
              transition="border-color .2s, color .2s" _hover={{ textDecoration: 'none' }} sx={fine({ borderColor: 'brand.amber', color: 'brand.amber' })}
            >
              <Box as={FaYoutube} color="brand.terra" fontSize="16px" aria-hidden="true" /> Ver en YouTube
            </Link>
          )}
        </Flex>

        {featured && <Box {...rv(0.1)}><FeaturedVideo video={featured} /></Box>}

        {reels.length > 0 && (
          <>
            <Flex justify="space-between" align="center" mt={{ base: '36px', tab: '56px' }} mb="16px" pb="12px" borderBottom="1px solid" borderColor="brand.line" {...rv(0.2)}>
              <Text as="span" fontSize="11px" fontWeight={700} letterSpacing=".28em" textTransform="uppercase" color="brand.gray">Reels</Text>
              {instagram && (
                <Link href={instagram.url} isExternal display="inline-flex" alignItems="center" gap="8px" fontSize="12px" fontWeight={700} letterSpacing=".08em" color="brand.amber" _hover={{ textDecoration: 'none' }}>
                  <FaInstagram aria-hidden="true" /> {instagram.handle}
                </Link>
              )}
            </Flex>
            <Grid
              templateColumns={{ base: 'repeat(3, 72vw)', md: 'repeat(3,1fr)' }} gap={{ base: '12px', tab: '20px' }} overflowX={{ base: 'auto', md: 'visible' }}
              mx={{ base: '-20px', md: 0 }} px={{ base: '20px', md: 0 }}
              sx={{ scrollSnapType: 'x mandatory', scrollPaddingInline: '20px', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
            >
              {reels.map((v, i) => <ReelCard key={v.id} video={v} index={i} onOpen={setOpen} rv={rv} />)}
            </Grid>
          </>
        )}
      </Box>

      <AnimatePresence>{open && <ReelViewer video={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Box>
  )
}
