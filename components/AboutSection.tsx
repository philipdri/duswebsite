export default function AboutSection() {
  return (
    <section
      id="omoss"
      className="relative mt-8"
      style={{
        backgroundColor: "#f7f4f0",
        borderRadius: "50px 50px 0 0",
        boxShadow: "0 -2px 15px rgba(0,0,0,0.1)",
        padding: "80px 40px",
        marginTop: "80px",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="overskrift_omoss"
          className="font-classico mb-8"
          style={{
            color: "#000",
            fontWeight: 400,
            fontSize: "clamp(7px, 3vw, 60px)",
          }}
        >
          Om Dus Arkitekter
        </h2>
        <div className="flex flex-col gap-12">
          <div>
            <p
              className="font-classico leading-relaxed"
              style={{
                color: "#434343",
                fontWeight: 300,
                fontSize: "clamp(6px, 1vw, 15px)",
                lineHeight: "1.8",
              }}
            >
              Vi er et lite og nyoppstartet, men ambisiøst arkitektkontor som er
              drevet av to engasjerte arkitekter - Synne Spjeld Høyvik og
              Anniken Marie Haugan.
              <br />
              <br />
              Navnet Dus Arkitekter kommer fra vår visjon om å være
              &quot;dus&quot; med våre klienter, prosjekter og omgivelsene selv.
              For oss handler Dus om å være i harmoni med noe eller noen, og det
              har blitt grunnleggende for vår estetikk som ellers er preget av
              renhet, funksjonalitet og tidløs eleganse.
              <br />
              <br />
              Vi har erfaring innenfor tilbygg og transformasjon av hytter og
              eneboliger, men vårt interessefelt er bredt og vi tar gjerne både
              større og mindre prosjekter. Så hvis vi skulle være av interesse,
              ikke nøl med å ta kontakt for en hyggelig, uforpliktende prat.
            </p>
          </div>
          <div className="flex flex-row gap-8 flex-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/oss.jpg"
              alt="Oss bak Dus!"
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                height: "20em",
                width: "auto",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/oppheng.jpg"
              alt="Oss bak Dus!"
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                height: "20em",
                width: "auto",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/byplanlegging.jpg"
              alt="Oss bak Dus!"
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                height: "20em",
                width: "auto",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
