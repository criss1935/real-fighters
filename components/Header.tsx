import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold">Real Fighters</h1>
              <p className="text-xs text-gray-400">Academia de MMA</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
  <Link href="/" className="hover:text-red-500 transition">
    Inicio
  </Link>
  <Link href="/fighters" className="hover:text-red-500 transition">
    Peleadores
  </Link>
  <Link href="/students" className="hover:text-red-500 transition">
    Alumnos
  </Link>
  <Link href="/events" className="hover:text-red-500 transition">
    Eventos
  </Link>
  <Link href="/admin" className="hover:text-red-500 transition">
    Admin
  </Link>
  <Link href="/clases" className="hover:text-red-500 transition">
              Clases
              </Link>
</nav>
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}