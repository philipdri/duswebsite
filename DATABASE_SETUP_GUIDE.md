# Database Setup Guide — DUS Arkitekter

This guide walks you through setting up the PostgreSQL database for the DUS Arkitekter website from scratch. It is written for the site's owners and is designed to be as straightforward as possible — you only need to follow it **once**. After that, the site runs itself and the admin panel handles everything day-to-day with **no code required**.

---

## Overview

The site uses a free PostgreSQL database hosted at **[Neon](https://neon.tech)** (recommended). Neon is a managed, serverless Postgres service with a generous free tier that is more than enough for this website. It integrates directly with Vercel, where the site is deployed.

### Why Neon?

| Feature | Detail |
|---|---|
| Cost | Free tier: 0.5 GB storage, plenty for a portfolio site |
| Setup time | ~5 minutes |
| Maintenance | Zero — Neon handles backups, updates, uptime |
| Vercel integration | One-click connect from the Vercel dashboard |
| Scaling | Automatically scales; no config needed |

---

## What You Will Need

- A **[Vercel](https://vercel.com)** account (the site is deployed here)
- A **[Neon](https://neon.tech)** account (free — sign in with GitHub or Google)
- A computer with **[Node.js](https://nodejs.org)** installed (only needed for the one-time database setup step)
- The repository cloned locally (or access via Vercel CLI)

---

## Step 1 — Create a Neon Database

1. Go to [https://neon.tech](https://neon.tech) and click **Sign Up** (use GitHub or Google — it's free).
2. On the dashboard, click **Create Project**.
3. Fill in:
   - **Project name**: `duswebsite` (or any name you like)
   - **Postgres version**: leave as the default (latest)
   - **Region**: `Frankfurt` or `Amsterdam` (closest to Norway)
4. Click **Create Project**.

Neon will create your database in about 10 seconds.

### Get your connection string

After creation, Neon shows a **Connection Details** panel. You need the **connection string** (also called a database URL). It looks like this:

```
postgresql://neondb_owner:<password>@ep-example-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

Neon generates the username and password for you — copy the string exactly as shown in the dashboard.

> **Important:** Keep this string private. It is the password to your database.  
> Copy it now — you will use it in Steps 2 and 3.

---

## Step 2 — Configure Vercel Environment Variables

This step tells the site how to connect to your database and protects your admin panel.

1. Go to your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Click **Settings** → **Environment Variables**.
3. Add the following three variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | The connection string you copied from Neon (see Step 1) |
| `ADMIN_PASSWORD` | A secure password for the admin panel (you choose this) |
| `ADMIN_SESSION_SECRET` | A long random string, at least 32 characters (see note below) |

> **Important:** `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are **not** set by the Neon integration — you must add them manually. Without both variables, you cannot log in to the admin panel.

#### Generating ADMIN_SESSION_SECRET

This value signs admin login sessions securely. Generate a random one:

**Option A — Use your terminal:**
```bash
openssl rand -base64 32
```

**Option B — Use an online generator:**  
Go to [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) — it generates a safe random string. Copy it.

4. Set all three variables to apply to **Production**, **Preview**, and **Development** environments.
5. Click **Save** for each variable.

---

## Step 3 — Connect Neon to Vercel (Recommended if you used the Neon integration)

If you connected Neon to your Vercel project via the Neon integration (Vercel → **Storage** → **Connect Store** → **Neon**), Neon automatically sets several environment variables in Vercel for you, including:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled (pgbouncer) connection — used by the app at runtime |
| `DATABASE_URL_UNPOOLED` | Direct connection — used by Prisma migrations during the build |

The site's code and build process are configured to use both automatically:
- **Runtime queries** (`lib/db.ts`) use `DATABASE_URL` (pooled).
- **Migrations** (`prisma.config.ts`, run during Vercel build) use `DATABASE_URL_UNPOOLED` when available, falling back to `DATABASE_URL`.

If you **skipped** the Neon integration and pasted `DATABASE_URL` manually (Step 2), that is equally fine. In that case, paste the **direct** connection string (without pgbouncer) so that migrations work correctly.

---

## Step 4 — Set Up the Database Schema (One-Time Only)

This step creates the database tables (`Project` and `ProjectImage`) that the site uses. You only run this **once**, when first setting up the site.

### 4a — Install dependencies

Clone the repository to your computer and run:

```bash
npm install
```

### 4b — Create your local environment file

Copy the example file and fill it in:

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
DATABASE_URL="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"
ADMIN_PASSWORD="choose-a-strong-password"
ADMIN_SESSION_SECRET="your-random-32-char-string-here"
```

Use the same `DATABASE_URL` from Neon (Step 1). This file is **never committed** to the repository (it is in `.gitignore`).

### 4c — Generate the Prisma client

```bash
npx prisma generate
```

This generates type-safe database access code from `prisma/schema.prisma`.

### 4d — Create the database tables

```bash
npx prisma migrate dev --name init
```

This creates the `Project` and `ProjectImage` tables in your Neon database. You will see:

```
✔ Generated Prisma Client
Applying migration `20240101000000_init`
Your database is now in sync with your schema.
```

### 4e — (Optional) Seed the database with existing projects

If you want the six existing DUS projects to appear immediately:

```bash
npx prisma db seed
```

Output:

```
Seeding projects...
  ✓ Enebolig i Bergen
  ✓ The Three Temporary
  ✓ Enebolig på Askøy
  ✓ Fiktivt sommerhus i Danmark
  ✓ Hytte på Samnøy
  ✓ [...] rommelig som havet
Done.
```

If you prefer to start fresh and add projects via the admin panel, you can skip this step.

---

## Step 5 — Deploy to Vercel

### Configure the build command

The `vercel.json` file in the repository already sets the correct build command automatically:

```
npx prisma migrate deploy && npx prisma generate && next build
```

This does three things on every Vercel deploy:
1. **`prisma migrate deploy`** — applies any pending database migrations (creates tables on first deploy, no-op if already up to date)
2. **`prisma generate`** — generates the Prisma client used by the app
3. **`next build`** — builds the Next.js app

> You do not need to change anything in Vercel's build settings — the `vercel.json` file handles it.

### First deploy

Make sure you have completed Steps 2–4 (environment variables and database tables) before deploying, or trigger a redeploy after adding the environment variables. Vercel will:

1. Apply database migrations (creates `Project` and `ProjectImage` tables)
2. Generate the Prisma client
3. Build and deploy the Next.js app

After the deployment succeeds, your site is live at your Vercel URL (e.g. `https://duswebsite.vercel.app` or your custom domain).

---

## Step 6 — Access the Admin Panel

Once the site is live, go to:

```
https://your-site.vercel.app/admin
```

Log in with the `ADMIN_PASSWORD` you set in Step 2. From the admin panel you can:

- **Add new projects** — fill in the title, description, images, location, year
- **Edit projects** — update any text or images
- **Delete projects** — permanently remove a project
- **Publish / Unpublish** — toggle visibility on the public site with one click
- **Reorder projects** — set `sortOrder` (lower numbers appear first)

No code is needed. Everything updates live on the public site as soon as you save.

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for a full walkthrough of the admin interface.

---

## Checklist — Full Setup Summary

Use this as a quick reference:

- [ ] Create Neon account and project at [neon.tech](https://neon.tech)
- [ ] Copy the Neon connection string
- [ ] Add `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` to Vercel environment variables
- [ ] (Optional) Connect Neon to Vercel via the Vercel Storage integration
- [ ] Clone the repo locally and run `npm install`
- [ ] Create `.env` from `.env.example` and fill in values
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev --name init` to create database tables
- [ ] (Optional) Run `npx prisma db seed` to load existing projects
- [ ] Deploy to Vercel (build command `npx prisma migrate deploy && npx prisma generate && next build` is set automatically via `vercel.json`)
- [ ] Log in at `/admin` and verify the admin panel works

---

## Troubleshooting

### "Can't reach database server"

- Double-check the `DATABASE_URL` in Vercel environment variables. Make sure there are no extra spaces or missing characters.
- In Neon, go to your project → **Connection Details** and copy the string again.
- Make sure `?sslmode=require` is included at the end of the URL.

### "Server misconfiguration" error on admin login

- You are missing one or both of the required admin environment variables. In Vercel → **Settings** → **Environment Variables**, make sure both `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are set. These are **not** added by the Neon integration — you must add them manually.
- After adding them, trigger a new deployment in Vercel so the app picks up the new values.

### Wrong password / can't log in

- The `ADMIN_PASSWORD` in Vercel must exactly match what you type at `/admin/login`. There are no password resets — if you forget it, update the `ADMIN_PASSWORD` environment variable in Vercel and redeploy.

### "Prisma Client not generated"

- The `vercel.json` in this repository sets the build command automatically. If you overrode the build command in Vercel's dashboard, restore it to: `npx prisma migrate deploy && npx prisma generate && next build`.

### The public site shows no projects

- Log in at `/admin/projects` and check that projects are marked **Published** (green badge). Unpublished projects are hidden from the public site.
- If the database is empty, run `npx prisma db seed` locally to add the default projects.

### Database tables don't exist after deploy

- This is handled automatically by the `prisma migrate deploy` step in the build command. If tables are still missing, check Vercel's deployment logs for migration errors.
- You can also verify tables exist using the Neon dashboard → **SQL Editor**: run `\dt` or `SELECT * FROM "Project" LIMIT 1;`.

---

## Security Notes

- **Never commit `.env`** — it contains your database credentials. The `.gitignore` already excludes it.
- **Rotate secrets periodically** — update `ADMIN_SESSION_SECRET` in Vercel if you suspect a compromise. Active admin sessions will be invalidated (users must log in again).
- **Use a strong `ADMIN_PASSWORD`** — at least 16 characters, mixing letters, numbers, and symbols.
- **Neon connection string** — treat it like a password. Do not share it or paste it in public channels.

---

## Ongoing Maintenance

After the initial setup, **no database maintenance is required**. Neon handles:

- Automatic backups (point-in-time restore for 7 days on free tier)
- Uptime monitoring
- Security patches
- Auto-scaling

The only tasks for the DUS owners are adding, editing, and publishing projects via the admin panel at `/admin`. No technical knowledge is required.
