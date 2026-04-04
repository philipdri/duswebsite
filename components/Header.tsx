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
const LARGE_LOGO_SIZE = 200;
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
  const menuItemBaseClass =
    "flex max-w-full flex-col items-center gap-4 px-0 py-[0.2rem] text-center font-classico text-[clamp(1.2rem,3.2vw,1.45rem)] font-light leading-none tracking-[0.12em] text-black transition-opacity duration-[250ms] [overflow-wrap:anywhere]";
  const menuUnderlineBaseClass =
    "block h-px w-full max-w-32 origin-center bg-current transition-transform duration-300";

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
  // p = 0 -> logo is large and centred in the viewport (home page, top)
  // p = 1 -> logo is small in the top-left header corner
  const p = isHome ? logoProgress : 1;

  // Fraction still to travel towards the centre (1 at top, 0 when fully in header)
  const frac = (1 - p).toFixed(6);

  // The element's resting centre inside the header (viewport coords, since header is position:fixed):
  //   x = headerPadding + SMALL/2  ->  clamp(1rem, 3vw, 2.25rem) + 18px
  //   y = HEADER_HEIGHT / 2        ->  50px
  // We translate from that resting position towards the viewport centre:
  //   tx_full = 50vw - headerPadding - 18px
  //   ty_full = 50vh - 50px
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
      className="fixed left-0 top-0 z-200 flex h-(--header-height) w-full items-center justify-between bg-dus-bg px-[clamp(1rem,3vw,2.25rem)] transition-shadow duration-300"
      style={{
        boxShadow: scrolled || menuOpen ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Link
        href="/"
        className="z-10 inline-block will-change-transform"
        style={{ transform: logoTransform }}
      >
        <Image
          src="/img/logo_lys.png"
          alt="DUS Arkitekter Logo"
          width={36}
          height={36}
          unoptimized
          className="h-auto w-9"
        />
      </Link>

      <Link
        href="/"
        className="absolute left-1/2 max-w-[70vw] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap font-classico text-[clamp(10px,2.4vw,14px)] font-light tracking-[0.2em] text-black transition-opacity duration-150"
        style={{
          opacity: centreTextOpacity,
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
          className="relative z-230 inline-flex min-h-14 min-w-14 items-center justify-center border-0 bg-transparent py-2 text-black"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Lukk meny" : "Apne meny"}
        >
          <span
            className="flex flex-col items-center justify-center gap-1.25"
            aria-hidden
          >
            <span
              className="block h-[2.5px] w-8 bg-black transition-all duration-300"
              style={{
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-[2.5px] w-8 bg-black transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-[2.5px] w-8 bg-black transition-all duration-300"
              style={{
                transform: menuOpen
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
              }}
            />
          </span>
          <span className="sr-only font-classico font-light">
            {menuOpen ? "Lukk meny" : "Apne meny"}
          </span>
        </button>
      </div>

      <div
        id="mobile-nav-panel"
        className="fixed inset-0 z-220 overflow-y-auto bg-dus-bg"
        aria-hidden={!menuOpen}
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, -100%, 0)",
          transition: "transform 0.45s ease, opacity 0.3s ease",
        }}
      >
        <div className="box-border flex min-h-svh w-full flex-col">
          <nav
            ref={menuPanelRef}
            className="my-auto flex w-full flex-col items-center justify-center gap-12 overflow-x-hidden px-8 py-12"
          >
            {links.map((item) =>
              item.href.startsWith("/#") ? (
                <button
                  key={item.href}
                  type="button"
                  className={`${menuItemBaseClass} border-0 bg-transparent ${hoveredItem === item.href ? "opacity-[0.65]" : "opacity-100"}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleMenuNavigation(item.href)}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden
                    className={`${menuUnderlineBaseClass} ${hoveredItem === item.href ? "scale-x-100" : "scale-x-0"}`}
                  />
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${menuItemBaseClass} no-underline ${hoveredItem === item.href ? "opacity-[0.65]" : "opacity-100"}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden
                    className={`${menuUnderlineBaseClass} ${hoveredItem === item.href ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
