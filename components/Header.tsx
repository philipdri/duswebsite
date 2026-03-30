"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const links = [
    { href: "/", label: "HJEM" },
    { href: "/tjenester", label: "TJENESTER" },
    { href: "/#prosjekter", label: "PROSJEKTER" },
    { href: "/#omoss", label: "OM OSS" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) {
        return;
      }

      const target = event.target as Node;
      if (!menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return pathname === "/";
    }
    return pathname === href;
  };

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

        <div
          key={pathname ?? "mobile-nav"}
          className="relative z-[60] shrink-0"
          ref={menuRef}
        >
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-16 w-16 items-center justify-center transition-opacity hover:opacity-70"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Lukk meny" : "Apne meny"}
            style={{
              color: "#000",
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            <span
              className="flex flex-col items-center justify-center gap-1.5"
              aria-hidden
            >
              <span
                className="block w-10 transition-all duration-300"
                style={{
                  backgroundColor: "#111",
                  height: "2px",
                  transform: menuOpen
                    ? "translateY(6px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className="block w-10 transition-all duration-300"
                style={{
                  backgroundColor: "#111",
                  height: "2px",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-10 transition-all duration-300"
                style={{
                  backgroundColor: "#111",
                  height: "2px",
                  transform: menuOpen
                    ? "translateY(-6px) rotate(-45deg)"
                    : "none",
                }}
              />
            </span>
            <span className="sr-only font-classico" style={{ fontWeight: 300 }}>
              {menuOpen ? "Lukk meny" : "Apne meny"}
            </span>
          </button>

          {menuOpen ? (
            <div
              id="mobile-nav-panel"
              className="fixed right-4 top-[68px] z-50 rounded-xl border p-2 shadow-lg"
              style={{
                borderColor: "#d4cfc8",
                backgroundColor: "#f7f4f0",
                width: "min(18rem, calc(100vw - 2rem))",
                maxWidth: "calc(100vw - 2rem)",
              }}
            >
              <nav className="flex flex-col gap-1">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-classico tracking-widest transition-opacity hover:opacity-60"
                    style={{
                      color: isLinkActive(item.href) ? "#6f6e68" : "#000",
                      letterSpacing: "0.16em",
                      fontWeight: isLinkActive(item.href) ? 400 : 300,
                    }}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isLinkActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </header>
    </>
  );
}
