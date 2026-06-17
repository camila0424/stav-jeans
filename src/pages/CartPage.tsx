import { Link, useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import useCart from '../hooks/useCart';
import Button from '../components/common/Button';

const SHIPPING_THRESHOLD = 80;
const SHIPPING_COST = 5.99;
const WHATSAPP_NUMBER = '34663577485';

function formatEur(amount: number): string {
  return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function buildWhatsAppMessage(items: CartItem[], subtotal: number, shipping: number): string {
  const lines = items.map(
    item =>
      `• ${item.product.name} x${item.quantity} (Talla: ${item.size}) — ${formatEur((item.product.salePrice ?? item.product.price) * item.quantity)}`
  );
  const shippingText = shipping === 0 ? 'Gratis' : formatEur(shipping);
  return [
    '¡Hola! Me gustaría hacer el siguiente pedido:',
    '',
    ...lines,
    '',
    `Subtotal: ${formatEur(subtotal)}`,
    `Envío: ${shippingText}`,
    `Total: ${formatEur(subtotal + shipping)}`,
  ].join('\n');
}

function EmptyCart() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        className="w-24 h-24 text-gray-300"
        aria-hidden="true"
      >
        <path
          d="M10 16h44l-5.5 28H15.5L10 16Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 16l-3-8H4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="22" cy="52" r="3" fill="currentColor" />
        <circle cx="44" cy="52" r="3" fill="currentColor" />
        <path
          d="M26 32h12M32 26v12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <h1 className="font-heading text-4xl text-navy mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 text-sm">Todavía no has añadido ningún producto.</p>
      </div>
      <Link to="/tienda">
        <Button size="lg">Ir a la tienda</Button>
      </Link>
    </div>
  );
}

function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const shipping = total > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  function handleWhatsApp() {
    const message = buildWhatsAppMessage(items, total, shipping);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-heading text-4xl text-navy mb-8">Tu carrito</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex flex-col divide-y divide-gray-200">
          {items.map(item => {
            const unitPrice = item.product.salePrice ?? item.product.price;
            return (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 py-6 first:pt-0"
              >
                <img
                  src={item.product.images[0] ?? '/placeholder.png'}
                  alt={item.product.name}
                  className="w-24 h-32 object-cover rounded shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg text-navy leading-tight">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Talla: {item.size} · Color: {item.color}
                  </p>
                  <p className="font-semibold text-navy mt-1">{formatEur(unitPrice)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                      }
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                      }
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                    <span className="ml-2 text-sm text-gray-400">
                      = {formatEur(unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product.id, item.size, item.color)}
                  className="text-gray-400 hover:text-red-500 self-start transition-colors text-sm shrink-0 mt-1"
                  aria-label={`Eliminar ${item.product.name}`}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>

        <aside className="lg:w-80 shrink-0">
          <div className="bg-gray-light p-6 rounded sticky top-24">
            <h2 className="font-heading text-2xl text-navy mb-5">Resumen</h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd>{formatEur(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Envío</dt>
                <dd className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Gratis' : formatEur(SHIPPING_COST)}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 -mt-1">
                  Envío gratis a partir de {formatEur(SHIPPING_THRESHOLD)}
                </p>
              )}
              <div className="border-t border-gray-300 mt-3 pt-3 flex justify-between font-semibold text-base text-navy">
                <dt>Total</dt>
                <dd>{formatEur(grandTotal)}</dd>
              </div>
            </dl>

            <Button size="lg" className="w-full mt-6" onClick={() => navigate('/checkout')}>
              Finalizar compra
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full mt-3"
              onClick={handleWhatsApp}
            >
              Finalizar por WhatsApp
            </Button>
            <Link to="/tienda" className="block mt-3">
              <Button variant="ghost" size="md" className="w-full">
                Seguir comprando
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
