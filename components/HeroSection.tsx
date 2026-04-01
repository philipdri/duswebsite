export default function HeroSection() {
  return (
    <div className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      <div
        className="hero-bg absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: "url(/img/skygge_gl\u00f8d.png)" }}
      />
    </div>
  );
}
