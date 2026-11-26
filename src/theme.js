import { extendTheme } from '@chakra-ui/react'

// Paleta de marca — fuente única de verdad para los colores del proyecto
const brand = {
  // Paleta "Oro y piedra": negro cálido, oro y terracota
  brown:      '#0F0D0A', // negro cálido base
  brownDark:  '#070605', // negro profundo
  brownLight: '#2A251C', // piedra oscura
  amber:      '#D6AE4E', // oro principal
  amber2:     '#d6ae4e8e',
  amberDark:  '#9C7A2C', // oro oscuro
  amberLight: '#d6ae4e40', // oro translúcido (líneas)
  dorado:     '#D6AE4E', // oro (acento)
  orange:     '#D2603F', // terracota (segundo acento)
  orangeDark: '#A84A30',
  orangeLight:'#E07A5C',
  dark:       '#0F0D0A', // fondo
  dark3:      '#1a1712d9', // superficie translúcida
  dark2:      '#A39A86',
  bg2:        '#1A1712', // superficie
  deep:       '#070605',
  terra:      '#D2603F', // terracota
  line:       '#d6ae4e40', // líneas finas
  onAcc:      '#0F0D0A', // texto sobre oro
  gray:       '#A39A86', // texto secundario
  gray2:      '#6E6556',
  bone:       '#F4EDE0', // texto principal
  boneWarm:   '#E5CE8A', // oro claro (detalles)
  rec:        '#E5484D', // rojo del indicador REC
  bgRef:      '#d6ae4e14'// fondo de hover en cajas
}

// Colores de la firma del desarrollador (crédito en el footer)
const dev = {
  green: '#2D5A47',
  cream: '#E8D5A3',
}

const theme = extendTheme({
  colors: { brand, dev },
  fonts: {
    display:   `'Nippo', system-ui, sans-serif`,
    heading:   `'Bebas Neue', sans-serif`,
    body:      `'Barlow', sans-serif`,
    mono:      `'Barlow Condensed', sans-serif`,
  },
  // 820px: el corte entre el diseño de celular y el de escritorio de las secciones
  breakpoints: { tab: '821px' },
  styles: {
    global: {
      // Alto de pantalla estable en mobile (no salta con la barra del navegador)
      ':root': { '--sv': '1vh', '@supports (height:1svh)': { '--sv': '1svh' } },
      'html, body': {
        bg: brand.dark,
        color: brand.bone,
        overflowX: 'hidden',
      },
      '::-webkit-scrollbar': { width: '4px' },
      '::-webkit-scrollbar-track': { bg: brand.dark },
      '::-webkit-scrollbar-thumb': { bg: brand.amber, borderRadius: '2px' },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

export default theme
