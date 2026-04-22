// Tarjeta de producto con hover cinematográfico
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Product } from '../../types'

interface Props {
  product: Product
  index?: number  // para el delay escalonado
}

function ProductCard({ product, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false)
  const image = product.images[0]?.src
  const image2 = product.images[1]?.src  // segunda foto al hover
  const hasDiscount = product.on_sale && product.regular_price !== product.price

  return (
    <Link to={`/producto/${product.slug}`}
      className="group block card-hover animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* Imagen */}
      <div className="img-hover bg-[#EBF1F8] relative overflow-hidden aspect-3/4">
        {image && (
          <img src={image} alt={product.name}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${hovered && image2 ? 'opacity-0' : 'opacity-100'}`} />
        )}
        {/* Segunda imagen al hover */}
        {image2 && (
          <img src={image2} alt={product.name}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        )}

        {/* Overlay con botón al hacer hover */}
        <div className={`absolute inset-0 bg-[#0E1E30]/40 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="bg-white text-[#1A2E4A] text-[10px] tracking-widest uppercase px-5 py-2.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Ver producto
          </span>
        </div>

        {/* Badges */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#1A2E4A] text-[#A0B4C8] text-[9px] px-2 py-1 tracking-widest uppercase z-10">
            Oferta
          </span>
        )}
        {product.stock_status === 'outofstock' && (
          <div className="absolute inset-0 bg-[#0E1E30]/60 flex items-center justify-center z-10">
            <span className="text-white text-xs tracking-widest uppercase">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3">
        <p className="text-[#1A2E4A] text-sm font-medium group-hover:text-[#2E4A6A] transition-colors">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[#1A2E4A] font-semibold">{product.price} €</span>
          {hasDiscount && (
            <span className="text-[#A0B4C8] text-xs line-through">{product.regular_price} €</span>
          )}
        </div>
        {/* Línea animada bajo el nombre */}
        <div className="h-px bg-[#D4A843] mt-2 w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </Link>
  )
}

export default ProductCard