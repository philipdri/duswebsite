# Admin Guide — DUS Arkitekter

This guide explains how to use the admin system added in Phase 2 of the DUS Arkitekter website.

---

## Overview

The admin system lets the firm owners:
- Log in securely with a password
- Add, edit, and delete projects
- Publish or unpublish projects
- Control what appears on the public website

The admin is accessible at `/admin`.

---

## Authentication

### How it works

- Login is at `/admin/login`
- A single admin password is set via environment variable (`ADMIN_PASSWORD`)
- On successful login, a JWT session token is stored in an `HttpOnly` cookie (`admin_session`)
- The session expires after **7 days**
- All `/admin/*` routes are protected by the `proxy.ts` file (Next.js Proxy/Middleware)
- Logout clears the cookie and redirects to `/admin/login`

### Setting the admin password

In your `.env` file:

```env
ADMIN_PASSWORD="your-secure-password-here"
ADMIN_SESSION_SECRET="your-random-32-char-secret"
```

The `ADMIN_SESSION_SECRET` is used to sign the JWT. It should be a random string of at least 32 characters. You can generate one with:

```bash
openssl rand -base64 32
```

**Important:** Never commit your `.env` file. Use `.env.example` as a template.

---

## Admin Pages

| URL | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Dashboard with project statistics |
| `/admin/projects` | List all projects |
| `/admin/projects/new` | Create a new project |
| `/admin/projects/[id]/edit` | Edit an existing project |

---

## Project CRUD

### Fields

| Field | Required | Description |
|---|---|---|
| `title` | ✓ | Project title |
| `slug` | ✓ | URL-friendly identifier (e.g. `enebolig-bergen`) |
| `coverImage` | ✓ | Path to cover image (e.g. `/img/prosjekt/bilde.jpg`) or external URL |
| `shortDescription` | — | Short text shown in overviews |
| `description` | — | Full project description (supports paragraphs separated by blank lines) |
| `location` | — | Location text (e.g. `Bergen, Norge`) |
| `year` | — | Year string (e.g. `2024` or `2022-2024`) |
| `sortOrder` | — | Integer for controlling display order (lower = first) |
| `published` | — | Checkbox. Only published projects appear on the public site. |

### Gallery images

Each project can have multiple gallery images. For each image:
- **URL**: path to image in `/public/img/` or an external URL
- **Caption**: optional caption text

### Image uploads

In this phase, images are referenced by URL/path. To add a project image:
1. Place the image file in `public/img/your-project/`
2. Use the path `/img/your-project/filename.jpg` in the admin form

Future upgrade: a file upload component can be added to the admin forms, storing files in Vercel Blob, Cloudinary, or similar services.

### Deleting projects

The project list has a **SLETT** button per row. You will be asked to confirm before deletion. Deletion also removes all associated gallery images.

### Publish/Unpublish

Click the **PUBLISERT**/**UTKAST** status badge on the project list to toggle visibility instantly.

---

## Database

### Prisma schema

The schema is in `prisma/schema.prisma`:

```prisma
model Project {
  id               String         @id @default(cuid())
  slug             String         @unique
  title            String
  shortDescription String?
  description      String?
  location         String?
  year             String?
  coverImage       String
  published        Boolean        @default(false)
  sortOrder        Int?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  images           ProjectImage[]
}

model ProjectImage {
  id        String  @id @default(cuid())
  src       String
  caption   String?
  order     Int     @default(0)
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String
}
```

### Prisma 7 configuration

Prisma 7 no longer uses `url` in `schema.prisma`. The connection URL is configured in `prisma.config.ts`:

```ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/duswebsite"

# Admin login password
ADMIN_PASSWORD="your-secure-password"

# JWT signing secret (min 32 chars, random)
ADMIN_SESSION_SECRET="your-random-32-char-secret-string"
```

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env and fill in DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET

# 3. Generate Prisma Client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. (Optional) Seed with existing project data
npx prisma db seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin.

---

## Deployment on Vercel

### Step-by-step

1. Connect your GitHub repo to Vercel
2. In Vercel project settings → **Environment Variables**, add:
   - `DATABASE_URL` (your PostgreSQL connection string)
   - `ADMIN_PASSWORD` (your admin password)
   - `ADMIN_SESSION_SECRET` (your JWT secret)
3. **Important:** Before first deploy, run migrations manually:
   ```bash
   npx prisma migrate deploy
   ```
   Or set up a Vercel build command that runs migrations.

### Recommended build command for Vercel

In `package.json` or Vercel settings, use:

```
npx prisma generate && next build
```

Or add a `vercel.json`:

```json
{
  "buildCommand": "npx prisma generate && next build"
}
```

### PostgreSQL provider

Vercel recommends **Vercel Postgres** (Neon-based). You can also use **Supabase**, **Railway**, or any managed PostgreSQL.

After provisioning:
- Copy the connection string to `DATABASE_URL` in Vercel environment variables
- Run `npx prisma migrate deploy` to apply schema

---

## Future Improvements

- **Image uploads**: Replace URL input with a file uploader using Vercel Blob or Cloudinary
- **Multiple admin users**: Add a `User` model and bcrypt-hashed passwords
- **Audit log**: Track who changed what and when
- **Drag-and-drop reorder**: Visual reordering of projects and gallery images
- **Rich text editor**: Replace the plain `<textarea>` for descriptions
- **Preview**: Add a preview link from the edit page to see the project as it would appear publicly
