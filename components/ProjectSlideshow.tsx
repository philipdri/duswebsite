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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', maxHeight: '70vh', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].caption}
          style={{ width: '100%', objectFit: 'contain', maxHeight: '70vh', backgroundColor: '#f7f4f0', display: 'block' }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#000',
                background: 'rgba(247,244,240,0.85)',
                border: '1px solid #ccc',
                padding: '10px 18px',
                fontSize: '1.75rem',
                lineHeight: 1,
                cursor: 'pointer',
                fontFamily: '"classico-urw", sans-serif',
                zIndex: 10,
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={next}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#000',
                background: 'rgba(247,244,240,0.85)',
                border: '1px solid #ccc',
                padding: '10px 18px',
                fontSize: '1.75rem',
                lineHeight: 1,
                cursor: 'pointer',
                fontFamily: '"classico-urw", sans-serif',
                zIndex: 10,
              }}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p
          style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 300, fontSize: '0.75rem', fontFamily: '"classico-urw", sans-serif' }}
        >
          {images[current].caption}
        </p>
        {images.length > 1 && (
          <p
            style={{ color: '#737373', fontWeight: 300, fontSize: '0.75rem', marginTop: '8px', fontFamily: '"classico-urw", sans-serif' }}
          >
            {current + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
