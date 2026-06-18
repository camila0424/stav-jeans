import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { getProduct, getProducts } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import useCart from '../hooks/useCart';

function formatPrice(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setProduct(null);
    setSuggestions([]);

    getProduct(slug)
      .then((data) => {
        const p = data as Product;
        setProduct(p);
        setSelectedSize(p.sizes[0] ?? '');
        setSelectedColor(p.colors[0] ?? '');
        setActiveImage(0);
        setQuantity(1);

        // Load related products from same category, excluding current product
        return getProducts().then(all => {
          const related = all
            .filter(x => x.id !== p.id && x.category.slug === p.category.slug)
            .slice(0, 4);
          // If fewer than 4 in same category, fill with other products
          if (related.length < 4) {
            const others = all
              .filter(x => x.id !== p.id && x.category.slug !== p.category.slug)
              .slice(0, 4 - related.length);
            setSuggestions([...related, ...others]);
          } else {
            setSuggestions(related);
          }
        });
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
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

  const hasVariants = (product.variants?.length ?? 0) > 0;
  const activeVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const variantStock = hasVariants ? (activeVariant?.stock ?? 0) : product.stock;
  const outOfStock = variantStock === 0;

  function getColorHex(color: string): string {
    return product?.variants?.find((v) => v.color === color)?.colorHex ?? '#cccccc';
  }

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

          {/* Selector de color */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-navy mb-2">
                Color:{' '}
                <span className="font-normal text-gray-600">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-navy ring-2 ring-navy ring-offset-2 scale-110'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: getColorHex(color) }}
                  />
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
                onClick={() => setQuantity((q) => Math.min(variantStock, q + 1))}
                disabled={outOfStock}
                className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-light disabled:opacity-40 transition-colors text-lg"
              >
                +
              </button>
            </div>
            {!outOfStock && (
              <p className="text-xs text-gray-400 mt-1">
                {variantStock} unidades disponibles
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
            {outOfStock
              ? hasVariants
                ? 'Sin stock en esta combinación'
                : 'Sin stock'
              : 'Añadir al carrito'}
          </Button>
        </div>
      </div>

      {/* También te puede gustar */}
      {suggestions.length > 0 && (
        <section>
          <h2 className="font-heading text-3xl text-navy mb-8">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductPage;
