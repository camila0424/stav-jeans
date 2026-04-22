import { createContext, useContext, useState } from 'react'
import type { CartItem, Product } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(product: Product, selectedSize: string) {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id && i.selectedSize === selectedSize)
      if (exists) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1, selectedSize }]
    })
  }

  function removeItem(productId: number) {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  function updateQuantity(productId: number, quantity: number) {
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }

  function clearCart() { setItems([]) }

  const total = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}

export { CartProvider, useCart }
