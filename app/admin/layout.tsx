import Link from "next/link";
import { logout } from "@/app/actions/auth";

export const metadata = { title: "DUS Admin" };

const navLinkClass =
  "text-xs tracking-[0.1em] text-[#ccc] no-underline transition-opacity hover:opacity-70";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex h-[52px] items-center justify-between bg-black px-4 text-white sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/admin"
            className="text-xs tracking-[0.2em] text-white no-underline transition-opacity hover:opacity-70"
          >
            DUS ADMIN
          </Link>
          <Link href="/admin/projects" className={navLinkClass}>
            PROSJEKTER
          </Link>
          <Link href="/admin/projects/new" className={navLinkClass}>
            + NYTT PROSJEKT
          </Link>
          <Link href="/admin/tjenester" className={navLinkClass}>
            TJENESTER
          </Link>
          <Link href="/admin/content" className={navLinkClass}>
            INNHOLD
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-[0.7rem] tracking-[0.1em] text-[#999] no-underline transition-opacity hover:opacity-70"
          >
            SE NETTSIDE {"\u2197"}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="border border-[#444] bg-transparent px-3 py-1 text-[0.7rem] tracking-[0.1em] text-[#ccc] transition-colors hover:border-[#666] hover:text-white"
            >
              LOGG UT
            </button>
          </form>
        </div>
      </nav>
      <div className="min-h-[calc(100vh-52px)] bg-dus-bg font-sans">{children}</div>
    </>
  );
}
