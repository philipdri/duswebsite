export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: '#171717' }}
      className="text-white py-16 px-8 mt-0"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-classico tracking-widest text-sm mb-8"
          style={{ color: '#858589', letterSpacing: '0.2em' }}
        >
          KONTAKT OSS
        </h2>
        <a
          href="mailto:post@dusarkitekter.no"
          className="font-classico text-white text-lg hover:opacity-70 transition-opacity block mb-8"
          style={{ fontWeight: 300 }}
        >
          post@dusarkitekter.no
        </a>
        <div className="flex gap-6 mt-4">
          <a
            href="https://www.instagram.com/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-70 transition-opacity"
            aria-label="Instagram"
          >
            {/* @ts-expect-error ion-icon is a custom web component */}
            <ion-icon name="logo-instagram" style={{ fontSize: '24px' }}></ion-icon>
          </a>
          <a
            href="https://www.linkedin.com/company/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-70 transition-opacity"
            aria-label="LinkedIn"
          >
            {/* @ts-expect-error ion-icon is a custom web component */}
            <ion-icon name="logo-linkedin" style={{ fontSize: '24px' }}></ion-icon>
          </a>
        </div>
      </div>
    </footer>
  );
}
