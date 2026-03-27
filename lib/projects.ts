export interface ProjectImage {
  src: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  location: string;
  projectName: string;
  description: string;
  images: ProjectImage[];
  coverImage: string;
  portfolioLabel: string;
}

export const projects: Project[] = [
  {
    slug: 'bergen',
    title: 'Enebolig i Bergen',
    subtitle: 'Prosjekt Bergen, 2024',
    year: '2024 - d.d.',
    location: 'BERGEN, NORGE',
    projectName: 'Transformasjon av enebolig i Bergen',
    description: 'Pågående prosjekt.',
    images: [
      { src: '/img/saedalen/fasade_nettside.jpeg', caption: 'Fasade Sørøst' },
      { src: '/img/saedalen/IMG_9586.JPG', caption: 'Foto, tomt' },
      { src: '/img/saedalen/IMG_9555.JPG', caption: 'Foto, utsikt' },
    ],
    coverImage: '/img/saedalen/fasade_nettside.jpeg',
    portfolioLabel: 'Prosjekt Bergen, <br>2024',
  },
  {
    slug: 'nationaltheatret',
    title: 'The Three Temporary',
    subtitle: 'THE THREE TEMPORARY, 2023',
    year: '2023',
    location: 'Oslo, Norge',
    projectName: 'The Three Temporary',
    description:
      'Nationaltheatret er et av Norges mest ikoniske kulturbygg, men bygningens tekniske tilstand stiller arkitekter og beslutningstakere overfor et kritisk valg: rive og bygge nytt, eller bevare og transformere? Med utgangspunkt i en alternativ tilnærming til rehabilitering presenterer dette prosjektet tre temporære strukturer som letter presset på eksisterende fasiliteter, mens den historiske bygningen gjennomgår restaurering. De tre temporære strukturene er plassert i direkte tilknytning til Nationaltheatret og dets kontekst, og tilbyr fleksible rom for forestillinger, utstillinger og kulturelle arrangementer. Strukturene er utformet for rask demontering og gjenbruk, i tråd med prinsippene for sirkulær arkitektur.',
    images: [
      { src: '/img/nationalteateret/render1.jpg', caption: 'Illustrasjon' },
      { src: '/img/nationalteateret/cityplan.jpg', caption: 'Situasjonsplan' },
      { src: '/img/nationalteateret/fasade1.jpg', caption: 'Fasade' },
      { src: '/img/nationalteateret/render2.jpg', caption: 'Illustrasjon' },
      { src: '/img/nationalteateret/fasade2.jpg', caption: 'Fasade' },
      { src: '/img/nationalteateret/fasade3.jpg', caption: 'Fasade' },
      { src: '/img/nationalteateret/plan1.jpg', caption: 'Plan' },
      { src: '/img/nationalteateret/plan2.jpg', caption: 'Plan' },
    ],
    coverImage: '/img/nationalteateret/render1.jpg',
    portfolioLabel: 'THE THREE TEMPORARY, <br>2023',
  },
  {
    slug: 'askoy',
    title: 'Enebolig på Askøy',
    subtitle: 'Prosjekt Askøy, 2025',
    year: '2025 - d.d.',
    location: 'ASKØY, NORGE',
    projectName: 'Transformasjon av enebolig i Bergen',
    description: 'Pågående prosjekt.',
    images: [
      { src: '/img/askoy/utsnitt.png', caption: 'Utsnitt fasade vest' },
    ],
    coverImage: '/img/askoy/utsnitt.png',
    portfolioLabel: 'Prosjekt Askøy, <br>2025',
  },
  {
    slug: 'sommerhus',
    title: 'Fiktivt sommerhus i Danmark',
    subtitle: 'SOMMERHUS I DANMARK, 2022',
    year: '2022',
    location: 'DANMARK',
    projectName: 'OPEN HOUSE',
    description:
      'Open House er et konsept for et fiktivt sommerhus i Danmark, utformet med fokus på åpenhet og forbindelsen mellom inne og ute. Prosjektet utforsker hvordan arkitektur kan skape en sømløs overgang mellom det private og det naturlige landskapet. Huset er designet for å maksimere dagslys og utsikt, med store glassflater og en åpen planløsning som inviterer naturen inn.',
    images: [
      { src: '/img/sommerhus/Render.jpg', caption: 'Illustrasjon' },
      { src: '/img/sommerhus/sommerhusplan.jpg', caption: 'Plan' },
      { src: '/img/sommerhus/modellfoto.jpeg', caption: 'Modellfoto' },
    ],
    coverImage: '/img/sommerhus/Render.jpg',
    portfolioLabel: 'SOMMERHUS I DANMARK,<br> 2022',
  },
  {
    slug: 'sommerhytte',
    title: 'Hytte på Samnøy',
    subtitle: 'SOMMERHYTTE PÅ SAMNØY, 2022',
    year: '2022-2024',
    location: 'Samnøy, Holmefjord',
    projectName: 'Tilbygg sommerhytte',
    description:
      'Prosjektet innebærer et tilbygg til en eksisterende sommerhytte på Samnøy i Holmefjord. Tilbygget er utformet for å harmonere med den eksisterende hyttens karakter og det omkringliggende landskapet. Det nye volumet tilfører ekstra soverom og oppholdsareal, samtidig som det bevarer hyttens intime skala og tilpasning til naturen.',
    images: [
      { src: '/img/samnoy/samnoy_plantegning.jpg', caption: 'Plantegning' },
      { src: '/img/samnoy/fasadevest.jpg', caption: 'Fasade vest' },
      { src: '/img/samnoy/fasadesor.jpg', caption: 'Fasade sør' },
      { src: '/img/samnoy/fasadeost.jpg', caption: 'Fasade øst' },
      { src: '/img/samnoy/rendersamnoy.jpeg', caption: 'Fasade øst' },
    ],
    coverImage: '/img/samnoy/samnoy_plantegning.jpg',
    portfolioLabel: 'SOMMERHYTTE PÅ SAMNØY,<br> 2022',
  },
  {
    slug: 'masteroppgave',
    title: '[...] rommelig som havet',
    subtitle: '[...] ROMMELIG SOM HAVET, 2024',
    year: '2024',
    location: 'BERGEN, NORGE',
    projectName: '[...] ROMMELIG SOM HAVET',
    description:
      "Dette prosjektet er en masteroppgave som utforsker konseptet om et maritimt kunnskapssenter i Bergen. Med tittelen '[...] rommelig som havet' undersøker prosjektet hvordan arkitektur kan reflektere og formidle maritim kunnskap og kultur. Senteret er plassert ved havnefronten og integrerer utstillingslokaler, forskningsfasiliteter og offentlige rom som inviterer byens innbyggere og besøkende til å utforske den maritime arven.",
    images: [
      { src: '/img/masteroppgave/master_render.jpeg', caption: 'Illustrasjon' },
      { src: '/img/masteroppgave/situasjonsplan.jpg', caption: 'Situasjonsplan' },
      { src: '/img/masteroppgave/fasadeutsnitt.jpg', caption: 'Fasadeutsnitt' },
      { src: '/img/masteroppgave/konstruksjonsprinsipp.jpg', caption: 'Konstruksjonsprinsipp' },
    ],
    coverImage: '/img/masteroppgave/master_render.jpeg',
    portfolioLabel: '[...] ROMMELIG SOM HAVET,<br> 2024',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
