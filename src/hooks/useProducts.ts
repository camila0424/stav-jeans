import { useState, useEffect } from 'react'
import { woocommerceService } from '../services/woocommerce'
import type { Product } from '../types'

function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    woocommerceService.getProducts(category)
      .then(setProducts)
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setLoading(false))
  }, [category])

  return { products, loading, error }
}

export default useProducts
