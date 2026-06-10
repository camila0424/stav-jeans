import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    label: 'Oferta del mes',
    to: '/oferta',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&q=80',
  },
  {
    label: 'Colección de temporada',
    to: '/coleccion',
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
  },
  {
    label: 'Catálogo',
    to: '/tienda',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80',
  },
] as const;

function CategoriesSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="font-heading text-4xl text-center text-navy mb-10">
        Categorías destacadas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map(({ label, to, image }) => (
          <Link
            key={to}
            to={to}
            className="card group relative h-125 overflow-hidden flex items-end"
          >
            <img
              src={image}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-navy/25 group-hover:bg-navy/45 transition-colors duration-300" />
            <div className="relative z-10 w-full p-6 bg-linear-to-t from-black/70 to-transparent">
              <h3 className="font-heading text-3xl text-white">{label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
