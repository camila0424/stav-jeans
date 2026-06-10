import type { CartItem, Order, Product, User } from '../types/index';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('stav_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getAdminAuthHeaders(): HeadersInit {
  const stored = localStorage.getItem('stav_admin');
  if (!stored) return {};
  try {
    const { token } = JSON.parse(stored) as { token: string };
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.detail ?? body?.message ?? body?.error ?? JSON.stringify(body) ?? message;
    } catch {
      // body is not JSON, keep default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ── Productos (público) ────────────────────────────────────────────────────

export function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sort?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.minPrice != null) params.set('min_price', String(filters.minPrice));
  if (filters?.maxPrice != null) params.set('max_price', String(filters.maxPrice));
  if (filters?.size) params.set('size', filters.size);
  if (filters?.sort) params.set('sort', filters.sort);
  const qs = params.toString();
  return request<Product[]>(`/products/${qs ? `?${qs}` : ''}`);
}

export function getProductById(id: string): Promise<Product> {
  return request<Product>(`/products/${id}/`);
}

export function getProduct(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}/`);
}

export function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category });
}

export function getFeaturedProducts(): Promise<Product[]> {
  return request<Product[]>('/products/?featured=true');
}

export function getCategories() {
  return request('/categories/');
}

// ── Productos (admin) ──────────────────────────────────────────────────────

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  images: string[];
  variants: Array<{ size: string; color: string; color_hex: string; stock: number }>;
}

export function adminCreateProduct(data: ProductPayload): Promise<Product> {
  return request<Product>('/products/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
  });
}

export function adminUpdateProduct(id: number, data: ProductPayload): Promise<Product> {
  return request<Product>(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
  });
}

export function adminDeleteProduct(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/products/${id}/`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  });
}

export function adminUploadImage(
  base64: string,
  folder = 'stavjeans/products'
): Promise<{ url: string; public_id: string }> {
  return request<{ url: string; public_id: string }>('/admin/upload', {
    method: 'POST',
    body: JSON.stringify({ image: base64, folder }),
    headers: getAdminAuthHeaders(),
  });
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/dh5xe3fva/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Error subiendo imagen a Cloudinary')
  const data = await res.json()
  return data.secure_url
}

// ── Auth ───────────────────────────────────────────────────────────────────

export function loginAdmin(data: {
  email: string;
  password: string;
}): Promise<{ token: string; email: string }> {
  return request<{ token: string; email: string }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ message: string }> {
  const [firstName, ...rest] = data.name.trim().split(' ');
  return request<{ message: string }>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName: rest.join(' '),
      email: data.email,
      password: data.password,
    }),
  });
}

export function getMe(): Promise<User> {
  return request<User>('/auth/me/', { headers: getAuthHeaders() });
}

export function getProfile(): Promise<User> {
  return getMe();
}

// ── Órdenes ────────────────────────────────────────────────────────────────

export function createOrder(data: {
  items: CartItem[];
  promoCode?: string;
}): Promise<Order> {
  return request<Order>('/orders/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: getAuthHeaders(),
  });
}

export function getMyOrders(): Promise<Order[]> {
  return request<Order[]>('/orders/', { headers: getAuthHeaders() });
}

export function getOrderById(id: number): Promise<Order> {
  return request<Order>(`/orders/${id}/`, { headers: getAuthHeaders() });
}

// ── Suscriptores ───────────────────────────────────────────────────────────

export function subscribeEmail(email: string): Promise<{ message: string }> {
  return request<{ message: string }>('/subscribers/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ── Códigos de descuento ───────────────────────────────────────────────────

export function validatePromoCode(code: string) {
  return request(`/promotions/validate/?code=${code}`);
}

// ── Hero ───────────────────────────────────────────────────────────────────

export interface HeroConfig {
  title: string;
  subtitle: string;
  cta_text: string;
  image_url: string;
  position_x: number;
  position_y: number;
}

export function getHeroConfig(): Promise<HeroConfig> {
  return request<HeroConfig>('/hero/');
}

export function updateHeroConfig(data: HeroConfig): Promise<HeroConfig> {
  return request<HeroConfig>('/hero/', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
  });
}

// ── Oferta ─────────────────────────────────────────────────────────────────

export interface OfertaConfig {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  hero_image_url: string;
  products: Array<{
    id: number;
    name: string;
    image: string;
    originalPrice: string;
    offerPrice: string;
    sizes: string[];
  }>;
}

export function getOfertaConfig(): Promise<OfertaConfig> {
  return request<OfertaConfig>('/oferta/');
}

export function updateOfertaConfig(data: OfertaConfig): Promise<OfertaConfig> {
  return request<OfertaConfig>('/oferta/', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
  });
}

// ── Colección ──────────────────────────────────────────────────────────────

export interface ColeccionConfig {
  name: string;
  start_date: string;
  end_date: string;
  prendas: Array<{
    id: number;
    name: string;
    image: string;
    price: string;
    sizes: string[];
  }>;
}

export function getColeccionConfig(): Promise<ColeccionConfig> {
  return request<ColeccionConfig>('/coleccion/');
}

export function updateColeccionConfig(data: ColeccionConfig): Promise<ColeccionConfig> {
  return request<ColeccionConfig>('/coleccion/', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
  });
}

// ── Catálogo ───────────────────────────────────────────────────────────────

export function getCatalogoConfig(): Promise<{ sections: unknown[] }> {
  return request<{ sections: unknown[] }>('/catalogo/');
}

export function updateCatalogoConfig(data: { sections: unknown[] }): Promise<{ sections: unknown[] }> {
  return request<{ sections: unknown[] }>('/catalogo/', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
  });
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  recent_orders: Array<{
    id: number;
    customer_name: string;
    created_at: string;
    total: number;
    status: string;
  }>;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/stats', { headers: getAdminAuthHeaders() });
}

// ── Pedidos (admin) ────────────────────────────────────────────────────────

export interface AdminOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  created_at: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{ id: number; product_name: string; quantity: number; unit_price: number }>;
}

export function getAdminOrders(): Promise<AdminOrder[]> {
  return request<AdminOrder[]>('/orders/', { headers: getAdminAuthHeaders() });
}

export function updateAdminOrderStatus(id: number, status: string): Promise<AdminOrder> {
  return request<AdminOrder>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
  });
}
