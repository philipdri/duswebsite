import { getSiteContent } from "@/lib/content-db";

export default async function AboutSection() {
  const heading = await getSiteContent("about_heading");
  const rawText = await getSiteContent("about_text");
  const paragraphs = rawText.split(/\n{2,}/).filter(Boolean);

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
        marginRight: "5%",
        marginLeft: "5%",
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
            paddingRight: "10%",
            paddingLeft: "10%",
          }}
        >
          {heading}
        </h2>
        <div className="flex flex-col gap-12">
          <div>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="font-classico leading-relaxed"
                style={{
                  color: "#434343",
                  fontWeight: 300,
                  fontSize: "clamp(10px, 2vw, 15px)",
                  lineHeight: "1.8",
                  paddingRight: "10%",
                  paddingLeft: "10%",
                  marginBottom: i < paragraphs.length - 1 ? "1em" : 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/oss.jpg"
              alt="Oss bak Dus!"
              className="h-48 w-full object-cover sm:h-60 sm:w-auto"
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/oppheng.jpg"
              alt="Oss bak Dus!"
              className="h-48 w-full object-cover sm:h-60 sm:w-auto"
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/byplanlegging.jpg"
              alt="Oss bak Dus!"
              className="h-48 w-full object-cover sm:h-60 sm:w-auto"
              style={{
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
