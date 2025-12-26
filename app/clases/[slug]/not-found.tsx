import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Clase no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          La clase que buscas no existe.
        </p>
        <Link 
          href="/clases"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Home className="w-5 h-5" />
          Ver todas las clases
        </Link>
      </div>
    </div>
  );
}