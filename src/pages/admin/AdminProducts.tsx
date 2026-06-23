import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, adminDeleteProduct } from '../../services/api';
import type { Product } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function StockDropdown({ product, align = 'left' }: { product: Product; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, anchor: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const variants = product.variants ?? [];

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    function onScroll() { setOpen(false); }
    document.addEventListener('mousedown', onOutside);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  function toggle() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      anchor: align === 'right' ? window.innerWidth - rect.right : rect.left,
    });
    setOpen(prev => !prev);
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggle}
        className="flex items-center gap-1.5 font-medium text-navy hover:text-navy/70 transition-colors touch-manipulation min-h-11"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="tabular-nums">{product.stock}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          style={{
            position: 'fixed',
            top: pos.top,
            zIndex: 9999,
            ...(align === 'right' ? { right: pos.anchor } : { left: pos.anchor }),
          }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg w-max max-w-[calc(100vw-1.5rem)] py-2"
        >
          {variants.length === 0 ? (
            <p className="px-4 py-2.5 text-sm font-body text-gray-400">Sin variantes</p>
          ) : (
            variants.map((v, i) => (
              <div key={v.id ?? i} role="option" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50">
                <span
                  className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                  style={{ backgroundColor: v.colorHex }}
                />
                <span className="text-sm font-body text-gray-700 leading-snug whitespace-nowrap">
                  Talla {v.size} · {v.color} ·{' '}
                  <span className="font-medium text-navy">{v.stock} uds</span>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

function NoImagePlaceholder() {
  return (
    <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then(data => setProducts(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await adminDeleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar producto');
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-navy">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-navy text-white text-sm font-body px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Añadir producto</span>
          <span className="sm:hidden">Añadir</span>
        </Link>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm font-body text-sm border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-navy transition-colors"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <p className="text-red-500 font-body text-sm py-4">{error}</p>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm py-16 text-center font-body text-gray-400">
              <p className="mb-4">
                {search ? 'Sin resultados para esa búsqueda.' : 'No hay productos. Añade el primero.'}
              </p>
              {!search && (
                <Link
                  to="/admin/productos/nuevo"
                  className="inline-block bg-navy text-white text-sm px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-colors"
                >
                  Añadir producto
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* ── Tabla — visible en md+ ──────────────────────────────── */}
              <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm font-body">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Imagen</th>
                      <th className="px-6 py-3 text-left">Nombre</th>
                      <th className="px-6 py-3 text-left">Precio</th>
                      <th className="px-6 py-3 text-left">Categoría</th>
                      <th className="px-6 py-3 text-left">Stock</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                      <th className="px-6 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-15 h-15 object-cover rounded-lg"
                            />
                          ) : (
                            <NoImagePlaceholder />
                          )}
                        </td>

                        <td className="px-6 py-4 font-medium text-navy">
                          {product.name}
                        </td>

                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {product.category.name}
                        </td>

                        {/* Stock con desplegable de variantes */}
                        <td className="px-6 py-4">
                          <StockDropdown product={product} align="left" />
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {product.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/productos/${product.id}`}
                              className="text-navy text-xs font-medium hover:underline"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 text-xs font-medium hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Tarjetas — visible en móvil/tablet (<md) ───────────── */}
              <div className="md:hidden space-y-3">
                {filtered.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-15 h-15 object-cover rounded-lg shrink-0"
                        />
                      ) : (
                        <NoImagePlaceholder />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy font-body text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 font-body mt-0.5">{product.category.name}</p>
                        <p className="text-sm font-medium text-gray-700 font-body mt-1">
                          {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium font-body ${
                            product.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-body uppercase tracking-wide">Stock total</span>
                      <StockDropdown product={product} align="right" />
                    </div>

                    {/* Acciones */}
                    <div className="mt-2.5 flex items-center gap-4">
                      <Link
                        to={`/admin/productos/${product.id}`}
                        className="text-navy text-sm font-medium hover:underline font-body"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 text-sm font-medium hover:underline font-body"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminProducts;
