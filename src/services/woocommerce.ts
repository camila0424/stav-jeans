const WC_BASE   = import.meta.env.VITE_WC_URL
const WC_KEY    = import.meta.env.VITE_WC_KEY
const WC_SECRET = import.meta.env.VITE_WC_SECRET
const auth = `consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`

async function getProducts(category?: string) {
  const cat = category ? `&category=${category}` : ''
  const res = await fetch(`${WC_BASE}/products?per_page=100${cat}&${auth}`)
  if (!res.ok) throw new Error('Error al cargar productos')
  return res.json()
}
async function getProductBySlug(slug: string) {
  const res = await fetch(`${WC_BASE}/products?slug=${slug}&${auth}`)
  if (!res.ok) throw new Error('Error al cargar el producto')
  const data = await res.json()
  return data[0]
}
async function getProductReviews(productId: number) {
  const res = await fetch(`${WC_BASE}/products/reviews?product=${productId}&${auth}`)
  if (!res.ok) throw new Error('Error al cargar reseñas')
  return res.json()
}
async function getCategories() {
  const res = await fetch(`${WC_BASE}/products/categories?${auth}`)
  if (!res.ok) throw new Error('Error al cargar categorías')
  return res.json()
}
export const woocommerceService = { getProducts, getProductBySlug, getProductReviews, getCategories }
