import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteProjectButton from "./components/DeleteProjectButton";
import SortableProjectList from "./components/SortableProjectList";
import PublishButton from "./components/PublishButton";
import {
  adminCard,
  adminPageShellWide,
  adminPrimaryButton,
  adminTableCell,
  adminTableHead,
  adminTitle,
  adminWarningAlert,
} from "../adminStyles";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { images: { select: { id: true } } },
    });
  } catch {
    return null;
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  type ProjectRow = NonNullable<typeof projects>[number];
  const published = projects?.filter((p: ProjectRow) => p.published) ?? [];
  const drafts = projects?.filter((p: ProjectRow) => !p.published) ?? [];

  const toRow = (p: NonNullable<typeof projects>[number]) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    year: p.year,
    location: p.location,
    published: p.published,
    imageCount: p.images.length,
  });

  const sectionHeadingClass =
    "mb-3 text-[0.7rem] font-normal uppercase tracking-[0.2em] text-dus-muted";
  const emptyCardClass =
    "border border-[#e5e5e5] bg-white px-8 py-8 text-center text-[0.85rem] text-dus-muted";

  return (
    <div className={adminPageShellWide}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className={adminTitle}>Prosjekter</h1>
        <Link href="/admin/projects/new" className={`${adminPrimaryButton} px-5 py-2`}>
          + NYTT PROSJEKT
        </Link>
      </div>

      {projects === null && (
        <div className={adminWarningAlert}>
          <strong>Database ikke tilkoblet.</strong> Sett opp `DATABASE_URL` i `.env`.
        </div>
      )}

      {projects !== null && (
        <>
          <div className="mb-10">
            <h2 className={sectionHeadingClass}>Portfolio (publiserte prosjekter)</h2>
            <p className="mb-3 text-[0.75rem] text-[#aaa]">
              Dra i {"\u283f"}-ikonet for {"\u00e5"} endre rekkef{"\u00f8"}lgen i
              portfolioen.
            </p>

            {published.length === 0 ? (
              <div className={emptyCardClass}>
                Ingen publiserte prosjekter enn{"\u00e5"}. Publiser et utkast for {"\u00e5"}
                legge det til i portfolioen.
              </div>
            ) : (
              <SortableProjectList
                key={published.map((p) => p.id).join(",")}
                projects={published.map(toRow)}
              />
            )}
          </div>

          <div>
            <h2 className={sectionHeadingClass}>Utkast (ikke publiserte)</h2>

            {drafts.length === 0 ? (
              <div className={emptyCardClass}>
                {projects.length === 0 ? (
                  <>
                    <p className="mb-3">Ingen prosjekter enn{"\u00e5"}.</p>
                    <Link
                      href="/admin/projects/new"
                      className="text-[0.8rem] tracking-[0.1em] text-black no-underline"
                    >
                      Opprett ditt f{"\u00f8"}rste prosjekt {"\u2192"}
                    </Link>
                  </>
                ) : (
                  "Ingen utkast."
                )}
              </div>
            ) : (
              <div className={`${adminCard} overflow-x-auto`}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e5e5]">
                      {["TITTEL", "SLUG", "\u00c5R", "STED", "STATUS", "BILDER", ""].map(
                        (h) => (
                          <th key={h} className={adminTableHead}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.map((project) => (
                      <tr key={project.id} className="border-b border-[#f0f0f0]">
                        <td className="px-4 py-3 text-[0.85rem] font-normal text-black">
                          {project.title}
                        </td>
                        <td className={`${adminTableCell} font-mono`}>{project.slug}</td>
                        <td className={adminTableCell}>{project.year || "\u2014"}</td>
                        <td className={adminTableCell}>{project.location || "\u2014"}</td>
                        <td className="px-4 py-3">
                          <PublishButton id={project.id} />
                        </td>
                        <td className={adminTableCell}>{project.images.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="text-[0.75rem] tracking-[0.1em] text-black no-underline"
                            >
                              REDIGER
                            </Link>
                            <DeleteProjectButton id={project.id} title={project.title} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
