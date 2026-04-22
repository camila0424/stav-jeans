const SIZES = [
  { talla: 'S',  es: '36-38', cintura: '68-72', cadera: '90-94' },
  { talla: 'M',  es: '38-40', cintura: '72-76', cadera: '94-98' },
  { talla: 'L',  es: '40-42', cintura: '76-80', cadera: '98-102' },
  { talla: 'XL', es: '42-44', cintura: '80-84', cadera: '102-106' },
]

function SizeGuide() {
  return (
    <section className="bg-[#1A2E4A] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-light text-white mb-3">Guía de tallas</h2>
        <div className="w-12 h-px bg-[#D4A843] mb-3" />
        <p className="text-white text-sm mb-10">Mídete la cintura y la cadera para encontrar tu talla perfecta.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#A0B4C8]/10">
                {['Talla','Talla ES','Cintura (cm)','Cadera (cm)'].map(h => (
                  <th key={h} className="text-left pb-3 text-white text-xs tracking-widest uppercase font-normal pr-8">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map(row => (
                <tr key={row.talla} className="border-b border-[#A0B4C8]/05 hover:bg-[#A0B4C8]/05">
                  <td className="py-4 font-bold text-[#D4A843] pr-8">{row.talla}</td>
                  <td className="py-4 text-white pr-8">{row.es}</td>
                  <td className="py-4 text-white pr-8">{row.cintura}</td>
                  <td className="py-4 text-white">{row.cadera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default SizeGuide
