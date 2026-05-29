function ParallaxSection() {
  return (
    <section
      className="relative h-80 flex items-center justify-center bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative z-10 text-center text-white px-4">
        <h2 className="font-heading text-4xl md:text-5xl mb-4">Hecho para durar</h2>
        <p className="text-gray-200 text-lg">Calidad que se siente en cada detalle</p>
      </div>
    </section>
  );
}

export default ParallaxSection;
