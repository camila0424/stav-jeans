export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_main: boolean
  display_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string
  color: string
  color_hex: string
  stock: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  subscribed_to_newsletter: boolean
  created_at: string
}

export interface Order {
  id: string
  customer_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: string
  payment_status: 'unpaid' | 'paid' | 'refunded'
  stripe_payment_id: string
  subtotal: number
  shipping: number
  total: number
  notes: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  unit_price: number
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  image_url: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface JwtPayload {
  adminId: string
  email: string
}
