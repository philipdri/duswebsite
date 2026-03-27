'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  variant?: 'home' | 'page';
}

export default function Header({ variant = 'page' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoAtTop, setLogoAtTop] = useState(false);

  useEffect(() => {
    if (variant !== 'home') return;
    const handleScroll = () => {
      setLogoAtTop(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
        style={{
          backgroundColor: '#f7f4f0',
          height: '10vh',
        }}
      >
        {variant === 'home' ? (
          <Link
            href="/"
            className="transition-all duration-500"
            style={{
              opacity: logoAtTop ? 1 : 0,
              pointerEvents: logoAtTop ? 'auto' : 'none',
            }}
          >
            <Image
              src="/img/logo_lys.png"
              alt="DUS Arkitekter Logo"
              width={40}
              height={40}
              unoptimized
            />
          </Link>
        ) : (
          <Link href="/">
            <Image
              src="/img/logo_lys.png"
              alt="DUS Arkitekter Logo"
              width={40}
              height={40}
              unoptimized
              style={{ width: '5%', minWidth: '30px' }}
            />
          </Link>
        )}

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-classico tracking-widest text-sm"
          style={{ color: '#000', letterSpacing: '0.25em', fontWeight: 300 }}
        >
          DUS ARKITEKTER
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 z-50 relative"
          aria-label="Toggle menu"
        >
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              backgroundColor: '#000',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              backgroundColor: '#000',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              backgroundColor: '#000',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </header>

      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: '#f7f4f0',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <nav className="flex flex-col items-center gap-8">
          {[
            { href: '/', label: 'HJEM' },
            { href: '/tjenester', label: 'TJENESTER' },
            { href: '/#prosjekter', label: 'PROSJEKTER' },
            { href: '/#omoss', label: 'OM OSS' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-classico tracking-widest text-2xl hover:opacity-50 transition-opacity"
              style={{ color: '#000', fontWeight: 300, letterSpacing: '0.3em' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
