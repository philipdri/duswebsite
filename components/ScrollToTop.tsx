'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 transition-all duration-300 font-classico text-xs tracking-widest"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        color: '#000',
        background: 'none',
        border: 'none',
        letterSpacing: '0.2em',
        fontWeight: 300,
      }}
      aria-label="Scroll to top"
    >
      ↑ TOPP
    </button>
  );
}
