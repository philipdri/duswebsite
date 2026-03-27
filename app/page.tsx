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
        style={{ paddingTop: '10vh' }}
      >
        <p
          className="font-classico leading-relaxed mb-8"
          style={{
            color: '#4c4c4f',
            fontWeight: 300,
            fontSize: '1.1rem',
            lineHeight: '1.9',
          }}
        >
          Dus handler om å være i harmoni med noe eller noen. Begrepet rommer en
          stillhet og en nærhet – en arkitektur som ikke roper, men hvisker.
          Vi jobber med prosjekter der form og funksjon møtes i det
          meningsfulle.
        </p>
        <a
          href="/tjenester"
          className="font-classico text-xs tracking-widest hover:opacity-50 transition-opacity"
          style={{
            color: '#000',
            letterSpacing: '0.25em',
            fontWeight: 300,
            textDecoration: 'none',
            borderBottom: '1px solid #000',
            paddingBottom: '2px',
          }}
        >
          SE HVA VI KAN TILBY | VÅRE TJENESTER
        </a>
      </section>

      <PortfolioGrid />
      <AboutSection />
      <ScrollToTop />
    </>
  );
}
