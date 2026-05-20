import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import ColeccionPage from './pages/ColeccionPage'
import ProductoPage from './pages/ProductoPage'
import NosotrosPage from './pages/NosotrosPage'
import ContactoPage from './pages/ContactoPage'
import CarritoPage from './pages/CarritoPage'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"              element={<HomePage />} />
            <Route path="/coleccion"     element={<ColeccionPage />} />
            <Route path="/novedades"     element={<ColeccionPage />} />
            <Route path="/producto/:slug" element={<ProductoPage />} />
            <Route path="/nosotros"      element={<NosotrosPage />} />
            <Route path="/contacto"      element={<ContactoPage />} />
            <Route path="/carrito"       element={<CarritoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
