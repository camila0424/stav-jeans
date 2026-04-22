import { useCart } from '../context/CartContext'
import { SITE } from '../data/siteConfig'

function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-2xl font-light text-[#1A2E4A] mb-4">Tu carrito está vacío</p>
        <a href="/coleccion" className="text-xs text-[#2E4A6A] tracking-widest uppercase underline">Ver colección</a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-light text-[#1A2E4A] mb-10">Tu carrito</h1>
      <div className="space-y-4 mb-10">
        {items.map(item => (
          <div key={`${item.product.id}-${item.selectedSize}`}
            className="flex items-center gap-6 bg-white p-4 border border-[#D0DDE8]">
            <img src={item.product.images[0]?.src} alt={item.product.name} className="w-20 h-24 object-cover" />
            <div className="flex-1">
              <p className="font-medium text-[#1A2E4A]">{item.product.name}</p>
              <p className="text-xs text-[#6A7E92]">Talla: {item.selectedSize}</p>
              <p className="font-semibold text-[#1A2E4A] mt-1">{item.product.price} €</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                className="w-8 h-8 border border-[#C8D4E4] text-[#2A3E54] hover:border-[#1A2E4A]">−</button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 border border-[#C8D4E4] text-[#2A3E54] hover:border-[#1A2E4A]">+</button>
            </div>
            <button onClick={() => removeItem(item.product.id)} className="text-[#A0B4C8] hover:text-[#1A2E4A] text-xs">✕</button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-light text-[#1A2E4A]">Total</span>
        <span className="text-2xl font-semibold text-[#1A2E4A]">{total.toFixed(2)} €</span>
      </div>
      <a href={`${SITE.whatsapp}?text=Hola, quiero pedir: ${items.map(i => `${i.product.name} talla ${i.selectedSize} x${i.quantity}`).join(', ')}`}
        target="_blank" rel="noopener noreferrer"
        className="w-full bg-[#1A2E4A] text-white py-4 text-xs tracking-widest uppercase text-center block hover:bg-[#2E4A6A] transition-colors">
        Finalizar por WhatsApp
      </a>
    </div>
  )
}

export default CarritoPage
