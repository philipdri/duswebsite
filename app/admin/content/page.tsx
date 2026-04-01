import { getAllSiteContent } from "@/lib/content-db";
import ContentForm from "./ContentForm";
import { adminLead, adminPageShell, adminTitle } from "../adminStyles";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const content = await getAllSiteContent();

  return (
    <div className={adminPageShell}>
      <h1 className={adminTitle}>Rediger innhold</h1>
      <p className={adminLead}>Her kan du redigere tekstinnhold p{"\u00e5"} nettsiden.</p>
      <ContentForm initialValues={content} />
    </div>
  );
}
