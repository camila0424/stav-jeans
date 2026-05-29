import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/productos', label: 'Productos', icon: '👖', end: false },
  { to: '/admin/pedidos', label: 'Pedidos', icon: '📦', end: false },
  { to: '/admin/hero', label: 'Hero', icon: '🖼️', end: false },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 px-5 py-3 text-sm font-body transition-colors border-l-4 ${
    isActive
      ? 'border-yellow bg-white/10 text-white font-semibold'
      : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
  }`;
}

function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('stav_admin');
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 h-screen w-65 bg-navy flex flex-col shrink-0 z-50">
        <div className="px-6 py-6">
          <p className="font-heading text-white text-xl tracking-widest uppercase">STAV JEANS</p>
          <p className="text-yellow text-xs mt-0.5 tracking-wider uppercase font-body">Admin</p>
        </div>

        <hr className="border-white/10" />

        <nav className="flex-1 py-3 flex flex-col">
          {navLinks.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <hr className="border-white/10" />

        <div className="py-3 flex flex-col">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors border-l-4 border-transparent font-body"
          >
            <span className="text-base">🌐</span>
            <span>Ver tienda</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-l-4 border-transparent w-full text-left font-body"
          >
            <span className="text-base">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="ml-65 flex-1 min-h-screen bg-gray-light overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
