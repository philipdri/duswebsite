import { getServices, getSiteContent } from "@/lib/content-db";
import Image from "next/image";

export default async function TjenesterPage() {
  const [services, introText] = await Promise.all([
    getServices(),
    getSiteContent("tjenester_intro"),
  ]);

  return (
    <div className="min-h-[110vh] bg-dus-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-12 sm:px-[7%] sm:pt-16 lg:w-[85%] lg:flex-row lg:items-start lg:justify-between lg:pt-[5%]">
        <p className="w-full font-classico text-[clamp(10px,2.5vw,30px)] font-extralight leading-[1.4] text-dus-text lg:w-[55%]">
          {introText}
        </p>
        <Image
          src="/img/byplanlegging.jpg"
          alt="Byplanlegging illustrasjon"
          width={400}
          height={300}
          className="h-auto w-full object-cover lg:w-[30%]"
        />
      </div>
      <div className="mx-auto my-12 flex w-full max-w-6xl flex-col gap-0 px-4 font-classico sm:px-[12%] lg:my-[5%]">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`relative mb-10 flex w-full flex-col gap-6 border-t border-dus-border pt-6 lg:mb-[5%] lg:flex-row lg:items-start lg:justify-between lg:pt-[3%] ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
          >
            <div className="flex w-full flex-col items-start justify-center lg:w-[40%]">
              <h2 className="font-classico text-base font-normal text-black sm:text-lg lg:text-[1.1vw]">
                {service.title}
              </h2>
              <p className="font-classico text-[0.9rem] font-light leading-[1.8] text-dus-muted">
                {service.description}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              className="block h-auto w-full max-w-full transition duration-1000 ease-in-out lg:max-w-[40%]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
