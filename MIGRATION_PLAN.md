# Migration Plan: DUS Arkitekter Website

## Phase 1 — Static Site to Next.js + TypeScript

---

## Current Structure Summary

The original site is a hand-coded static HTML/CSS/JS website with the following structure:

### Pages
| File | Route | Description |
|---|---|---|
| `index.html` | `/` | Home page — hero, portfolio grid, about section, footer |
| `tjenester.html` | `/tjenester` | Services page with 3 service categories |
| `prosjektsaedalen.html` | `/prosjekter/bergen` | Project: Enebolig i Bergen (Sædalen) |
| `nationaltheatret.html` | `/prosjekter/nationaltheatret` | Project: The Three Temporary |
| `prosjektaskoy.html` | `/prosjekter/askoy` | Project: Enebolig på Askøy |
| `sommerhus.html` | `/prosjekter/sommerhus` | Project: Sommerhus i Danmark |
| `sommerhytte.html` | `/prosjekter/sommerhytte` | Project: Sommerhytte på Samnøy |
| `masteroppgave.html` | `/prosjekter/masteroppgave` | Project: [...] Rommelig som havet |

### Reusable Layout Pieces
- **Header**: Fixed, `#f7f4f0` background. Logo (left) + brand name (center) + hamburger (right). On home page the logo starts centered and animates to top-left on scroll.
- **Footer**: Dark (`#171717`) with "KONTAKT OSS", email link, LinkedIn + Instagram icons.
- **Hamburger menu**: Full-screen vertical overlay with 5 nav links.

### JavaScript Behaviors
- `sitejs.js` — Hamburger toggle
- `indexscript.js` — Logo scroll animation, back-to-top button
- `addPortfolio.js` — DOM injection for portfolio items
- `addTjenester.js` — DOM injection for service items
- `prosjektMalContent.js` — DOM injection for project page content (title, images, info)
- `prosjektmal.js` — Image slideshow (prev/next)

### Project / Gallery Structure
All 6 projects are hardcoded with:
- Cover image
- Image gallery (array of [src, caption])
- Info table (PROSJEKT, STED, ÅRSTALL)
- Description text

### Assets
- `img/` — Project images in subdirectories (askoy/, masteroppgave/, nationalteateret/, saedalen/, samnoy/, sommerhus/)
- `img/logo_lys.png` — Logo
- `img/skygge_glød.png` — Hero background
- `css/` — site styles split across multiple files
- `font/` — Local font (Shree-Devanagari-714.ttf, not actively used)

---

## Migration Strategy

### Approach
- Scaffold a Next.js App Router application at the repository root
- Preserve the original files in `legacy/` folder as a safety net
- Copy images into `public/img/` for Next.js static serving
- Rebuild each page as a React component, matching the original layout and content exactly

### Stack Chosen
- **Next.js** (App Router, static export compatible)
- **TypeScript** — full type safety
- **Tailwind CSS** — utility classes for layout/spacing
- **Prisma** (PostgreSQL) — schema prepared for future CMS

---

## What Is Preserved

| Item | Status |
|---|---|
| Visual design (colors, fonts, spacing) | ✅ Preserved |
| Brand typography (`classico-urw` via Typekit) | ✅ Preserved |
| All project descriptions (original Norwegian text) | ✅ Preserved |
| All images | ✅ Copied to `public/img/` |
| Header/footer layout | ✅ Preserved |
| Hamburger menu behavior | ✅ Recreated with React state |
| Logo scroll animation on home page | ✅ Recreated with useEffect |
| Portfolio grid alternating layout | ✅ Preserved |
| Project slideshow (prev/next) | ✅ Recreated as React component |
| CNAME (custom domain) | ✅ Kept in root |
| SEO headings and content | ✅ Preserved |

---

## What Is Refactored

| Original | New |
|---|---|
| Separate HTML files | Next.js App Router pages |
| Repeated header/footer HTML | Shared `Header` and `Footer` components |
| Vanilla JS DOM injection (`addPortfolio.js` etc.) | Static TypeScript data in `lib/projects.ts` |
| jQuery dependency | Removed (not needed) |
| Hardcoded project content per HTML file | Centralized in `lib/projects.ts` |
| CSS files (sitecss.css, index.css, etc.) | Tailwind CSS + inline styles for brand specifics |
| Ionicons via `<ion-icon>` web component | Kept via CDN script, declared as custom element in TypeScript |

---

## What Is Deferred to Phase 2

- **Admin CMS**: Prisma schema is prepared but not wired to any UI
- **Database seeding**: Project data is in TypeScript files, not yet seeded to PostgreSQL
- **Contact form**: Footer shows email link only; no form backend
- **Analytics**: Not implemented
- **Auth**: Not implemented
- **Image optimization**: Using `<img>` tags with `unoptimized` where Next.js `Image` would cause issues; future improvement to use `next/image` fully
- **Accessibility audit**: Not completed

---

## Project Content Migration Status

All 6 projects are fully migrated to `lib/projects.ts`:

| Project | Slug | Images | Info | Description |
|---|---|---|---|---|
| Enebolig i Bergen (Sædalen) | `bergen` | 3 images | ✅ | ✅ original text |
| The Three Temporary | `nationaltheatret` | 8 images | ✅ | ✅ original text |
| Enebolig på Askøy | `askoy` | 1 image | ✅ | ✅ original text |
| Sommerhus i Danmark | `sommerhus` | 3 images | ✅ | ✅ original text |
| Sommerhytte på Samnøy | `sommerhytte` | 5 images | ✅ | ✅ original text |
| [...] Rommelig som havet | `masteroppgave` | 4 images | ✅ | ✅ original text |

**TODO for Phase 2**: Seed these projects to the PostgreSQL database and replace the static `lib/projects.ts` data with Prisma queries.
