import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { woocommerceService } from '../services/woocommerce'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'
import { SITE } from '../data/siteConfig'

function ProductoPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()

  useEffect(() => {
    if (!slug) return
    woocommerceService.getProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#6A7E92]">Cargando...</div>
  if (!product) return <div className="min-h-screen flex items-center justify-center text-[#6A7E92]">Producto no encontrado</div>

  const sizes = product.attributes.find(a => a.name.toLowerCase().includes('talla'))?.options ?? []

  function handleAddToCart() {
    if (!selectedSize && sizes.length > 0) return alert('Selecciona una talla')
    addItem(product!, selectedSize)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-14">
      <div>
        <div className="aspect-[3/4] bg-[#EBF1F8]">
          {product.images[activeImage] && (
            <img src={product.images[activeImage].src} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {product.images.map((img, i) => (
            <button key={img.id} onClick={() => setActiveImage(i)}
              className={`w-16 h-20 border-2 transition-colors ${activeImage === i ? 'border-[#1A2E4A]' : 'border-transparent'}`}>
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-medium text-[#1A2E4A] mb-2">{product.name}</h1>
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-2xl font-semibold text-[#1A2E4A]">{product.price} €</span>
          {product.on_sale && <span className="text-[#A0B4C8] line-through text-sm">{product.regular_price} €</span>}
        </div>
        <p className="text-[#6A7E92] text-sm leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: product.short_description }} />
        {sizes.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-[#6A7E92] tracking-widest uppercase mb-3">Selecciona tu talla</p>
            <div className="flex gap-2">
              {sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border text-sm transition-colors
                    ${selectedSize === size ? 'border-[#1A2E4A] bg-[#1A2E4A] text-white' : 'border-[#C8D4E4] text-[#2A3E54] hover:border-[#1A2E4A]'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleAddToCart}
          className="w-full bg-[#1A2E4A] text-white py-4 text-xs tracking-widest uppercase hover:bg-[#2E4A6A] transition-colors mb-4">
          Añadir al carrito
        </button>
        <a href={`${SITE.whatsapp}?text=Hola, me interesa: ${product.name}`}
          target="_blank" rel="noopener noreferrer"
          className="w-full border border-[#C8D4E4] text-[#2A3E54] py-4 text-xs tracking-widest uppercase text-center block hover:border-[#1A2E4A] transition-colors">
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  )
}

export default ProductoPage
