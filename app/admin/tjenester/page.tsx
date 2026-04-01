import Link from "next/link";
import { getServices } from "@/lib/content-db";
import {
  adminCard,
  adminLead,
  adminPageShell,
  adminPrimaryButton,
  adminTitle,
} from "../adminStyles";

export const dynamic = "force-dynamic";

export default async function TjenesterAdminPage() {
  const services = await getServices();

  return (
    <div className={adminPageShell}>
      <h1 className={adminTitle}>Tjenester</h1>
      <p className={adminLead}>Rediger tjenestene som vises p{"\u00e5"} Tjenester-siden.</p>

      <div className="flex flex-col gap-px bg-[#e0e0e0]">
        {services.map((service) => (
          <div
            key={service.id}
            className={`${adminCard} flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.title}
                className="h-10 w-[60px] shrink-0 object-cover"
              />
              <div className="min-w-0">
                <p className="m-0 text-[0.9rem] font-normal tracking-[0.05em] text-black">
                  {service.title}
                </p>
                <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.78rem] text-dus-muted">
                  {service.description}
                </p>
              </div>
            </div>
            <Link
              href={`/admin/tjenester/${service.id}/edit`}
              className={`${adminPrimaryButton} shrink-0 px-5 py-2 text-[0.72rem]`}
            >
              REDIGER
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
