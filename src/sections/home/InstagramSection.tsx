const images = [
  'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=400&q=80',
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&q=80',
  'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400&q=80',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80',
  'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&q=80',
];

const INSTAGRAM_URL = 'https://www.instagram.com/stavjeans';

function InstagramSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="font-heading text-4xl text-center text-navy mb-2">
        Síguenos en Instagram
      </h2>
      <p className="text-center text-gray-400 mb-8">@stavjeans</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {images.map((src, i) => (
          <a
            key={i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden group"
          >
            <img
              src={src}
              alt={`stavjeans instagram ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 1.924 2.104.493 3.535-.023 5.377.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.875.601 3.717 2.032 5.148 1.431 1.431 3.273 1.947 5.148 2.032C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.875-.085 3.717-.601 5.148-2.032 1.431-1.431 1.947-3.273 2.032-5.148C23.986 15.668 24 15.259 24 12c0-3.259-.014-3.668-.072-4.948-.085-1.875-.601-3.717-2.032-5.148C20.465.673 18.623.157 16.748.072 15.468.014 15.059 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </div>
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-navy text-navy px-8 py-3 font-medium transition-colors hover:bg-navy hover:text-white"
        >
          Ver más en Instagram
        </a>
      </div>
    </section>
  );
}

export default InstagramSection;
