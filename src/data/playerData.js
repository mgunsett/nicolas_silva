import { FaInstagram, FaEnvelope } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoMdStats } from 'react-icons/io'

//Hero
import polaco1 from '@assets/polaco1.webp'
import heroWide from '@assets/hero-ancho.webp'

import argentina from '@assets/argentina.webp'
import cusco from '@assets/escudo_cusco.webp'
//Escudos trayectoria
import escudoArgentinos from '@assets/escudos/escudo_argentinos.webp'
import escudoBanfield from '@assets/escudos/escudo_banfield.webp'
import escudoBocaUnidos from '@assets/escudos/escudo_bocaunidos.webp'
import escudoColon from '@assets/escudos/escudo_colon.webp'
import escudoHuracan from '@assets/escudos/escudo_huracan.webp'
import escudoLasParejas from '@assets/escudos/escudo_lasparejas.webp'
import escudoChaco from '@assets/escudos/escudo_chaco.webp'
import escudoAucas from '@assets/escudos/escudo_aucas.webp'
//Gallery
import image1 from '@assets/gallery/image1.webp'
import image2 from '@assets/gallery/image2.webp'
import image3 from '@assets/gallery/image3.webp'
import image4 from '@assets/gallery/image4.webp'
import image5 from '@assets/gallery/image5.webp'
import image6 from '@assets/gallery/image6.webp'
import image7 from '@assets/gallery/image7.webp'
import image8 from '@assets/gallery/image8.webp'
import image9 from '@assets/gallery/image9.webp'
import image10 from '@assets/gallery/image10.webp'
import image11 from '@assets/gallery/image11.webp'
import image12 from '@assets/gallery/image12.webp'
import image13 from '@assets/gallery/image13.webp'
import image14 from '@assets/gallery/image14.webp'
import image15 from '@assets/gallery/image15.webp'
//Video
import photoGraph from '@assets/perfil_video.webp'
//Prensa
import logo1 from '@assets/logos/logo1.webp'
import logo2 from '@assets/logos/logo2.webp'
import logo3 from '@assets/logos/logo3.webp'
//Redes
import transfermkt from '@assets/contact2.svg'
import ledsports from '@assets/contact3.webp'
import moon from '@assets/contact4.webp'


const name = 'NICOLAS'
const fullName = 'SILVA'

export const playerData = {
  name,
  fullName,
  initials: `${name[0]}${fullName[0]}`,
  displayName: `${name} ${fullName}`,
  number: 26,
  position: 'Extremo Derecho',
  positionShort: 'ED',
  nationality: 'Argentina',
  nationalityFlag: argentina,
  age: 36,
  height: '1.63m',
  weight: '70kg',
  foot: 'Derecho',
  birthDate: '24 / 01 / 1990',
  birthPlace: 'Las Parejas, Santa Fe, Argentina',
  birthPlaceShort: 'Las Parejas, ARG',
  currentClub: 'Cusco FC',
  league: 'Liga 1 · Perú',
  logoCurrentClub: cusco,
  image: polaco1,
  heroWide, // foto de cancha que rellena el dorsal del hero
  

  stats: [
    { label: 'Velocidad',      value: 94 },
    { label: 'Definición',     value: 79 },
    { label: 'Regate',         value: 89 },
    { label: 'Pases',          value: 83 },
    { label: 'Presión Alta',   value: 80 },
    { label: 'Visión de Juego',value: 77 },
  ],

  seasonStats: [
    { label: 'Partidos',    value: 60 },
    { label: 'Goles',       value: 3 },
    { label: 'Asistencias', value: 5  },
    { label: 'Tiros al árco', value: 19  },
    { label: 'Min / Part.', value: "2,589'" },
    { label: 'Valoración', value: 7.1  },

  ],

  clubs: [
    {
      name:    'Cusco FC',
      country: 'Perú',
      years:   '2024 — Actualidad',
      logo:    cusco,
      titles:  [],
      info:    'Subcampeón de la Liga 1 de Perú 2025',
    },
    {
      name:    'Chaco For Ever',
      country: 'Argentina',
      years:   '2022 — 2023',
      logo:    escudoChaco,
      titles:  [],
      info:    '',
    },
    {
      name:    'S.D Aucas',
      country: 'Ecuador',
      years:   '2022',
      logo:    escudoAucas,
      titles:  ['Campeón de la Serie A 2022'],
      info:    '',
    },
    {
      name:    'Huracán',
      country: 'Argentina',
      years:   '2021',
      logo:    escudoHuracan,
      titles:  [],
      info:    'PRESTAMO',
    },
    {
      name:    'Argentinos Juniors',
      country: 'Argentina',
      years:   '2019 — 2021',
      logo:    escudoArgentinos,
      titles:  [],
      info:    '',
    },
    {
      name:    'Banfield',
      country: 'Argentina',
      years:   '2018 — 2019',
      logo:    escudoBanfield,
      titles:  [],
      info:    '',
    },
    {
      name:    'Huracán',
      country: 'Argentina',
      years:   '2017 — 2018',
      logo:    escudoHuracan,
      titles:  [],
      info:    '',
    },
    {
      name:    'Colón de Santa Fe',
      country: 'Argentina',
      years:   '2016 — 2017',
      logo:    escudoColon,
      titles:  [],
      info:    '',
    },
    {
      name:    'Boca Unidos',
      country: 'Argentina',
      years:   '2014 — 2015',
      logo:    escudoBocaUnidos,
      titles:  [],
      info:    '',
    },
    {
      name:    'Chaco For Ever',
      country: 'Argentina',
      years:   '2013 — 2014',
      logo:    escudoChaco,
      titles:  [],
      info:    '',
    },
    {
      name:    'Sportivo Las Parejas',
      country: 'Argentina',
      years:   '2012 — 2013',
      logo:    escudoLasParejas,
      titles:  [],
      info:    '',
    },
  ],

  // Highlight principal (YouTube). La portada es `cover`; sin `cover` se usa la miniatura de YouTube.
  featuredVideo: {
    youtubeId: 'XTF0C7YeP1s',
    title: 'Jugadas destacadas',
    subtitle: 'Cusco FC · Liga 1 Perú',
    cover: image1,
  },

  videos: [
    {
      id: 'v1',
      instagramId: 'DRar5BiDxW_',
      title: 'Gol vs Sp Huancayo 2025',
      fullTitle: 'Nicolas Silva | Jugadas destacadas 2025',
      season: 'Gol vs Sp Huancayo 2025',
      league: 'LIGA 1 2025',
      thumbnail: image7,
      cover: image7,
      category: 'Goles',
    },
    {
      id: 'v2',
      instagramId: 'DMT6HFkM00D',
      title: 'Gol vs Alianza 2025',
      fullTitle: 'Nicolas Silva | Compilado de goles',
      season: 'Gol vs Alianza 2025',
      league: 'LIGA 1 2025',
      thumbnail: image5,
      cover: image5,
      category: 'Goles',
    },
    {
      id: 'v3',
      instagramId: 'DIuSnoTxJGS',
      title: 'Jugador de Partido 2025',
      fullTitle: 'Nicolas Silva | Asistencias y juego',
      season: 'Jugador de Partido 2025',
      league: 'LIGA 1 2025',
      thumbnail: image2,
      cover: image2,
      category: 'Highlights',
    },
  ],



  // Galería: c = categoría (clave de galleryCats), a = descripción para lectores de pantalla
  galleryCats: [['all', 'Todas'], ['u', 'Cusco FC'], ['e', 'Entrenamiento']],
  gallery: [
    { src: image3,  c: 'u', alt: 'Corre con la camiseta dorada de Cusco FC' },
    { src: image7,  c: 'u', alt: 'Remata de zurda en el estadio de Cusco' },
    { src: image9,  c: 'u', alt: 'Retrato con la cinta de capitán de Cusco FC' },
    { src: image10, c: 'u', alt: 'De espaldas con el 26, saluda a la tribuna' },
    { src: image1,  c: 'u', alt: 'Conduce la pelota ante la marca de un rival' },
    { src: image2,  c: 'u', alt: 'El equipo de Cusco FC en la Copa Libertadores' },
    { src: image4,  c: 'u', alt: 'Posa con un trofeo de campeón' },
    { src: image5,  c: 'u', alt: 'Prepara el remate con la camiseta de Cusco FC' },
    { src: image6,  c: 'u', alt: 'Formación de Cusco FC antes del partido' },
    { src: image8,  c: 'u', alt: 'Prepara un centro desde la banda' },
    { src: image13, c: 'u', alt: 'Avanza con la pelota junto a un compañero' },
    { src: image11, c: 'e', alt: 'Trabajo con pelota en el entrenamiento' },
    { src: image12, c: 'e', alt: 'Sonríe con el pulgar arriba en el entrenamiento' },
    { src: image14, c: 'e', alt: 'Salto en un entrenamiento en la montaña' },
    { src: image15, c: 'e', alt: 'Disputa la pelota en una práctica' },
  ],

  socialMedia: [
    {
      label: 'Instagram',
      icon: FaInstagram,
      iconBg: FaInstagram,
      handle: '@_silvanicolas',
      url: 'https://www.instagram.com/_silvanicolas/',
      hoverColor: '#E1306C',
      hoverGradient: 'insta-gradient',
    },
    {
      label: 'TransferMarkt',
      image: transfermkt,
      iconBg: IoMdStats,
      handle: '/nicolas-silva',
      url: 'https://www.transfermarkt.com.ar/nicolas-silva/profil/spieler/422914',
      hoverColor: '#2e73f2',
    },
  ],

  contact: [
    {
      title:      'Representante Deportivo',
      label:      'Moon Sports Group',
      image:       moon,
      handle:     '@moonsportsgroup_',
      url:        'https://www.instagram.com/moonsportsgroup_/',
      hoverColor: 'rgba(139,69,19,0.18)',
    },
    {
      title:      'Contacto Marketing',
      label:      'led sports marketing',
      image: ledsports,
      handle:     '@_ledsports',
      url:        'https://www.instagram.com/_ledsports/',
      hoverColor: 'rgba(212,168,75,0.18)',
    },
  ],
}
