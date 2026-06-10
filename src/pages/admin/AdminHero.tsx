import { useState, useRef, useEffect } from 'react';
import { getHeroConfig, updateHeroConfig, uploadImageToCloudinary } from '../../services/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1600&q=80';

interface HeroData {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  posX: number;
  posY: number;
}

function AdminHero() {
  const [data, setData] = useState<HeroData>({
    image: DEFAULT_IMAGE,
    title: '',
    subtitle: '',
    cta: '',
    posX: 50,
    posY: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getHeroConfig()
      .then(cfg => {
        setData({
          image: cfg.image_url || DEFAULT_IMAGE,
          title: cfg.title,
          subtitle: cfg.subtitle,
          cta: cfg.cta_text,
          posX: cfg.position_x,
          posY: cfg.position_y,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setData(prev => ({ ...prev, image: url }));
    } catch {
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      await updateHeroConfig({
        title: data.title,
        subtitle: data.subtitle,
        cta_text: data.cta,
        image_url: data.image,
        position_x: data.posX,
        position_y: data.posY,
      });
      alert('Cambios guardados');
    } catch {
      alert('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-gray-400 font-body text-sm">Cargando...</div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-heading text-navy mb-6">Editar Hero</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column — controls (40%) */}
        <div className="w-full md:w-2/5 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy font-body mb-2">
                Imagen de fondo
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 font-body
                  file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded
                  file:text-sm file:font-medium file:bg-navy file:text-white
                  file:cursor-pointer hover:file:bg-blue disabled:opacity-50"
              />
              {uploading && (
                <p className="mt-1.5 text-xs text-blue font-body">Subiendo imagen...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy font-body mb-2">
                Título del hero
              </label>
              <input
                type="text"
                value={data.title}
                onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy font-body mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={e => setData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy font-body mb-2">
                Texto del botón CTA
              </label>
              <input
                type="text"
                value={data.cta}
                onChange={e => setData(prev => ({ ...prev, cta: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy font-body mb-2">
                Posición de la imagen
              </label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-body text-gray-500 mb-1">
                    <span>Horizontal</span>
                    <span>{data.posX}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={data.posX}
                    onChange={e => setData(prev => ({ ...prev, posX: Number(e.target.value) }))}
                    className="w-full accent-navy cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-body text-gray-500 mb-1">
                    <span>Vertical</span>
                    <span>{data.posY}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={data.posY}
                    onChange={e => setData(prev => ({ ...prev, posY: Number(e.target.value) }))}
                    className="w-full accent-navy cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-navy text-white font-body font-medium px-6 py-2.5 rounded-lg hover:bg-blue transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        {/* Right column — live preview (60%), sticky */}
        <div className="w-full md:w-3/5 sticky top-4">
          <p className="text-xs font-body text-gray-400 mb-2 uppercase tracking-wide">
            Vista previa
          </p>
          <div
            className="relative w-full rounded-xl overflow-hidden bg-cover bg-center"
            style={{
              height: '500px',
              backgroundImage: `url(${data.image})`,
              backgroundPosition: `${data.posX}% ${data.posY}%`,
            }}
          >
            <div className="absolute inset-0 bg-navy/65" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-8">
              <p className="font-heading text-3xl mb-3 leading-tight">{data.title}</p>
              <p className="font-body text-base mb-6 text-gray-200">{data.subtitle}</p>
              <span className="bg-yellow text-navy font-body font-medium px-6 py-2.5 text-sm">
                {data.cta}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHero;
