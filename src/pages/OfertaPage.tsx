const WA = '34663577485';

interface OfertaProduct {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  offerPrice: number;
  sizes: string[];
}

const PROMO = {
  title: 'Gran Oferta de Temporada',
  description: 'Los mejores jeans colombianos a precios increíbles. Aprovecha antes de que se agoten.',
  validUntil: '30 de junio de 2025',
  heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80',
};

const PRODUCTS: OfertaProduct[] = [
  { id: 1, name: 'Jean Skinny Classic', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', originalPrice: 89, offerPrice: 59, sizes: ['36', '38', '40'] },
  { id: 2, name: 'Mom Fit Vintage', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80', originalPrice: 95, offerPrice: 65, sizes: ['38', '40', '42'] },
  { id: 3, name: 'Wide Leg Premium', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', originalPrice: 110, offerPrice: 79, sizes: ['36', '38', '40', '42'] },
  { id: 4, name: 'Straight Leg Navy', image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80', originalPrice: 85, offerPrice: 55, sizes: ['34', '36', '38'] },
  { id: 5, name: 'Bota Recta Casual', image: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=600&q=80', originalPrice: 92, offerPrice: 69, sizes: ['38', '40', '44'] },
  { id: 6, name: 'Skinny Push Up', image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=600&q=80', originalPrice: 98, offerPrice: 72, sizes: ['36', '38', '40', '42'] },
];

function fmt(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function WaButton({ name }: { name: string }) {
  const msg = encodeURIComponent(`Hola! Me interesa: ${name} (oferta del mes)`);
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

function OfertaPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-96 md:h-[520px] overflow-hidden">
        <img
          src={PROMO.heroImage}
          alt="Oferta del mes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-4">
          <span className="bg-yellow text-navy text-xs font-body font-semibold px-4 py-1.5 uppercase tracking-widest rounded-full">
            Oferta del mes
          </span>
          <h1 className="font-heading text-5xl md:text-6xl text-white leading-tight max-w-2xl">
            {PROMO.title}
          </h1>
          <p className="font-body text-white/80 text-lg max-w-xl">{PROMO.description}</p>
          <p className="font-body text-yellow text-sm tracking-wide">
            Válido hasta el {PROMO.validUntil}
          </p>
        </div>
      </div>

      {/* Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl text-navy mb-8 text-center">Productos en oferta</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {PRODUCTS.map(p => {
            const pct = Math.round((1 - p.offerPrice / p.originalPrice) * 100);
            return (
              <article key={p.id} className="card flex flex-col bg-white border border-gray-100 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-yellow text-navy text-xs font-body font-semibold px-2.5 py-1 rounded uppercase tracking-wide">
                    -{pct}% OFERTA
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="font-heading text-lg text-navy leading-tight">{p.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-body font-semibold text-navy">{fmt(p.offerPrice)}</span>
                    <span className="font-body text-sm text-gray-400 line-through">{fmt(p.originalPrice)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.sizes.map(s => (
                      <span key={s} className="text-xs border border-gray-200 text-navy px-2 py-0.5 font-body">
                        {s}
                      </span>
                    ))}
                  </div>
                  <WaButton name={p.name} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default OfertaPage;
