import { useState } from 'react';
import Button from '../../components/common/Button';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: conectar con endpoint del backend
    setSubmitted(true);
  }

  return (
    <section className="bg-gray-light py-16 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-heading text-4xl text-navy mb-3">Suscribite</h2>
        <p className="text-gray-600 mb-8">
          Recibí novedades y descuentos exclusivos en tu correo
        </p>
        {submitted ? (
          <p className="text-blue font-medium">¡Gracias por suscribirte!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy"
            />
            <Button type="submit" variant="primary">
              Suscribirse
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export default NewsletterSection;
