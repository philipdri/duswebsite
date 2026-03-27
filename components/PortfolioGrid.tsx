import { projects as staticProjects } from '@/lib/projects';
import { getPublishedProjects } from '@/lib/projects-db';
import PortfolioItem, { PortfolioProject } from './PortfolioItem';

export const dynamic = 'force-dynamic';

function toPortfolioProject(p: { slug: string; title: string; coverImage: string; year?: string | null }): PortfolioProject {
  const label = p.year
    ? `${p.title.toUpperCase()},<br>${p.year}`
    : p.title.toUpperCase();
  return { slug: p.slug, title: p.title, coverImage: p.coverImage, portfolioLabel: label };
}

export default async function PortfolioGrid() {
  let portfolioProjects: PortfolioProject[];

  try {
    const dbProjects = await getPublishedProjects();
    portfolioProjects = dbProjects.map(toPortfolioProject);
  } catch {
    // Fallback to static data when DB is not available
    portfolioProjects = staticProjects.map((p) => ({
      slug: p.slug,
      title: p.title,
      coverImage: p.coverImage,
      portfolioLabel: p.portfolioLabel,
    }));
  }

  return (
    <section id="prosjekter" className="w-full" style={{ backgroundColor: '#f7f4f0' }}>
      {portfolioProjects.map((project, index) => (
        <PortfolioItem key={project.slug} project={project} index={index} />
      ))}
    </section>
  );
}
