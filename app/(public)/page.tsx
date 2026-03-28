import PortfolioGrid from "@/components/PortfolioGrid";
import AboutSection from "@/components/AboutSection";
import ScrollToTop from "@/components/ScrollToTop";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section
        className="px-8 py-20 max-w-3xl mx-auto"
        style={{ paddingTop: '80px' }}
      >
        <p
          className="font-classico leading-relaxed mb-8"
          style={{
            color: '#000000',
            fontWeight: 150,
            fontSize: 'clamp(10px, 2.5vw, 30px)',
            lineHeight: '1.6',
            textAlign: 'center',
          }}
        >
          Dus handler om å være i harmoni med noe eller noen, og det har blitt
          grunnleggende for vår estetikk som ellers er preget av renhet,
          funksjonalitet og tidløs eleganse.
        </p>
        <a
          href="/tjenester"
          className="font-classico hover:opacity-50 transition-opacity"
          style={{
            color: '#6e6e73',
            fontSize: 'clamp(8px, 2.5vw, 15px)',
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          <span style={{ color: '#858589' }}>SE HVA VI KAN TILBY</span> | VÅRE
          TJENESTER
        </a>
      </section>

      <PortfolioGrid />
      <AboutSection />
      <ScrollToTop />
    </>
  );
}
