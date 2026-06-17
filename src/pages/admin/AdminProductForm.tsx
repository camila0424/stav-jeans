import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, adminCreateProduct, adminUpdateProduct, uploadImageToCloudinary, getCategories } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Category } from '../../types/index';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44'];

interface FormVariant {
  id?: number;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

const SUBCATEGORY_OPTIONS = [
  'Pitillo',
  'Mom / Mum',
  'Wide leg (pernera ancha)',
  'Straight (corte recto)',
  'Barrel (bombacho)',
  'Campana / Acampanado',
  'Tobillero',
  'Pernera cónica',
];

interface FormState {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  category: string;
  subcategory: string;
  isActive: boolean;
  isFeatured: boolean;
  images: (string | null)[];
  variants: FormVariant[];
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  category: '',
  subcategory: '',
  isActive: true,
  isFeatured: false,
  images: [null, null, null, null, null, null],
  variants: [],
};


function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loadingProduct, setLoadingProduct] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  const [variantDraft, setVariantDraft] = useState({
    size: '34',
    color: '',
    colorHex: '#000000',
    stock: '',
  });

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const filesRef = useRef<(File | null)[]>([null, null, null, null, null, null]);
  const variantIdCounter = useRef(1000);

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data as Category[]))
      .catch(() => setCategoriesError(true))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    setForm(EMPTY_FORM);
    filesRef.current = [null, null, null, null, null, null];
    setSaveError(null);

    if (!id) {
      setLoadingProduct(false);
      return;
    }

    setLoadingProduct(true);
    getProductById(id)
      .then(product => {
        const images: (string | null)[] = [...product.images, null, null, null, null, null, null].slice(0, 6);
        const variants: FormVariant[] = (product.variants ?? []).map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: v.stock,
        }));
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          salePrice: product.salePrice ? String(product.salePrice) : '',
          category: product.category.name,
          subcategory: (product as { subcategory?: string }).subcategory ?? '',
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          images,
          variants,
        });
      })
      .catch(() => setSaveError('No se pudo cargar el producto'))
      .finally(() => setLoadingProduct(false));
  }, [id]);

  function handleFieldChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const cat = categories.find(c => c.name === value);
    const isVaqueros = cat?.slug === 'vaqueros' || cat?.name === 'Vaqueros';
    setForm(prev => ({ ...prev, category: value, subcategory: isVaqueros ? prev.subcategory : '' }));
  }

  function handleImageSelect(index: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    filesRef.current[index] = file;
    const url = URL.createObjectURL(file);
    setForm(prev => {
      const images = [...prev.images];
      images[index] = url;
      return { ...prev, images };
    });
    e.target.value = '';
  }

  function removeImage(index: number) {
    filesRef.current[index] = null;
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
    const newVariant: FormVariant = {
      id: variantIdCounter.current++,
      size: variantDraft.size,
      color: variantDraft.color.trim(),
      colorHex: variantDraft.colorHex,
      stock: Number(variantDraft.stock),
    };
    setForm(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
    setVariantDraft({ size: '34', color: '', colorHex: '#000000', stock: '' });
  }

  function removeVariant(_variantId: number | undefined, index: number) {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const uploadedImages: string[] = [];
      const hasBlobImages = form.images.some(img => img?.startsWith('blob:'));
      if (hasBlobImages) setUploadingImages(true);

      for (let i = 0; i < form.images.length; i++) {
        const img = form.images[i];
        if (!img) continue;
        if (img.startsWith('blob:')) {
          const file = filesRef.current[i];
          if (!file) throw new Error(`No se pudo recuperar la imagen ${i + 1}. Por favor, vuelve a seleccionarla.`);
          const url = await uploadImageToCloudinary(file);
          uploadedImages.push(url);
        } else {
          uploadedImages.push(img);
        }
      }

      setUploadingImages(false);

      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        sale_price: form.salePrice ? parseFloat(form.salePrice) : null,
        category: form.category,
        subcategory: form.subcategory || null,
        is_active: form.isActive,
        is_featured: form.isFeatured,
        images: uploadedImages,
        variants: form.variants.map(v => ({
          size: v.size,
          color: v.color,
          color_hex: v.colorHex,
          stock: v.stock,
        })),
      };

      if (isEditing && id) {
        await adminUpdateProduct(parseInt(id, 10), payload);
      } else {
        await adminCreateProduct(payload);
      }

      navigate('/admin/productos');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar producto');
      setUploadingImages(false);
    } finally {
      setSaving(false);
    }
  }

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
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

      {saveError && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-lg">
          {saveError}
        </div>
      )}

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
                  step="0.01"
                  value={form.price}
                  onChange={handleFieldChange}
                  placeholder="89900"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
                />
              </div>
            </div>
            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 font-body mb-1.5">
                Precio oferta
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-body">$</span>
                <input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salePrice}
                  onChange={handleFieldChange}
                  placeholder="Opcional"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy"
                />
              </div>
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
              disabled={loadingCategories || categoriesError}
              value={form.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy bg-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingCategories && <option value="">Cargando categorías…</option>}
              {categoriesError && <option value="">Error al cargar categorías</option>}
              {!loadingCategories && !categoriesError && (
                <>
                  <option value="">Seleccionar...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {categories.find(c => c.name === form.category)?.slug === 'vaqueros' && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 font-body mb-1.5">
                Tipo de vaquero
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={form.subcategory}
                onChange={handleFieldChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy bg-white"
              >
                <option value="">Seleccionar tipo…</option>
                {SUBCATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-navy' : 'bg-gray-200'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
              <span className="text-sm font-body text-gray-700">
                {form.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.isFeatured}
                onClick={() => setForm(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-yellow' : 'bg-gray-200'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isFeatured ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
              <span className="text-sm font-body text-gray-700">Destacado</span>
            </div>
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
        </section>

        {/* 3. VARIANTES */}
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
            Variantes
          </h2>

          {form.variants.length > 0 && (
            <ul className="flex flex-col gap-2">
              {form.variants.map((v, index) => (
                <li
                  key={index}
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
                    onClick={() => removeVariant(v.id, index)}
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
            disabled={saving || uploadingImages}
            className="px-6 py-2.5 bg-navy text-white text-sm font-body rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-60"
          >
            {uploadingImages ? 'Subiendo imágenes…' : saving ? 'Guardando…' : 'Guardar'}
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
