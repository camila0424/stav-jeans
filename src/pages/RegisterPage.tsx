import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import Button from '../components/common/Button';

type FormFields = { name: string; email: string; password: string; confirmPassword: string };

const FIELDS: { name: keyof FormFields; label: string; type: string; autoComplete: string }[] = [
  { name: 'name',            label: 'Nombre',              type: 'text',     autoComplete: 'name' },
  { name: 'email',           label: 'Email',               type: 'email',    autoComplete: 'email' },
  { name: 'password',        label: 'Contraseña',          type: 'password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', autoComplete: 'new-password' },
];

function validate(form: FormFields): string | null {
  if (!form.name.trim()) return 'El nombre es requerido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'El email no es válido.';
  if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden.';
  return null;
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormFields>({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError(null);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      navigate('/login', { state: { message: 'Cuenta creada, ya puedes entrar.' } });
    } catch {
      setError('No se pudo crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-light px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg px-8 py-10">

        <div className="text-center mb-8">
          <span className="font-heading text-3xl tracking-widest text-navy uppercase">
            Stav Jeans
          </span>
        </div>

        <h1 className="font-heading text-2xl text-navy mb-6 text-center">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {FIELDS.map(({ name, label, type, autoComplete }) => (
            <div key={name}>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                {label}
              </label>
              <input
                name={name}
                type={type}
                required
                autoComplete={autoComplete}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-navy transition-colors"
              />
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
            Registrarse
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
