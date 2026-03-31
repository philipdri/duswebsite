import { services } from "@/lib/services";

export default function TjenesterPage() {
  return (
    <div style={{ paddingTop: '60px', backgroundColor: '#f7f4f0', minHeight: '100vh' }}>
      <div
        style={{
          marginTop: '15%',
          paddingLeft: '7%',
          paddingRight: '7%',
          width: '85%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'flex-start',
          boxSizing: 'border-box',
        }}
      >
        <p
          className="font-classico"
          style={{
            fontWeight: 200,
            lineHeight: '1.4',
            color: '#000000',
            fontSize: 'clamp(10px, 2.5vw, 30px)',
            textAlign: 'left',
            width: '55%',
          }}
        >
          Vi har erfaring innenfor tilbygg og transformasjon av hytter og eneboliger, men vårt interessefelt er bredt og vi tar gjerne både større og mindre prosjekter. Så hvis vi skulle være av interesse, ikke nøl med å ta kontakt for en hyggelig, uforpliktende prat.
        </p>
      </div>
      <div
        className="font-classico"
        style={{
          paddingLeft: '12%',
          paddingRight: '12%',
          marginTop: '10%',
          marginBottom: '10%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {services.map((service, index) => (
          <div
            key={service.id}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: index % 2 !== 0 ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              minHeight: '500px',
              marginBottom: '10%',
              borderTop: '1px solid #666669',
              boxSizing: 'border-box',
              paddingTop: '3%',
              opacity: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '40%',
              }}
            >
              <h2
                className="font-classico"
                style={{ fontSize: '1.1vw', textAlign: 'left', color: 'black', fontWeight: 400 }}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              style={{
                display: 'block',
                height: 'auto',
                maxWidth: '40%',
                transition: '1.0s ease',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
