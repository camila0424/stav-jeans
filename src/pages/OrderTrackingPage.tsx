import { useState } from 'react';
import { trackOrder } from '../services/api';
import type { TrackedOrder } from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

type OrderStatus = TrackedOrder['status'];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'bg-yellow/20 text-yellow-800' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-800' },
  shipped:   { label: 'Enviado',    className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado',  className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado',  className: 'bg-red-100 text-red-700' },
};

function formatPrice(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function OrderTrackingPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    setNotFound(false);
    setError(null);

    try {
      const result = await trackOrder(code.replace(/^#/, ''), email);
      setOrder(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('404') || msg.toLowerCase().includes('no encontrado')) {
        setNotFound(true);
      } else {
        setError('Error al buscar el pedido. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  const statusCfg = order ? STATUS_CONFIG[order.status] : null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-heading text-4xl text-navy mb-2">Seguimiento de pedido</h1>
      <p className="text-gray-500 text-sm mb-8">
        Introduce el número de pedido y el email con el que realizaste la compra.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <div>
          <label className="block text-sm font-medium mb-1">Número de pedido</label>
          <input
            required
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="9FB9BE3D"
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email de la compra</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>
        <Button type="submit" size="lg" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Buscando...' : 'Buscar pedido'}
        </Button>
      </form>

      {loading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {notFound && !loading && (
        <div className="border border-gray-200 px-6 py-8 text-center">
          <p className="text-gray-600">
            No encontramos un pedido con esos datos. Verifica el código y el email e intenta de nuevo.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {order && !loading && statusCfg && (
        <div className="border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pedido</p>
              <p className="font-heading text-2xl text-navy">#{order.short_code}</p>
              <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
          </div>

          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Artículos</p>
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium text-navy">{item.product_name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Talla: {item.size} · Color: {item.color} · Cant: {item.quantity}
                    </p>
                  </div>
                  <span className="text-gray-600 shrink-0 ml-4">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6 py-5 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Envío</span>
              <span>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-navy pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default OrderTrackingPage;
