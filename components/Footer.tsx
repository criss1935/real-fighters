export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">Real Fighters</h3>
            <p className="text-sm">
              Portal profesional de peleadores de la academia.
              Récords verificados y actualizados.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/fighters" className="hover:text-red-500 transition">Peleadores</a></li>
              <li><a href="/events" className="hover:text-red-500 transition">Eventos</a></li>
              <li><a href="#" className="hover:text-red-500 transition">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Privacidad</h3>
            <p className="text-sm">
              Todos los datos son publicados con consentimiento explícito.
              Para correcciones: <span className="text-red-500">info@realfighters.com</span>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2024 Real Fighters. Portal Demo - Versión de Presentación</p>
        </div>
      </div>
    </footer>
  );
}