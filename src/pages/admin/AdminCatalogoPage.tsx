import { useState, useRef, useEffect } from 'react';
import { getCatalogoConfig, updateCatalogoConfig, uploadImageToCloudinary } from '../../services/api';

// ---------- Types ----------

interface FilterOption {
  id: number;
  name: string;
}

interface FilterGroup {
  id: number;
  name: string;
  options: FilterOption[];
}

interface CatalogProduct {
  id: number;
  name: string;
  image: string;
  price: string;
  sizes: string[];
  filters: Record<number, number>;
}

interface CatalogSection {
  id: number;
  name: string;
  sizes: string[];
  filterGroups: FilterGroup[];
  products: CatalogProduct[];
}

// ---------- ID counter ----------

let _uid = 200;
const uid = () => _uid++;

// ---------- Shared styles ----------

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy';
const fileInputCls = 'block w-full text-sm text-gray-500 font-body file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-medium file:bg-navy file:text-white file:cursor-pointer hover:file:bg-blue';

// ---------- SizesManager ----------

interface SizesManagerProps {
  section: CatalogSection;
  onUpdate: (s: CatalogSection) => void;
}

function SizesManager({ section, onUpdate }: SizesManagerProps) {
  const [newSize, setNewSize] = useState('');

  function addSize() {
    const trimmed = newSize.trim();
    if (!trimmed || section.sizes.includes(trimmed)) return;
    onUpdate({ ...section, sizes: [...section.sizes, trimmed] });
    setNewSize('');
  }

  function removeSize(s: string) {
    onUpdate({ ...section, sizes: section.sizes.filter(x => x !== s) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {section.sizes.map(s => (
          <span key={s} className="flex items-center gap-1.5 bg-navy/10 text-navy px-3 py-1 rounded-full text-sm font-body">
            {s}
            <button
              type="button"
              onClick={() => removeSize(s)}
              className="text-navy/50 hover:text-red-500 transition-colors leading-none"
            >
              ×
            </button>
          </span>
        ))}
        {section.sizes.length === 0 && (
          <p className="text-sm text-gray-400 font-body">Sin tallas definidas</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newSize}
          onChange={e => setNewSize(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSize()}
          placeholder="Ej. S, M, L / 36 / Única"
          className={inputCls}
        />
        <button
          type="button"
          onClick={addSize}
          className="px-4 py-2 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors whitespace-nowrap"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}

// ---------- FiltersManager ----------

interface FiltersManagerProps {
  section: CatalogSection;
  onUpdate: (s: CatalogSection) => void;
}

function FiltersManager({ section, onUpdate }: FiltersManagerProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [optionInputs, setOptionInputs] = useState<Record<number, string>>({});

  function addGroup() {
    if (!newGroupName.trim()) return;
    const group: FilterGroup = { id: uid(), name: newGroupName.trim(), options: [] };
    onUpdate({ ...section, filterGroups: [...section.filterGroups, group] });
    setNewGroupName('');
  }

  function removeGroup(gId: number) {
    onUpdate({ ...section, filterGroups: section.filterGroups.filter(g => g.id !== gId) });
  }

  function renameGroup(gId: number, name: string) {
    onUpdate({
      ...section,
      filterGroups: section.filterGroups.map(g => g.id === gId ? { ...g, name } : g),
    });
  }

  function addOption(gId: number) {
    const name = (optionInputs[gId] ?? '').trim();
    if (!name) return;
    onUpdate({
      ...section,
      filterGroups: section.filterGroups.map(g =>
        g.id === gId ? { ...g, options: [...g.options, { id: uid(), name }] } : g
      ),
    });
    setOptionInputs(prev => ({ ...prev, [gId]: '' }));
  }

  function removeOption(gId: number, oId: number) {
    onUpdate({
      ...section,
      filterGroups: section.filterGroups.map(g =>
        g.id === gId ? { ...g, options: g.options.filter(o => o.id !== oId) } : g
      ),
    });
  }

  function renameOption(gId: number, oId: number, name: string) {
    onUpdate({
      ...section,
      filterGroups: section.filterGroups.map(g =>
        g.id === gId
          ? { ...g, options: g.options.map(o => o.id === oId ? { ...o, name } : o) }
          : g
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {section.filterGroups.length === 0 && (
        <p className="text-sm text-gray-400 font-body">Sin grupos de filtros definidos</p>
      )}

      {section.filterGroups.map(group => (
        <div key={group.id} className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          {/* Group name + delete */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={group.name}
              onChange={e => renameGroup(group.id, e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-body font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
            <button
              type="button"
              onClick={() => removeGroup(group.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Eliminar grupo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-1.5">
            {group.options.map(opt => (
              <div key={opt.id} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                <input
                  type="text"
                  value={opt.name}
                  onChange={e => renameOption(group.id, opt.id, e.target.value)}
                  className="text-xs font-body text-navy bg-transparent outline-none w-24 min-w-0"
                />
                <button
                  type="button"
                  onClick={() => removeOption(group.id, opt.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors leading-none"
                >
                  ×
                </button>
              </div>
            ))}
            {group.options.length === 0 && (
              <span className="text-xs text-gray-400 font-body">Sin opciones</span>
            )}
          </div>

          {/* Add option */}
          <div className="flex gap-2">
            <input
              type="text"
              value={optionInputs[group.id] ?? ''}
              onChange={e => setOptionInputs(prev => ({ ...prev, [group.id]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addOption(group.id)}
              placeholder="Nueva opción..."
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-body focus:outline-none focus:ring-1 focus:ring-navy/30"
            />
            <button
              type="button"
              onClick={() => addOption(group.id)}
              className="px-3 py-1.5 text-xs font-body bg-navy/10 text-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
            >
              + Opción
            </button>
          </div>
        </div>
      ))}

      {/* Add group */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGroup()}
          placeholder="Nuevo grupo (ej. Corte, Tiro, Tela...)"
          className={inputCls}
        />
        <button
          type="button"
          onClick={addGroup}
          className="px-4 py-2 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors whitespace-nowrap"
        >
          + Grupo
        </button>
      </div>
    </div>
  );
}

// ---------- ProductsManager ----------

interface ProductsManagerProps {
  section: CatalogSection;
  allSections: CatalogSection[];
  onUpdate: (s: CatalogSection) => void;
  onMove: (productId: number, fromSectionId: number, toSectionId: number) => void;
}

function ProductsManager({ section, allSections, onUpdate, onMove }: ProductsManagerProps) {
  const [draft, setDraft] = useState({
    name: '',
    price: '',
    sizes: [] as string[],
    filters: {} as Record<number, number>,
    image: '',
  });
  const [draftUploading, setDraftUploading] = useState(false);
  const [productUploading, setProductUploading] = useState<number | null>(null);
  const draftImgRef = useRef<HTMLInputElement>(null);
  const imgRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const otherSections = allSections.filter(s => s.id !== section.id);

  function toggleDraftSize(s: string) {
    setDraft(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s],
    }));
  }

  function addProduct() {
    if (!draft.name.trim() || !draft.price) return;
    onUpdate({
      ...section,
      products: [...section.products, {
        id: uid(),
        name: draft.name.trim(),
        image: draft.image,
        price: draft.price,
        sizes: draft.sizes,
        filters: draft.filters,
      }],
    });
    setDraft({ name: '', price: '', sizes: [], filters: {}, image: '' });
    if (draftImgRef.current) draftImgRef.current.value = '';
  }

  function removeProduct(id: number) {
    onUpdate({ ...section, products: section.products.filter(p => p.id !== id) });
  }

  async function handleProductImage(id: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setProductUploading(id);
      const url = await uploadImageToCloudinary(file);
      onUpdate({ ...section, products: section.products.map(p => p.id === id ? { ...p, image: url } : p) });
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

  function getOptionName(groupId: number, optId: number) {
    return section.filterGroups.find(g => g.id === groupId)?.options.find(o => o.id === optId)?.name ?? '';
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Product list */}
      {section.products.length === 0 && (
        <p className="text-sm text-gray-400 font-body text-center py-4">Sin productos en esta sección</p>
      )}
      {section.products.map(p => (
        <div key={p.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          {/* Photo */}
          <div className="shrink-0">
            {p.image ? (
              <button type="button" onClick={() => imgRefs.current[p.id]?.click()} title="Cambiar foto">
                <img src={p.image} alt={p.name} className="w-14 h-20 object-cover rounded-lg" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => imgRefs.current[p.id]?.click()}
                className="w-14 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-navy hover:text-navy transition-colors"
                title="Añadir foto"
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
              ref={el => { imgRefs.current[p.id] = el; }}
              type="file"
              accept="image/*"
              onChange={e => handleProductImage(p.id, e)}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-navy font-body truncate">{p.name}</p>
            <p className="text-xs text-gray-500 font-body">{p.price}€</p>
            <div className="flex flex-wrap gap-1">
              {p.sizes.map(s => (
                <span key={s} className="text-xs border border-gray-200 text-navy px-1.5 py-0.5 font-body rounded">
                  {s}
                </span>
              ))}
            </div>
            {section.filterGroups.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {section.filterGroups.map(g => p.filters[g.id] != null ? (
                  <span key={g.id} className="text-xs bg-blue/10 text-blue px-1.5 py-0.5 font-body rounded">
                    {g.name}: {getOptionName(g.id, p.filters[g.id])}
                  </span>
                ) : null)}
              </div>
            )}
            {otherSections.length > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400 font-body">Mover a:</span>
                <select
                  onChange={e => { if (e.target.value) { onMove(p.id, section.id, Number(e.target.value)); e.target.value = ''; } }}
                  className="text-xs font-body border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-navy/30 bg-white"
                >
                  <option value="">Sección...</option>
                  {otherSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Delete */}
          <button
            type="button"
            onClick={() => removeProduct(p.id)}
            className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1 self-start"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* Add product form */}
      <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col gap-4">
        <p className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest">
          Añadir producto
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 font-body mb-1">Nombre</label>
            <input
              type="text"
              value={draft.name}
              onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
              placeholder="Nombre del producto"
              className={inputCls}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 font-body mb-1">Precio (€)</label>
            <input
              type="number"
              min="0"
              value={draft.price}
              onChange={e => setDraft(p => ({ ...p, price: e.target.value }))}
              placeholder="89"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-body mb-1">Foto</label>
          <input ref={draftImgRef} type="file" accept="image/*" onChange={handleDraftImageFile} disabled={draftUploading} className={fileInputCls} />
          {draftUploading && <p className="mt-1 text-xs text-blue font-body">Subiendo imagen...</p>}
          {draft.image && !draftUploading && <img src={draft.image} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-lg" />}
        </div>

        {section.sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-1">Tallas</label>
            <div className="flex flex-wrap gap-2">
              {section.sizes.map(s => (
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
        )}

        {section.filterGroups.map(group => group.options.length > 0 ? (
          <div key={group.id}>
            <label className="block text-sm font-medium text-gray-700 font-body mb-1">{group.name}</label>
            <select
              value={draft.filters[group.id] ?? ''}
              onChange={e => setDraft(p => ({ ...p, filters: { ...p.filters, [group.id]: Number(e.target.value) } }))}
              className={`${inputCls} bg-white`}
            >
              <option value="">Sin {group.name.toLowerCase()}</option>
              {group.options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
          </div>
        ) : null)}

        <button
          type="button"
          onClick={addProduct}
          className="self-start flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors"
        >
          <span className="text-lg leading-none">＋</span>
          Añadir producto
        </button>
      </div>
    </div>
  );
}

// ---------- Main component ----------

type ActiveTab = 'productos' | 'tallas' | 'filtros';

function AdminCatalogoPage() {
  const [sections, setSections] = useState<CatalogSection[]>([]);
  const [activeId, setActiveId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('productos');
  const [newSectionName, setNewSectionName] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCatalogoConfig()
      .then(cfg => {
        const loaded = (cfg.sections ?? []) as CatalogSection[];
        setSections(loaded);
        if (loaded.length > 0) setActiveId(loaded[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSection = sections.find(s => s.id === activeId) ?? sections[0];

  function updateSection(updated: CatalogSection) {
    setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
  }

  function renameSection(id: number, name: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  }

  function moveSection(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= sections.length) return;
    setSections(prev => {
      const arr = [...prev];
      [arr[index], arr[to]] = [arr[to], arr[index]];
      return arr;
    });
  }

  function deleteSection(id: number) {
    if (sections.length <= 1) return;
    const remaining = sections.filter(s => s.id !== id);
    setSections(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  }

  function addSection() {
    const name = newSectionName.trim();
    if (!name) return;
    const newSection: CatalogSection = { id: uid(), name, sizes: [], filterGroups: [], products: [] };
    setSections(prev => [...prev, newSection]);
    setActiveId(newSection.id);
    setNewSectionName('');
    setShowNewSection(false);
  }

  function moveProduct(productId: number, fromId: number, toId: number) {
    setSections(prev => {
      const from = prev.find(s => s.id === fromId);
      const product = from?.products.find(p => p.id === productId);
      if (!product) return prev;
      return prev.map(s => {
        if (s.id === fromId) return { ...s, products: s.products.filter(p => p.id !== productId) };
        if (s.id === toId) return { ...s, products: [...s.products, product] };
        return s;
      });
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      await updateCatalogoConfig({ sections });
      alert('Cambios guardados');
    } catch {
      alert('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  }

  const tabCls = (tab: ActiveTab) =>
    `px-4 py-2 text-sm font-body rounded-lg transition-colors ${
      activeTab === tab ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  if (loading) {
    return <div className="p-8 text-gray-400 font-body text-sm">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-navy">Catálogo</h1>
        <button
          type="button"
          onClick={() => setShowNewSection(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors"
        >
          <span className="text-lg leading-none">＋</span>
          Nueva sección
        </button>
      </div>

      {/* Nueva sección inline */}
      {showNewSection && (
        <div className="mb-6 bg-white rounded-xl shadow-sm p-5 flex gap-3 items-end border border-navy/20">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 font-body mb-1.5">
              Nombre de la nueva sección
            </label>
            <input
              type="text"
              autoFocus
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSection()}
              placeholder="Ej. Jeans Mujer, Accesorios, Tops..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          <button
            type="button"
            onClick={addSection}
            className="px-5 py-2.5 bg-navy text-white text-sm font-body rounded-lg hover:bg-blue transition-colors"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => { setShowNewSection(false); setNewSectionName(''); }}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-body rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {sections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center text-gray-400 font-body text-sm">
          Sin secciones. Crea la primera para empezar.
        </div>
      ) : (
        <div className="flex gap-6 items-start">
          {/* Left sidebar — section list */}
          <div className="w-56 shrink-0 bg-white rounded-xl shadow-sm p-3 flex flex-col gap-1">
            <p className="text-xs font-body font-semibold text-gray-400 uppercase tracking-widest px-2 py-1">
              Secciones
            </p>
            {sections.map((s, idx) => (
              <div
                key={s.id}
                className={`group flex items-center gap-1 rounded-lg transition-colors ${
                  activeId === s.id ? 'bg-navy/10' : 'hover:bg-gray-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => { setActiveId(s.id); setActiveTab('productos'); }}
                  className={`flex-1 text-left px-3 py-2 text-sm font-body truncate ${
                    activeId === s.id ? 'text-navy font-semibold' : 'text-gray-700'
                  }`}
                >
                  {s.name}
                </button>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pr-1.5">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-navy disabled:opacity-30 text-xs"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === sections.length - 1}
                    className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-navy disabled:opacity-30 text-xs"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(s.id)}
                    disabled={sections.length <= 1}
                    className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-red-500 disabled:opacity-30 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel — section editor */}
          {activeSection && (
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              {/* Section name */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <label className="block text-xs font-body font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Nombre de la sección
                </label>
                <input
                  type="text"
                  value={activeSection.name}
                  onChange={e => renameSection(activeSection.id, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-navy/30"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-2 bg-white rounded-xl shadow-sm p-3">
                <button type="button" className={tabCls('productos')} onClick={() => setActiveTab('productos')}>
                  Productos ({activeSection.products.length})
                </button>
                <button type="button" className={tabCls('tallas')} onClick={() => setActiveTab('tallas')}>
                  Tallas ({activeSection.sizes.length})
                </button>
                <button type="button" className={tabCls('filtros')} onClick={() => setActiveTab('filtros')}>
                  Filtros ({activeSection.filterGroups.length})
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                {activeTab === 'tallas' && (
                  <SizesManager section={activeSection} onUpdate={updateSection} />
                )}
                {activeTab === 'filtros' && (
                  <FiltersManager section={activeSection} onUpdate={updateSection} />
                )}
                {activeTab === 'productos' && (
                  <ProductsManager
                    section={activeSection}
                    allSections={sections}
                    onUpdate={updateSection}
                    onMove={moveProduct}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
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
  );
}

export default AdminCatalogoPage;
