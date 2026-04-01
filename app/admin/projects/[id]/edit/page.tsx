import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProjectForm from "../../components/ProjectForm";
import { updateProject } from "../../actions";
import {
  adminPageShellWide,
  adminSubtleLink,
  adminTitle,
  adminWarningAlert,
} from "../../../adminStyles";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  let project = null;
  let dbAvailable = false;

  try {
    project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    dbAvailable = true;
  } catch {
    // DB not connected
  }

  if (dbAvailable && project === null) {
    notFound();
  }

  return (
    <div className={adminPageShellWide}>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link href="/admin/projects" className={adminSubtleLink}>
          {"\u2190 PROSJEKTER"}
        </Link>
        <h1 className={adminTitle}>Rediger: {project?.title || id}</h1>
      </div>
      {project ? (
        <ProjectForm
          project={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            shortDescription: project.shortDescription,
            description: project.description,
            location: project.location,
            year: project.year,
            coverImage: project.coverImage,
            published: project.published,
            images: project.images.map((img: { src: string; caption: string | null }) => ({
              src: img.src,
              caption: img.caption || "",
            })),
          }}
          action={updateProject}
          submitLabel="LAGRE ENDRINGER"
        />
      ) : (
        <div className={adminWarningAlert}>Database ikke tilkoblet.</div>
      )}
    </div>
  );
}
