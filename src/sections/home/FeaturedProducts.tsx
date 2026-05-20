// Productos con animación de entrada al hacer scroll
import { Link } from 'react-router-dom'
import ProductCard from '../../components/common/ProductCard'
import useProducts from '../../hooks/useProducts'
import useScrollAnimation from '../../hooks/useScrollAnimation'

function FeaturedProducts() {
  const { products, loading, error } = useProducts()
  const { ref, visible } = useScrollAnimation()
  const featured = products.slice(0, 4)

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto" ref={ref}>

      {/* Cabecera con animación */}
      <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div>
          <p className="text-[10px] tracking-[0.25em] text-[#A0B4C8] uppercase mb-2">Colección</p>
          <h2 className="text-4xl font-light text-[#1A2E4A]">Más vendidos</h2>
        </div>
        <Link to="/coleccion"
          className="group text-xs text-[#2E4A6A] tracking-widest uppercase flex items-center gap-2 hover:text-[#1A2E4A] transition-colors">
          Ver todos
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Skeletons de carga */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-3/4 bg-[#D0DDE8] animate-pulse rounded-sm" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-[#6A7E92] py-10">No se pudieron cargar los productos</p>
      )}

      {/* Grid de productos — cada uno entra escalonado */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, i) => (
            <div key={product.id}
              className={`transition-all duration-700 ${visible ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedProducts