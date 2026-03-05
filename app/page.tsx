'use client'
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* SECCIÓN 1: HERO - NEGRO CON IMAGEN DE FONDO */}
      <section className="relative min-h-screen flex items-center justify-center bg-black">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero-mma.jpg"
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
            <Link
              href="#horarios"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg"
            >
              Clases y Horarios
            </Link>
            <Link
              href="#precios"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg"
            >
              Planes y Precios
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: ÚLTIMAS NOTICIAS - GRIS OSCURO */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Últimas Noticias</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <Link href="/announcements" className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl">
              <div className="h-48 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Próximos Eventos</h3>
                <p className="text-gray-400 text-sm mb-4">Conoce los próximos combates y competencias</p>
                <span className="text-red-500 hover:text-red-400 font-semibold text-sm">
                  Leer más →
                </span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/fighters" className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Nuestros Peleadores</h3>
                <p className="text-gray-400 text-sm mb-4">Conoce a nuestros atletas de alto rendimiento</p>
                <span className="text-red-500 hover:text-red-400 font-semibold text-sm">
                  Ver peleadores →
                </span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/announcements" className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl">
              <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Anuncios Importantes</h3>
                <p className="text-gray-400 text-sm mb-4">Mantente informado sobre cambios y novedades</p>
                <span className="text-red-500 hover:text-red-400 font-semibold text-sm">
                  Leer más →
                </span>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/announcements"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              Ver Todas las Noticias
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: CLASES Y HORARIOS - NEGRO */}
      <section id="horarios" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Clases y Horarios</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Entrenamientos profesionales con los mejores coaches
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* MMA */}
            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-red-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">MMA</h3>
              <p className="text-red-100 mb-4">Artes Marciales Mixtas - Técnica completa</p>
              <div className="text-sm text-red-100 space-y-1">
                <p><strong>Adultos:</strong> Lun-Vie 7am-9am, 7pm-9pm</p>
                <p><strong>Precio:</strong> Incluido en planes</p>
              </div>
            </div>

            {/* Muay Thai */}
            <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-orange-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Muay Thai</h3>
              <p className="text-orange-100 mb-4">El arte de las 8 extremidades</p>
              <div className="text-sm text-orange-100 space-y-1">
                <p><strong>Horario:</strong> Lun-Vie 6pm-8pm</p>
                <p><strong>Precio:</strong> Incluido en planes</p>
              </div>
            </div>

            {/* BJJ */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Brazilian Jiu-Jitsu</h3>
              <p className="text-blue-100 mb-4">El arte suave - Grappling y sumisiones</p>
              <div className="text-sm text-blue-100 space-y-1">
                <p><strong>Horario:</strong> Mar-Jue-Sab 8am-10am</p>
                <p><strong>Precio:</strong> Incluido en planes</p>
              </div>
            </div>

            {/* Boxeo */}
            <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-yellow-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Boxeo</h3>
              <p className="text-yellow-100 mb-4">El noble arte del pugilismo</p>
              <div className="text-sm text-yellow-100 space-y-1">
                <p><strong>Horario:</strong> Lun-Vie 6am-8am, 6pm-8pm</p>
                <p><strong>Precio:</strong> Plan Box $1,200/mes</p>
              </div>
            </div>

            {/* CrossFit */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-green-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">CrossFit</h3>
              <p className="text-green-100 mb-4">Acondicionamiento físico funcional</p>
              <div className="text-sm text-green-100 space-y-1">
                <p><strong>Horario:</strong> Lun-Vie 6am-7am, 7pm-8pm</p>
                <p><strong>Precio:</strong> Plan CrossFit $1,200/mes</p>
              </div>
            </div>

            {/* Capoeira */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-purple-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Capoeira</h3>
              <p className="text-purple-100 mb-4">Arte marcial brasileño con música</p>
              <div className="text-sm text-purple-100 space-y-1">
                <p><strong>Horario:</strong> Sábados 10am-12pm</p>
                <p><strong>Precio:</strong> Incluido en planes</p>
              </div>
            </div>

            {/* MMA Kids */}
            <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-pink-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">MMA Kids</h3>
              <p className="text-pink-100 mb-4">Clases para niños 4-11 años</p>
              <div className="text-sm text-pink-100 space-y-1">
                <p><strong>Horario:</strong> Lun-Mie-Vie 4pm-6pm</p>
                <p><strong>Precio:</strong> Incluido en planes</p>
              </div>
            </div>

            {/* Box Kids */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl">
              <div className="w-16 h-16 bg-indigo-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Box Kids</h3>
              <p className="text-indigo-100 mb-4">Boxeo para niños y adolescentes</p>
              <div className="text-sm text-indigo-100 space-y-1">
                <p><strong>Horario:</strong> Mar-Jue 4pm-5pm</p>
                <p><strong>Precio:</strong> Incluido en planes</p>
              </div>
            </div>

            {/* Semi Pro y Profesionales */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 hover:transform hover:scale-105 transition shadow-xl border-2 border-yellow-500">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl"></span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Semi Pro y Profesionales</h3>
              <p className="text-gray-100 mb-4">Alto rendimiento para competidores</p>
              <div className="text-sm text-gray-100 space-y-1">
                <p><strong>Horario:</strong> Lun-Vie 11am-2pm, 8pm-10pm</p>
                <p><strong>Requisito:</strong> Evaluación previa</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/clases"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              Ver Todas las Clases
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: PLANES Y PRECIOS - GRIS OSCURO */}
      <section id="precios" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Planes y Precios</h2>
          <p className="text-gray-400 text-center mb-12">Encuentra el plan perfecto para ti</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Plan Básico */}
            <div className="bg-gray-800 rounded-lg p-8 hover:transform hover:scale-105 transition border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-2">Plan Básico</h3>
              <p className="text-gray-400 text-sm mb-6">Acceso a clases regulares</p>
              <div className="text-5xl font-bold text-white mb-6">
                $900<span className="text-lg text-gray-400 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Todas las clases regulares</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Uso de instalaciones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Vestuarios y duchas</span>
                </li>
              </ul>
              <a
                href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20el%20Plan%20Básico"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white hover:bg-gray-100 text-gray-900 text-center px-6 py-3 rounded-lg font-semibold transition"
              >
                Inscribirme
              </a>
            </div>

            {/* Plan Box */}
            <div className="bg-gray-800 rounded-lg p-8 hover:transform hover:scale-105 transition border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-2">Plan Box</h3>
              <p className="text-gray-400 text-sm mb-6">Especialización en Boxeo</p>
              <div className="text-5xl font-bold text-white mb-6">
                $1,200<span className="text-lg text-gray-400 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Clases de Boxeo ilimitadas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Entrenamiento técnico</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Uso de instalaciones</span>
                </li>
              </ul>
              <a
                href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20el%20Plan%20Box"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white hover:bg-gray-100 text-gray-900 text-center px-6 py-3 rounded-lg font-semibold transition"
              >
                Inscribirme
              </a>
            </div>

            {/* Plan CrossFit */}
            <div className="bg-gray-800 rounded-lg p-8 hover:transform hover:scale-105 transition border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-2">Plan CrossFit</h3>
              <p className="text-gray-400 text-sm mb-6">Acondicionamiento físico</p>
              <div className="text-5xl font-bold text-white mb-6">
                $1,200<span className="text-lg text-gray-400 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>CrossFit ilimitado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>WODs personalizados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Área de pesas completa</span>
                </li>
              </ul>
              <a
                href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20el%20Plan%20CrossFit"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white hover:bg-gray-100 text-gray-900 text-center px-6 py-3 rounded-lg font-semibold transition"
              >
                Inscribirme
              </a>
            </div>

            {/* Plan RFM - Destacado */}
            <div className="bg-gradient-to-b from-red-900 to-red-800 rounded-lg p-8 hover:transform hover:scale-105 transition border-2 border-yellow-500 relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MÁS POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Plan RFM</h3>
              <p className="text-red-100 text-sm mb-6">Acceso total ilimitado</p>
              <div className="text-5xl font-bold text-white mb-6">
                $1,600<span className="text-lg text-red-100 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-red-50 text-sm">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>TODAS las clases ilimitadas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>Acceso 7 días a la semana</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>Plan nutricional básico</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>Seguimiento personalizado</span>
                </li>
              </ul>
              <a
                href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20el%20Plan%20RFM"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white hover:bg-gray-100 text-red-900 text-center px-6 py-3 rounded-lg font-bold transition"
              >
                Inscribirme Ahora
              </a>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">¿Tienes dudas? Contáctanos por WhatsApp</p>
            <a
              href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20los%20planes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: UBICACIÓN Y CONTACTO - NEGRO */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Visítanos</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mapa */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
              <div className="h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.538257132739!2d-99.12251052662423!3d19.30243604482848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce018d14f87053%3A0xd45df628e7cb4d3!2sReal%20Fighters%20M%C3%A9xico!5e0!3m2!1ses-419!2smx!4v1772743928302!5m2!1ses-419!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Dirección</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Real Fighters México<br />
                  Calz. del Hueso 590, Coapa<br />
                  Los Girasoles, Coyoacán, 04920<br />
                  Ciudad de México, CDMX
                </p>
                <a 
                  href="https://share.google/wVhKbbWiCgj5gkGw1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
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
                    <a href="tel:+525535147658" className="hover:text-red-500 transition">
                      +52 55 3514 7658
                    </a>
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Email:</strong><br />
                    <a href="mailto:info@realfighters.mx" className="hover:text-red-500 transition">
                      info@realfighters.mx
                    </a>
                  </p>
                  <a
                    href="https://wa.me/525535147658?text=Hola,%20quiero%20más%20información"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition mt-2"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">&copy; 2024 Real Fighters México. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-500">
              Para correcciones: <a href="mailto:info@realfighters.mx" className="text-red-500 hover:underline">info@realfighters.mx</a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <Link href="/aviso-privacidad" className="text-red-500 hover:underline">
                Aviso de Privacidad
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}