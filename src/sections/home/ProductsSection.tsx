import ProductCard from '../../components/common/ProductCard';
import type { Product } from '../../types';

const MOCK_CATEGORY = { id: 1, name: 'Jeans', slug: 'jeans' };

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Jean Bota Recta con Bordado',
    slug: 'jean-bota-recta-con-bordado',
    description: 'Jean bota recta con detalle de bordado, corte favorecedor',
    price: 59.60,
    images: ['https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=600&q=80'],
    category: MOCK_CATEGORY,
    stock: 10,
    sizes: ['36', '38', '40', '42'],
    colors: ['azul oscuro'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 2,
    name: 'Jean Bota Recta Clásico',
    slug: 'jean-bota-recta-clasico',
    description: 'Jean bota recta de corte clásico y tiro alto',
    price: 58.80,
    images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80'],
    category: MOCK_CATEGORY,
    stock: 8,
    sizes: ['36', '38', '40', '42'],
    colors: ['azul medio'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: 'Jean Skinny Push-Up',
    slug: 'jean-skinny-push-up',
    description: 'Jean skinny con efecto push-up y tiro alto',
    price: 58.80,
    images: ['https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&q=80'],
    category: MOCK_CATEGORY,
    stock: 10,
    sizes: ['36', '38', '40', '42'],
    colors: ['azul oscuro'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 4,
    name: 'Jean Mom Fit',
    slug: 'jean-mom-fit',
    description: 'Mom fit de tiro alto con caída perfecta',
    price: 59.60,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80'],
    category: MOCK_CATEGORY,
    stock: 12,
    sizes: ['36', '38', '40', '42'],
    colors: ['azul claro'],
    isActive: true,
    isFeatured: true,
  },
];

function ProductsSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="font-heading text-4xl text-center text-navy mb-10">
        Productos destacados
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductsSection;
