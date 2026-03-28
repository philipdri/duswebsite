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
      className={` margintop:50 portfolio-item flex items-center  ${isReversed ? "portfolio-item-right" : "portfolio-item-left"}`}
      style={{
        flexDirection: isReversed ? "row-reverse" : "row",
        marginTop: "50px",
      }}
    >
      <Link
        href={`/prosjekter/${project.slug}`}
        className="block relative overflow-hidden group"
        style={{ width: "60%", aspectRatio: "4/3" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(247,244,240,0.7)" }}
        >
          <span
            className="font-classico tracking-widest text-sm"
            style={{ color: "#000", letterSpacing: "0.25em", fontWeight: 300 }}
          >
            SE PROSJEKT
          </span>
        </div>
      </Link>
      <div
        className="flex flex-col justify-center px-50 py-8 "
        style={{ width: "40%" }}
      >
        <p
          className="font-classico text-xs tracking-widest mb-4"
          style={{ color: "#737373", letterSpacing: "0.2em", fontWeight: 300 }}
        >
          {project.portfolioLabel.split(/<br\s*\/?>/i).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
        <Link
          href={`/prosjekter/${project.slug}`}
          className="font-classico text-xs tracking-widest hover:opacity-50 transition-opacity"
          style={{ color: "#000", letterSpacing: "0.25em", fontWeight: 300 }}
        >
          SE PROSJEKT →
        </Link>
      </div>
    </div>
  );
}
