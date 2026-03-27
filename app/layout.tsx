import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dus Arkitekter",
  description: "DUS Arkitekter – arkitektur i harmoni med omgivelsene.",
  icons: {
    icon: "/img/logo_lys.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vfr3hyb.css" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
        ></script>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
