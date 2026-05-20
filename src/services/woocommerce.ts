const API = '/api/products'

async function getProducts(category?: string) {
  const params = new URLSearchParams({ resource: 'products', per_page: '100' })
  if (category) params.set('category', category)
  const res = await fetch(`${API}?${params}`)
  if (!res.ok) throw new Error('Error al cargar productos')
  return res.json()
}

async function getProductBySlug(slug: string) {
  const params = new URLSearchParams({ resource: 'products', slug })
  const res = await fetch(`${API}?${params}`)
  if (!res.ok) throw new Error('Error al cargar el producto')
  const data = await res.json()
  return data[0]
}

async function getProductReviews(productId: number) {
  const params = new URLSearchParams({ resource: 'products/reviews', product: String(productId) })
  const res = await fetch(`${API}?${params}`)
  if (!res.ok) throw new Error('Error al cargar reseñas')
  return res.json()
}

async function getCategories() {
  const params = new URLSearchParams({ resource: 'products/categories' })
  const res = await fetch(`${API}?${params}`)
  if (!res.ok) throw new Error('Error al cargar categorías')
  return res.json()
}

export const woocommerceService = { getProducts, getProductBySlug, getProductReviews, getCategories }
