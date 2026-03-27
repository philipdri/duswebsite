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
    <div className="w-full">
      <div className="relative w-full" style={{ maxHeight: '70vh', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].caption}
          className="w-full object-contain"
          style={{ maxHeight: '70vh', backgroundColor: '#f7f4f0' }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 font-classico text-2xl hover:opacity-50 transition-opacity"
              style={{ color: '#000', background: 'rgba(247,244,240,0.7)', border: 'none', padding: '8px 16px' }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 font-classico text-2xl hover:opacity-50 transition-opacity"
              style={{ color: '#000', background: 'rgba(247,244,240,0.7)', border: 'none', padding: '8px 16px' }}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>
      <div className="text-center mt-4">
        <p
          className="font-classico text-xs tracking-widest"
          style={{ color: '#737373', letterSpacing: '0.2em', fontWeight: 300 }}
        >
          {images[current].caption}
        </p>
        {images.length > 1 && (
          <p
            className="font-classico text-xs mt-2"
            style={{ color: '#737373', fontWeight: 300 }}
          >
            {current + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
