import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { getProduct } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import useCart from '../hooks/useCart';

const MOCK_SUGGESTIONS: Product[] = [
  {
    id: 101,
    name: 'Jean Mom Fit',
    slug: 'jean-mom-fit',
    description: 'Corte alto y relajado, tendencia actual.',
    price: 9500,
    images: ['/placeholder.png'],
    category: { id: 1, name: 'Jeans', slug: 'jeans' },
    stock: 5,
    sizes: ['36', '38', '40'],
    colors: ['azul oscuro'],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 102,
    name: 'Jean Skinny',
    slug: 'jean-skinny',
    description: 'Ajustado desde la cadera hasta el tobillo.',
    price: 8200,
    salePrice: 6900,
    images: ['/placeholder.png'],
    category: { id: 1, name: 'Jeans', slug: 'jeans' },
    stock: 8,
    sizes: ['34', '36', '38', '40'],
    colors: ['negro'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 103,
    name: 'Jean Wide Leg',
    slug: 'jean-wide-leg',
    description: 'Pierna ancha para un look retro y cómodo.',
    price: 10200,
    images: ['/placeholder.png'],
    category: { id: 1, name: 'Jeans', slug: 'jeans' },
    stock: 3,
    sizes: ['38', '40', '42'],
    colors: ['celeste'],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 104,
    name: 'Jean Boyfriend',
    slug: 'jean-boyfriend',
    description: 'Holgado y cómodo, perfecto para cualquier ocasión.',
    price: 8800,
    salePrice: 7500,
    images: ['/placeholder.png'],
    category: { id: 1, name: 'Jeans', slug: 'jeans' },
    stock: 0,
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['azul medio'],
    isActive: true,
    isFeatured: false,
  },
];

function formatPrice(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getProduct(slug)
      .then((data) => {
        const p = data as Product;
        setProduct(p);
        setSelectedSize(p.sizes[0] ?? '');
        setActiveImage(0);
        setQuantity(1);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem(product, quantity, selectedSize, product.colors[0] ?? '');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center gap-6 py-32 text-center px-4">
        <p className="font-heading text-2xl text-navy">
          {error ?? 'Producto no encontrado'}
        </p>
        <Button variant="outline" onClick={() => navigate('/tienda')}>
          ← Volver a la tienda
        </Button>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const outOfStock = product.stock === 0;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 flex gap-2">
        <button
          onClick={() => navigate('/tienda')}
          className="hover:text-navy transition-colors"
        >
          Tienda
        </button>
        <span>/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      {/* Grilla producto */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        {/* Galería */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden bg-gray-light">
            <img
              src={product.images[activeImage] ?? '/placeholder.png'}
              alt={product.name}
              className="w-full aspect-3/4 object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${
                    activeImage === i
                      ? 'border-navy'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} vista ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">{product.category.name}</p>
            <h1 className="font-heading text-4xl text-navy leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-navy">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm bg-yellow text-navy font-medium px-2 py-0.5">
                  -{Math.round((1 - product.salePrice! / product.price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Selector de talle */}
          {product.sizes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-navy mb-2">
                Talle:{' '}
                <span className="font-normal text-gray-600">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-navy text-white border-navy'
                        : 'border-gray-300 text-navy hover:border-navy'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de cantidad */}
          <div>
            <p className="text-sm font-medium text-navy mb-2">Cantidad</p>
            <div className="flex items-center border border-gray-300 w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-light disabled:opacity-40 transition-colors text-lg"
              >
                −
              </button>
              <span className="w-12 text-center text-navy font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={outOfStock}
                className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-light disabled:opacity-40 transition-colors text-lg"
              >
                +
              </button>
            </div>
            {!outOfStock && (
              <p className="text-xs text-gray-400 mt-1">
                {product.stock} unidades disponibles
              </p>
            )}
          </div>

          {/* Botón carrito */}
          <Button
            size="lg"
            variant={outOfStock ? 'outline' : 'primary'}
            disabled={outOfStock}
            onClick={handleAddToCart}
            className="w-full"
          >
            {outOfStock ? 'Sin stock' : 'Añadir al carrito'}
          </Button>
        </div>
      </div>

      {/* También te puede gustar */}
      <section>
        <h2 className="font-heading text-3xl text-navy mb-8">
          También te puede gustar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_SUGGESTIONS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
