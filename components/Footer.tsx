export default function Footer() {
  return (
    <footer
      id="kontakt"
      className="mt-0 border-t border-[#d4cfc8] bg-[#ede9e3] px-6 py-8 sm:px-10 md:px-14"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center justify-items-center gap-6 sm:grid-cols-3 sm:items-end sm:gap-8">
        {/* Kontakt Oss - center column on desktop, first on mobile */}
        <div className="order-1 flex flex-col items-center gap-4 text-center sm:order-2">
          <h2 className="font-classico text-base font-medium tracking-[0.25em] text-[#858589]">
            KONTAKT OSS
          </h2>
          <a
            href="mailto:post@dusarkitekter.no"
            className="block rounded-[4px] border border-[#1a1a1a] px-2 py-1 font-classico text-lg font-light text-[#1a1a1a] no-underline transition-opacity hover:opacity-60"
          >
            post@dusarkitekter.no
          </a>
        </div>

        {/* Social icons - right column on desktop, middle on mobile */}
        <div className="order-2 flex w-full items-center justify-center gap-2.5 sm:order-3">
          <a
            href="https://www.instagram.com/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a1a1a] transition-opacity hover:opacity-60"
            aria-label="Instagram"
          >
            <ion-icon name="logo-instagram" className="text-[30px]"></ion-icon>
          </a>
          <a
            href="https://www.linkedin.com/company/dusarkitekter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a1a1a] transition-opacity hover:opacity-60"
            aria-label="LinkedIn"
          >
            <ion-icon name="logo-linkedin" className="text-[30px]"></ion-icon>
          </a>
        </div>

        {/* Copyright - left column on desktop, last on mobile */}
        <div className="order-3 flex w-full items-end justify-center sm:order-1">
          <p className="font-classico text-xs font-light tracking-widest text-[#aaa9a3]">
            {"\u00a9"} {new Date().getFullYear()} DUS ARKITEKTER AS
          </p>
        </div>
      </div>
    </footer>
  );
}
