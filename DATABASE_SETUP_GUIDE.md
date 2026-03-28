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

This step tells the site how to connect to your database.

1. Go to your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Click **Settings** → **Environment Variables**.
3. Add the following three variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | The connection string you copied from Neon (see Step 1) |
| `ADMIN_PASSWORD` | A secure password for the admin panel (you choose this) |
| `ADMIN_SESSION_SECRET` | A long random string, at least 32 characters (see note below) |

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

## Step 3 — Connect Neon to Vercel (Optional but Recommended)

Vercel and Neon have a native integration that makes things even easier.

1. In Vercel → **Storage** → **Connect Store**.
2. Click **Neon** → **Connect**.
3. Follow the prompts to authorise and select your Neon project.

This automatically keeps your `DATABASE_URL` in sync. If you skip this step, manually pasting the connection string in Step 2 is equally fine.

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

In Vercel → **Settings** → **Build & Development Settings**, set:

| Setting | Value |
|---|---|
| **Build Command** | `npx prisma generate && next build` |
| **Framework Preset** | Next.js |

The `vercel.json` file in the repository already sets the build command automatically, so this may already be configured.

### First deploy

Push your code (or trigger a new deployment in the Vercel dashboard). Vercel will:

1. Run `npx prisma generate`
2. Build the Next.js app
3. Deploy to production

After the deployment succeeds, your site is live at your Vercel URL (e.g. `https://duswebsite.vercel.app` or your custom domain).

### Run migrations in production (required for future schema changes)

If you ever update `prisma/schema.prisma` (only done by a developer), deploy the migration with:

```bash
npx prisma migrate deploy
```

This applies pending migrations to the production database without losing data. For the initial setup, the tables are already created from Step 4d.

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
- [ ] Deploy to Vercel (verify build command is `npx prisma generate && next build`)
- [ ] Log in at `/admin` and verify the admin panel works

---

## Troubleshooting

### "Can't reach database server"

- Double-check the `DATABASE_URL` in Vercel environment variables. Make sure there are no extra spaces or missing characters.
- In Neon, go to your project → **Connection Details** and copy the string again.
- Make sure `?sslmode=require` is included at the end of the URL.

### "Invalid credentials" on admin login

- The `ADMIN_PASSWORD` in Vercel must exactly match what you type at `/admin/login`. There are no password resets — if you forget it, update the `ADMIN_PASSWORD` environment variable in Vercel and redeploy.

### "Prisma Client not generated"

- Make sure the Vercel build command is `npx prisma generate && next build` (not just `next build`). Check Vercel → **Settings** → **Build & Development Settings**.

### The public site shows no projects

- Log in at `/admin/projects` and check that projects are marked **Published** (green badge). Unpublished projects are hidden from the public site.
- If the database is empty, run `npx prisma db seed` locally to add the default projects.

### Database tables don't exist after deploy

- This happens if `npx prisma migrate deploy` was never run. Run it locally (with your `.env` pointing to the production database) or use the Neon dashboard SQL editor to verify the tables exist.

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
