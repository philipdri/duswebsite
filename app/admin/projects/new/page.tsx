import Link from "next/link";
import ProjectForm from "../components/ProjectForm";
import { createProject } from "../actions";
import { adminPageShellWide, adminSubtleLink, adminTitle } from "../../adminStyles";

export default function NewProjectPage() {
  return (
    <div className={adminPageShellWide}>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link href="/admin/projects" className={adminSubtleLink}>
          {"\u2190 PROSJEKTER"}
        </Link>
        <h1 className={adminTitle}>Nytt prosjekt</h1>
      </div>
      <ProjectForm action={createProject} submitLabel="OPPRETT PROSJEKT" />
    </div>
  );
}
