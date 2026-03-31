"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const HOME_LOGO_REVEAL_THRESHOLD = 24;
// Distance (px) over which the logo travels from the viewport centre to the header corner.
const LOGO_TRANSITION_PX = 320;
// Natural size of the small header logo (px)
const SMALL_LOGO_SIZE = 36;
// Enlarged size of the logo in the hero (px)
const LARGE_LOGO_SIZE = 120;
// Header height from CSS variable --header-height (px)
const HEADER_HEIGHT = 100;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 0 = logo at viewport centre (hero), 1 = logo in header corner
  const [logoProgress, setLogoProgress] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const links = [
    { href: "/", label: "HJEM" },
    { href: "/#prosjekter", label: "PROSJEKTER" },
    { href: "/tjenester", label: "TJENESTER" },
    { href: "/#omoss", label: "OM OSS" },
    { href: "/#kontakt", label: "KONTAKT" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > HOME_LOGO_REVEAL_THRESHOLD);
      if (isHome) {
        setLogoProgress(Math.min(1, Math.max(0, y / LOGO_TRANSITION_PX)));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close menu when navigating to a different page.
  // React-recommended pattern: adjust state during render instead of in an effect.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
      if (!menuRef.current && !menuPanelRef.current) {
        return;
      }

      const target = event.target as Node;
      const clickedToggle = menuRef.current?.contains(target);
      const clickedPanel = menuPanelRef.current?.contains(target);

      if (!clickedToggle && !clickedPanel) {
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

  // --- Logo scroll transition ---
  // p = 0 → logo is large and centred in the viewport (home page, top)
  // p = 1 → logo is small in the top-left header corner
  const p = isHome ? logoProgress : 1;

  // Fraction still to travel towards the centre (1 at top, 0 when fully in header)
  const frac = (1 - p).toFixed(6);

  // The element's resting centre inside the header (viewport coords, since header is position:fixed):
  //   x = headerPadding + SMALL/2  →  clamp(1rem, 3vw, 2.25rem) + 18px
  //   y = HEADER_HEIGHT / 2        →  50px
  // We translate from that resting position towards the viewport centre:
  //   tx_full = 50vw − headerPadding − 18px
  //   ty_full = 50vh − 50px
  const logoTx =
    p < 1
      ? `calc((50vw - clamp(1rem, 3vw, 2.25rem) - ${SMALL_LOGO_SIZE / 2}px) * ${frac})`
      : "0px";
  const logoTy =
    p < 1 ? `calc((50vh - ${HEADER_HEIGHT / 2}px) * ${frac})` : "0px";
  const logoScale = 1 + (LARGE_LOGO_SIZE / SMALL_LOGO_SIZE - 1) * (1 - p);
  const logoTransform =
    p >= 1 ? "none" : `translate(${logoTx}, ${logoTy}) scale(${logoScale})`;

  // Fade centre text in as the logo travels into the header
  const centreTextOpacity = isHome ? p : 1;

  const handleMenuNavigation = (href: string) => {
    setMenuOpen(false);

    if (!href.startsWith("/#")) {
      return;
    }

    if (pathname !== "/") {
      router.push(href);
      return;
    }

    const sectionId = href.slice(2);
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", href);
    });
  };

  return (
    <header
      className="fixed left-0 top-0 z-[200] flex w-full items-center justify-between"
      style={{
        backgroundColor: "#f7f4f0",
        height: "var(--header-height)",
        paddingInline: "clamp(1rem, 3vw, 2.25rem)",
        boxShadow: scrolled || menuOpen ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          transform: logoTransform,
          willChange: "transform",
          zIndex: 10,
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
        className="absolute left-1/2 -translate-x-1/2 font-classico tracking-widest"
        style={{
          color: "#000",
          letterSpacing: "0.2em",
          fontWeight: 300,
          fontSize: "clamp(10px, 2.4vw, 14px)",
          whiteSpace: "nowrap",
          maxWidth: "70vw",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: centreTextOpacity,
          transition: "opacity 0.15s linear",
        }}
      >
        DUS ARKITEKTER
      </Link>

      <div
        key={pathname ?? "mobile-nav"}
        className="relative z-230 flex items-center"
        ref={menuRef}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Lukk meny" : "Apne meny"}
          style={{
            color: "#000",
            backgroundColor: "transparent",
            border: "none",
            padding: "0.5rem 0",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "56px",
            minHeight: "56px",
            position: "relative",
            zIndex: 230,
          }}
        >
          <span
            className="flex flex-col items-center justify-center gap-1.25"
            aria-hidden
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <span
              className="transition-all duration-300"
              style={{
                display: "block",
                backgroundColor: "#000",
                height: "2.5px",
                width: "32px",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="transition-all duration-300"
              style={{
                display: "block",
                backgroundColor: "#000",
                height: "2.5px",
                width: "32px",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="transition-all duration-300"
              style={{
                display: "block",
                backgroundColor: "#000",
                height: "2.5px",
                width: "32px",
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
      </div>

      <div
        id="mobile-nav-panel"
        className="fixed inset-0 z-[220]"
        aria-hidden={!menuOpen}
        style={{
          backgroundColor: "#f7f4f0",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, -100%, 0)",
          transition: "transform 0.45s ease, opacity 0.3s ease",
          overflow: "hidden",
          inset: 0,
        }}
      >
        <nav
          ref={menuPanelRef}
          className="flex h-min w-full flex-col items-center justify-center"
          style={{
            padding: "calc(var(--header-height)) 2rem 3rem",
            gap: "3.0rem",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          {links.map((item) =>
            item.href.startsWith("/#") ? (
              <button
                key={item.href}
                type="button"
                className="font-classico"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.9rem",
                  color: "#000",
                  fontFamily: '"classico-urw", sans-serif',
                  letterSpacing: "0.12em",
                  fontWeight: 300,
                  fontSize: "clamp(1.2rem, 3.2vw, 1.45rem)",
                  lineHeight: 1,
                  textAlign: "center",
                  maxWidth: "100%",
                  overflowWrap: "anywhere",
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0.2rem 0",
                  cursor: "pointer",
                  opacity: hoveredItem === item.href ? 0.65 : 1,
                  transition: "opacity 0.25s ease",
                }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleMenuNavigation(item.href)}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden
                  className="block h-px origin-center bg-current transition-transform duration-300"
                  style={{
                    width: "min(8rem, 100%)",
                    transform:
                      hoveredItem === item.href ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="font-classico"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.9rem",
                  color: "#000",
                  fontFamily: '"classico-urw", sans-serif',
                  letterSpacing: "0.12em",
                  fontWeight: 300,
                  fontSize: "clamp(1.2rem, 3.2vw, 1.45rem)",
                  lineHeight: 1,
                  textAlign: "center",
                  maxWidth: "100%",
                  overflowWrap: "anywhere",
                  cursor: "pointer",
                  opacity: hoveredItem === item.href ? 0.65 : 1,
                  transition: "opacity 0.25s ease",
                  textDecoration: "none",
                  padding: "0.2rem 0",
                }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setMenuOpen(false)}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden
                  className="block h-px origin-center bg-current transition-transform duration-300"
                  style={{
                    width: "min(8rem, 100%)",
                    transform:
                      hoveredItem === item.href ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
