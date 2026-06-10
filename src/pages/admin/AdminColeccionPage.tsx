import { useState, useRef } from 'react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Prenda {
  id: number;
  name: string;
  image: string;
  price: string;
  sizes: string[];
}

interface ColeccionState {
  name: string;
  startDate: string;
  endDate: string;
  prendas: Prenda[];
}

const INITIAL: ColeccionState = {
  name: 'Verano Mediterráneo 2025',
  startDate: '2025-05-01',
  endDate: '2025-08-31',
  prendas: [
    { id: 1, name: 'Jean Wide Mediterráneo', image: '', price: '95', sizes: ['XS', 'S', 'M', 'L'] },
    { id: 2, name: 'Mom Fit Verano', image: '', price: '89', sizes: ['S', 'M', 'L', 'XL'] },
  ],
};

let _nextPrendaId = 100;

const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy';
const labelCls = 'block text-sm font-medium text-gray-700 font-body mb-1.5';
const fileInputCls = 'block w-full text-sm text-gray-500 font-body file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-medium file:bg-navy file:text-white file:cursor-pointer hover:file:bg-blue';

function AdminColeccionPage() {
  const [data, setData] = useState<ColeccionState>(INITIAL);
  const [draft, setDraft] = useState({ name: '', price: '', sizes: [] as string[], image: '' });
  const imgRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const draftImgRef = useRef<HTMLInputElement>(null);

  function handlePrendaImage(id: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setData(prev => ({ ...prev, prendas: prev.prendas.map(p => p.id === id ? { ...p, image: url } : p) }));
  }

  function handleDraftImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDraft(prev => ({ ...prev, image: URL.createObjectURL(file) }));
  }

  function toggleDraftSize(s: string) {
    setDraft(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s],
    }));
  }

  function addPrenda() {
    if (!draft.name.trim() || !draft.price) return;
    const id = _nextPrendaId++;
    setData(prev => ({
      ...prev,
      prendas: [...prev.prendas, { id, name: draft.name.trim(), image: draft.image, price: draft.price, sizes: draft.sizes }],
    }));
    setDraft({ name: '', price: '', sizes: [], image: '' });
    if (draftImgRef.current) draftImgRef.current.value = '';
  }

  function removePrenda(id: number) {
    setData(prev => ({ ...prev, prendas: prev.prendas.filter(p => p.id !== id) }));
  }

  function movePrenda(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= data.prendas.length) return;
    setData(prev => {
      const arr = [...prev.prendas];
      [arr[index], arr[to]] = [arr[to], arr[index]];
      return { ...prev, prendas: arr };
    });
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-heading text-navy mb-6">Editar Colección de Temporada</h1>

      <div className="flex flex-col gap-6">
        {/* Información de la colección */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Información de la colección
          </h2>

          <div>
            <label className={labelCls}>Nombre de la colección</label>
            <input type="text" value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Fecha inicio</label>
              <input type="date" value={data.startDate} onChange={e => setData(p => ({ ...p, startDate: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Fecha fin</label>
              <input type="date" value={data.endDate} onChange={e => setData(p => ({ ...p, endDate: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </section>

        {/* Prendas */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Prendas de la colección
          </h2>

          {data.prendas.map((p, idx) => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {p.image ? (
                <button type="button" onClick={() => imgRefs.current[p.id]?.click()} className="shrink-0">
                  <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded-lg" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => imgRefs.current[p.id]?.click()}
                  className="w-12 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-navy hover:text-navy transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
              <input
                ref={el => { imgRefs.current[p.id] = el; }}
                type="file"
                accept="image/*"
                onChange={e => handlePrendaImage(p.id, e)}
                className="hidden"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy font-body truncate">{p.name}</p>
                <p className="text-xs text-gray-500 font-body">{p.price}€</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.sizes.map(s => (
                    <span key={s} className="text-xs border border-gray-200 text-navy px-1.5 py-0.5 font-body rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => movePrenda(idx, -1)}
                  disabled={idx === 0}
                  className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-navy hover:bg-gray-200 disabled:opacity-30 transition-colors text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => movePrenda(idx, 1)}
                  disabled={idx === data.prendas.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-navy hover:bg-gray-200 disabled:opacity-30 transition-colors text-xs"
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                onClick={() => removePrenda(p.id)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Formulario añadir prenda */}
          <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col gap-4">
            <p className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
              Añadir prenda
            </p>

            <div>
              <label className={labelCls}>Nombre</label>
              <input
                type="text"
                value={draft.name}
                onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                placeholder="Jean Mediterráneo"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Precio (€)</label>
              <input
                type="number"
                min="0"
                value={draft.price}
                onChange={e => setDraft(p => ({ ...p, price: e.target.value }))}
                placeholder="89"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Foto</label>
              <input ref={draftImgRef} type="file" accept="image/*" onChange={handleDraftImageFile} className={fileInputCls} />
              {draft.image && (
                <img src={draft.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className={labelCls}>Tallas disponibles</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleDraftSize(s)}
                    className={`px-3 py-1.5 text-sm font-body border rounded-lg transition-colors ${
                      draft.sizes.includes(s)
                        ? 'bg-navy text-white border-navy'
                        : 'border-gray-200 text-navy hover:border-navy'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={addPrenda}
              className="self-start flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors"
            >
              <span className="text-lg leading-none">＋</span>
              Añadir prenda
            </button>
          </div>
        </section>

        <div>
          <button
            type="button"
            onClick={() => alert('Cambios guardados (mock)')}
            className="px-6 py-2.5 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminColeccionPage;
