import { Global } from '@emotion/react'
import light from '@assets/fonts/Nippo-Light.woff2'
import regular from '@assets/fonts/Nippo-Regular.woff2'
import medium from '@assets/fonts/Nippo-Medium.woff2'
import bold from '@assets/fonts/Nippo-Bold.woff2'

// Fuente Nippo (local). Una regla @font-face por peso.
const face = (weight, src) => `@font-face{font-family:'Nippo';font-weight:${weight};font-display:swap;src:url('${src}') format('woff2')}`

export default function Fonts() {
  return <Global styles={[face(300, light), face(400, regular), face(500, medium), face(700, bold)].join('\n')} />
}
