import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import Button from '../components/common/Button';

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: conectar con createOrder del servicio
    setTimeout(() => {
      clearCart();
      navigate('/');
      setLoading(false);
    }, 1000);
  }

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading text-4xl text-navy mb-8">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            required
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección de envío</label>
          <textarea
            required
            rows={3}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy resize-none"
          />
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-semibold text-lg text-navy">
            Total: ${total.toLocaleString('es-AR')}
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
