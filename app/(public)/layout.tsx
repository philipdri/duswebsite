"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Header />
      <main className={isHome ? undefined : "pt-(--header-offset)"}>
        {children}
      </main>
      <Footer />
    </>
  );
}
