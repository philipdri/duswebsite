'use client';

import { useState } from 'react';
import { ProjectImage } from '@/lib/projects';

interface ProjectSlideshowProps {
  images: ProjectImage[];
}

export default function ProjectSlideshow({ images }: ProjectSlideshowProps) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: '0 12px',
    cursor: 'pointer',
    color: '#171717',
    fontSize: '1.25rem',
    lineHeight: 1,
    fontFamily: '"classico-urw", sans-serif',
    letterSpacing: '0.05em',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Image */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].caption}
          style={{ width: '100%', objectFit: 'contain', maxHeight: '70vh', backgroundColor: '#f7f4f0', display: 'block' }}
        />
      </div>

      {/* Caption + navigation */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <p style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 300, fontSize: '0.75rem', fontFamily: '"classico-urw", sans-serif', marginBottom: '10px' }}>
          {images[current].caption}
        </p>

        {images.length > 1 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={prev}
              style={buttonStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
              aria-label="Previous image"
            >
              ←
            </button>
            <span style={{ color: '#737373', fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.15em', fontFamily: '"classico-urw", sans-serif', minWidth: '48px', textAlign: 'center' }}>
              {current + 1} / {images.length}
            </span>
            <button
              onClick={next}
              style={buttonStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
              aria-label="Next image"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
