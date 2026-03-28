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
      <div className="max-w-5xl mx-auto px-8">
        <Link
          href="/#prosjekter"
          className="font-classico text-xs tracking-widest hover:opacity-50 transition-opacity mb-12 inline-block"
          style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 300 }}
        >
          ← TILBAKE
        </Link>

        <h1
          className="font-classico tracking-widest mt-6 mb-4"
          style={{ color: '#000', letterSpacing: '0.15em', fontWeight: 300, fontSize: '1.5rem' }}
        >
          {project.title}
        </h1>

        <div className="my-12">
          <ProjectSlideshow images={project.images.map((img) => ({ src: img.src, caption: img.caption ?? '' }))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 py-8" style={{ borderTop: '1px solid #666669', borderBottom: '1px solid #666669' }}>
          <div>
            <p className="font-classico text-xs tracking-widest mb-2" style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400 }}>PROSJEKT</p>
            <p className="font-classico text-sm" style={{ color: '#000', fontWeight: 300 }}>{project.title}</p>
          </div>
          <div>
            <p className="font-classico text-xs tracking-widest mb-2" style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400 }}>STED</p>
            <p className="font-classico text-sm" style={{ color: '#000', fontWeight: 300 }}>{project.location || '—'}</p>
          </div>
          <div>
            <p className="font-classico text-xs tracking-widest mb-2" style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400 }}>ÅRSTALL</p>
            <p className="font-classico text-sm" style={{ color: '#000', fontWeight: 300 }}>{project.year || '—'}</p>
          </div>
        </div>

        <div className="max-w-2xl">
          {(project.description || '').split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className="font-classico leading-relaxed mb-4"
              style={{ color: '#434343', fontWeight: 300, fontSize: '1rem', lineHeight: '1.9' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
