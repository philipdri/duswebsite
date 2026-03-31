export default function HeroSection() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        minHeight: "100svh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/img/skygge_glød.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      />
    </div>
  );
}
