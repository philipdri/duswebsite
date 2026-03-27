# REVIEW_REPORT.md — DUS Arkitekter Next.js Application

**Reviewed:** 2026-03-27  
**Reviewer:** Automated Technical Audit  
**Branch:** `copilot/audit-duswebsite-repository`

---

## 1. Executive Summary

**Overall Quality:** Medium  
**Production Readiness:** Needs work

### Biggest Strengths

- Clean, well-structured Next.js App Router architecture with sensible route grouping
- Solid auth implementation: JWT in HttpOnly cookies, protected at the proxy/edge level AND re-verified in server actions (defense-in-depth)
- Graceful DB-unavailable fallback using static project data at every layer
- Good separation of server vs. client components throughout
- Comprehensive documentation (README, ARCHITECTURE_GUIDE, ADMIN_GUIDE)

### Biggest Risks

- **Active bug:** `onSubmit` event handler in a Server Component (`admin/projects/page.tsx`) — delete confirmation dialog silently does nothing; accidental deletions are possible
- **Active bug:** Edit page (`app/admin/projects/[id]/edit/page.tsx`) calls `notFound()` even when the database is unavailable, making the edit page completely broken with no DB
- **Security:** Plain-text password comparison is vulnerable to timing attacks (`password !== adminPassword`)
- **Security:** `dangerouslySetInnerHTML` used with `portfolioLabel`, which is a user-controlled string stored in the database (potential XSS if admin is compromised)
- **Deployment blocker:** No `vercel.json`; the required `npx prisma generate && next build` build command must be set manually in the Vercel dashboard or it will fail

---

## 2. Strengths

### Architecture
- Route groups `(public)` and `admin` cleanly separate the public site from the admin panel with their own layouts
- Root layout is minimal (html, body, fonts only) — correct for App Router
- `proxy.ts` (Next.js Middleware) guards all `/admin/*` routes edge-side before any page renders
- Server actions with `requireAdmin()` provide a second auth check on mutations — correct defense-in-depth pattern

### Implementation
- TypeScript is used consistently throughout; all props and data shapes are typed
- DB singleton pattern in `lib/db.ts` (globalThis cache) is correct for Next.js
- Prisma schema is clean: `onDelete: Cascade` on `ProjectImage` prevents orphaned rows
- Server actions revalidate both `/` and `/admin/projects` after mutations — no stale cache
- `createProject` and `updateProject` validate required fields and slug format server-side (not just client-side)

### UX
- Publish/unpublish toggle is one-click — good for the use case
- Empty state and DB-unavailable warnings shown clearly in admin
- Form shows pending state ("LAGRER…") for long-running submits

### Data Model
- `sortOrder` + `createdAt` dual ordering in admin project list is practical
- `published` flag gives a proper draft/publish workflow without complexity

---

## 3. Weaknesses and Risks

### Architecture

**✅ `proxy.ts` filename is correct for Next.js 16**  
In Next.js 16, the `middleware.ts` file convention has been deprecated and renamed to `proxy.ts`. The project correctly uses `proxy.ts` at the root with a `proxy` default export. This is the expected convention per the [Next.js 16 `proxy.js` file reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).

**Issue: `force-dynamic` on public project page conflicts with `generateStaticParams`**  
`export const dynamic = 'force-dynamic'` and `export async function generateStaticParams()` are both present in `app/(public)/prosjekter/[slug]/page.tsx`. These directives contradict each other — `force-dynamic` prevents static generation. This makes `generateStaticParams` dead code and forces full server rendering on every request.  
**Severity:** Important

---

### Code Quality

**Issue: `onSubmit` event handler in a Server Component**  
`app/admin/projects/page.tsx` is a Server Component (no `'use client'` directive) but uses `onSubmit` on the delete form. Event handlers are not supported in Server Components — this handler is silently ignored at runtime. The delete confirmation dialog never appears, and projects can be accidentally deleted with a single click.  
**Severity:** Critical

**Issue: Edit page `notFound()` logic is broken when DB is unavailable**  
In `app/admin/projects/[id]/edit/page.tsx`:
```tsx
let project = null
try {
  project = await prisma.project.findUnique(...)
} catch {
  // DB not connected — project stays null
}
if (project === null && id) {
  notFound() // ← Also fires when DB is unavailable!
}
```
Since `id` is always a non-empty string, this condition is equivalent to `project === null`. When the database is unavailable, the catch block runs, `project` stays `null`, and `notFound()` is called — rendering a 404 page instead of the "Database not connected" warning. The fallback JSX below is dead code.  
**Severity:** Critical

**Issue: `font-weight: 150` is not a valid CSS value**  
`fontWeight: 150` is used in several places (e.g., `app/(public)/page.tsx`, `app/(public)/tjenester/page.tsx`). The CSS `font-weight` property only accepts values in steps of 100 (100–900), or keywords. Value `150` will be ignored by browsers, which will apply the nearest valid weight.  
**Severity:** Nice-to-have

**Issue: Unnecessary `as const` casts in JSX**  
`flexDirection: 'row' as const` and similar casts appear in `app/(public)/tjenester/page.tsx`. These are unnecessary because TypeScript infers the correct type from the React `CSSProperties` context.  
**Severity:** Nice-to-have

---

### Database

**Issue: Missing URL in `schema.prisma` datasource block**  
The datasource block in `prisma/schema.prisma` has no `url` field — this is the Prisma 7 pattern using `prisma.config.ts`. This is correct for Prisma 7, but it means `npx prisma migrate dev/deploy` must always be run with the config file available. If someone runs migrations without the config, they will get an error. This is acceptable but worth documenting clearly.  
**Severity:** Nice-to-have (already documented)

**Issue: `updateProject` uses `$transaction` but the create/delete pattern may have edge cases**  
The update logic deletes all `ProjectImage` rows and re-creates them in a transaction. This is correct and safe. However, if the transaction fails mid-way, Prisma's transaction guarantees rollback, so there is no data loss risk.  
**Severity:** None (acceptable)

---

### Admin UX

**Issue: Delete confirmation is broken (server component event handler)**  
As described above, the delete confirmation dialog never shows. This is a significant UX and safety risk.  
**Severity:** Critical

**Issue: No preview link from the project edit page**  
The edit form has no direct link to preview the public project page. This is noted in the ADMIN_GUIDE as a future improvement.  
**Severity:** Nice-to-have

**Issue: Service descriptions are placeholder text**  
`lib/services.ts` contains `description: 'Beskrivelse utarbeides'` for all three services. These appear on the public `/tjenester` page.  
**Severity:** Important (content issue, not code)

---

### Security

**Issue: Plain-text password comparison is vulnerable to timing attacks**  
`app/actions/auth.ts` compares passwords with `password !== adminPassword`. This is susceptible to timing-based side-channel attacks. A constant-time comparison should be used via Node.js `crypto.timingSafeEqual`.  
**Severity:** Important (low practical risk for a small site, but should be fixed)

**Issue: `dangerouslySetInnerHTML` with user-controlled data**  
`components/PortfolioItem.tsx` uses `dangerouslySetInnerHTML={{ __html: project.portfolioLabel }}`. The `portfolioLabel` string is derived from project data stored in the database. While the admin system is password-protected, if an attacker gains admin access they could inject arbitrary HTML/JS into the public homepage. This should use a safe `<br>` replacement approach.  
**Severity:** Important

**Issue: Ionicons loaded from `unpkg.com` CDN without Subresource Integrity (SRI)**  
`app/layout.tsx` loads two Ionicons scripts from `https://unpkg.com` without integrity hashes. If the CDN serves malicious code (supply chain attack), it executes on every page of the site.  
**Severity:** Important

**Issue: Adobe Typekit loaded from CDN**  
The Typekit CSS is loaded from `https://use.typekit.net`. This is expected for Typekit, but if the font kit becomes unavailable or the account lapses, the font degrades to `sans-serif`.  
**Severity:** Nice-to-have

---

### Performance

**Issue: `images: { unoptimized: true }` disables all image optimization globally**  
`next.config.ts` sets `images.unoptimized: true`. This disables Next.js image optimization (resizing, WebP conversion, lazy loading via `<Image>`). Additionally, several components use `<img>` elements directly instead of Next.js `<Image>` with the `eslint-disable` comment. On a site with many large architecture photos, this is a significant performance concern.  
**Severity:** Important

**Issue: `backgroundAttachment: 'fixed'` on hero image**  
The hero section in `HeroSection.tsx` uses `backgroundAttachment: 'fixed'` for the parallax effect. This triggers "paint" on every scroll frame and disables GPU compositing on mobile browsers, causing jank.  
**Severity:** Nice-to-have

**Issue: Ionicons scripts loaded synchronously in `<head>`**  
Two Ionicons `<script>` tags are in the `<head>` with `eslint-disable` comments suppressing the Next.js warning about synchronous scripts. Synchronous scripts block HTML parsing. The ESM module script with `type="module"` is non-blocking, but the fallback `ionicons.js` is synchronous.  
**Severity:** Important

---

### Deployment

**Issue: No `vercel.json` — build command must be set manually**  
The README and ADMIN_GUIDE document that the Vercel build command should be `npx prisma generate && next build`. Without a `vercel.json` file, this is not applied automatically. A new deploy from a fresh Vercel project will fail because `@prisma/client` won't be generated.  
**Severity:** Critical

**Issue: No `prisma migrate deploy` in build pipeline**  
The docs say to run `npx prisma migrate deploy` manually before first deploy. There is no Vercel `postinstall` hook or deploy hook configured. If schema changes are made and deployed without running migrations, the app will error at runtime.  
**Severity:** Important

**Issue: Missing Prisma migrations directory**  
There is no `prisma/migrations/` directory in the repository. This means `prisma migrate deploy` cannot be used in production. The schema must be applied with `prisma db push` instead, which is not idempotent and not suitable for production workflows.  
**Severity:** Important

---

### Documentation

**✅ `ARCHITECTURE_GUIDE` correctly describes `proxy.ts`**  
The guide's description of `proxy.ts` as the Next.js Proxy file is accurate for Next.js 16, where `middleware.ts` has been deprecated and replaced by `proxy.ts`.

**Issue: README missing `vercel.json` mention**  
The deployment section doesn't mention that `vercel.json` should be created, or that `prisma migrate deploy` needs to be run before every schema-changing deploy.  
**Severity:** Nice-to-have

---

## 4. Missing Features

These are realistic gaps for a production-ready small business website:

| Feature | Priority | Notes |
|---|---|---|
| Image uploads | Important | Currently requires manual file placement + URL entry. Vercel Blob or Cloudinary would improve this significantly. Noted as future work in ADMIN_GUIDE. |
| Per-page SEO metadata | Important | Only root-level metadata is defined. Project pages and the services page have no `<title>` or OG tags. |
| Prisma migration files | Important | No `prisma/migrations/` directory. Production deploys require `prisma db push` instead of the proper `migrate deploy` workflow. |
| Rate limiting on login | Important | No rate limiting on `/admin/login` — brute force attacks are possible. |
| Contact form | Nice-to-have | The site has a contact email but no form. For a small architecture firm, a form would be expected. |
| Preview from admin | Nice-to-have | Edit page has no link to the public project view. |
| Drag-and-drop reorder | Nice-to-have | Noted in ADMIN_GUIDE. Manual `sortOrder` integers work but are not user-friendly. |
| Service content | Important | All three services have placeholder descriptions ("Beskrivelse utarbeides"). |

---

## 5. Improvement Roadmap

### Phase A — Critical Fixes

1. ~~**Rename `proxy.ts` to `middleware.ts`**~~ — **Not needed.** In Next.js 16, `proxy.ts` is the correct filename. `middleware.ts` is deprecated and has been replaced by `proxy.ts`. The original file was correct.
2. **Fix `onSubmit` in server component** — Move the delete form to a small `'use client'` wrapper component with the confirmation logic.
3. **Fix edit page `notFound()` logic** — The condition should distinguish "DB unavailable" from "project not found" so the correct fallback is shown.
4. **Add `vercel.json`** — Add `{ "buildCommand": "npx prisma generate && next build" }` to ensure Prisma client is generated on every Vercel build.
5. **Initialize Prisma migrations** — Run `npx prisma migrate dev --name init` to create the migrations directory, enabling proper `migrate deploy` in production.

### Phase B — Important Improvements

6. **Timing-safe password comparison** — Replace `password !== adminPassword` with `crypto.timingSafeEqual` in `app/actions/auth.ts`.
7. **Remove `dangerouslySetInnerHTML`** — Replace `portfolioLabel` HTML rendering with a proper `<br>` component to eliminate XSS surface.
8. **Enable image optimization** — Remove `images: { unoptimized: true }` from `next.config.ts` and replace `<img>` elements with Next.js `<Image>` throughout.
9. **Move Ionicons to local or deferred loading** — Load Ionicons with `defer` or move them to `<Script strategy="lazyOnload">` in Next.js. Add SRI hashes.
10. **Remove `force-dynamic` / `generateStaticParams` conflict** — Choose one: either keep `force-dynamic` for real-time DB data or use ISR with `revalidate`.
11. **Per-page metadata** — Add `generateMetadata()` to project pages and a static metadata export to `/tjenester`.
12. **Add per-deploy migration step** — Document or automate `prisma migrate deploy` in Vercel deploy hooks.

### Phase C — Nice-to-Have

13. **Preview link from edit page** — Add a "SE PROSJEKT →" link that opens the public project page in a new tab.
14. **`backgroundAttachment: 'fixed'` alternative** — Use a CSS transform-based parallax or simply remove it for mobile performance.
15. **Fix `fontWeight: 150`** — Replace with `100` or `200`.
16. **Remove unnecessary `as const` casts** — Clean up TypeScript casts in `tjenester/page.tsx`.
17. **Rate limiting on login** — Use Vercel's edge middleware or a simple in-memory rate limiter.

---

## 6. New Agent Plan

### Goal
Fix all critical bugs and important security/deployment issues in the DUS Arkitekter Next.js application without changing the design or user-facing behavior.

### Scope
The agent may change:
- `proxy.ts` — already correctly named for Next.js 16 (do NOT rename)
- `app/admin/projects/page.tsx` — extract delete form to a client component
- `app/admin/projects/[id]/edit/page.tsx` — fix `notFound()` logic
- `app/actions/auth.ts` — timing-safe password comparison
- `components/PortfolioItem.tsx` — remove `dangerouslySetInnerHTML`
- `next.config.ts` — enable image optimization
- `app/layout.tsx` — defer Ionicons loading
- `app/(public)/prosjekter/[slug]/page.tsx` — remove `generateStaticParams`/`force-dynamic` conflict
- Create `vercel.json`
- Create `prisma/migrations/` via CLI

The agent must NOT change:
- Visual design or layout
- Font choices or color palette
- Public page content or structure
- Admin form fields or behavior (beyond fixing the delete confirmation)

### Tasks

1. ~~Rename `proxy.ts` to `middleware.ts`~~ — **Not needed.** `proxy.ts` is the correct filename in Next.js 16 (`middleware.ts` is deprecated).
2. Extract the delete form from `admin/projects/page.tsx` into a new `'use client'` component `DeleteProjectButton.tsx` with the `confirm()` dialog
3. Fix `notFound()` logic in `app/admin/projects/[id]/edit/page.tsx` to track whether the DB was unavailable vs. project not found
4. Replace `password !== adminPassword` with `crypto.timingSafeEqual` in `app/actions/auth.ts`
5. Replace `dangerouslySetInnerHTML` in `PortfolioItem.tsx` with safe rendering that splits on `<br>` and renders two text nodes
6. Create `vercel.json` with `{ "buildCommand": "npx prisma generate && next build" }`
7. Remove the conflicting `generateStaticParams` export from `prosjekter/[slug]/page.tsx` (keep `force-dynamic`)
8. Load Ionicons with `next/script` `strategy="lazyOnload"` instead of plain `<script>` tags
9. Add `generateMetadata` to `prosjekter/[slug]/page.tsx` for project title/description

### Constraints

- Keep all Norwegian language text as-is
- Do not change any visual styling, colors, or fonts
- Do not remove or alter existing functionality (toggle publish, CRUD operations)
- Do not introduce new dependencies unless absolutely necessary
- All changes must pass `next lint` without new warnings

---

## 7. New Agent Prompt

```
You are working on the repository `philipdri/duswebsite` — a Next.js 16 + TypeScript + Prisma website for a Norwegian architecture firm (DUS Arkitekter).

The codebase has been audited. Your job is to fix the identified critical bugs and important issues WITHOUT changing the design or user-facing behavior.

> **Important:** This project uses Next.js 16. In Next.js 16, `middleware.ts` has been **deprecated and replaced** by `proxy.ts`. The project already has a correctly named `proxy.ts` file at the root — do NOT rename it.

---

## Priority 1 — Critical Bugs (must fix)

### 1. Fix delete confirmation in `app/admin/projects/page.tsx`
The page is a Server Component but uses `onSubmit` with a `confirm()` dialog. Event handlers are ignored in Server Components — the confirmation never shows, and projects can be deleted accidentally.
- Create a new file `app/admin/projects/components/DeleteProjectButton.tsx` marked `'use client'`
- This component renders the delete `<form>` with `action={deleteProject}`, an `onSubmit` handler using `confirm()`, and the hidden `id` input
- Replace the inline delete form in `admin/projects/page.tsx` with `<DeleteProjectButton id={project.id} title={project.title} />`

### 2. Fix `notFound()` logic in `app/admin/projects/[id]/edit/page.tsx`
Currently: `if (project === null && id) { notFound() }` — since `id` is always truthy, this fires even when the DB is unavailable, causing a 404 instead of the "Database not connected" warning.
- Add a `dbAvailable` boolean flag (set to `true` on success, `false` in catch)
- Only call `notFound()` when `dbAvailable && project === null`

---

## Priority 2 — Security Fixes (should fix)

### 3. Timing-safe password comparison in `app/actions/auth.ts`
Replace `password !== adminPassword` with a constant-time comparison:
```ts
import { timingSafeEqual } from 'crypto'
// ...
const passwordsMatch = timingSafeEqual(
  Buffer.from(password),
  Buffer.from(adminPassword)
)
if (!passwordsMatch) { return { error: 'Feil passord.' } }
```

### 4. Remove `dangerouslySetInnerHTML` from `components/PortfolioItem.tsx`
`portfolioLabel` is stored in the database and rendered with `dangerouslySetInnerHTML`. Replace with safe rendering:
- Split `portfolioLabel` on `<br>` (various formats: `<br>`, `<br/>`, `<br />`)
- Render as `<span>line1</span><br /><span>line2</span>` using JSX

---

## Priority 3 — Deployment Fixes (should fix)

### 5. Add `vercel.json`
Create `/vercel.json`:
```json
{
  "buildCommand": "npx prisma generate && next build"
}
```

### 6. Remove conflicting directives in `app/(public)/prosjekter/[slug]/page.tsx`
Both `export const dynamic = 'force-dynamic'` and `export async function generateStaticParams()` are present. These contradict each other. Remove `generateStaticParams` — the page is already `force-dynamic` and fetches from the DB at request time.

---

## Priority 4 — Performance (nice to have, implement if easy)

### 7. Defer Ionicons loading in `app/layout.tsx`
Replace the two `<script>` tags (with eslint-disable comments) with Next.js `<Script>` components using `strategy="lazyOnload"`.

---

## Definition of Done

- [ ] `proxy.ts` exists at root (NOT renamed — `proxy.ts` is correct for Next.js 16)
- [ ] Admin routes are protected: unauthenticated `/admin` requests redirect to `/admin/login`
- [ ] Delete confirmation dialog appears before project deletion
- [ ] Edit page shows "Database not connected" when DB is unavailable (not 404)
- [ ] Password comparison uses `timingSafeEqual`
- [ ] `dangerouslySetInnerHTML` removed from `PortfolioItem.tsx`
- [ ] `vercel.json` exists with correct build command
- [ ] `generateStaticParams` removed from the dynamic project page
- [ ] `next lint` passes without new errors
- [ ] No visual or functional regressions on public pages

## Constraints

- Do NOT change any visual styling, colors, fonts, or layout
- Do NOT modify public page content or the Norwegian language text
- Do NOT remove or break existing admin CRUD functionality
- Do NOT introduce new npm dependencies unless unavoidable
- Do NOT change the database schema or Prisma configuration
- Keep all error messages in Norwegian where they already are
```
