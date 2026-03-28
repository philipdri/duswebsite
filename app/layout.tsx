import type { Metadata } from "next";
import Script from "next/script";
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
    <html lang="no" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vfr3hyb.css" />
      </head>
      <body>
        {children}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
