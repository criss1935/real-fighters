'use client'
import Image from 'next/image'
import Link from 'next/link'
import PlansSection from '@/components/PlansSection'
import ClassesSection from '@/components/ClassesSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center bg-black">
        <div className="absolute inset-0">
          <Image
            src="/banner1.jpeg"
            alt="MMA Training"
            fill
            className="object-cover opacity-30"
            priority
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Bienvenidos a<br />Real Fighters México
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Portal profesional de peleadores. Perfiles verificados, récords actualizados, historial completo de combates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#horarios" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg">
              Clases y Horarios
            </Link>
            <Link href="#precios" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg">
              Planes y Precios
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Últimas Noticias</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/announcements" className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl">
              <div className="h-48 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Próximos Eventos</h3>
                <p className="text-gray-400 text-sm mb-4">Conoce los próximos combates y competencias</p>
                <span className="text-red-500 hover:text-red-400 font-semibold text-sm">Leer más →</span>
              </div>
            </Link>

            <Link href="/fighters" className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Nuestros Peleadores</h3>
                <p className="text-gray-400 text-sm mb-4">Conoce a nuestros atletas de alto rendimiento</p>
                <span className="text-red-500 hover:text-red-400 font-semibold text-sm">Ver peleadores →</span>
              </div>
            </Link>

            <Link href="/announcements" className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl">
              <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Anuncios Importantes</h3>
                <p className="text-gray-400 text-sm mb-4">Mantente informado sobre cambios y novedades</p>
                <span className="text-red-500 hover:text-red-400 font-semibold text-sm">Leer más →</span>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link href="/announcements" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg">
              Ver Todas las Noticias
            </Link>
          </div>
        </div>
      </section>

      <section id="horarios" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Clases y Horarios</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Entrenamientos profesionales con los mejores coaches
          </p>
          <ClassesSection />
        </div>
      </section>

      <section id="precios" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Planes y Precios</h2>
          <p className="text-gray-400 text-center mb-12">Encuentra el plan perfecto para ti</p>

          <PlansSection />

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">¿Tienes dudas? Contáctanos por WhatsApp</p>
            <a href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20los%20planes" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg">
              Chatear por WhatsApp
            </a>
          </div>

          <div className="container mx-auto px-4 mt-12">
            <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-8 text-center max-w-md mx-auto shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-2">DAY PASS</h3>
              <p className="text-purple-100 text-sm mb-6">Acceso completo 1 día</p>
              <div className="text-6xl font-bold text-white mb-6">$150</div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-8 pb-12">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 text-center max-w-2xl mx-auto shadow-xl border border-gray-700">
              <h3 className="text-3xl font-bold text-white mb-2">INSCRIPCIÓN</h3>
              <p className="text-gray-300 text-sm mb-8">(Cuota Mantenimiento Anual)</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-300 font-semibold mb-3">Nuevos Ingreso</p>
                  <div className="text-4xl font-bold text-white">$1,000</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-300 font-semibold mb-3">Socio Activo</p>
                  <div className="text-4xl font-bold text-white">$500</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Visítanos</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-black rounded-lg overflow-hidden shadow-xl">
              <div className="h-96">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.538257132739!2d-99.12251052662423!3d19.30243604482848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce018d14f87053%3A0xd45df628e7cb4d3!2sReal%20Fighters%20M%C3%A9xico!5e0!3m2!1ses-419!2smx!4v1772743928302!5m2!1ses-419!2smx" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Dirección</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Real Fighters México<br />Calz. del Hueso 590, Coapa<br />Los Girasoles, Coyoacán, 04920<br />Ciudad de México, CDMX
                </p>
                <a href="https://maps.app.goo.gl/jifg5vMojdo5j72f7" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Ver en Google Maps
                </a>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Horarios</h3>
                <div className="text-gray-300 space-y-2">
                  <p>Lunes a Viernes: 7:00 AM - 10:00 PM</p>
                  <p>Sábados: 9:00 AM - 2:00 PM</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Contacto</h3>
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <strong className="text-white">Teléfono:</strong><br />
                    <a href="tel:+525535147658" className="hover:text-red-500 transition">+52 55 3514 7658</a>
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Email:</strong><br />
                    <a href="mailto:info@realfighters.mx" className="hover:text-red-500 transition">info@realfighters.mx</a>
                  </p>
                  <a href="https://wa.me/525535147658?text=Hola,%20quiero%20más%20información" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition mt-2">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">&copy; 2024 Real Fighters México. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-500">
              Para correcciones: <a href="mailto:info@realfighters.mx" className="text-red-500 hover:underline">info@realfighters.mx</a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <Link href="/aviso-privacidad" className="text-red-500 hover:underline">Aviso de Privacidad</Link>
            </p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/525535147658" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110" aria-label="Contactar por WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.196-1.624A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.887 9.887 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.106 12c0-5.457 4.437-9.894 9.894-9.894 5.457 0 9.894 4.437 9.894 9.894 0 5.457-4.437 9.894-9.894 9.894z"/>
        </svg>
      </a>

    </div>
  )
}