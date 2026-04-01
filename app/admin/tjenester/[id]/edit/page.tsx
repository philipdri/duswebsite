import { notFound } from "next/navigation";
import { getServices } from "@/lib/content-db";
import ServiceEditForm from "./ServiceEditForm";
import { adminLead, adminPageShell, adminTitle } from "../../../adminStyles";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const services = await getServices();
  const service = services.find((s) => s.id === id);

  if (!service) notFound();

  return (
    <div className={adminPageShell}>
      <h1 className={adminTitle}>Rediger tjeneste</h1>
      <p className={adminLead}>{service.title}</p>
      <ServiceEditForm service={service} />
    </div>
  );
}
