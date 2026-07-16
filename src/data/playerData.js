import { FaInstagram, FaEnvelope } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoMdStats } from 'react-icons/io'

//Hero
import polaco1 from '@assets/polaco1.webp'

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
  currentClub: 'Cusco FC',
  logoCurrentClub: cusco,
  image: polaco1,
  

  stats: [
    { label: 'Velocidad',      value: 94 },
    { label: 'Definición',     value: 79 },
    { label: 'Regate',         value: 89 },
    { label: 'Pases Completos',    value: 83 },
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



  gallery: [
    { id: 1, src: image1, alt: 'Francisco Fydriszewski', caption: 'Liga Profesional 2024', category: 'Partido', aspect: 'wide' },
    { id: 2, src: image2, alt: 'Francisco Fydriszewski', caption: 'Festejo ante Racing',    category: 'Festejo', aspect: 'tall' },
    { id: 3, src: image3, alt: 'Francisco Fydriszewski', caption: 'Pretemporada 2025',       category: 'Entrenamiento', aspect: 'square' },
    { id: 4, src: image4, alt: 'Francisco Fydriszewski', caption: 'Copa Argentina 2024',     category: 'Partido', aspect: 'wide' },
    { id: 5, src: image5, alt: 'Francisco Fydriszewski', caption: 'Plantel Talleres 2024',   category: 'Equipo',  aspect: 'wide' },
    { id: 6, src: image6, alt: 'Francisco Fydriszewski', caption: 'Foto oficial 2024',       category: 'Retrato', aspect: 'tall' },
    { id: 7, src: image7, alt: 'Francisco Fydriszewski', caption: 'Liga Profesional 2025', category: 'Partido', aspect: 'wide' },
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
