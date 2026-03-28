export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: '#ede9e3', borderTop: '1px solid #d4cfc8' }}
      className="py-16 px-8 mt-0"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-classico tracking-widest text-xs mb-8"
          style={{ color: '#858589', letterSpacing: '0.25em', fontWeight: 400 }}
        >
          KONTAKT OSS
        </h2>
        <a
          href="mailto:post@dusarkitekter.no"
          className="font-classico text-lg hover:opacity-60 transition-opacity block mb-8"
          style={{ fontWeight: 300, color: '#1a1a1a' }}
        >
          post@dusarkitekter.no
        </a>
        <div className="flex gap-6 mt-4">
          <a
            href="https://www.instagram.com/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity"
            style={{ color: '#1a1a1a' }}
            aria-label="Instagram"
          >
            {/* @ts-expect-error ion-icon is a custom web component */}
            <ion-icon name="logo-instagram" style={{ fontSize: '22px' }}></ion-icon>
          </a>
          <a
            href="https://www.linkedin.com/company/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity"
            style={{ color: '#1a1a1a' }}
            aria-label="LinkedIn"
          >
            {/* @ts-expect-error ion-icon is a custom web component */}
            <ion-icon name="logo-linkedin" style={{ fontSize: '22px' }}></ion-icon>
          </a>
        </div>
        <p
          className="font-classico text-xs tracking-widest mt-12"
          style={{ color: '#aaa9a3', letterSpacing: '0.15em', fontWeight: 300 }}
        >
          © {new Date().getFullYear()} DUS ARKITEKTER
        </p>
      </div>
    </footer>
  );
}
