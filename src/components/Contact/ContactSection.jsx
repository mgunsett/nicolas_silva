import { Box, Flex, Grid, Heading, Image, Link, Text } from '@chakra-ui/react'
import { FaInstagram } from 'react-icons/fa'
import { playerData } from '../../data/playerData'
import { EASE, hoverKids, useReveal } from '../../lib/motion'
import SectionHeader from '../UI/SectionHeader'

// Contacto "Tarjetas": cuatro tarjetas grandes y clicables — Instagram, Transfermarkt y los dos
// contactos profesionales (el representante deportivo destacado en oro).

function ContactCard({ card, index, rv }) {
  const { role, name, handle, extra, url, img, icon, highlight } = card
  const mark = img ? <Image src={img} alt="" boxSize="80%" objectFit="contain" maxW="none" /> : icon
  return (
    <Link
      href={url} isExternal aria-label={`${name}: ${handle}. Se abre en una pestaña nueva`}
      position="relative" display="flex" flexDirection="column" justifyContent="space-between" overflow="hidden" borderRadius="16px" border="1px solid"
      minH={{ base: '200px', tab: '260px' }} p={{ base: '22px', tab: '30px' }} textDecoration="none" color={highlight ? 'brand.onAcc' : 'brand.bone'}
      bg={highlight ? 'brand.amber' : 'brand.bg2'} borderColor={highlight ? 'brand.amber' : 'brand.line'} transition={`background-color .35s ${EASE}, transform .16s ease-out`}
      _hover={{ textDecoration: 'none' }} _active={{ transform: 'scale(.99)' }}
      sx={hoverKids(highlight ? {} : { bg: '#221d16', borderColor: '#d6ae4e99' }, { '[data-arrow]': { transform: 'rotate(45deg)' } })}
      {...rv(0.1 + index * 0.07)}
    >
      <Flex
        aria-hidden="true" position="absolute" right="-24px" bottom="-34px" boxSize={{ base: '140px', tab: '190px' }} align="center" justify="center"
        fontSize={{ base: '140px', tab: '190px' }} lineHeight={0} pointerEvents="none" opacity={highlight ? 0.22 : 0.08} color={highlight ? 'brand.onAcc' : 'brand.bone'}
        sx={{ '& img': { filter: highlight ? 'grayscale(1) brightness(.4)' : 'grayscale(1) brightness(1.6)', mixBlendMode: highlight ? 'multiply' : 'normal' }, '& img, & svg': { width: '100%', height: '100%' } }}
      >
        {mark}
      </Flex>
      <Flex justify="space-between" align="flex-start">
        <Flex boxSize="64px" borderRadius="full" bg="brand.dark" align="center" justify="center" color="brand.amber" fontSize="28px" overflow="hidden">{mark}</Flex>
        <Flex
          data-arrow aria-hidden="true" boxSize="48px" borderRadius="full" border="1.5px solid currentColor" align="center" justify="center" fontSize="18px"
          transition={`transform .35s ${EASE}`}
        >
          ↗
        </Flex>
      </Flex>
      <Box>
        <Text fontSize="11px" fontWeight={700} letterSpacing=".22em" textTransform="uppercase" color={highlight ? 'brand.onAcc' : 'brand.terra'} opacity={highlight ? 0.7 : 1}>{role}</Text>
        <Heading as="h3" mt="8px" fontFamily="display" fontWeight={700} fontSize="clamp(26px,2.6vw,40px)" textTransform="uppercase" lineHeight={1}>{name}</Heading>
        <Text mt="8px" fontSize="14px" opacity={0.75}>{handle}{extra ? ` · ${extra}` : ''}</Text>
      </Box>
    </Link>
  )
}

export default function ContactSection() {
  const { ref, rv } = useReveal()
  const { socialMedia, contact, name } = playerData
  const ig = socialMedia.find((s) => s.label === 'Instagram')
  const tm = socialMedia.find((s) => s.label === 'TransferMarkt')
  const [rep, mkt] = contact

  const cards = [
    ig && { role: `Directo con ${name[0]}${name.slice(1).toLowerCase()}`, name: 'Instagram', handle: ig.handle, url: ig.url, icon: <FaInstagram aria-hidden="true" /> },
    tm && { role: 'Ficha profesional', name: 'Transfermarkt', handle: 'Trayectoria y valor de mercado', url: tm.url, img: tm.image },
    rep && { role: 'Representante deportivo', name: rep.label, handle: rep.handle, extra: 'Clubes y transferencias', url: rep.url, img: rep.image, highlight: true },
    mkt && { role: 'Contacto de marketing', name: mkt.label, handle: mkt.handle, extra: 'Marcas y acciones comerciales', url: mkt.url, img: mkt.image },
  ].filter(Boolean)

  return (
    <Box as="section" id="contact" ref={ref} position="relative" bg="brand.dark" color="brand.bone" fontFamily="display" overflow="hidden" p={{ base: '64px 20px', tab: '96px 60px' }}>
      <Box maxW="1320px" mx="auto">
        <SectionHeader kicker="Hablemos" title="Contacto" mb={{ base: '28px', tab: '44px' }} {...rv()} />
        <Grid templateColumns={{ base: '1fr', tab: '1fr 1fr' }} gap="12px">
          {cards.map((c, i) => <ContactCard key={c.name} card={c} index={i} rv={rv} />)}
        </Grid>
      </Box>
    </Box>
  )
}
