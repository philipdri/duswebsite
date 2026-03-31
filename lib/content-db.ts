import { prisma } from './db'
import { services as staticServices } from './services'

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  intro_text:
    'Dus handler om å være i harmoni med noe eller noen, og det har blitt grunnleggende for vår estetikk som ellers er preget av renhet, funksjonalitet og tidløs eleganse.',
  about_heading: 'Om Dus Arkitekter',
  about_text:
    'Vi er et lite og nyoppstartet, men ambisiøst arkitektkontor som er drevet av to engasjerte arkitekter - Synne Spjeld Høyvik og Anniken Marie Haugan.\nNavnet Dus Arkitekter kommer fra vår visjon om å være "dus" med våre klienter, prosjekter og omgivelsene selv. For oss handler Dus om å være i harmoni med noe eller noen, og det har blitt grunnleggende for vår estetikk som ellers er preget av renhet, funksjonalitet og tidløs eleganse.\nVi har erfaring innenfor tilbygg og transformasjon av hytter og eneboliger, men vårt interessefelt er bredt og vi tar gjerne både større og mindre prosjekter. Så hvis vi skulle være av interesse, ikke nøl med å ta kontakt for en hyggelig, uforpliktende prat.',
  tjenester_intro:
    'Vi har erfaring innenfor tilbygg og transformasjon av hytter og eneboliger, men vårt interessefelt er bredt og vi tar gjerne både større og mindre prosjekter. Så hvis vi skulle være av interesse, ikke nøl med å ta kontakt for en hyggelig, uforpliktende prat.',
}

export async function getSiteContent(key: string): Promise<string> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key } })
    return row?.value ?? SITE_CONTENT_DEFAULTS[key] ?? ''
  } catch {
    return SITE_CONTENT_DEFAULTS[key] ?? ''
  }
}

export async function getAllSiteContent(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteContent.findMany()
    const result: Record<string, string> = { ...SITE_CONTENT_DEFAULTS }
    for (const row of rows) {
      result[row.key] = row.value
    }
    return result
  } catch {
    return { ...SITE_CONTENT_DEFAULTS }
  }
}

export interface ServiceData {
  id: string
  title: string
  description: string
  image: string
  sortOrder: number
}

export async function getServices(): Promise<ServiceData[]> {
  try {
    const rows = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } })
    if (rows.length > 0) return rows
    // Fall back to static services if DB is empty
    return staticServices.map((s, i) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image,
      sortOrder: i,
    }))
  } catch {
    return staticServices.map((s, i) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image,
      sortOrder: i,
    }))
  }
}

export async function getServiceById(id: string): Promise<ServiceData | null> {
  try {
    return await prisma.service.findUnique({ where: { id } })
  } catch {
    return null
  }
}
