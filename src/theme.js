import { extendTheme } from '@chakra-ui/react'

// Paleta de marca — fuente única de verdad para los colores del proyecto
const brand = {
  brown:      '#141516', // negro base (escudo Cusco FC)
  brownDark:  '#000000', // negro profundo
  brownLight: '#3A362C', // negro cálido/verdoso (sombra dorada)
  amber:      '#C6A24A', // dorado principal (escudo/camiseta)
  amber2:     '#c6a24a8e',
  amberDark:  '#8A6E2A', // dorado oscuro
  amberLight: '#c6a24a4f', // dorado claro translúcido
  dorado:     '#D4B45A', // dorado camiseta (más luminoso)
  orange:     '#B8862F', // dorado-ámbar (hover de botones)
  orangeDark: '#8A6522', // dorado-ámbar oscuro (hover de botones)
  orangeLight:'#D9A94A', // dorado-ámbar claro (hover de botones)
  dark:       '#2324249f',//'#532626', // fondo oscuro (mantener)
  dark3:      '#232424a1',
  dark2:      '#a5a4a4',
  gray:       '#9C8F6E', // grisáceo cálido dorado (texto secundario)
  gray2:      '#6E5A2E', // ámbar apagado
  bone:       '#FFFFFF', // blanco (texto principal)
  boneWarm:   '#E5CE8A', // dorado claro (detalles)
  rec:        '#E5484D', // rojo del indicador REC
  bgRef:      '#bda78e1a'// bg de hover en cajas (mantener)
}

// Colores de la firma del desarrollador (crédito en el footer)
const dev = {
  green: '#2D5A47',
  cream: '#E8D5A3',
}

const theme = extendTheme({
  colors: { brand, dev },
  fonts: {
    heading:   `'Bebas Neue', sans-serif`,
    body:      `'Barlow', sans-serif`,
    mono:      `'Barlow Condensed', sans-serif`,
  },
  styles: {
    global: {
      'html, body': {
        bg: brand.dark,
        color: 'white',
        overflowX: 'hidden',
      },
      '::-webkit-scrollbar': { width: '4px' },
      '::-webkit-scrollbar-track': { bg: brand.dark },
      '::-webkit-scrollbar-thumb': { bg: brand.accent, borderRadius: '2px' },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

export default theme
