# Architecture Guide: DUS Arkitekter Next.js App

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16+ | App Router, routing, server actions |
| TypeScript | 5+ | Type safety throughout |
| Tailwind CSS | 4+ | Utility-first layout/spacing |
| Prisma | 7+ | ORM for PostgreSQL |
| PostgreSQL | — | Project database |
| jose | — | JWT session signing |
| Adobe Typekit | — | `classico-urw` font (CDN) |
| Ionicons | 7.1.0 | Social/icon web components (CDN) |

---

## Directory Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: html/body, fonts, meta only
│   ├── globals.css             # Tailwind directives + global resets
│   ├── (public)/               # Route group: public-facing pages
│   │   ├── layout.tsx          # Public layout: Header + Footer wrapper
│   │   ├── page.tsx            # Home page
│   │   ├── tjenester/
│   │   │   └── page.tsx        # Services page
│   │   └── prosjekter/
│   │       └── [slug]/
│   │           └── page.tsx    # Dynamic project detail page (DB-driven)
│   ├── admin/                  # Admin area (protected by proxy.ts)
│   │   ├── layout.tsx          # Admin layout: black nav bar
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx        # Admin login page
│   │   ├── projects/
│   │   │   ├── page.tsx        # Project list
│   │   │   ├── actions.ts      # Server actions: CRUD + toggle + reorder
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Create project
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx # Edit project
│   │   │   └── components/
│   │   │       ├── ProjectForm.tsx         # Shared create/edit form (client)
│   │   │       ├── DeleteProjectButton.tsx # Delete with confirm dialog
│   │   │       ├── PublishButton.tsx       # Toggle publish status
│   │   │       └── SortableProjectList.tsx # Drag-and-drop reorder
│   │   ├── tjenester/
│   │   │   ├── page.tsx        # Services list
│   │   │   ├── actions.ts      # Server action: updateService
│   │   │   └── [id]/edit/
│   │   │       ├── page.tsx         # Edit one service
│   │   │       └── ServiceEditForm.tsx # Form component (client)
│   │   └── content/
│   │       ├── page.tsx        # Edit site text content
│   │       ├── actions.ts      # Server action: saveSiteContent
│   │       └── ContentForm.tsx # Form component (client)
│   └── actions/
│       └── auth.ts             # Login / logout server actions
│
├── components/                 # Reusable React components
│   ├── Header.tsx              # Fixed nav with hamburger (client)
│   ├── Footer.tsx              # Dark footer with contact + socials
│   ├── HeroSection.tsx         # Full-viewport hero (client, scroll animation)
│   ├── PortfolioGrid.tsx       # Grid container (server, DB-driven)
│   ├── PortfolioItem.tsx       # Individual project card (client, IntersectionObserver)
│   ├── ProjectSlideshow.tsx    # Image slideshow prev/next (client)
│   ├── AboutSection.tsx        # Om Oss section with team photos
│   └── ScrollToTop.tsx         # Floating back-to-top button (client)
│
├── lib/                        # Data and utilities
│   ├── db.ts                   # Prisma client singleton (pg adapter)
│   ├── session.ts              # JWT session creation/verification
│   ├── projects.ts             # Static project data (fallback when DB unavailable)
│   ├── projects-db.ts          # DB-backed project queries
│   ├── content-db.ts           # DB queries for site content + services (with fallbacks)
│   └── services.ts             # Static services data (fallback when DB unavailable)
│
├── types/
│   └── ion-icon.d.ts           # TypeScript declaration for <ion-icon> custom element
│
├── prisma/
│   ├── schema.prisma           # Database schema (Project + ProjectImage)
│   └── seed.ts                 # Seed script: imports static projects into DB
│
├── prisma.config.ts            # Prisma 7 config: datasource URL
├── proxy.ts                    # Next.js Proxy (replaces middleware.ts in Next.js 16): admin route protection
│
├── public/
│   └── img/                    # All static images (copied from legacy img/)
│
├── legacy/                     # Original static HTML/CSS/JS (archived, not served)
│
├── .env.example                # Environment variable template
├── ADMIN_GUIDE.md              # Admin system documentation
├── ARCHITECTURE_GUIDE.md       # This file
├── MIGRATION_PLAN.md           # Phase 1 migration audit and plan
└── README.md                   # Quick start and setup
```

---

## Routing

| URL | File | Type |
|---|---|---|
| `/` | `app/(public)/page.tsx` | Dynamic (DB) |
| `/tjenester` | `app/(public)/tjenester/page.tsx` | Static |
| `/prosjekter/[slug]` | `app/(public)/prosjekter/[slug]/page.tsx` | Dynamic (DB) |
| `/admin/login` | `app/admin/login/page.tsx` | Static |
| `/admin` | `app/admin/page.tsx` | Dynamic (protected) |
| `/admin/projects` | `app/admin/projects/page.tsx` | Dynamic (protected) |
| `/admin/projects/new` | `app/admin/projects/new/page.tsx` | Static (protected) |
| `/admin/projects/[id]/edit` | `app/admin/projects/[id]/edit/page.tsx` | Dynamic (protected) |
| `/admin/tjenester` | `app/admin/tjenester/page.tsx` | Dynamic (protected) |
| `/admin/tjenester/[id]/edit` | `app/admin/tjenester/[id]/edit/page.tsx` | Dynamic (protected) |
| `/admin/content` | `app/admin/content/page.tsx` | Dynamic (protected) |

Public project pages are dynamically rendered and read only `published: true` projects from the database.

---

## Route Groups

The app uses a route group `(public)` to separate public pages from admin pages:

- `app/(public)/layout.tsx` — adds Header + Footer to all public routes
- `app/admin/layout.tsx` — adds admin nav bar, no Header/Footer
- `app/layout.tsx` — root layout with just `<html>`, `<body>`, fonts (shared by both groups)

---

## Auth Architecture

1. **Login**: POST to `app/actions/auth.ts` → `login()` server action
   - Compares submitted password with `ADMIN_PASSWORD` env variable using constant-time comparison (`crypto.timingSafeEqual`)
   - On success: creates a signed JWT via `lib/session.ts`, stores in `HttpOnly` cookie
2. **Protection**: `proxy.ts` runs on all `/admin/*` routes
   - Reads the `admin_session` cookie
   - Verifies JWT signature using `ADMIN_SESSION_SECRET`
   - Redirects to `/admin/login` if invalid or missing
3. **Logout**: `logout()` server action deletes the cookie, redirects to `/admin/login`
4. **Server-side guard**: Admin server actions in `actions.ts` call `requireAdmin()` which re-verifies the session before any mutation

---

## Data Flow

### Public site (with DB connected)

```
Request → proxy.ts (no admin route, passes through)
       → app/(public)/layout.tsx (Header + Footer)
       → page.tsx / [slug]/page.tsx
       → lib/projects-db.ts → prisma.project.findMany({ published: true })
       → PostgreSQL
```

### Public site (DB unavailable / build time fallback)

```
lib/projects.ts (static array) → PortfolioGrid / project detail page
```

### Admin CRUD

```
Admin form → Server Action (app/admin/projects/actions.ts)
           → requireAdmin() → session check
           → prisma.project.create/update/delete
           → revalidatePath('/') → revalidatePath('/admin/projects')
           → redirect('/admin/projects')
```

---

## Component Organization

### Server Components
- `PortfolioGrid` — fetches published projects from DB (falls back to static)
- `AboutSection` — static text + images
- `Footer` — static HTML
- All admin pages (dashboard, project list, edit page)

### Client Components (`'use client'`)
- `Header` — hamburger menu toggle
- `HeroSection` — scroll event for logo fade
- `PortfolioItem` — IntersectionObserver scroll-in animation
- `ProjectSlideshow` — prev/next slideshow state
- `ScrollToTop` — scroll event + click handler
- `ProjectForm` (admin) — dynamic image list management

---

## Prisma / Database

### Schema (`prisma/schema.prisma`)
Two models:
- **Project** — core project data: `slug`, `title`, `shortDescription`, `description`, `location`, `year`, `coverImage`, `published`, `sortOrder`
- **ProjectImage** — gallery images linked to a project via `projectId`

### Prisma 7 Configuration
In Prisma 7, the connection URL is no longer in `schema.prisma` but in `prisma.config.ts`:

```ts
import { defineConfig } from 'prisma/config'
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: process.env.DATABASE_URL! },
})
```

The Prisma client uses the `@prisma/adapter-pg` driver adapter (`lib/db.ts`):

```ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = new PrismaClient({ adapter })
```

---

## Vercel Deployment

- Set `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` in Vercel environment variables
- Build command: `npx prisma generate && next build`
- Run migrations before first deploy: `npx prisma migrate deploy`
- See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for full deployment instructions
