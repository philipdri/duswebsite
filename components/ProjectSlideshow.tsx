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
  const buttonClassName =
    'cursor-pointer border-0 bg-transparent px-3 py-0 font-classico text-xl leading-none tracking-[0.05em] text-dus-dark opacity-60 transition-opacity hover:opacity-100';

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].caption}
          className="block max-h-[70vh] w-full bg-dus-bg object-contain"
        />
      </div>

      <div className="mt-4 text-center">
        <p className="mb-2.5 font-classico text-xs font-light tracking-[0.2em] text-dus-muted">
          {images[current].caption}
        </p>

        {images.length > 1 && (
          <div className="inline-flex items-center gap-1">
            <button
              onClick={prev}
              className={buttonClassName}
              aria-label="Previous image"
            >
              {'\u2190'}
            </button>
            <span className="min-w-12 text-center font-classico text-xs font-light tracking-[0.15em] text-dus-muted">
              {current + 1} / {images.length}
            </span>
            <button
              onClick={next}
              className={buttonClassName}
              aria-label="Next image"
            >
              {'\u2192'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
