import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/api';
import type { Product } from '../types';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

type SortOption = 'newest' | 'price-asc' | 'price-desc';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Controla visibilidad del panel de filtros en móvil
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then(data => setProducts(data as Product[]))
      .catch(err =>
        setError(err instanceof Error ? err.message : 'Error al cargar productos')
      )
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) map.set(p.category.slug, p.category.name);
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category.slug === selectedCategory);
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.some(s => p.sizes.includes(s)));
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) result = result.filter(p => (p.salePrice ?? p.price) >= min);
    if (!isNaN(max)) result = result.filter(p => (p.salePrice ?? p.price) <= max);

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else {
      // keep API order (newest first as returned by the server)
    }

    return result;
  }, [products, selectedCategory, selectedSizes, minPrice, maxPrice, sortBy]);

  function toggleSize(size: string) {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  }

  function clearFilters() {
    setSelectedCategory('');
    setSelectedSizes([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  }

  const hasFilters =
    !!selectedCategory || selectedSizes.length > 0 || !!minPrice || !!maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-heading text-4xl text-navy">Tienda</h1>
        {!loading && !error && (
          <span className="text-sm text-gray-500">{filtered.length} productos</span>
        )}
      </div>

      {/* Toggle de filtros en móvil */}
      <button
        onClick={() => setFiltersOpen(o => !o)}
        aria-expanded={filtersOpen}
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2 border border-navy text-navy text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h18M7 8h10M11 12h4"
          />
        </svg>
        Filtros
        <ChevronIcon open={filtersOpen} />
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <aside
          className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-56 shrink-0`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl text-navy">Filtros</h2>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-blue underline">
                Limpiar
              </button>
            )}
          </div>

          {/* Ordenar por */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">
              Ordenar por
            </h3>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="w-full border border-gray-200 text-sm text-navy px-3 py-2 bg-white focus:outline-none focus:border-navy"
            >
              <option value="newest">Novedades</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>

          {/* Categoría */}
          {categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">
                Categoría
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-sm w-full text-left transition-colors ${
                      !selectedCategory
                        ? 'text-navy font-semibold'
                        : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    Todas
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <button
                      onClick={() =>
                        setSelectedCategory(
                          cat.slug === selectedCategory ? '' : cat.slug
                        )
                      }
                      className={`text-sm w-full text-left transition-colors ${
                        selectedCategory === cat.slug
                          ? 'text-navy font-semibold'
                          : 'text-gray-500 hover:text-navy'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Talla */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">
              Talla
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 text-sm border transition-colors ${
                    selectedSizes.includes(size)
                      ? 'bg-navy text-white border-navy'
                      : 'border-gray-200 text-navy hover:border-navy'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">
              Precio
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={minPrice}
                min={0}
                onChange={e => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 text-sm text-navy px-3 py-2 focus:outline-none focus:border-navy"
              />
              <span className="text-gray-400 shrink-0">—</span>
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                min={0}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 text-sm text-navy px-3 py-2 focus:outline-none focus:border-navy"
              />
            </div>
          </div>
        </aside>

        {/* Grid de productos */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && <p className="text-red-500 py-4">{error}</p>}

          {!loading && !error && (
            <>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="font-heading text-2xl text-navy mb-2">
                    No se encontraron productos
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Intenta ajustar los filtros
                  </p>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
