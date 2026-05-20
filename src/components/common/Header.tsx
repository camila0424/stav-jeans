// Header con efecto de blur al hacer scroll
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, Menu, X, MessageCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { NAV_LINKS, SITE } from '../../data/siteConfig'

function Header() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Detecta si hiciste scroll para cambiar la apariencia del header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 animate-slide-down transition-all duration-500 border-b
      ${scrolled
        ? 'bg-[#0E1E30]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(14,30,48,0.4)] border-[#A0B4C8]/10'
        : 'bg-[#0E1E30]/80 border-transparent'
      }`}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/"
          className="font-bold text-white tracking-widest text-sm uppercase hover:text-[#A0B4C8] transition-colors duration-300">
          {SITE.name}
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path}
              className={`nav-link text-xs tracking-widest uppercase transition-colors duration-300
                ${location.pathname === link.path
                  ? 'text-[#D4A843]'
                  : 'text-white hover:text-[#A0B4C8]'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Iconos derecha: Heart → ShoppingBag → MessageCircle → Menu */}
        <div className="flex items-center gap-5">

          {/* Wishlist (sin funcionalidad aún) */}
          <button
            className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            aria-label="Lista de deseos">
            <Heart size={20} strokeWidth={1.5} />
          </button>

          {/* Carrito con badge */}
          <Link to="/carrito"
            className="relative text-white/70 hover:text-white transition-colors duration-300"
            aria-label="Carrito">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4A843] text-[#0E1E30] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {itemCount}
              </span>
            )}
          </Link>

          {/* WhatsApp — solo icono en desktop */}
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer"
            title="WhatsApp"
            className="hidden md:flex text-white/70 hover:text-white transition-colors duration-300"
            aria-label="WhatsApp">
            <MessageCircle size={20} strokeWidth={1.5} />
          </a>

          {/* Hamburguesa — solo en móvil */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú">
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil con animación */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#0E1E30]/98 backdrop-blur-md border-t border-[#A0B4C8]/10 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link, i) => (
            <Link key={link.path} to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm uppercase tracking-widest transition-colors ${location.pathname === link.path ? 'text-[#D4A843]' : 'text-white hover:text-[#A0B4C8]'}`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
