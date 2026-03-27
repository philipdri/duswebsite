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
      'Selv om Nationaltheatret er en av Norges mest ikoniske kulturinstitusjoner, har den historiske bygningen lenge vært preget av omfattende slitasje og tekniske utfordringer, noe som gjør en fullstendig renovering helt nødvendig. Dette har fått stor oppmerksomhet i media, særlig med tanke på hvordan teatret kan opprettholde sin virksomhet mens rehabiliteringsarbeidet pågår. Nationaltheatret er avhengig av inntektene fra sine teaterforestillinger og tilhørende arrangementer, og det er derfor avgjørende at institusjonen finner egnede midlertidige lokaler for å sikre fortsatt drift. En omfattende kravspesifikasjon for slike midlertidige fasiliteter er blitt fremlagt av teatret, men vi stiller oss skeptiske til dens gjennomførbarhet. Dette skyldes at kravene ser ut til å legge opp til en toppmoderne løsning, som kan være uhensiktsmessig for en midlertidig setting.\n\nVår bekymring ligger også i å ivareta Nationaltheatrets historiske verdi og unngå en utvikling hvor bygningen risikerer å bli forlatt – en skjebne som allerede har rammet flere kulturbygg i Oslo. Med dette i tankene har vi utviklet et alternativt forslag, basert på Nationaltheatrets offentlige program, som innebærer en fordeling av aktivitetene på tre midlertidige strukturer.',
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
      'Open House utfordrer måten vi lever på og er drevet av spørsmålet om hvor lite man egentlig behøver. Det er konseptualisert som et sommerhus i betong, designet for kunstneren Robert Motherwell. Prosjektet består av en langstrakt struktur med en lineær sekvens av rom, og er plassert på en blomstereng i Danmark. Tykke betongvegger skaper strukturen, og skyvedører i bronse former og lukker rom. Hvert rom blir formet som en separat enhet, og gir en unik, innrammet utsikt over den omliggende blomsterengen - både hvis du tar en dusj eller lager middag.',
    images: [
      { src: '/img/sommerhus/render.jpg', caption: 'Illustrasjon' },
      { src: '/img/sommerhus/sommerhusplan.jpg', caption: 'Plan' },
      { src: '/img/sommerhus/modellfoto.jpeg', caption: 'Modellfoto' },
    ],
    coverImage: '/img/sommerhus/render.jpg',
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
      'Prosjektet ble utviklet sommeren 2022, og er et tilbygg til en sommerhytte i Samnanger utenfor Bergen. Den eldre eksisterende hytten er plassert ved Bjørnafjorden, med utsikt mot nord. Klientene ønsket en større hytte med moderne preg, hvor alle funksjoner utenom soverom skulle flyttes til tilbygget. I tillegg ønsket de en carport, og godt med lysinnslipp og vinduer mot utsikten i nord.',
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
      'Havet står for øyeblikket overfor store konsekvenser som følge av den voksende klimakrisen. Likevel ser det ut til at den offentlige bevisstheten og engasjementet for havets helse er mangelfull. Denne masteroppgaven har som mål å undersøke hvordan arkitektur kan brukes til å skape engasjement og dypere forståelse for viktige miljøutfordringer, ved å utvikle et designforslag for et nytt maritimt kunnskapsenter i Bergen.\n\nBergen er i ferd med å utvikle et nytt maritimt nabolag, med en visjon om å styrke de marine sektorene i byen ved å samle dem i tett tilknytning til hverandre. Dette prosjektet ønsker å videreføre diskusjonen ved å slå sammen Havforskningsinstituttet og Bergen Akvarium til én institusjon som fokuserer på både den utdanningsmessige og vitenskapelige betydningen av havet.',
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
