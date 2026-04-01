import PortfolioGrid from "@/components/PortfolioGrid";
import AboutSection from "@/components/AboutSection";
import ScrollToTop from "@/components/ScrollToTop";
import HeroSection from "@/components/HeroSection";
import { getSiteContent } from "@/lib/content-db";

export default async function Home() {
  const introText = await getSiteContent("intro_text");

  return (
    <>
      <HeroSection />
      <section className="bg-dus-bg px-4 pt-12 text-center sm:px-[7%]">
        <p className="mx-auto mb-8 max-w-[28ch] font-classico text-[clamp(10px,2.5vw,30px)] font-extralight leading-[1.6] text-dus-text">
          {introText}
        </p>
        <a
          href="/tjenester"
          className="font-classico text-[clamp(8px,2.5vw,15px)] text-[#6e6e73] no-underline transition-opacity hover:opacity-50"
        >
          <span className="text-[#858589]">SE HVA VI KAN TILBY</span> | V\u00c5RE
          TJENESTER
        </a>
      </section>

      <PortfolioGrid />
      <AboutSection />
      <ScrollToTop />
    </>
  );
}
