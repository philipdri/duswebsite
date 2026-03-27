# Migration Plan: DUS Arkitekter Website

## Overview
Migrating the static HTML/CSS/JS website to a Next.js 14+ App Router application with TypeScript and Tailwind CSS.

## Audit Summary
- 8 HTML pages audited (index, tjenester, 6 project pages)
- CSS: custom styles in css/ folder
- JS: vanilla JS for hamburger menu, parallax, scroll animations
- Images: img/ folder with subdirectories
- Fonts: Adobe Typekit (classico-urw) + local Shree-Devanagari-714.ttf

## Migration Strategy

### Preserved
- All visual design, colors (#f7f4f0 background, #171717 footer)
- Typography (classico-urw via Typekit)
- All content: project data, descriptions, images
- URL structure for projects (/prosjekter/[slug])
- CNAME for custom domain

### Refactored
- Vanilla JS → React hooks (useState, useEffect)
- CSS files → Tailwind CSS + CSS modules where needed
- Separate HTML pages → Next.js App Router pages
- Repeated HTML → shared components

### Deferred
- CMS integration (Prisma schema prepared, not wired up)
- Contact form backend
- Analytics

## File Structure
- legacy/ - Original HTML/CSS/JS files preserved
- app/ - Next.js App Router pages
- components/ - Shared React components
- lib/ - Data files (projects, services)
- public/img/ - Static images
- prisma/ - Database schema (future use)
