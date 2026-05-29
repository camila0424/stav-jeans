# Stav Jeans — Frontend

Tienda online de jeans femeninos. Catálogo con filtros, carrito persistente y checkout por WhatsApp.

---

## Stack

| Herramienta | Versión |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 (plugin `@tailwindcss/vite`) |
| React Router | 7 |

---

## Arrancar en local

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

Para compilar y previsualizar el build de producción:

```bash
npm run build
npm run preview
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API REST (ej. `http://localhost:3000/api`) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary para imágenes |
| `VITE_STRIPE_PUBLIC_KEY` | Clave pública de Stripe (pagos online) |

---

## Estructura de carpetas

```
src/
├── main.tsx                    # Punto de entrada, monta CartProvider
├── App.tsx                     # Router con todas las rutas
├── index.css                   # Tokens de diseño (@theme) + reset
├── types/
│   └── index.ts                # Product, Category, CartItem, Order, User…
├── services/
│   └── api.ts                  # Helpers fetch, base URL desde VITE_API_URL
├── context/
│   └── CartContext.tsx         # CartProvider + useCartContext
├── hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   └── useProducts.ts
├── components/
│   ├── common/                 # Button, ProductCard, LoadingSpinner, Header, Footer
│   └── layout/
│       └── Layout.tsx          # Wrapper con Outlet (Header + Footer)
├── pages/
│   ├── HomePage.tsx
│   ├── ShopPage.tsx            # Catálogo con filtros y ordenamiento
│   ├── ProductPage.tsx         # Detalle de producto por slug
│   ├── CartPage.tsx            # Carrito + resumen + checkout por WhatsApp
│   ├── CheckoutPage.tsx        # Formulario de pedido
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── NotFoundPage.tsx
└── sections/
    └── home/                   # HeroSection, ProductsSection, ParallaxSection…
```

---

## Rutas

| Ruta | Página |
|---|---|
| `/` | HomePage |
| `/tienda` | ShopPage |
| `/tienda/:slug` | ProductPage |
| `/carrito` | CartPage |
| `/checkout` | CheckoutPage |
| `/login` | LoginPage |
| `/registro` | RegisterPage |
| `*` | NotFoundPage |

---

## Deploy en Vercel

1. Importa el repositorio desde el dashboard de Vercel.
2. El framework se detecta automáticamente como **Vite**.
3. Agrega las variables de entorno en **Settings → Environment Variables**:
   - `VITE_API_URL` → URL del backend en producción
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_STRIPE_PUBLIC_KEY`
4. Dado que la app usa React Router con rutas del lado del cliente, crea un archivo `public/vercel.json` con el siguiente rewrite para evitar 404 al recargar:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

5. Haz push a `main` — Vercel desplegará automáticamente.
