import { STRIP_ITEMS } from '../../data/siteConfig'

function InfoStrip() {
  return (
    <div className="bg-[#D4A843] flex">
      {STRIP_ITEMS.map((item, i) => (
        <div key={i} className={`flex-1 text-center py-3 text-[11px] text-[#0E1E30] tracking-widest uppercase
          ${i < STRIP_ITEMS.length - 1 ? 'border-r border-[#0E1E30]/15' : ''}`}>
          {item}
        </div>
      ))}
    </div>
  )
}

export default InfoStrip
