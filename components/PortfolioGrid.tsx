import { projects } from '@/lib/projects';
import PortfolioItem from './PortfolioItem';

export default function PortfolioGrid() {
  return (
    <section id="prosjekter" className="w-full" style={{ backgroundColor: '#f7f4f0' }}>
      {projects.map((project, index) => (
        <PortfolioItem key={project.slug} project={project} index={index} />
      ))}
    </section>
  );
}
