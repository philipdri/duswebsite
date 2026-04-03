# Utviklerguide — Admin-sider

Dette dokumentet forklarer **hvordan admin-sidene er bygget opp i koden**, med eksempler fra kildefilene. Formålet er å gi deg som utvikler en god oversikt over hvordan administrasjon av prosjekter, innhold og tjenester fungerer fra kode til database.

---

## Innholdsfortegnelse

1. [Overordnet struktur](#1-overordnet-struktur)
2. [Autentisering og rutebeskytt­else](#2-autentisering-og-rutebeskyttelse)
3. [Admin-layout og navigasjon](#3-admin-layout-og-navigasjon)
4. [Mønsteret som gjentas overalt](#4-m%C3%B8nsteret-som-gjentas-overalt)
5. [Prosjekter — CRUD](#5-prosjekter--crud)
   - [Opprette nytt prosjekt](#51-opprette-nytt-prosjekt)
   - [Redigere prosjekt](#52-redigere-prosjekt)
   - [Slette prosjekt](#53-slette-prosjekt)
   - [Publisere og avpublisere](#54-publisere-og-avpublisere)
   - [Sortere rekkefølge (drag-and-drop)](#55-sortere-rekkef%C3%B8lge-drag-and-drop)
6. [Innhold — redigere sidetekster](#6-innhold--redigere-sidetekster)
7. [Tjenester — redigere tjenester](#7-tjenester--redigere-tjenester)
8. [Bildeopplasting](#8-bildeopplasting)
9. [Database-skjema](#9-database-skjema)
10. [Feilhåndtering og fallback-verdier](#10-feilh%C3%A5ndtering-og-fallback-verdier)

---

## 1. Overordnet struktur

Admin-sidene bor i `app/admin/`. Filstrukturen er:

```
app/admin/
├── adminStyles.ts           ← delte CSS-klasser (Tailwind-strenger)
├── layout.tsx               ← felles nav-bar for alle admin-sider
├── page.tsx                 ← dashboard (statistikk)
├── login/
│   └── page.tsx             ← innloggingsskjema
├── projects/
│   ├── page.tsx             ← liste over alle prosjekter
│   ├── actions.ts           ← server actions: create, update, delete, toggle, reorder
│   ├── new/
│   │   └── page.tsx         ← side for å opprette nytt prosjekt
│   ├── [id]/edit/
│   │   └── page.tsx         ← side for å redigere eksisterende prosjekt
│   └── components/
│       ├── ProjectForm.tsx         ← delt skjema-komponent (opprett + rediger)
│       ├── DeleteProjectButton.tsx ← slett-knapp med bekreftelse
│       ├── PublishButton.tsx       ← publiser-knapp
│       └── SortableProjectList.tsx ← drag-and-drop prosjektliste
├── tjenester/
│   ├── page.tsx             ← liste over tjenester
│   ├── actions.ts           ← server action: updateService
│   └── [id]/edit/
│       ├── page.tsx         ← side for å redigere én tjeneste
│       └── ServiceEditForm.tsx ← skjema-komponent
└── content/
    ├── page.tsx             ← side for å redigere sidetekster
    ├── actions.ts           ← server action: saveSiteContent
    └── ContentForm.tsx      ← skjema-komponent
```

**Nøkkelfiler utenfor `app/admin/`:**

| Fil | Hva den gjør |
|---|---|
| `proxy.ts` | Beskytter alle `/admin/*`-ruter (kjøres som Next.js Proxy) |
| `app/actions/auth.ts` | `login()` og `logout()` server actions |
| `lib/session.ts` | Oppretter, verifiserer og sletter JWT-sesjon |
| `lib/db.ts` | Prisma-klient (singleton) |
| `lib/content-db.ts` | Spørringer for innhold og tjenester, med fallback-verdier |
| `app/api/upload/route.ts` | API-rute for bildeopplasting |

---

## 2. Autentisering og rutebeskyttelse

### Innlogging

Innloggingssiden (`app/admin/login/page.tsx`) kaller `login()` server action fra `app/actions/auth.ts`:

```ts
// app/actions/auth.ts
export async function login(_prevState, formData) {
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD  // satt i .env

  // Konstant-tid-sammenligning (beskytter mot timing-angrep)
  let passwordsMatch = false
  try {
    passwordsMatch = timingSafeEqual(
      Buffer.from(password),
      Buffer.from(adminPassword),
    )
  } catch {
    // Buffere med ulik lengde kaster — behandles som feil passord
  }

  if (!passwordsMatch) return { error: 'Feil passord.' }

  await createAdminSession()  // oppretter JWT-cookie
  redirect('/admin')
}
```

`createAdminSession()` i `lib/session.ts` oppretter et JWT-token signert med `ADMIN_SESSION_SECRET` og lagrer det som en `HttpOnly`-cookie (`admin_session`) som varer i 7 dager.

### Rutebeskyttelse — proxy.ts

`proxy.ts` kjøres av Next.js som en Proxy-funksjon (dette prosjektet bruker Next.js 16 sin `proxy.ts`-konvensjon som erstatter den utdaterte `middleware.ts`; se `node_modules/next/dist/docs/.../proxy.md`) og sjekker JWT-cookien på **alle** requests til `/admin/*`:

```ts
// proxy.ts
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Beskytt alle /admin-sider unntatt selve innloggingssiden
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const authenticated = await isAuthenticated(req)
    if (!authenticated) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }
  }

  // Send allerede innloggede brukere videre fra login-siden
  if (path === '/admin/login') {
    const authenticated = await isAuthenticated(req)
    if (authenticated) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
  }

  return NextResponse.next()
}
```

### Dobbel beskyttelse i server actions

I tillegg til proxy.ts kaller **alle** server actions `requireAdmin()` før de gjør noe mot databasen. Dette sikrer at selv om noen omgår proxy-en, vil datamanipulasjon feile:

```ts
// app/admin/projects/actions.ts
async function requireAdmin() {
  const ok = await verifyAdminSession()
  if (!ok) throw new Error('Unauthorized')
}

export async function deleteProject(formData: FormData) {
  await requireAdmin()  // ← alltid første linje i enhver server action
  const id = formData.get('id') as string
  await prisma.project.delete({ where: { id } })
  // ...
}
```

---

## 3. Admin-layout og navigasjon

Alle admin-sider bruker `app/admin/layout.tsx` som wrapper. Dette gir dem en felles svart nav-bar øverst med lenker og en utloggingsknapp:

```tsx
// app/admin/layout.tsx (forkortet)
export default function AdminLayout({ children }) {
  return (
    <>
      <nav className="flex h-[52px] items-center justify-between bg-black px-4 text-white">
        <div className="flex items-center gap-4">
          <Link href="/admin">DUS ADMIN</Link>
          <Link href="/admin/projects">PROSJEKTER</Link>
          <Link href="/admin/projects/new">+ NYTT PROSJEKT</Link>
          <Link href="/admin/tjenester">TJENESTER</Link>
          <Link href="/admin/content">INNHOLD</Link>
        </div>
        <form action={logout}>
          <button type="submit">LOGG UT</button>
        </form>
      </nav>
      <div className="min-h-[calc(100vh-52px)] bg-dus-bg">{children}</div>
    </>
  )
}
```

`children` er selve sideinnholdet — for eksempel prosjektlisten eller et redigeringsskjema.

### Delte stiler

All visuell styling er sentralisert i `app/admin/adminStyles.ts` som eksporterer Tailwind-klasse-strenger:

```ts
// app/admin/adminStyles.ts (utvalg)
export const adminTitle = "mb-2 text-2xl font-light tracking-[0.1em] text-black"
export const adminPrimaryButton = "inline-flex ... bg-black px-6 py-3 text-white ..."
export const adminInput = "w-full border border-[#d0d0d0] bg-white px-3 py-2.5 ..."
export const adminCard = "border border-[#e5e5e5] bg-white"
export const adminWarningAlert = "border border-[#ffc107] bg-[#fff3cd] ..."
```

Komponentene importerer disse og bruker dem i JSX:
```tsx
<h1 className={adminTitle}>Rediger innhold</h1>
<button className={adminPrimaryButton}>LAGRE</button>
```

---

## 4. Mønsteret som gjentas overalt

Admin-koden følger ett konsistent mønster for alle skjemaer (prosjekter, innhold, tjenester):

```
Server-komponent (page.tsx)
  └─ henter data fra DB
  └─ rendrer en klient-komponent (Form.tsx) med data som props

Klient-komponent (Form.tsx)  [«use client»]
  └─ bruker useActionState(serverAction, null) for skjemastatus
  └─ rendrer et HTML-skjema med action={formAction}

Server action (actions.ts)   [«use server»]
  └─ 1. requireAdmin()
  └─ 2. valider input
  └─ 3. prisma-kall (create/update/delete/upsert)
  └─ 4. revalidatePath(...)  ← ugyldiggjør Next.js-cache
  └─ 5. redirect(...)        ← send bruker videre
```

Dette er React Server Actions-mønsteret fra Next.js App Router. Skjemaet kjøres på serveren uten JavaScript-avhengighet fra klientens side (progressivt forbedret), men `useActionState` gir deg optimistisk UI og feilvisning.

---

## 5. Prosjekter — CRUD

### 5.1 Opprette nytt prosjekt

**URL:** `/admin/projects/new`  
**Fil:** `app/admin/projects/new/page.tsx`

Siden er en enkel server-komponent som bare rendrer `ProjectForm` med `createProject`-action:

```tsx
// app/admin/projects/new/page.tsx
export default function NewProjectPage() {
  return (
    <div className={adminPageShellWide}>
      <h1 className={adminTitle}>Nytt prosjekt</h1>
      <ProjectForm action={createProject} submitLabel="OPPRETT PROSJEKT" />
    </div>
  )
}
```

**Server action — `createProject`** (`app/admin/projects/actions.ts`):

```ts
export async function createProject(_prev, formData) {
  await requireAdmin()

  const title = (formData.get('title') as string).trim()
  const slug  = (formData.get('slug') as string).trim()
  const coverImage = (formData.get('coverImage') as string).trim()

  // 1. Påkrevde felt
  if (!title || !slug || !coverImage) {
    return { error: 'Tittel, slug og forsidebilde er påkrevd.' }
  }

  // 2. Slugformat: kun a-z, 0-9 og bindestrek
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug kan kun inneholde små bokstaver, tall og bindestrek.' }
  }

  // 3. Slug må være unik
  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing) {
    return { error: `Slug "${slug}" er allerede i bruk.` }
  }

  // 4. Håndter publisering og sortOrder
  const isPublished = formData.get('published') === 'on'
  let sortOrder = null
  if (isPublished) {
    // Legg til på slutten av publiserte prosjekter
    const result = await prisma.project.aggregate({
      where: { published: true },
      _max: { sortOrder: true },
    })
    sortOrder = (result._max.sortOrder ?? -1) + 1
  }

  // 5. Parse galleribilder (images[0][src], images[0][caption], osv.)
  const images = parseImages(formData)

  // 6. Opprett prosjekt med tilhørende bilder
  await prisma.project.create({
    data: {
      title, slug, coverImage,
      shortDescription: ..., description: ..., location: ..., year: ...,
      published: isPublished, sortOrder,
      images: { create: images },  // ← oppretter ProjectImage-rader
    },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')            // ← oppdaterer forsiden
  redirect('/admin/projects')   // ← sender bruker tilbake til listen
}
```

**Bildeparsing** — galleribilder sendes som nummererte form-felter:

```ts
function parseImages(formData: FormData) {
  const images = []
  let i = 0
  while (formData.has(`images[${i}][src]`)) {
    const src = (formData.get(`images[${i}][src]`) as string).trim()
    if (src) {
      images.push({
        src,
        caption: formData.get(`images[${i}][caption]`) || '',
        order: i,
      })
    }
    i++
  }
  return images
}
```

Skjemaet i `ProjectForm.tsx` sender for eksempel:
- `images[0][src]` = `/img/prosjekt/bilde1.jpg`
- `images[0][caption]` = `Stua sett fra nord`
- `images[1][src]` = `/img/prosjekt/bilde2.jpg`

### 5.2 Redigere prosjekt

**URL:** `/admin/projects/[id]/edit`  
**Fil:** `app/admin/projects/[id]/edit/page.tsx`

Siden henter eksisterende prosjekt fra databasen og sender det inn som `project`-prop til `ProjectForm`:

```tsx
// app/admin/projects/[id]/edit/page.tsx (forkortet)
export default async function EditProjectPage({ params }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })

  if (project === null) notFound()

  return (
    <ProjectForm
      project={{
        id: project.id,
        title: project.title,
        slug: project.slug,
        coverImage: project.coverImage,
        published: project.published,
        images: project.images.map(img => ({
          src: img.src,
          caption: img.caption || '',
        })),
        // ... øvrige felt
      }}
      action={updateProject}
      submitLabel="LAGRE ENDRINGER"
    />
  )
}
```

`ProjectForm` er altså én delt komponent som brukes til **både** å opprette og redigere. Forskjellen er:
- Ved redigering sendes `project`-prop med eksisterende verdier → skjemaet vises forhåndsutfylt
- Ved redigering legges `<input type="hidden" name="id" value={project.id} />` til i skjemaet

**Server action — `updateProject`** likner `createProject`, men:
- Leser `id` fra skjemaet
- Sjekker at slug ikke er i bruk av et **annet** prosjekt (ikke seg selv)
- Erstatter alle bilder atomisk i én transaksjon:

```ts
await prisma.$transaction([
  // Slett alle eksisterende galleribilder
  prisma.projectImage.deleteMany({ where: { projectId: id } }),
  // Oppdater prosjektet og legg til nye bilder
  prisma.project.update({
    where: { id },
    data: {
      title, slug, coverImage, ...,
      images: { create: images },
    },
  }),
])

revalidatePath('/admin/projects')
revalidatePath(`/prosjekter/${slug}`)  // ← oppdaterer den offentlige prosjektsiden
revalidatePath('/')
redirect('/admin/projects')
```

### 5.3 Slette prosjekt

Sletteknappen er en separat klient-komponent, `DeleteProjectButton.tsx`:

```tsx
// app/admin/projects/components/DeleteProjectButton.tsx
'use client'
export default function DeleteProjectButton({ id, title }) {
  return (
    <form
      action={deleteProject}              // ← server action
      onSubmit={(e) => {
        // Vis bekreftelsesdialog i nettleseren
        if (!confirm(`Slett "${title}"? Dette kan ikke angres.`)) {
          e.preventDefault()             // ← avbryt hvis bruker klikker Avbryt
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit">SLETT</button>
    </form>
  )
}
```

**Server action — `deleteProject`**:

```ts
export async function deleteProject(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  await prisma.project.delete({ where: { id } })
  // Tilhørende ProjectImage-rader slettes automatisk via onDelete: Cascade i skjemaet
  revalidatePath('/admin/projects')
  revalidatePath('/')
}
```

`onDelete: Cascade` i Prisma-skjemaet sørger for at alle galleribilder knyttet til prosjektet automatisk slettes fra `ProjectImage`-tabellen.

### 5.4 Publisere og avpublisere

Publiseringsstatusen vises i prosjektlisten som en klikkbar badge. Det er to steder denne endres:

**Fra utkast-tabellen** — `PublishButton.tsx` publiserer ett prosjekt:

```tsx
'use client'
export default function PublishButton({ id }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button onClick={() => {
      startTransition(async () => {
        const fd = new FormData()
        fd.set('id', id)
        fd.set('published', 'true')
        await togglePublished(fd)
        router.refresh()
      })
    }}>
      {isPending ? '...' : 'UTKAST'}
    </button>
  )
}
```

**Fra portfolio-tabellen** — `SortableProjectList.tsx` avpubliserer (inline-klikk):

```tsx
// I SortableProjectList — klikk på «PUBLISERT»-badge
<button onClick={() => {
  startTransition(async () => {
    const fd = new FormData()
    fd.set('id', project.id)
    fd.set('published', 'false')     // ← avpubliser
    await togglePublished(fd)
    router.refresh()
  })
}}>
  PUBLISERT
</button>
```

**Server action — `togglePublished`**:

```ts
export async function togglePublished(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const published = formData.get('published') === 'true'

  let sortOrder = null
  if (published) {
    // Publiseres for første gang → legg til sist i portfolio
    const result = await prisma.project.aggregate({
      where: { published: true },
      _max: { sortOrder: true },
    })
    sortOrder = (result._max.sortOrder ?? -1) + 1
  }

  await prisma.project.update({
    where: { id },
    data: { published, sortOrder },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')
}
```

Når et prosjekt avpubliseres settes `sortOrder` tilbake til `null`. Når det publiseres igjen får det det høyeste `sortOrder`-tallet (legges sist i listen).

### 5.5 Sortere rekkefølge (drag-and-drop)

`SortableProjectList.tsx` er en klient-komponent med HTML5 drag-and-drop:

```tsx
'use client'
export default function SortableProjectList({ projects: initialProjects }) {
  const [projects, setProjects] = useState(initialProjects)
  const dragId = useRef(null)

  async function handleDrop(targetId) {
    // Finn rad som dras og der den slippes
    const fromIndex = projects.findIndex(p => p.id === dragId.current)
    const toIndex   = projects.findIndex(p => p.id === targetId)

    // Oppdater lokal state umiddelbart (optimistisk)
    const next = [...projects]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setProjects(next)

    // Lagre den nye rekkefølgen til databasen
    await reorderProjects(next.map(p => p.id))
  }

  return (
    <tr
      draggable
      onDragStart={() => { dragId.current = project.id }}
      onDrop={() => handleDrop(project.id)}
    >
      <td><span className="cursor-grab">⠿</span></td>  {/* drag-håndtak */}
      {/* ... øvrige celler */}
    </tr>
  )
}
```

**Server action — `reorderProjects`**:

```ts
export async function reorderProjects(ids: string[]) {
  await requireAdmin()
  // Oppdater sortOrder for alle prosjekter i én transaksjon
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.project.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath('/admin/projects')
  revalidatePath('/')
}
```

`ids`-arrayen er i ønsket rekkefølge, så `index` brukes direkte som `sortOrder` (0 = øverst).

---

## 6. Innhold — redigere sidetekster

**URL:** `/admin/content`  
**Filer:** `app/admin/content/page.tsx`, `ContentForm.tsx`, `actions.ts`

Det er fire redigerbare tekstfelt (nøkler):

| Nøkkel | Vist på |
|---|---|
| `intro_text` | Forsiden, mellom header og portfolio |
| `about_heading` | Overskrift i «Om oss»-seksjonen |
| `about_text` | Brødtekst i «Om oss»-seksjonen |
| `tjenester_intro` | Introduksjonstekst øverst på Tjenester-siden |

### Henting av data

Siden henter alle nøkler fra databasen via `getAllSiteContent()`:

```ts
// lib/content-db.ts
export async function getAllSiteContent(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteContent.findMany()
    // Start med standardverdier og overstyr med verdier fra DB
    const result = { ...SITE_CONTENT_DEFAULTS }
    for (const row of rows) {
      result[row.key] = row.value
    }
    return result
  } catch {
    // Hvis DB ikke er tilgjengelig → vis standardverdier
    return { ...SITE_CONTENT_DEFAULTS }
  }
}
```

Resultatet sendes som `initialValues` til `ContentForm`:

```tsx
// app/admin/content/page.tsx
const content = await getAllSiteContent()
return <ContentForm initialValues={content} />
```

### Lagring

`ContentForm.tsx` er en klient-komponent med `useActionState`:

```tsx
'use client'
export default function ContentForm({ initialValues }) {
  const [state, formAction, pending] = useActionState(saveSiteContent, null)

  return (
    <form action={formAction}>
      {state?.success && <div className={adminSuccessAlert}>Innhold lagret.</div>}
      {state?.error  && <div className={adminErrorAlert}>{state.error}</div>}

      <textarea name="intro_text"     defaultValue={initialValues.intro_text} />
      <input    name="about_heading"  defaultValue={initialValues.about_heading} />
      <textarea name="about_text"     defaultValue={initialValues.about_text} />
      <textarea name="tjenester_intro" defaultValue={initialValues.tjenester_intro} />

      <button type="submit">{pending ? 'LAGRER...' : 'LAGRE INNHOLD'}</button>
    </form>
  )
}
```

**Server action — `saveSiteContent`**:

```ts
// app/admin/content/actions.ts
export async function saveSiteContent(_prev, formData) {
  await requireAdmin()

  const keys = ['intro_text', 'about_heading', 'about_text', 'tjenester_intro']

  await prisma.$transaction(
    keys
      .filter(key => formData.has(key))
      .map(key => {
        const value = (formData.get(key) as string).trim()
        return prisma.siteContent.upsert({
          where:  { key },           // finn eksisterende rad
          update: { value },         // oppdater hvis den finnes
          create: { key, value },    // opprett hvis den ikke finnes
        })
      })
  )

  revalidatePath('/')          // ← oppdaterer forsiden
  revalidatePath('/tjenester') // ← oppdaterer tjenester-siden
  return { success: true }
}
```

`upsert` betyr at det ikke er nødvendig å sjekke om innholdet eksisterer fra før — Prisma håndterer det automatisk.

---

## 7. Tjenester — redigere tjenester

**URL:** `/admin/tjenester` og `/admin/tjenester/[id]/edit`

Tjenester kan ikke opprettes eller slettes gjennom admin-panelet (antallet er fast). Kun **redigering** av eksisterende tjenester er mulig.

### Listesiden

```tsx
// app/admin/tjenester/page.tsx
const services = await getServices()  // fra lib/content-db.ts

return services.map(service => (
  <div key={service.id}>
    <img src={service.image} />
    <p>{service.title}</p>
    <p>{service.description}</p>
    <Link href={`/admin/tjenester/${service.id}/edit`}>REDIGER</Link>
  </div>
))
```

### Redigeringssiden

`app/admin/tjenester/[id]/edit/page.tsx` henter tjenesten og sender den til `ServiceEditForm`:

```tsx
const services = await getServices()
const service = services.find(s => s.id === id)
if (!service) notFound()

return <ServiceEditForm service={service} />
```

`ServiceEditForm.tsx` er en klient-komponent med bildeopplasting og `useActionState`:

```tsx
'use client'
export default function ServiceEditForm({ service }) {
  const [state, formAction, pending] = useActionState(updateService, null)
  const [imageUrl, setImageUrl] = useState(service.image)

  // Direkte bildeopplasting via /api/upload
  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setImageUrl(url)  // ← oppdater forhåndsvisning og skjult felt
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={service.id} />
      <input name="title"       defaultValue={service.title} />
      <textarea name="description" defaultValue={service.description} />
      <input type="hidden" name="image" value={imageUrl} />  {/* lagrer opplastet URL */}
      <input type="file" onChange={handleImageUpload} />
    </form>
  )
}
```

**Server action — `updateService`**:

```ts
export async function updateService(_prev, formData) {
  await requireAdmin()
  const id          = formData.get('id') as string
  const title       = (formData.get('title') as string).trim()
  const description = (formData.get('description') as string).trim()
  const image       = (formData.get('image') as string).trim()

  if (!title || !description || !image) {
    return { error: 'Tittel, beskrivelse og bilde er påkrevd.' }
  }

  await ensureServicesSeeded()  // oppretter DB-rader fra statisk data hvis tabellen er tom

  await prisma.service.upsert({
    where:  { id },
    update: { title, description, image },
    create: { id, title, description, image, sortOrder: 0 },
  })

  revalidatePath('/admin/tjenester')
  revalidatePath('/tjenester')
  redirect('/admin/tjenester')
}
```

Legg merke til `ensureServicesSeeded()` — den sjekker om `Service`-tabellen er tom, og fyller den da med statisk data fra `lib/services.ts`. Dette skjer første gang en tjeneste redigeres.

---

## 8. Bildeopplasting

All bildeopplasting skjer via `POST /api/upload` (`app/api/upload/route.ts`).

```
Klient               Server (Next.js API-rute)
  │                        │
  ├──POST /api/upload──────►│ 1. Verifiser admin-sesjon
  │  (multipart form)       │ 2. Valider filtype (kun JPEG/PNG/GIF/WebP)
  │                        │ 3. Valider filstørrelse (maks 10 MB)
  │                        │ 4. Generer tilfeldig filnavn
  │                        │ 5a. Prod: lagre i Vercel Blob
  │                        │ 5b. Dev:  lagre i public/uploads/
  ◄────{ url: "..." }───────│ 6. Returner URL
```

Klient-koden i `ProjectForm.tsx` ser slik ut:

```ts
async function uploadImageFile(file: File): Promise<{ url: string } | { error: string }> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) return { error: data.error }
  return { url: data.url }
}
```

Når opplastingen er ferdig oppdateres `coverImageUrl` (React state), som igjen fyller inn den skjulte `<input name="coverImage">` i skjemaet. Slik følger bilde-URL'en med når skjemaet sendes.

---

## 9. Database-skjema

Databaseskjemaet (`prisma/schema.prisma`) har fire modeller:

```prisma
model Project {
  id               String         @id @default(cuid())
  slug             String         @unique        // URL-vennlig identifikator
  title            String
  shortDescription String?
  description      String?
  location         String?
  year             String?
  coverImage       String
  published        Boolean        @default(false)
  sortOrder        Int?                          // null = utkast, ellers posisjon i portfolio
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  images           ProjectImage[]               // relasjon til galleribilder
}

model ProjectImage {
  id        String  @id @default(cuid())
  src       String
  caption   String?
  order     Int     @default(0)
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String
}

model SiteContent {
  key       String   @id   // f.eks. "intro_text"
  value     String
  updatedAt DateTime @updatedAt
}

model Service {
  id          String @id @default(cuid())
  title       String
  description String
  image       String
  sortOrder   Int    @default(0)
}
```

**Viktige design-valg:**
- `sortOrder: null` betyr at prosjektet er et utkast (ikke publisert). Publiserte prosjekter har alltid et tall.
- `onDelete: Cascade` på `ProjectImage` sørger for at galleribilder automatisk slettes når prosjektet slettes.
- `SiteContent` er en enkel nøkkel/verdi-tabell — en rad per innholdsfelt.

---

## 10. Feilhåndtering og fallback-verdier

Koden er skrevet for å tåle at databasen ikke er tilkoblet (f.eks. lokalt under utvikling uten `.env`):

**I lib/content-db.ts** — alle funksjoner returnerer statiske standardverdier hvis DB-kallet feiler:

```ts
export async function getAllSiteContent() {
  try {
    const rows = await prisma.siteContent.findMany()
    // ... bruk DB-verdier
  } catch {
    return { ...SITE_CONTENT_DEFAULTS }  // ← vis standardtekst
  }
}
```

**I admin-sider** — vises en advarsel hvis DB ikke er tilkoblet:

```tsx
// app/admin/page.tsx
const stats = await getStats()  // returnerer null hvis DB feiler

{stats === null && (
  <div className={adminWarningAlert}>
    <strong>Database ikke tilkoblet.</strong>
    Sett opp DATABASE_URL i .env for å aktivere databasefunksjonalitet.
  </div>
)}
```

**I redigeringssider** — vises samme advarsel i stedet for skjemaet:

```tsx
// app/admin/projects/[id]/edit/page.tsx
{project ? (
  <ProjectForm project={project} action={updateProject} submitLabel="LAGRE ENDRINGER" />
) : (
  <div className={adminWarningAlert}>Database ikke tilkoblet.</div>
)}
```

---

## Oppsummering — dataflyt for prosjekter

```
[Bruker åpner /admin/projects/new]
  │
  ▼
app/admin/projects/new/page.tsx   (Server Component — ingen DB-kall her)
  └─► <ProjectForm action={createProject} />  (Client Component)
        └─ Viser tomt skjema

[Bruker fyller ut og klikker "OPPRETT PROSJEKT"]
  │
  ▼
Server Action: createProject()    (kjører på serveren)
  ├─ requireAdmin()               → verifiserer JWT-sesjon
  ├─ valider title, slug, cover
  ├─ sjekk slug-unikhet
  ├─ prisma.project.create(...)   → skriver til PostgreSQL
  ├─ revalidatePath('/') etc.     → ugyldiggjør Next.js-cache
  └─ redirect('/admin/projects')  → sender bruker tilbake til listen

[Neste request til /]
  │
  ▼
components/PortfolioGrid.tsx
  └─ lib/projects-db.ts: prisma.project.findMany({ published: true })
     → nytt prosjekt er nå synlig på forsiden (hvis publisert)
```
