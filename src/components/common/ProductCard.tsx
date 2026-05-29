import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

function formatPrice(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function ProductCard({ product }: ProductCardProps) {
  const price = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;

  return (
    <article className="card group flex flex-col bg-white border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/tienda/${product.slug}`} className="overflow-hidden">
        <img
          src={product.images[0] ?? '/placeholder.png'}
          alt={product.name}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <Link to={`/tienda/${product.slug}`}>
          <h3 className="font-heading text-lg leading-tight text-navy hover:text-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-navy font-semibold">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map(size => (
              <span
                key={size}
                className="px-2 py-0.5 text-xs border border-gray-200 text-navy"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/tienda/${product.slug}`}
          className="mt-auto border border-navy text-navy text-sm font-medium text-center py-2 transition-all duration-200 hover:bg-navy hover:text-white"
        >
          Ver producto
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
