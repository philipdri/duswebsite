# Architecture Guide: DUS Arkitekter Next.js App

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + inline styles for brand colors
- **Fonts**: Adobe Typekit (classico-urw) loaded via `<link>` in layout
- **Icons**: Ionicons via CDN
- **Images**: Static files in `public/img/`

## Directory Structure

app/                    # Next.js App Router pages
  layout.tsx            # Root layout (Header, Footer, global styles)
  page.tsx              # Home page
  globals.css           # Tailwind + global styles
  tjenester/
    page.tsx            # Services page
  prosjekter/
    [slug]/
      page.tsx          # Dynamic project page

components/             # Shared React components
  Header.tsx            # Fixed navigation header with hamburger menu
  Footer.tsx            # Dark footer with contact info + social links
  HeroSection.tsx       # Full-viewport hero with parallax background
  PortfolioGrid.tsx     # Grid of project items (server component)
  PortfolioItem.tsx     # Individual project card with scroll animation
  ProjectSlideshow.tsx  # Image slideshow with prev/next navigation
  AboutSection.tsx      # About section with team photo
  ScrollToTop.tsx       # Floating scroll-to-top button

lib/                    # Data and utilities
  projects.ts           # Project data + types
  services.ts           # Service data + types

types/                  # TypeScript declarations
  ion-icon.d.ts         # Custom element type for Ionicons

prisma/                 # Database schema (future use)
  schema.prisma

legacy/                 # Original static HTML/CSS/JS files (archived)
public/
  img/                  # All images (copied from legacy img/)
  CNAME                 # Custom domain config

## Key Patterns

### Data Layer
Project and service data lives in `lib/projects.ts` and `lib/services.ts` as typed TypeScript arrays. Future CMS integration can replace these exports while keeping the same interface.

### Component Architecture
- Server components by default (no `'use client'` unless needed)
- Client components: Header, HeroSection, PortfolioItem, ProjectSlideshow, ScrollToTop
- `'use client'` is used only for components requiring browser APIs (scroll, IntersectionObserver, useState)

### Styling Approach
- Tailwind utility classes for layout and spacing
- Inline `style` props for brand-specific colors (matching legacy design exactly)
- Custom Tailwind colors defined in `tailwind.config.ts` for reference

### Image Handling
- All images served from `public/img/` (same paths as legacy, prefixed with `/img/`)
- `next/image` used in Header and HeroSection with `unoptimized: true`
- `<img>` used in project slideshows and portfolio items for simplicity

## Adding a New Project
1. Add entry to `projects` array in `lib/projects.ts`
2. Add images to `public/img/[project-folder]/`
3. The page is automatically generated via `generateStaticParams()`
