import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'admin@stavjeans.com';
const ADMIN_PASSWORD = 'stavjeans2024';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('stav_admin', JSON.stringify({ token: 'mock-token', role: 'admin' }));
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-10 py-12">

        <div className="text-center mb-2">
          <span className="font-heading text-4xl tracking-widest text-navy uppercase">
            Stav Jeans
          </span>
        </div>
        <p className="text-center text-sm text-gray-400 font-body mb-10">
          Panel de administración
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 font-body">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-navy transition-colors font-body"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 font-body">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-navy transition-colors font-body"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center font-body">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow text-navy font-body font-semibold text-sm uppercase tracking-wider py-3 rounded-lg hover:opacity-90 transition-opacity mt-1 cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
