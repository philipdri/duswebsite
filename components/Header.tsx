"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showLogo = !isHome || scrolled;

  return (
    <>
      <header
        className=" w-full top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
        style={{
          backgroundColor: "#f7f4f0",
          height: "60px",
        }}
      >
        <Link
          href="/"
          className="transition-all duration-500"
          style={{
            opacity: showLogo ? 1 : 0,
            pointerEvents: showLogo ? "auto" : "none",
          }}
        >
          <Image
            src="/img/logo_lys.png"
            alt="DUS Arkitekter Logo"
            width={36}
            height={36}
            unoptimized
            style={{ width: "36px", height: "auto" }}
          />
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-classico tracking-widest text-sm"
          style={{ color: "#000", letterSpacing: "0.25em", fontWeight: 300 }}
        >
          DUS ARKITEKTER
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 z-50 relative p-2"
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 transition-all duration-300"
            style={{
              backgroundColor: "#000",
              height: "1.5px",
              transform: menuOpen
                ? "rotate(45deg) translate(3px, 4px)"
                : "none",
            }}
          />
          <span
            className="block w-6 transition-all duration-300"
            style={{
              backgroundColor: "#000",
              height: "1.5px",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 transition-all duration-300"
            style={{
              backgroundColor: "#000",
              height: "1.5px",
              transform: menuOpen
                ? "rotate(-45deg) translate(3px, -4px)"
                : "none",
            }}
          />
        </button>
      </header>

      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: "#f7f4f0",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col items-center gap-8">
          {[
            { href: "/", label: "HJEM" },
            { href: "/tjenester", label: "TJENESTER" },
            { href: "/#prosjekter", label: "PROSJEKTER" },
            { href: "/#omoss", label: "OM OSS" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-classico tracking-widest text-2xl hover:opacity-50 transition-opacity"
              style={{ color: "#000", fontWeight: 300, letterSpacing: "0.3em" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
