# DUS Arkitekter

Official website for [DUS Arkitekter](https://dusarkitekter.no) — a Norwegian architecture firm.

## Overview

This site showcases DUS Arkitekter's projects, services, and philosophy. It was migrated from a static HTML/CSS/JS site to a Next.js + TypeScript application (Phase 1 migration).

## Stack

| Tool | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) (App Router) | Framework, SSG routing |
| TypeScript | Type-safe code |
| Tailwind CSS | Utility-first styling |
| [Prisma](https://www.prisma.io/) | ORM for future PostgreSQL CMS |
| Adobe Typekit | `classico-urw` font |
| Ionicons | Social/UI icons |

## Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (11 static pages) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Database Setup (Phase 2)

Prisma is included but not yet connected to a live database (project data is in `lib/projects.ts`).

To enable database support:

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Set your PostgreSQL connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/duswebsite"

# 3. Run migrations
npx prisma migrate dev

# 4. Generate Prisma Client
npx prisma generate
```

## Deployment

The site is deployed on **GitHub Pages** with the custom domain `dusarkitekter.no` (configured via `CNAME`).

For **Vercel** deployment:
1. Connect the repo to Vercel
2. Set `DATABASE_URL` in Vercel environment variables (Phase 2)
3. Deploy — all pages are statically generated

## Project Structure

See [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) for full documentation.

## Migration

See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) for the Phase 1 migration audit and plan. Original static files are preserved in `legacy/`.
