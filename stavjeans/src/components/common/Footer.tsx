import { Link } from 'react-router-dom'
import { SITE } from '../../data/siteConfig'

function Footer() {
  return (
    <footer className="bg-[#0E1E30] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[#D4A843] uppercase mb-3">Stav Jeans</p>
          {['Inicio','Colección','Nosotros','Contacto'].map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`}
              className="block text-white/60 text-xs mb-2 hover:text-white transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[#D4A843] uppercase mb-3">Categorías</p>
          {['Pitillos','Rectos','Novedades','Ofertas'].map(l => (
            <Link key={l} to={`/coleccion`}
              className="block text-white/60 text-xs mb-2 hover:text-white transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[#D4A843] uppercase mb-3">Ayuda</p>
          {['Guía de tallas','Envíos','Devoluciones','FAQ'].map(l => (
            <span key={l} className="block text-white/60 text-xs mb-2">{l}</span>
          ))}
        </div>
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[#D4A843] uppercase mb-3">Tienda física</p>
          <p className="text-white/60 text-xs leading-relaxed">{SITE.location}</p>
          <p className="text-white/60 text-xs mt-2">{SITE.phone}</p>
          <p className="text-white/60 text-xs">{SITE.email}</p>
        </div>
      </div>
      <div className="border-t border-[#A0B4C8]/10 px-6 py-4 max-w-7xl mx-auto flex justify-between">
        <p className="text-white/60 text-xs">© 2026 Stav Jeans · Vitoria-Gasteiz</p>
        <div className="flex gap-4">
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
            className="text-white/60 text-xs hover:text-white transition-colors">Instagram</a>
          <a href={SITE.facebook} target="_blank" rel="noopener noreferrer"
            className="text-white/60 text-xs hover:text-white transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
