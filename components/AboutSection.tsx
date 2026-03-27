export default function AboutSection() {
  return (
    <section
      id="omoss"
      className="relative mt-8"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '50px 50px 0 0',
        boxShadow: '0 -2px 15px rgba(0,0,0,0.1)',
        padding: '80px 40px',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-classico tracking-widest text-sm mb-12"
          style={{ color: '#737373', letterSpacing: '0.25em', fontWeight: 400 }}
        >
          OM OSS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p
              className="font-classico leading-relaxed mb-6"
              style={{ color: '#434343', fontWeight: 300, fontSize: '1rem', lineHeight: '1.8' }}
            >
              DUS Arkitekter er et arkitektkontor med fokus på bærekraftig design og menneskelig skala. Vi tror på arkitektur som er i harmoni med sine omgivelser – med naturen, med historien og med menneskene som bruker rommene.
            </p>
            <p
              className="font-classico leading-relaxed"
              style={{ color: '#434343', fontWeight: 300, fontSize: '1rem', lineHeight: '1.8' }}
            >
              Våre prosjekter spenner fra private boliger til offentlige kulturbygg, alltid med samme dedikasjon til kvalitet, detalj og kontekst.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/oss.jpg"
              alt="DUS Arkitekter team"
              className="w-full object-cover"
              style={{ borderRadius: '4px', maxHeight: '300px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
