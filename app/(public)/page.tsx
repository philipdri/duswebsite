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
      <section
        style={{
          padding: "3rem 7% 0",
          textAlign: "center",
          backgroundColor: "#f7f4f0",
        }}
      >
        <p
          className="mb-8 font-classico leading-relaxed"
          style={{
            color: "#000000",
            fontWeight: 200,
            fontSize: "clamp(10px, 2.5vw, 30px)",
            lineHeight: "1.6",
            textAlign: "center",
            margin: "0 auto 2rem",
            maxWidth: "28ch",
          }}
        >
          {introText}
        </p>
        <a
          href="/tjenester"
          className="font-classico hover:opacity-50 transition-opacity"
          style={{
            color: "#6e6e73",
            fontSize: "clamp(8px, 2.5vw, 15px)",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "#858589" }}>SE HVA VI KAN TILBY</span> | VÅRE
          TJENESTER
        </a>
      </section>

      <PortfolioGrid />
      <AboutSection />
      <ScrollToTop />
    </>
  );
}
