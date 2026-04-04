import byplanleggingImage from "@/public/img/byplanlegging.jpg";
import opphengImage from "@/public/img/oppheng.jpg";
import ossImage from "@/public/img/oss.jpg";
import { getSiteContent } from "@/lib/content-db";
import Image from "next/image";

export default async function AboutSection() {
  const heading = await getSiteContent("about_heading");
  const rawText = await getSiteContent("about_text");
  const paragraphs = rawText.split(/\n{2,}/).filter(Boolean);
  const imageShadowClass = "shadow-[0_4px_10px_rgba(0,0,0,0.1)]";
  const bodyTextClass =
    "px-3 font-classico text-[clamp(10px,2vw,15px)] font-light leading-[1.8] text-[#434343] sm:px-[10%]";

  return (
    <section
      id="omoss"
      className="relative mx-4 mt-12 rounded-t-[50px] bg-dus-bg px-4 py-10 shadow-[0_-2px_15px_rgba(0,0,0,0.1)] sm:mx-[5%] sm:mt-20 sm:px-10 sm:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="overskrift_omoss"
          className="mb-8 px-3 font-classico text-[clamp(7px,3vw,60px)] font-normal text-black sm:px-[10%]"
        >
          {heading}
        </h2>
        <div className="flex flex-col gap-12">
          <div>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={`${bodyTextClass} ${i < paragraphs.length - 1 ? "mb-4" : ""}`}
              >
                {para}
              </p>
            ))}
          </div>
          <div className="space-y-4 sm:hidden">
            <Image
              src={opphengImage}
              alt="Oppheng prosjektfoto"
              className={`h-48 w-full object-cover ${imageShadowClass}`}
            />
            <div className="flex items-start justify-center gap-4">
              <Image
                src={ossImage}
                alt="Teamet bak Dus"
                className={`h-48 w-auto object-cover ${imageShadowClass}`}
              />
              <Image
                src={byplanleggingImage}
                alt="Byplanlegging prosjektfoto"
                className={`h-48 w-auto object-cover ${imageShadowClass}`}
              />
            </div>
          </div>
          <div className="hidden items-start justify-center gap-6 sm:flex">
            <Image
              src={ossImage}
              alt="Teamet bak Dus"
              className={`h-60 w-auto shrink-0 object-cover ${imageShadowClass}`}
            />
            <div
              className={`h-60 w-full max-w-[24rem] min-w-0 overflow-hidden ${imageShadowClass}`}
            >
              <Image
                src={opphengImage}
                alt="Oppheng prosjektfoto"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <Image
              src={byplanleggingImage}
              alt="Byplanlegging prosjektfoto"
              className={`h-60 w-auto shrink-0 object-cover ${imageShadowClass}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
