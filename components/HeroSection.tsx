"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const FADE_SPEED = 1.6;
const MIN_LOGO_SCALE = 0.25;
const SCALE_SPEED = 0.75;

export default function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
      const progress = Math.min(1, window.scrollY / (heroHeight * 0.55));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoOpacity = Math.max(0, 1 - scrollProgress * FADE_SPEED);
  const logoScale = Math.max(MIN_LOGO_SCALE, 1 - scrollProgress * SCALE_SPEED);
  const logoTranslateY = -scrollProgress * 40;

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center"
      style={{
        minHeight: "100svh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/img/skygge_glød.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      />
      <div
        className="relative z-10"
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale}) translateY(${logoTranslateY}px)`,
          willChange: "opacity, transform",
        }}
      >
        <Image
          src="/img/logo_lys.png"
          alt="DUS Arkitekter"
          width={120}
          height={120}
          unoptimized
          style={{ width: "120px", height: "auto" }}
        />
      </div>
    </div>
  );
}
