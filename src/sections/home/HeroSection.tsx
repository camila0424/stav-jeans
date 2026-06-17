import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getHeroConfig, type HeroConfig } from '../../services/api';

const DEFAULTS: HeroConfig = {
  image_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1600&q=80',
  title: 'Jeans colombianos que abrazan tu cuerpo',
  subtitle: 'Denim de calidad premium diseñado para cada curva',
  cta_text: 'Ver colección',
  position_x: 50,
  position_y: 30,
};

function HeroSection() {
  const [hero, setHero] = useState<HeroConfig | null>(null);

  useEffect(() => {
    getHeroConfig()
      .then(data => setHero({ ...DEFAULTS, ...data }))
      .catch(() => setHero(DEFAULTS));
  }, []);

  if (!hero) {
    return <section className="h-screen bg-gray-200" />;
  }

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden bg-cover"
      style={{
        backgroundImage: `url('${hero.image_url}')`,
        backgroundPosition: `${hero.position_x}% ${hero.position_y}%`,
      }}
    >
      <div className="absolute inset-0 bg-navy/65" />
      <div className="relative z-10 text-center text-white px-4 max-w-2xl">
        <h1 className="font-heading text-5xl md:text-7xl mb-6 leading-tight">
          {hero.title}
        </h1>
        <p className="font-body text-lg md:text-xl mb-8 text-gray-200">
          {hero.subtitle}
        </p>
        <Link to="/tienda">
          <Button variant="secondary" size="lg">
            {hero.cta_text}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
