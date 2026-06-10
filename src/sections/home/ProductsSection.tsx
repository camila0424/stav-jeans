import { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import type { Product } from '../../types';
import { getFeaturedProducts } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(data => setProducts(data.slice(0, 4)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto flex justify-center">
        <LoadingSpinner size="lg" />
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="font-heading text-4xl text-center text-navy mb-10">
        Productos destacados
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductsSection;
