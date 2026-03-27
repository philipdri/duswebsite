'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center"
      style={{
        height: '95vh',
        width: '90%',
        margin: '10vh auto 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/img/skygge_glød.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <Link
        href="/"
        className="relative z-10 transition-all duration-700"
        style={{
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? 'translateY(-20px)' : 'translateY(0)',
        }}
      >
        <Image
          src="/img/logo_lys.png"
          alt="DUS Arkitekter"
          width={100}
          height={100}
          unoptimized
          style={{ width: '100px', height: 'auto' }}
        />
      </Link>
    </div>
  );
}
