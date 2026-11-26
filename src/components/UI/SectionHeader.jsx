import { Box, Heading, Text } from '@chakra-ui/react'

// Encabezado de sección: rótulo en terracota y título grande en oro.
// Se puede esparcir `rv(...)` de useReveal u otras props de Chakra.
export default function SectionHeader({ kicker, title, ...rest }) {
  return (
    <Box {...rest}>
      <Text fontSize="11px" fontWeight={700} letterSpacing=".28em" textTransform="uppercase" color="brand.terra">{kicker}</Text>
      <Heading as="h2" mt="8px" fontFamily="display" fontWeight={700} fontSize="clamp(44px,5.4vw,84px)" lineHeight={0.9} color="brand.amber" textTransform="uppercase">
        {title}
      </Heading>
    </Box>
  )
}
