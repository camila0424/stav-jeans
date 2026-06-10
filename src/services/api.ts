import type { CartItem, Order, Product, User } from '../types/index';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('stav_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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
      message = body?.detail ?? body?.message ?? JSON.stringify(body) ?? message;
    } catch {
      // body is not JSON, keep default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ── Productos ──────────────────────────────────────────────────────────────

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

// ── Auth ───────────────────────────────────────────────────────────────────

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
