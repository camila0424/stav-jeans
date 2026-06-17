import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, adminDeleteProduct } from '../../services/api';
import type { Product } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
    <div className="p-8">
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
          Añadir producto
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

      {/* Estados */}
      {loading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <p className="text-red-500 font-body text-sm py-4">{error}</p>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filtered.length > 0 ? (
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Imagen</th>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Precio</th>
                  <th className="px-6 py-3 text-left">Categoría</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* Imagen */}
                    <td className="px-6 py-4">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-15 h-15 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4 font-medium text-navy">
                      {product.name}
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4 text-gray-600">
                      {product.category.name}
                    </td>

                    {/* Estado */}
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

                    {/* Acciones */}
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
          ) : (
            <div className="py-16 text-center font-body text-gray-400">
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
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
