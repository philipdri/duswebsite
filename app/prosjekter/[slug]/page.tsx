import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/projects";
import ProjectSlideshow from "@/components/ProjectSlideshow";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div
      style={{
        paddingTop: '12vh',
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
          <ProjectSlideshow images={project.images} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 py-8" style={{ borderTop: '1px solid #666669', borderBottom: '1px solid #666669' }}>
          <div>
            <p className="font-classico text-xs tracking-widest mb-2" style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400 }}>PROSJEKT</p>
            <p className="font-classico text-sm" style={{ color: '#000', fontWeight: 300 }}>{project.projectName}</p>
          </div>
          <div>
            <p className="font-classico text-xs tracking-widest mb-2" style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400 }}>STED</p>
            <p className="font-classico text-sm" style={{ color: '#000', fontWeight: 300 }}>{project.location}</p>
          </div>
          <div>
            <p className="font-classico text-xs tracking-widest mb-2" style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 400 }}>ÅRSTALL</p>
            <p className="font-classico text-sm" style={{ color: '#000', fontWeight: 300 }}>{project.year}</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <p
            className="font-classico leading-relaxed"
            style={{ color: '#434343', fontWeight: 300, fontSize: '1rem', lineHeight: '1.9' }}
          >
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
