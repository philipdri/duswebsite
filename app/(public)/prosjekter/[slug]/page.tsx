import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedProjectBySlug } from "@/lib/projects-db";
import { getProjectBySlug } from "@/lib/projects";
import ProjectSlideshow from "@/components/ProjectSlideshow";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let title: string | undefined;
  let description: string | null | undefined;

  try {
    const project = await getPublishedProjectBySlug(slug);
    title = project?.title;
    description = project?.description;
  } catch {
    const staticProject = getProjectBySlug(slug);
    title = staticProject?.title;
    description = staticProject?.description;
  }

  if (!title) {
    const staticProject = getProjectBySlug(slug);
    title = staticProject?.title;
    description = staticProject?.description;
  }

  return {
    title: title ? `${title} — DUS Arkitekter` : 'DUS Arkitekter',
    description: description || 'DUS Arkitekter – arkitektur i harmoni med omgivelsene.',
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  // Try DB first; fall back to static data
  let project: {
    title: string;
    description: string | null;
    location: string | null;
    year: string | null;
    images: { src: string; caption: string | null }[];
  } | null = null;

  function toProjectFromStatic(p: typeof import('@/lib/projects').projects[number]) {
    return {
      title: p.title,
      description: p.description,
      location: p.location,
      year: p.year,
      images: p.images,
    };
  }

  try {
    project = await getPublishedProjectBySlug(slug);
  } catch {
    // DB unavailable — fall back to static
    const staticProject = getProjectBySlug(slug);
    if (staticProject) project = toProjectFromStatic(staticProject);
  }

  if (!project) {
    // Also try static fallback when DB returns null
    const staticProject = getProjectBySlug(slug);
    if (staticProject) project = toProjectFromStatic(staticProject);
  }

  if (!project) {
    notFound();
  }

  return (
    <div
      style={{
        paddingTop: '60px',
        backgroundColor: '#f7f4f0',
        minHeight: '100vh',
        paddingBottom: '80px',
      }}
    >
      <div style={{ maxWidth: '64rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Link
          href="/#prosjekter"
          style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 300, fontSize: '0.75rem', fontFamily: '"classico-urw", sans-serif', display: 'inline-block', marginBottom: '3rem', textDecoration: 'none' }}
        >
          ← TILBAKE
        </Link>

        <h1
          style={{ color: '#000', letterSpacing: '0.15em', fontWeight: 300, fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '1rem', fontFamily: '"classico-urw", sans-serif' }}
        >
          {project.title}
        </h1>

        <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
          <ProjectSlideshow images={project.images.map((img) => ({ src: img.src, caption: img.caption ?? '' }))} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem', marginBottom: '3rem', paddingTop: '2rem', paddingBottom: '2rem', borderTop: '1px solid #666669', borderBottom: '1px solid #666669' }}>
          <div>
            <p style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400, fontSize: '0.75rem', marginBottom: '0.5rem', fontFamily: '"classico-urw", sans-serif' }}>PROSJEKT</p>
            <p style={{ color: '#000', fontWeight: 300, fontSize: '0.875rem', fontFamily: '"classico-urw", sans-serif' }}>{project.title}</p>
          </div>
          <div>
            <p style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400, fontSize: '0.75rem', marginBottom: '0.5rem', fontFamily: '"classico-urw", sans-serif' }}>STED</p>
            <p style={{ color: '#000', fontWeight: 300, fontSize: '0.875rem', fontFamily: '"classico-urw", sans-serif' }}>{project.location || '—'}</p>
          </div>
          <div>
            <p style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400, fontSize: '0.75rem', marginBottom: '0.5rem', fontFamily: '"classico-urw", sans-serif' }}>ÅRSTALL</p>
            <p style={{ color: '#000', fontWeight: 300, fontSize: '0.875rem', fontFamily: '"classico-urw", sans-serif' }}>{project.year || '—'}</p>
          </div>
        </div>

        <div style={{ maxWidth: '42rem' }}>
          {(project.description || '').split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              style={{ color: '#434343', fontWeight: 300, fontSize: '1rem', lineHeight: '1.9', marginBottom: '1rem', fontFamily: '"classico-urw", sans-serif' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
