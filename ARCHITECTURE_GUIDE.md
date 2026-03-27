# Architecture Guide: DUS Arkitekter Next.js App

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16+ | App Router, SSG, routing |
| TypeScript | 5+ | Type safety throughout |
| Tailwind CSS | 4+ | Utility-first layout/spacing |
| Prisma | 6+ | ORM for future PostgreSQL CMS |
| Adobe Typekit | — | `classico-urw` font (CDN) |
| Ionicons | 7.1.0 | Social/icon web components (CDN) |

---

## Directory Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: Header, Footer, fonts, meta
│   ├── page.tsx                # Home page
│   ├── globals.css             # Tailwind directives + global resets
│   ├── tjenester/
│   │   └── page.tsx            # Services page
│   └── prosjekter/
│       └── [slug]/
│           └── page.tsx        # Dynamic project detail page (SSG)
│
├── components/                 # Reusable React components
│   ├── Header.tsx              # Fixed nav with hamburger (client)
│   ├── Footer.tsx              # Dark footer with contact + socials
│   ├── HeroSection.tsx         # Full-viewport hero (client, scroll animation)
│   ├── PortfolioGrid.tsx       # Grid container (server)
│   ├── PortfolioItem.tsx       # Individual project card (client, IntersectionObserver)
│   ├── ProjectSlideshow.tsx    # Image slideshow prev/next (client)
│   ├── AboutSection.tsx        # Om Oss section with team photos
│   └── ScrollToTop.tsx         # Floating back-to-top button (client)
│
├── lib/                        # Data and utilities
│   ├── projects.ts             # All 6 projects: typed array + helper function
│   └── services.ts             # 3 services: typed array
│
├── types/
│   └── ion-icon.d.ts           # TypeScript declaration for <ion-icon> custom element
│
├── prisma/
│   └── schema.prisma           # Database schema (Project + ProjectImage)
│
├── public/
│   └── img/                    # All static images (copied from legacy img/)
│
├── legacy/                     # Original static HTML/CSS/JS (archived, not served)
│
├── .env.example                # Environment variable template
├── MIGRATION_PLAN.md           # Migration audit and plan
├── ARCHITECTURE_GUIDE.md       # This file
└── README.md                   # Quick start and setup
```

---

## Routing

| URL | File | Type |
|---|---|---|
| `/` | `app/page.tsx` | Static |
| `/tjenester` | `app/tjenester/page.tsx` | Static |
| `/prosjekter/bergen` | `app/prosjekter/[slug]/page.tsx` | SSG |
| `/prosjekter/nationaltheatret` | `app/prosjekter/[slug]/page.tsx` | SSG |
| `/prosjekter/askoy` | `app/prosjekter/[slug]/page.tsx` | SSG |
| `/prosjekter/sommerhus` | `app/prosjekter/[slug]/page.tsx` | SSG |
| `/prosjekter/sommerhytte` | `app/prosjekter/[slug]/page.tsx` | SSG |
| `/prosjekter/masteroppgave` | `app/prosjekter/[slug]/page.tsx` | SSG |

All routes are statically generated at build time via `generateStaticParams()`.

---

## Component Organization

### Server Components (no interactivity needed)
- `PortfolioGrid` — renders list of projects from `lib/projects.ts`
- `AboutSection` — static text + images
- `Footer` — static HTML

### Client Components (`'use client'`)
- `Header` — hamburger menu toggle, logo scroll animation on home page
- `HeroSection` — scroll event for logo fade
- `PortfolioItem` — IntersectionObserver scroll-in animation
- `ProjectSlideshow` — prev/next slideshow state
- `ScrollToTop` — scroll event + click handler

---

## Public Data Flow

```
lib/projects.ts (typed TS array)
    ↓
PortfolioGrid (server) → maps over projects → passes each to PortfolioItem
    ↓
PortfolioItem (client) → renders cover image + label + link

lib/projects.ts
    ↓
app/prosjekter/[slug]/page.tsx (SSG server component)
    ↓
ProjectSlideshow (client) → receives images array as prop
```

When Phase 2 CMS is integrated, `lib/projects.ts` exports will be replaced by Prisma queries (`prisma.project.findMany()`), and the component interfaces remain unchanged.

---

## Prisma / Database Groundwork

### Schema (`prisma/schema.prisma`)
Two models:
- **Project** — core project data with `slug`, `title`, `shortDescription`, `description`, `location`, `year`, `coverImage`, `published`, `sortOrder`
- **ProjectImage** — individual gallery images linked to a project

### Setup
1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma migrate dev` to create tables
4. Run `npx prisma generate` to generate the Prisma Client

### Seed Strategy
The 6 projects currently in `lib/projects.ts` are the seed source. A `prisma/seed.ts` file should be created in Phase 2 to import from `lib/projects.ts` and call `prisma.project.createMany()`.

---

## Phase 2 Admin Integration

The current architecture is designed so Phase 2 admin features plug in cleanly:

1. **Auth**: Add NextAuth.js (or Clerk) and protect `/admin/**` routes via middleware
2. **Admin routes**: Create `app/admin/page.tsx`, `app/admin/projects/page.tsx`, etc.
3. **CMS data flow**: Replace `lib/projects.ts` array with `prisma.project.findMany({ where: { published: true } })` calls
4. **API routes**: Add `app/api/projects/route.ts` for CRUD operations
5. **Image uploads**: Integrate Vercel Blob or Cloudinary for image storage

The `prisma/schema.prisma` file is already prepared for this with the `published` and `sortOrder` fields.

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. (Optional) Set up database
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Vercel Deployment Considerations

- The app is fully statically generated (`output: 'export'` can be added to `next.config.ts` if needed for GitHub Pages)
- The `CNAME` file in the root configures `dusarkitekter.no` for GitHub Pages; for Vercel, the domain is configured in the Vercel dashboard
- Environment variables (`DATABASE_URL`) must be set in the Vercel project settings for Phase 2
- Images are served from `public/img/` — no external CDN needed for Phase 1
- The Adobe Typekit CSS link requires internet access (expected in production)
