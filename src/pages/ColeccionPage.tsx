import { useState } from 'react'
import ProductCard from '../components/common/ProductCard'
import useProducts from '../hooks/useProducts'

const CATEGORIES = ['Todos','Pitillo','Rectos','Novedades','Ofertas']

function ColeccionPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const { products, loading, error } = useProducts(activeCategory || undefined)

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-light text-[#1A2E4A] mb-8">Colección</h1>
      <div className="flex gap-3 mb-10 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(cat === 'Todos' ? '' : cat)}
            className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors
              ${(cat === 'Todos' && !activeCategory) || activeCategory === cat
                ? 'bg-[#1A2E4A] text-white border-[#1A2E4A]'
                : 'bg-transparent text-[#6A7E92] border-[#C8D4E4] hover:border-[#1A2E4A]'}`}>
            {cat}
          </button>
        ))}
      </div>
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-[#D0DDE8] animate-pulse" />)}
        </div>
      )}
      {error && <p className="text-center text-[#6A7E92] py-20">Error al cargar productos</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default ColeccionPage
