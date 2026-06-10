import { useState, useEffect } from 'react';

const WA = '34663577485';
const COLECCION_NAME = 'Verano Mediterráneo 2025';

interface Prenda {
  id: number;
  name: string;
  image: string;
  price: number;
  sizes: string[];
}

const SLIDES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
];

const PRENDAS: Prenda[] = [
  { id: 1, name: 'Jean Wide Mediterráneo', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', price: 95, sizes: ['XS', 'S', 'M', 'L'] },
  { id: 2, name: 'Mom Fit Verano', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80', price: 89, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 3, name: 'Straight Lino Azul', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', price: 105, sizes: ['XS', 'S', 'M'] },
  { id: 4, name: 'Bermuda Denim', image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80', price: 75, sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 5, name: 'Culotte Azul Marino', image: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=600&q=80', price: 88, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 6, name: 'Maxi Flare Premium', image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=600&q=80', price: 112, sizes: ['S', 'M', 'L'] },
];

function fmt(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function WaButton({ name }: { name: string }) {
  const msg = encodeURIComponent(`Hola! Me interesa: ${name} (${COLECCION_NAME})`);
  return (
    <a
      href={`https://wa.me/${WA}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-body font-medium py-2.5 rounded-lg hover:bg-[#1ebe5a] transition-colors"
    >
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.172.198-.296.298-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
      </svg>
      Consultar por WhatsApp
    </a>
  );
}

function ColeccionPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* Carousel — transform percentage relative to track own width */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${(current / SLIDES.length) * 100}%)` }}
        >
          {SLIDES.map((src, i) => (
            <div key={i} className="relative min-w-full shrink-0 h-[60vh] md:h-[680px]">
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-navy/45" />
              <div className="absolute inset-0 flex items-end p-10 md:p-16">
                <div>
                  <p className="font-body text-white/60 text-sm uppercase tracking-widest mb-2">Colección</p>
                  <h1 className="font-heading text-5xl md:text-7xl text-white leading-tight">
                    {COLECCION_NAME}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrent(c => (c + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors"
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Prendas */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl text-navy mb-8 text-center">
          Prendas de la colección
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {PRENDAS.map(p => (
            <article key={p.id} className="card flex flex-col bg-white border border-gray-100 overflow-hidden group">
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <h3 className="font-heading text-lg text-navy leading-tight">{p.name}</h3>
                <span className="font-body font-semibold text-navy">{fmt(p.price)}</span>
                <div className="flex flex-wrap gap-1">
                  {p.sizes.map(s => (
                    <span key={s} className="text-xs border border-navy/30 text-navy bg-navy/5 px-2.5 py-0.5 font-body rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <WaButton name={p.name} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ColeccionPage;
