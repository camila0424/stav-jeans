import { useState, useRef, useEffect } from 'react';
import { getOfertaConfig, updateOfertaConfig, uploadImageToCloudinary } from '../../services/api';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface OfertaProduct {
  id: number;
  name: string;
  image: string;
  originalPrice: string;
  offerPrice: string;
  sizes: string[];
}

interface OfertaState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  heroImage: string;
  products: OfertaProduct[];
}

const EMPTY: OfertaState = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  heroImage: '',
  products: [],
};

let _nextProductId = 1000;

const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy';
const labelCls = 'block text-sm font-medium text-gray-700 font-body mb-1.5';
const fileInputCls = 'block w-full text-sm text-gray-500 font-body file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-medium file:bg-navy file:text-white file:cursor-pointer hover:file:bg-blue disabled:opacity-50';

function AdminOfertaPage() {
  const [data, setData] = useState<OfertaState>(EMPTY);
  const [draft, setDraft] = useState({ name: '', originalPrice: '', offerPrice: '', sizes: [] as string[], image: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [draftUploading, setDraftUploading] = useState(false);
  const [productUploading, setProductUploading] = useState<number | null>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const productImgRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const draftImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getOfertaConfig()
      .then(cfg => {
        setData({
          title: cfg.title,
          description: cfg.description,
          startDate: cfg.start_date,
          endDate: cfg.end_date,
          heroImage: cfg.hero_image_url,
          products: cfg.products ?? [],
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleHeroFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setHeroUploading(true);
      const url = await uploadImageToCloudinary(file);
      setData(prev => ({ ...prev, heroImage: url }));
    } catch {
      alert('Error al subir imagen');
    } finally {
      setHeroUploading(false);
    }
  }

  async function handleProductImage(id: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setProductUploading(id);
      const url = await uploadImageToCloudinary(file);
      setData(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? { ...p, image: url } : p) }));
    } catch {
      alert('Error al subir imagen');
    } finally {
      setProductUploading(null);
    }
  }

  async function handleDraftImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setDraftUploading(true);
      const url = await uploadImageToCloudinary(file);
      setDraft(prev => ({ ...prev, image: url }));
    } catch {
      alert('Error al subir imagen');
    } finally {
      setDraftUploading(false);
    }
  }

  function toggleDraftSize(s: string) {
    setDraft(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s],
    }));
  }

  function addProduct() {
    if (!draft.name.trim() || !draft.originalPrice || !draft.offerPrice) return;
    const id = _nextProductId++;
    setData(prev => ({
      ...prev,
      products: [...prev.products, { id, name: draft.name.trim(), image: draft.image, originalPrice: draft.originalPrice, offerPrice: draft.offerPrice, sizes: draft.sizes }],
    }));
    setDraft({ name: '', originalPrice: '', offerPrice: '', sizes: [], image: '' });
    if (draftImgRef.current) draftImgRef.current.value = '';
  }

  function removeProduct(id: number) {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      await updateOfertaConfig({
        title: data.title,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        hero_image_url: data.heroImage,
        products: data.products,
      });
      alert('Cambios guardados');
    } catch {
      alert('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400 font-body text-sm">Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-heading text-navy mb-6">Editar Oferta del Mes</h1>

      <div className="flex flex-col gap-6">
        {/* Información de la promo */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Información de la promo
          </h2>

          <div>
            <label className={labelCls}>Título</label>
            <input type="text" value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea rows={3} value={data.description} onChange={e => setData(p => ({ ...p, description: e.target.value }))} className={`${inputCls} resize-none`} />
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

          <div>
            <label className={labelCls}>Imagen principal</label>
            <input ref={heroRef} type="file" accept="image/*" onChange={handleHeroFile} disabled={heroUploading} className={fileInputCls} />
            {heroUploading && <p className="mt-1.5 text-xs text-blue font-body">Subiendo imagen...</p>}
            {data.heroImage && !heroUploading && (
              <img src={data.heroImage} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />
            )}
          </div>
        </section>

        {/* Productos en oferta */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Productos en oferta
          </h2>

          {data.products.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {p.image ? (
                <button type="button" onClick={() => productImgRefs.current[p.id]?.click()} className="shrink-0">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => productImgRefs.current[p.id]?.click()}
                  className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-navy hover:text-navy transition-colors shrink-0"
                >
                  {productUploading === p.id ? (
                    <span className="text-xs text-blue">...</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              )}
              <input
                ref={el => { productImgRefs.current[p.id] = el; }}
                type="file"
                accept="image/*"
                onChange={e => handleProductImage(p.id, e)}
                className="hidden"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy font-body truncate">{p.name}</p>
                <p className="text-xs text-gray-500 font-body">
                  <span className="line-through">{p.originalPrice}€</span>
                  {' → '}
                  <span className="text-blue font-semibold">{p.offerPrice}€</span>
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.sizes.map(s => (
                    <span key={s} className="text-xs border border-gray-200 text-navy px-1.5 py-0.5 font-body rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeProduct(p.id)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Formulario añadir producto */}
          <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col gap-4">
            <p className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
              Añadir producto
            </p>

            <div>
              <label className={labelCls}>Nombre</label>
              <input
                type="text"
                value={draft.name}
                onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                placeholder="Jean Skinny Classic"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Precio original (€)</label>
                <input type="number" min="0" value={draft.originalPrice} onChange={e => setDraft(p => ({ ...p, originalPrice: e.target.value }))} placeholder="89" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Precio oferta (€)</label>
                <input type="number" min="0" value={draft.offerPrice} onChange={e => setDraft(p => ({ ...p, offerPrice: e.target.value }))} placeholder="59" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Foto</label>
              <input ref={draftImgRef} type="file" accept="image/*" onChange={handleDraftImageFile} disabled={draftUploading} className={fileInputCls} />
              {draftUploading && <p className="mt-1 text-xs text-blue font-body">Subiendo imagen...</p>}
              {draft.image && !draftUploading && (
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
              onClick={addProduct}
              className="self-start flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors"
            >
              <span className="text-lg leading-none">＋</span>
              Añadir producto
            </button>
          </div>
        </section>

        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminOfertaPage;
