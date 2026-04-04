# DUS Arkitekter

Official website for [DUS Arkitekter](https://dusarkitekter.no) — a Norwegian architecture firm.

## Overview

This site showcases DUS Arkitekter's projects, services, and philosophy. It was migrated from a static HTML/CSS/JS site to a Next.js + TypeScript application (Phase 1), and a full admin + database-backed project management system was added in Phase 2.

## Stack

| Tool | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework, routing, server actions |
| TypeScript | Type-safe code |
| Tailwind CSS | Utility-first styling |
| [Prisma 7](https://www.prisma.io/) | ORM for PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | Project database |
| [jose](https://github.com/panva/jose) | JWT session signing |
| Adobe Typekit | `classico-urw` font |
| Ionicons | Social/UI icons |

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env
# Edit .env: set DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET

# 3. Generate Prisma Client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. (Optional) Seed with existing project data
npx prisma db seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | JWT signing secret (random, min 32 chars) |

See `.env.example` for a template.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Apply schema migrations (dev) |
| `npx prisma migrate deploy` | Apply schema migrations (production) |
| `npx prisma db seed` | Seed database with existing projects |

## Admin

The admin panel (`/admin`) lets owners:
- Log in with a password
- Create, edit, delete projects
- Publish / unpublish projects
- Manage gallery images

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for full admin documentation.

## Database Setup

For a complete, step-by-step guide to setting up the PostgreSQL database (using the free [Neon](https://neon.tech) hosting service) and deploying to Vercel, see:

👉 **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)**

## Deployment on Vercel

1. Connect the repo to Vercel.
2. In Vercel settings → **Environment Variables**, add `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (and `BLOB_READ_WRITE_TOKEN` for image uploads).
3. Ensure the **Framework Preset** in Vercel settings is set to **Next.js** (the `vercel.json` now sets `"framework": "nextjs"` to enforce this automatically).
4. The build command is already configured in `vercel.json`: `npx prisma generate && npx prisma migrate deploy && next build` — this generates the Prisma client and applies any pending database migrations on every deploy.
5. Deploy.

> **Troubleshooting 404 on Vercel:** If the site returns 404 after deployment, check:
> - The Framework Preset in Vercel → Settings → General is **Next.js**.
> - All required environment variables are set (see above).
> - The Vercel build log shows a successful build (not a build error).

See [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md) for a detailed walkthrough.

## Project Structure

See [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) for full documentation.

## Migration

See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) for the Phase 1 migration audit and plan. Original static files are preserved in `legacy/`.
