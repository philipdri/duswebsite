import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedProjectBySlug } from "@/lib/projects-db";
import { getProjectBySlug } from "@/lib/projects";
import ProjectSlideshow from "@/components/ProjectSlideshow";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

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
    title: title ? `${title} \u2014 DUS Arkitekter` : "DUS Arkitekter",
    description:
      description || "DUS Arkitekter \u2013 arkitektur i harmoni med omgivelsene.",
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

  function toProjectFromStatic(p: typeof import("@/lib/projects").projects[number]) {
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
    // DB unavailable - fall back to static
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
    <div className="min-h-screen bg-dus-bg px-4 pb-20 pt-[60px] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#prosjekter"
          className="mb-12 inline-block font-classico text-xs font-light tracking-[0.2em] text-dus-muted no-underline"
        >
          {"\u2190 TILBAKE"}
        </Link>

        <h1 className="mb-4 mt-6 font-classico text-2xl font-light tracking-[0.15em] text-black">
          {project.title}
        </h1>

        <div className="my-12">
          <ProjectSlideshow
            images={project.images.map((img) => ({
              src: img.src,
              caption: img.caption ?? "",
            }))}
          />
        </div>

        <div className="my-12 grid gap-6 border-y border-dus-border py-8 md:grid-cols-3 md:gap-8">
          <div>
            <p className="mb-2 font-classico text-xs font-normal tracking-[0.2em] text-dus-muted">
              PROSJEKT
            </p>
            <p className="font-classico text-sm font-light text-black">{project.title}</p>
          </div>
          <div>
            <p className="mb-2 font-classico text-xs font-normal tracking-[0.2em] text-dus-muted">
              STED
            </p>
            <p className="font-classico text-sm font-light text-black">
              {project.location || "\u2014"}
            </p>
          </div>
          <div>
            <p className="mb-2 font-classico text-xs font-normal tracking-[0.2em] text-dus-muted">
              {"\u00c5RSTALL"}
            </p>
            <p className="font-classico text-sm font-light text-black">
              {project.year || "\u2014"}
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          {(project.description || "").split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="mb-4 font-classico text-base font-light leading-[1.9] text-[#434343] last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
