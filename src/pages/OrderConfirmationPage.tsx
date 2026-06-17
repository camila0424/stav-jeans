import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-heading text-4xl text-navy mb-4">¡Pedido confirmado!</h1>

      {orderId != null && (
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold text-navy">
            Pedido #{orderId.slice(0, 8).toUpperCase()}
          </span>
        </p>
      )}

      <p className="text-gray-600 leading-relaxed mb-8">
        Gracias por tu compra. En breve nos pondremos en contacto contigo para
        coordinar el pago y confirmar el envío.
      </p>

      <div className="bg-gray-50 border border-gray-200 px-6 py-5 text-left mb-8">
        <h2 className="font-semibold text-navy mb-3">Instrucciones de pago</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          El pago se realiza por <strong>Bizum o transferencia bancaria</strong>.
          Contáctanos para recibir los datos de pago:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://wa.me/34663577485"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-medium hover:underline"
            >
              WhatsApp: +34 663 577 485
            </a>
          </li>
          <li>
            <a
              href="mailto:stavjeans2021@gmail.com"
              className="text-navy font-medium hover:underline"
            >
              stavjeans2021@gmail.com
            </a>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate('/tienda')}>
          Seguir comprando
        </Button>
        <Link
          to="/seguimiento"
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-navy border border-navy hover:bg-navy hover:text-white transition-colors"
        >
          Seguir mi pedido
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
