export default function Footer() {
  return (
    <footer
      id="kontakt"
      style={{
        backgroundColor: "#ede9e3",
        borderTop: "1px solid #d4cfc8",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
      className="mt-0 px-6 sm:px-10 md:px-14"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-3 items-center sm:items-end justify-items-center gap-6 sm:gap-8">
        {/* Kontakt Oss – center column on desktop, first on mobile */}
        <div className="flex flex-col items-center gap-4 text-center order-1 sm:order-2">
          <h2
            className="font-classico tracking-widest"
            style={{
              color: "#858589",
              letterSpacing: "0.25em",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            KONTAKT OSS
          </h2>
          <a
            href="mailto:post@dusarkitekter.no"
            className="block font-classico text-lg transition-opacity hover:opacity-60"
            style={{
              fontWeight: 300,
              color: "#1a1a1a",
              textDecoration: "none",
              border: "1px solid #1a1a1a",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
            }}
          >
            post@dusarkitekter.no
          </a>
        </div>

        {/* Social icons – right column on desktop, middle on mobile */}
        <div className="flex w-full items-center justify-center gap-2.5 order-2 sm:order-3">
          <a
            href="https://www.instagram.com/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            style={{ color: "#1a1a1a" }}
            aria-label="Instagram"
          >
            <ion-icon
              name="logo-instagram"
              style={{ fontSize: "30px" }}
            ></ion-icon>
          </a>
          <a
            href="https://www.linkedin.com/company/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            style={{ color: "#1a1a1a" }}
            aria-label="LinkedIn"
          >
            <ion-icon
              name="logo-linkedin"
              style={{ fontSize: "30px" }}
            ></ion-icon>
          </a>
        </div>

        {/* Copyright – left column on desktop, last on mobile */}
        <div className="flex w-full items-end justify-center order-3 sm:order-1">
          <p
            className="font-classico text-xs tracking-widest"
            style={{
              color: "#aaa9a3",
              fontWeight: 300,
            }}
          >
            {"\u00A9"} {new Date().getFullYear()} DUS ARKITEKTER AS
          </p>
        </div>
      </div>
    </footer>
  );
}
