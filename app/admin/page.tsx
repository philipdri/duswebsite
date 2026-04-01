import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  adminLead,
  adminPageShell,
  adminPrimaryButton,
  adminSecondaryButton,
  adminTitle,
  adminWarningAlert,
} from "./adminStyles";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const total = await prisma.project.count();
    const published = await prisma.project.count({ where: { published: true } });
    return { total, published, unpublished: total - published };
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className={adminPageShell}>
      <h1 className={adminTitle}>Dashboard</h1>
      <p className={adminLead}>
        Administrer prosjekter og innhold p{"\u00e5"} DUS Arkitekter nettside.
      </p>

      {stats === null && (
        <div className={`${adminWarningAlert} mb-6`}>
          <strong>Database ikke tilkoblet.</strong> Sett opp `DATABASE_URL` i `.env`
          for {"\u00e5"} aktivere databasefunksjonalitet.
        </div>
      )}

      {stats !== null && (
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Totalt prosjekter", value: stats.total },
            { label: "Publiserte", value: stats.published },
            { label: "Upubliserte", value: stats.unpublished },
          ].map((s) => (
            <div key={s.label} className="border border-[#e5e5e5] bg-white px-6 py-6 text-center">
              <p className="m-0 text-[2rem] font-light text-black">{s.value}</p>
              <p className="mt-1 text-[0.75rem] tracking-[0.1em] text-dus-muted">
                {s.label.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/projects" className={adminPrimaryButton}>
          SE ALLE PROSJEKTER
        </Link>
        <Link href="/admin/projects/new" className={adminSecondaryButton}>
          + NYTT PROSJEKT
        </Link>
        <Link href="/admin/tjenester" className={adminSecondaryButton}>
          TJENESTER
        </Link>
        <Link href="/admin/content" className={adminSecondaryButton}>
          INNHOLD
        </Link>
      </div>
    </div>
  );
}
