"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-4 z-50 rounded-full border border-gray-500 bg-white px-4 py-2 font-classico text-xs font-light tracking-[0.2em] text-black transition-all duration-300 hover:cursor-pointer sm:bottom-8 sm:right-8 ${visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      aria-label="Scroll to top"
    >
      {"\u2191"}
    </button>
  );
}
