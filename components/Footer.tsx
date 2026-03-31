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
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 items-end justify-items-center gap-8">
        <div className="flex w-full items-end justify-center">
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

        <div className="flex flex-col items-center gap-4 text-center">
          <h2
            className="font-classico tracking-widest"
            style={{
              color: "#858589",
              letterSpacing: "0.25em",
              fontWeight: 500,
              fontSize: " 1rem",
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

        <div
          className="flex w-full items-center justify-center gap-20"
          style={{ gap: "10px" }}
        >
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
      </div>
    </footer>
  );
}
