/**
 * Seed script: imports the static project data from lib/projects.ts into the database.
 * Run with: npx prisma db seed
 * (requires DATABASE_URL to be set in .env)
 */
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const projects = [
  {
    slug: 'bergen',
    title: 'Enebolig i Bergen',
    year: '2024 - d.d.',
    location: 'BERGEN, NORGE',
    description: 'Pågående prosjekt.',
    coverImage: '/img/saedalen/fasade_nettside.jpeg',
    published: true,
    sortOrder: 1,
    images: [
      { src: '/img/saedalen/fasade_nettside.jpeg', caption: 'Fasade Sørøst', order: 0 },
      { src: '/img/saedalen/IMG_9586.JPG', caption: 'Foto, tomt', order: 1 },
      { src: '/img/saedalen/IMG_9555.JPG', caption: 'Foto, utsikt', order: 2 },
    ],
  },
  {
    slug: 'nationaltheatret',
    title: 'The Three Temporary',
    year: '2023',
    location: 'Oslo, Norge',
    description:
      'Selv om Nationaltheatret er en av Norges mest ikoniske kulturinstitusjoner, har den historiske bygningen lenge vært preget av omfattende slitasje og tekniske utfordringer, noe som gjør en fullstendig renovering helt nødvendig. Dette har fått stor oppmerksomhet i media, særlig med tanke på hvordan teatret kan opprettholde sin virksomhet mens rehabiliteringsarbeidet pågår. Nationaltheatret er avhengig av inntektene fra sine teaterforestillinger og tilhørende arrangementer, og det er derfor avgjørende at institusjonen finner egnede midlertidige lokaler for å sikre fortsatt drift. En omfattende kravspesifikasjon for slike midlertidige fasiliteter er blitt fremlagt av teatret, men vi stiller oss skeptiske til dens gjennomførbarhet. Dette skyldes at kravene ser ut til å legge opp til en toppmoderne løsning, som kan være uhensiktsmessig for en midlertidig setting.\n\nVår bekymring ligger også i å ivareta Nationaltheatrets historiske verdi og unngå en utvikling hvor bygningen risikerer å bli forlatt – en skjebne som allerede har rammet flere kulturbygg i Oslo. Med dette i tankene har vi utviklet et alternativt forslag, basert på Nationaltheatrets offentlige program, som innebærer en fordeling av aktivitetene på tre midlertidige strukturer.',
    coverImage: '/img/nationalteateret/render1.jpg',
    published: true,
    sortOrder: 2,
    images: [
      { src: '/img/nationalteateret/render1.jpg', caption: 'Illustrasjon', order: 0 },
      { src: '/img/nationalteateret/cityplan.jpg', caption: 'Situasjonsplan', order: 1 },
      { src: '/img/nationalteateret/fasade1.jpg', caption: 'Fasade', order: 2 },
      { src: '/img/nationalteateret/render2.jpg', caption: 'Illustrasjon', order: 3 },
      { src: '/img/nationalteateret/fasade2.jpg', caption: 'Fasade', order: 4 },
      { src: '/img/nationalteateret/fasade3.jpg', caption: 'Fasade', order: 5 },
      { src: '/img/nationalteateret/plan1.jpg', caption: 'Plan', order: 6 },
      { src: '/img/nationalteateret/plan2.jpg', caption: 'Plan', order: 7 },
    ],
  },
  {
    slug: 'askoy',
    title: 'Enebolig på Askøy',
    year: '2025 - d.d.',
    location: 'ASKØY, NORGE',
    description: 'Pågående prosjekt.',
    coverImage: '/img/askoy/utsnitt.png',
    published: true,
    sortOrder: 3,
    images: [{ src: '/img/askoy/utsnitt.png', caption: 'Utsnitt fasade vest', order: 0 }],
  },
  {
    slug: 'sommerhus',
    title: 'Fiktivt sommerhus i Danmark',
    year: '2022',
    location: 'DANMARK',
    description:
      'Open House utfordrer måten vi lever på og er drevet av spørsmålet om hvor lite man egentlig behøver. Det er konseptualisert som et sommerhus i betong, designet for kunstneren Robert Motherwell. Prosjektet består av en langstrakt struktur med en lineær sekvens av rom, og er plassert på en blomstereng i Danmark. Tykke betongvegger skaper strukturen, og skyvedører i bronse former og lukker rom. Hvert rom blir formet som en separat enhet, og gir en unik, innrammet utsikt over den omliggende blomsterengen - både hvis du tar en dusj eller lager middag.',
    coverImage: '/img/sommerhus/render.jpg',
    published: true,
    sortOrder: 4,
    images: [
      { src: '/img/sommerhus/render.jpg', caption: 'Illustrasjon', order: 0 },
      { src: '/img/sommerhus/sommerhusplan.jpg', caption: 'Plan', order: 1 },
      { src: '/img/sommerhus/modellfoto.jpeg', caption: 'Modellfoto', order: 2 },
    ],
  },
  {
    slug: 'sommerhytte',
    title: 'Hytte på Samnøy',
    year: '2022-2024',
    location: 'Samnøy, Holmefjord',
    description:
      'Prosjektet ble utviklet sommeren 2022, og er et tilbygg til en sommerhytte i Samnanger utenfor Bergen. Den eldre eksisterende hytten er plassert ved Bjørnafjorden, med utsikt mot nord. Klientene ønsket en større hytte med moderne preg, hvor alle funksjoner utenom soverom skulle flyttes til tilbygget. I tillegg ønsket de en carport, og godt med lysinnslipp og vinduer mot utsikten i nord.',
    coverImage: '/img/samnoy/samnoy_plantegning.jpg',
    published: true,
    sortOrder: 5,
    images: [
      { src: '/img/samnoy/samnoy_plantegning.jpg', caption: 'Plantegning', order: 0 },
      { src: '/img/samnoy/fasadevest.jpg', caption: 'Fasade vest', order: 1 },
      { src: '/img/samnoy/fasadesor.jpg', caption: 'Fasade sør', order: 2 },
      { src: '/img/samnoy/fasadeost.jpg', caption: 'Fasade øst', order: 3 },
      { src: '/img/samnoy/rendersamnoy.jpeg', caption: 'Fasade øst', order: 4 },
    ],
  },
  {
    slug: 'masteroppgave',
    title: '[...] rommelig som havet',
    year: '2024',
    location: 'BERGEN, NORGE',
    description:
      'Havet står for øyeblikket overfor store konsekvenser som følge av den voksende klimakrisen. Likevel ser det ut til at den offentlige bevisstheten og engasjementet for havets helse er mangelfull. Denne masteroppgaven har som mål å undersøke hvordan arkitektur kan brukes til å skape engasjement og dypere forståelse for viktige miljøutfordringer, ved å utvikle et designforslag for et nytt maritimt kunnskapsenter i Bergen.\n\nBergen er i ferd med å utvikle et nytt maritimt nabolag, med en visjon om å styrke de marine sektorene i byen ved å samle dem i tett tilknytning til hverandre. Dette prosjektet ønsker å videreføre diskusjonen ved å slå sammen Havforskningsinstituttet og Bergen Akvarium til én institusjon som fokuserer på både den utdanningsmessige og vitenskapelige betydningen av havet.',
    coverImage: '/img/masteroppgave/master_render.jpeg',
    published: true,
    sortOrder: 6,
    images: [
      { src: '/img/masteroppgave/master_render.jpeg', caption: 'Illustrasjon', order: 0 },
      { src: '/img/masteroppgave/situasjonsplan.jpg', caption: 'Situasjonsplan', order: 1 },
      { src: '/img/masteroppgave/fasadeutsnitt.jpg', caption: 'Fasadeutsnitt', order: 2 },
      { src: '/img/masteroppgave/konstruksjonsprinsipp.jpg', caption: 'Konstruksjonsprinsipp', order: 3 },
    ],
  },
]

async function main() {
  console.log('Seeding projects...')
  for (const project of projects) {
    const { images, ...data } = project
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        ...data,
        images: {
          deleteMany: {},
          create: images,
        },
      },
      create: {
        ...data,
        images: {
          create: images,
        },
      },
    })
    console.log(`  ✓ ${project.title}`)
  }
  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
