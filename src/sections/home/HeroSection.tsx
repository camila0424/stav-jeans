// Sección hero — editorial de moda, full-screen inmersivo
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function HeroSection() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="h-screen overflow-hidden relative">

      {/* CAPA 1 — Imagen de fondo / placeholder gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1A2E4A] via-[#0E1E30] to-[#2E4A6A]">
        {/* Cuando haya foto real: descomentar y eliminar el gradient del padre
        <img src="..." alt="Stav Jeans" className="w-full h-full object-cover object-top" /> */}
      </div>

      {/* CAPA 2 — Overlay cinematográfico */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          animationDelay: '0.1s',
          background: 'linear-gradient(to right, rgba(14,30,48,0.85) 0%, rgba(14,30,48,0.5) 50%, rgba(14,30,48,0.15) 100%)',
        }}
      />

      {/* CAPA 3 — Textura de profundidad */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)' }}
      />

      {/* CAPA 4 — Contenido */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between px-10 lg:px-24">

        {/* PARTE SUPERIOR — etiqueta editorial */}
        <div className={`flex justify-between items-center pt-20 transition-all duration-700 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}
          style={{ animationDelay: '0.1s' }}>
          <span className="text-[10px] tracking-[0.35em] text-[#D4A843]/80 uppercase">
            Nueva colección · Primavera 2026
          </span>
          <span className="hidden md:block text-[10px] tracking-[0.2em] text-white/25 uppercase">
            stavjeans.com
          </span>
        </div>

        {/* PARTE CENTRAL — título + subtítulo + botones */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Título editorial en tres líneas */}
          <div className="leading-none">
            <p
              className={`text-[80px] lg:text-[130px] font-black leading-[0.9] text-white tracking-tight transition-all duration-700 ${loaded ? 'animate-fade-left' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}>
              TU
            </p>
            <p
              className={`text-[80px] lg:text-[130px] font-black leading-[0.9] text-transparent tracking-tight transition-all duration-700 ${loaded ? 'animate-fade-left' : 'opacity-0'}`}
              style={{ animationDelay: '0.35s', WebkitTextStroke: '1px rgba(255,255,255,0.35)' }}>
              SEGUNDA
            </p>
            <p
              className={`text-[80px] lg:text-[130px] font-black leading-[0.9] text-[#D4A843] tracking-tight transition-all duration-700 ${loaded ? 'animate-fade-left' : 'opacity-0'}`}
              style={{ animationDelay: '0.5s' }}>
              PIEL.
            </p>
          </div>

          {/* Línea dorada + subtítulo */}
          <div
            className={`mt-8 transition-all duration-700 ${loaded ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.6s' }}>
            <div
              className={`h-px bg-[#D4A843] mb-6 transition-all duration-700 ${loaded ? 'w-12' : 'w-0'}`}
              style={{ transitionDelay: '0.6s' }}
            />
            <p className="text-base lg:text-lg text-white/70 font-light max-w-xs leading-relaxed">
              Vaqueros colombianos para mujeres reales.
            </p>
          </div>

          {/* Botones */}
          <div
            className={`flex items-center gap-6 mt-8 transition-all duration-700 ${loaded ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.7s' }}>
            <Link
              to="/coleccion"
              className="bg-[#D4A843] text-[#0E1E30] font-semibold px-10 py-4 text-xs tracking-widest uppercase hover:bg-white transition-all duration-300">
              Ver colección
            </Link>
            <Link
              to="/nosotros"
              className="group text-white/50 hover:text-white text-xs tracking-widest uppercase flex items-center gap-2 transition-colors duration-300">
              Nuestra historia
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* PARTE INFERIOR — stats + scroll indicator */}
        <div className="flex items-end justify-between pb-8">

          {/* Stats */}
          <div className="flex gap-10">
            {[
              { num: '4.7★', label: 'Google' },
              { num: '1.6K', label: 'Seguidores' },
              { num: '5 años', label: 'En Vitoria' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${loaded ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                <p className="text-2xl font-bold text-[#D4A843]">{stat.num}</p>
                <p className="text-[9px] tracking-[0.2em] text-white/40 uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className={`flex flex-col items-center gap-2 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '1s' }}>
            <span className="text-[9px] tracking-widest text-white/30 uppercase">Scroll</span>
            <div className="h-12 w-px bg-white/20 animate-scroll-line" />
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
