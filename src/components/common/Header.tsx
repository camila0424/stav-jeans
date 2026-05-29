import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';

const navLinks = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/tienda', label: 'Tienda' },
  { to: '/nosotras', label: 'Nosotras' },
  { to: '/contacto', label: 'Contacto' },
];

function Header() {
  const { itemCount } = useCartContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-blue font-medium'
      : 'text-gray-700 hover:text-navy transition-colors';

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-60 h-8 flex items-center justify-center bg-navy text-yellow text-xs font-medium tracking-wide whitespace-nowrap overflow-hidden px-4">
        🚚 Envíos a toda España · Pedir por WhatsApp · Jeans colombianos premium
      </div>
      <header className="sticky top-8 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading text-2xl text-navy font-semibold tracking-wider"
        >
          STAV JEANS
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/carrito" className="relative p-2">
            <svg
              className="w-6 h-6 text-navy"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow text-navy text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 text-navy"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4 text-sm">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
    </>
  );
}

export default Header;
