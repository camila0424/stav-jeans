import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminHero from './pages/admin/AdminHero';
import AdminOfertaPage from './pages/admin/AdminOfertaPage';
import AdminColeccionPage from './pages/admin/AdminColeccionPage';
import AdminCatalogoPage from './pages/admin/AdminCatalogoPage';
import OfertaPage from './pages/OfertaPage';
import ColeccionPage from './pages/ColeccionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="productos/nuevo" element={<AdminProductForm />} />
          <Route path="productos/:id" element={<AdminProductForm />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="oferta" element={<AdminOfertaPage />} />
          <Route path="coleccion" element={<AdminColeccionPage />} />
          <Route path="catalogo" element={<AdminCatalogoPage />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/oferta" element={<OfertaPage />} />
          <Route path="/coleccion" element={<ColeccionPage />} />
          <Route path="/tienda" element={<ShopPage />} />
          <Route path="/tienda/:slug" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
