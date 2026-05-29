import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-8xl text-navy mb-4">404</h1>
      <p className="text-gray-500 text-lg mb-8">Esta página no existe.</p>
      <Link to="/">
        <Button variant="outline" size="lg">
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
