export interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  images: ProductImage[]
  categories: Category[]
  attributes: ProductAttribute[]
  stock_status: 'instock' | 'outofstock'
  short_description: string
  description: string
}
export interface ProductImage { id: number; src: string; alt: string }
export interface Category { id: number; name: string; slug: string }
export interface ProductAttribute { id: number; name: string; options: string[] }
export interface InstagramPost {
  id: string; media_url: string; permalink: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'; timestamp: string; caption?: string
}
export interface Review {
  id: number; reviewer: string; review: string
  rating: number; date_created: string; reviewer_avatar_urls: { '96': string }
}
export interface CartItem { product: Product; quantity: number; selectedSize: string }
