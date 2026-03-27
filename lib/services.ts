export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const services: Service[] = [
  {
    id: 'enebolig',
    title: 'Enebolig',
    description: 'Beskrivelse utarbeides',
    image: '/img/saedalen/fasade_nettside.jpeg',
  },
  {
    id: 'arkitekturvisualisering',
    title: 'ARKITEKTURVISUALISERING',
    description: 'Beskrivelse utarbeides',
    image: '/img/interiør.png',
  },
  {
    id: 'byplanlegging',
    title: 'BYPLANLEGGING',
    description: 'Beskrivelse utarbeides',
    image: '/img/byplanlegging.jpg',
  },
];
