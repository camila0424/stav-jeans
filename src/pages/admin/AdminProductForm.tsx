import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';

const CATEGORIES = ['Skinny', 'Bota Recta', 'Mom Fit', 'Wide Leg', 'Straight'];
const SIZES = ['34', '36', '38', '40', '42', '44'];

interface Variant {
  id: number;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  category: string;
  isActive: boolean;
  images: (string | null)[];
  variants: Variant[];
}

const MOCK_PRODUCT: FormState = {
  name: 'Jean Skinny Classic',
  description: 'Jean skinny de tiro alto con corte ajustado, ideal para looks casuales y formales.',
  price: '89900',
  category: 'Skinny',
  isActive: true,
  images: [
    'https://picsum.photos/seed/jean1/400/500',
    'https://picsum.photos/seed/jean2/400/500',
    null, null, null, null,
  ],
  variants: [
    { id: 1, size: '36', color: 'Azul Oscuro', colorHex: '#1a2f5e', stock: 10 },
    { id: 2, size: '38', color: 'Negro', colorHex: '#1a1a1a', stock: 5 },
  ],
};

function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormState>(() =>
    isEditing
      ? { ...MOCK_PRODUCT, images: [...MOCK_PRODUCT.images], variants: [...MOCK_PRODUCT.variants] }
      : {
          name: '',
          description: '',
          price: '',
          category: '',
          isActive: true,
          images: [null, null, null, null, null, null],
          variants: [],
        }
  );

  const [variantDraft, setVariantDraft] = useState({
    size: '34',
    color: '',
    colorHex: '#000000',
    stock: '',
  });

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const variantIdCounter = useRef(100);

  function handleFieldChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleImageSelect(index: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(prev => {
      const images = [...prev.images];
      images[index] = url;
      return { ...prev, images };
    });
    e.target.value = '';
  }

  function removeImage(index: number) {
    setForm(prev => {
      const images = [...prev.images];
      images[index] = null;
      return { ...prev, images };
    });
  }

  function handleVariantDraftChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setVariantDraft(prev => ({ ...prev, [name]: value }));
  }

  function addVariant() {
    if (!variantDraft.color.trim() || !variantDraft.stock) return;
    const newVariant: Variant = {
      id: variantIdCounter.current++,
      size: variantDraft.size,
      color: variantDraft.color.trim(),
      colorHex: variantDraft.colorHex,
      stock: Number(variantDraft.stock),
    };
    setForm(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
    setVariantDraft({ size: '34', color: '', colorHex: '#000000', stock: '' });
  }

  function removeVariant(variantId: number) {
    setForm(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== variantId) }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    alert('Producto guardado (mock)');
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/productos"
          className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-heading text-navy">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="text-sm text-gray-500 font-body">
            {isEditing ? `Editando ID #${id}` : 'Completa los datos del nuevo producto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* 1. INFORMACIÓN BÁSICA */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Información básica
          </h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-body mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleFieldChange}
              placeholder="Ej. Jean Skinny Classic"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 font-body mb-1.5">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleFieldChange}
              placeholder="Describe el producto..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 font-body mb-1.5">
                Precio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-body">$</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={handleFieldChange}
                  placeholder="89900"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
                />
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 font-body mb-1.5">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={form.category}
                onChange={handleFieldChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy bg-white"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.isActive}
              onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isActive ? 'bg-navy' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm font-body text-gray-700">
              {form.isActive ? 'Producto activo' : 'Producto inactivo'}
            </span>
          </div>
        </section>

        {/* 2. IMÁGENES */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Imágenes{' '}
            <span className="normal-case font-normal text-gray-300">(máximo 6)</span>
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {form.images.map((img, index) => (
              <div key={index} className="relative aspect-3/4">
                {img ? (
                  <div className="w-full h-full relative group rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-navy text-white text-xs font-body px-2 py-0.5 rounded-full">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="w-full h-full border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-navy hover:text-navy transition-colors"
                  >
                    <span className="text-2xl leading-none">＋</span>
                    <span className="text-xs font-body">Añadir foto</span>
                    {index === 0 && (
                      <span className="text-xs font-body text-gray-300">Principal</span>
                    )}
                  </button>
                )}
                <input
                  ref={el => { fileInputRefs.current[index] = el; }}
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageSelect(index, e)}
                  className="hidden"
                />
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 font-body">
            Las imágenes se subirán a Cloudinary cuando el backend esté conectado.
          </p>
        </section>

        {/* 3. VARIANTES */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Variantes
          </h2>

          {form.variants.length > 0 && (
            <ul className="flex flex-col gap-2">
              {form.variants.map(v => (
                <li
                  key={v.id}
                  className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg text-sm font-body"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                    style={{ backgroundColor: v.colorHex }}
                  />
                  <span className="text-gray-700 min-w-0 flex-1">
                    Talla <strong>{v.size}</strong> · {v.color} · Stock: <strong>{v.stock}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariant(v.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 items-end flex-wrap">
            <div className="shrink-0">
              <label className="block text-xs font-body text-gray-500 mb-1">Talla</label>
              <select
                name="size"
                value={variantDraft.size}
                onChange={handleVariantDraftChange}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy bg-white"
              >
                {SIZES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-36">
              <label className="block text-xs font-body text-gray-500 mb-1">Color</label>
              <input
                name="color"
                type="text"
                value={variantDraft.color}
                onChange={handleVariantDraftChange}
                placeholder="Ej. Azul Oscuro"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
              />
            </div>
            <div className="shrink-0">
              <label className="block text-xs font-body text-gray-500 mb-1">Hex</label>
              <input
                name="colorHex"
                type="color"
                value={variantDraft.colorHex}
                onChange={handleVariantDraftChange}
                className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer p-0.5"
              />
            </div>
            <div className="shrink-0">
              <label className="block text-xs font-body text-gray-500 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={variantDraft.stock}
                onChange={handleVariantDraftChange}
                placeholder="0"
                className="w-20 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="self-start flex items-center gap-2 px-4 py-2 border border-navy text-navy text-sm font-body rounded-lg hover:bg-navy hover:text-white transition-colors"
          >
            <span className="text-lg leading-none">＋</span>
            Añadir variante
          </button>
        </section>

        {/* 4. BOTONES */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-navy text-white text-sm font-body rounded-lg hover:bg-navy/90 transition-colors"
          >
            Guardar
          </button>
          <Link
            to="/admin/productos"
            className="px-6 py-2.5 bg-white text-gray-600 text-sm font-body rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
