import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { getProducts, getFeaturedProducts, getProductsByCategory } from '../services/api';

interface UseProductsOptions {
  featured?: boolean;
  category?: string;
}

function useProducts({ featured, category }: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchFn = featured
      ? getFeaturedProducts
      : category
      ? () => getProductsByCategory(category)
      : getProducts;

    fetchFn()
      .then(data => {
        if (!cancelled) setProducts(data as Product[]);
      })
      .catch(err => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Error al cargar productos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [featured, category]);

  return { products, loading, error };
}

export default useProducts;
