import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import Button from '../components/common/Button';
import { createOrder } from '../services/api';
import type { CheckoutFormData } from '../services/api';

function formatPrice(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    notes: '',
  });

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const order = await createOrder(form, items);
      clearCart();
      navigate('/pedido-confirmado', { state: { orderId: order.id } });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al procesar el pedido. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading text-4xl text-navy mb-8">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección (calle y número)</label>
          <input
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código postal</label>
            <input
              name="postal_code"
              required
              value={form.postal_code}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notas <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            placeholder="Instrucciones especiales de entrega, referencias..."
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
            {error}
          </p>
        )}

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-semibold text-lg text-navy">
            Total: {formatPrice(total)}
          </span>
          <Button type="submit" loading={loading} size="lg">
            Confirmar pedido
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
