import { services } from "@/lib/services";
import React from "react";

export default function TjenesterPage() {
  return (
    <div style={{ paddingTop: '10vh', backgroundColor: '#f7f4f0', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1
          className="font-classico tracking-widest text-sm mb-16"
          style={{ color: '#737373', letterSpacing: '0.25em', fontWeight: 400 }}
        >
          TJENESTER
        </h1>
        <div className="flex flex-col gap-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="flex items-center gap-12"
              style={{ flexDirection: index % 2 !== 0 ? 'row-reverse' : 'row' } as React.CSSProperties}
            >
              <div style={{ width: '55%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              <div style={{ width: '45%' }}>
                <h2
                  className="font-classico tracking-widest text-sm mb-4"
                  style={{ color: '#000', letterSpacing: '0.2em', fontWeight: 400 }}
                >
                  {service.title}
                </h2>
                <p
                  className="font-classico"
                  style={{ color: '#737373', fontWeight: 300, fontSize: '0.9rem', lineHeight: '1.8' }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
