"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export interface PortfolioProject {
  slug: string;
  title: string;
  coverImage: string;
  portfolioLabel: string;
}

interface PortfolioItemProps {
  project: PortfolioProject;
  index: number;
}

export default function PortfolioItem({ project, index }: PortfolioItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("portfolio-visible");
          }
        });
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isReversed = index % 2 !== 0;

  return (
    <div
      ref={ref}
      className={`portfolio-item mt-12 flex flex-col gap-6 ${isReversed ? "portfolio-item-right md:flex-row-reverse" : "portfolio-item-left md:flex-row"} md:items-center`}
    >
      <Link
        href={`/prosjekter/${project.slug}`}
        className="group relative block aspect-[4/3] w-full overflow-hidden md:w-[60%]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(247,244,240,0.7)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-classico text-sm font-light tracking-[0.25em] text-black">
            SE PROSJEKT
          </span>
        </div>
      </Link>
      <div
        className={`flex w-full flex-col justify-center py-2 md:w-[40%] md:py-8 ${isReversed ? "md:pr-[clamp(1.5rem,4vw,4rem)]" : "md:pl-[clamp(1.5rem,4vw,4rem)]"}`}
      >
        <p className="mb-4 font-classico text-xs font-light tracking-[0.2em] text-dus-muted">
          {project.portfolioLabel.split(/<br\s*\/?>/i).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
        <Link
          href={`/prosjekter/${project.slug}`}
          className="font-classico text-xs font-light tracking-[0.25em] text-black transition-opacity hover:opacity-50"
        >
          SE PROSJEKT {"\u2192"}
        </Link>
      </div>
    </div>
  );
}
