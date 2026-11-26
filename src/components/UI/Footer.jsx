import { Box, Flex, Image, Link, Text, chakra } from '@chakra-ui/react'
import { LiaLaptopCodeSolid } from 'react-icons/lia'
import { playerData } from '../../data/playerData'
import { EASE, fine } from '../../lib/motion'
import { scrollToTop } from '../../lib/scroll'

// Footer "Firma": el apellido gigante a todo el ancho (las dos últimas letras en contorno),
// con escudo, links de contacto y "Volver arriba" encima. Crédito del desarrollador al pie.

export default function Footer() {
  const { fullName, name, position, currentClub, logoCurrentClub, socialMedia, contact } = playerData
  const links = [
    ...socialMedia.map((s) => ({ name: s.label === 'TransferMarkt' ? 'Transfermarkt' : s.label, url: s.url })),
    ...contact.map((c) => ({ name: c.label.replace(/\b\w/g, (m) => m.toUpperCase()), url: c.url })),
  ]
  // El apellido ocupa todo el ancho: el tamaño se reparte según la cantidad de letras
  const size = `${(164.5 / fullName.length).toFixed(2)}vw`

  return (
    <Box as="footer" position="relative" overflow="hidden" bg="brand.deep" color="brand.bone" fontFamily="display" p={{ base: '44px 20px 0', tab: '56px 60px 0' }}>
      <Flex position="relative" zIndex={2} justify="space-between" align="flex-start" gap="24px" wrap="wrap">
        <Flex align="center" gap="18px">
          <Image src={logoCurrentClub} alt={`Escudo de ${currentClub}`} boxSize={{ base: '52px', tab: '68px' }} objectFit="contain" />
          <Text fontSize="clamp(22px,2.4vw,34px)" fontWeight={700} textTransform="uppercase" lineHeight={1.05} maxW="20ch">
            {position}<br /><Text as="em" fontStyle="normal" color="brand.amber">{currentClub}</Text>
          </Text>
        </Flex>
        <chakra.button
          type="button" onClick={scrollToTop} display="flex" alignItems="center" gap="12px" fontFamily="inherit" fontSize="12px" fontWeight={700} letterSpacing=".18em"
          textTransform="uppercase" color="brand.amber" bg="transparent" border={0} cursor="pointer" _focusVisible={{ outline: '2px solid', outlineColor: 'brand.terra', outlineOffset: '3px' }}
          sx={{ '@media (hover:hover) and (pointer:fine)': { '&:hover [data-up]': { transform: 'translateY(-4px)', bg: 'brand.amber', color: 'brand.onAcc' } } }}
        >
          Volver arriba
          <Flex
            data-up aria-hidden="true" boxSize="54px" borderRadius="full" border="1.5px solid" borderColor="brand.amber" align="center" justify="center" fontSize="20px"
            transition={`transform .35s ${EASE}, background-color .35s ${EASE}, color .35s ${EASE}`}
          >
            ↑
          </Flex>
        </chakra.button>
      </Flex>

      <Flex as="nav" aria-label="Contacto y perfiles" position="relative" zIndex={2} gap={{ base: '18px', tab: '26px' }} mt="30px" wrap="wrap">
        {links.map((l) => (
          <Link
            key={l.name} href={l.url} isExternal color="brand.bone" fontSize="12px" letterSpacing=".18em" textTransform="uppercase" textDecoration="none" pb="4px"
            borderBottom="1px solid" borderColor="brand.line" transition="color .2s, border-color .2s" _hover={{ textDecoration: 'none' }}
            sx={fine({ color: 'brand.amber', borderColor: 'brand.amber' })}
          >
            {l.name} ↗
          </Link>
        ))}
      </Flex>

      <Box
        aria-hidden="true" mt={{ base: '32px', tab: '44px' }} mx="-.04em" fontSize={size} fontWeight={700} lineHeight={0.74} letterSpacing="-.02em" color="brand.amber"
        textTransform="uppercase" whiteSpace="nowrap" userSelect="none" pointerEvents="none" transform="translateY(8%)"
      >
        {fullName.slice(0, -2)}
        <Text as="span" color="transparent" sx={{ WebkitTextStroke: '2px var(--chakra-colors-brand-amber)' }}>{fullName.slice(-2)}</Text>
      </Box>

      <Flex
        position="relative" zIndex={1} direction={{ base: 'column', tab: 'row' }} justify="space-between" align="center" gap="16px" wrap="wrap" bg="brand.deep" color="brand.gray"
        p={{ base: '16px 20px 20px', tab: '18px 60px 22px' }} mx={{ base: '-20px', tab: '-60px' }} borderTop="2px solid" borderColor="brand.amber"
      >
        <Text fontSize="12px" letterSpacing=".12em" textTransform="uppercase" textAlign="center">© {new Date().getFullYear()} {name} {fullName} · Todos los derechos reservados</Text>
        <Text fontSize="12px" letterSpacing=".05em" color="brand.bone">
          Desarrollo Web -{' '}
          <Link
            href="https://matiasgunsett.netlify.app/" isExternal color="dev.green" fontSize="18px" fontFamily='"Shadows Into Light", cursive' ml="2px" transition="color .3s"
            _hover={{ textDecoration: 'none' }} sx={fine({ color: 'rgba(232,213,163,0.5)' })}
          >
            Matias Gunsett <Box as={LiaLaptopCodeSolid} display="inline-block" verticalAlign="middle" fontSize="20px" color="dev.cream" ml="2px" aria-hidden="true" />
          </Link>
        </Text>
      </Flex>
    </Box>
  )
}
