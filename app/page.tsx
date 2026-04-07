'use client'
import Image from 'next/image'
import Link from 'next/link'
import PlansSection from '@/components/PlansSection'
import ClassesSection from '@/components/ClassesSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/banner1.jpeg" alt="MMA Training" fill className="object-cover opacity-25" priority onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="text-red-500 text-sm font-bold tracking-[0.3em] uppercase mb-6">Academia de MMA • Ciudad de México</p>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight uppercase">
            REAL<br /><span className="text-red-600">FIGHTERS</span><br />MÉXICO
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Entrena con los mejores. MMA, Muay Thai, BJJ, Boxeo y más — para todas las edades y niveles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#horarios" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 text-base font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-red-900/50">
              Clases y Horarios
            </Link>
            <Link href="#precios" className="border-2 border-white hover:bg-white hover:text-black text-white px-10 py-4 text-base font-bold uppercase tracking-widest transition-all hover:scale-105">
              Planes y Precios
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-red-600 mx-auto mb-2" />
          <div className="w-2 h-2 bg-red-600 rounded-full mx-auto" />
        </div>
      </section>

      {/* FLOATING SOCIAL BAR */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col">
        <a href="https://www.instagram.com/realfightersmx" target="_blank" rel="noopener noreferrer"
          className="bg-black border border-gray-800 hover:bg-red-600 hover:border-red-600 text-white p-3 transition-all group"
          aria-label="Instagram">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/realfightersmx" target="_blank" rel="noopener noreferrer"
          className="bg-black border border-gray-800 hover:bg-red-600 hover:border-red-600 text-white p-3 transition-all"
          aria-label="Facebook">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="https://wa.me/525535147658" target="_blank" rel="noopener noreferrer"
          className="bg-black border border-gray-800 hover:bg-red-600 hover:border-red-600 text-white p-3 transition-all"
          aria-label="WhatsApp">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.196-1.624A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.887 9.887 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.106 12c0-5.457 4.437-9.894 9.894-9.894 5.457 0 9.894 4.437 9.894 9.894 0 5.457-4.437 9.894-9.894 9.894z"/>
          </svg>
        </a>
      </div>

      {/* STATS BAR */}
      <section className="bg-red-600 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            {[['10+', 'Disciplinas'], ['500+', 'Alumnos'], ['15+', 'Coaches'], ['10+', 'Años de experiencia']].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-black">{num}</div>
                <div className="text-red-100 text-sm uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASES Y HORARIOS */}
      <section id="horarios" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">Entrena con nosotros</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Clases y Horarios</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4" />
          </div>
          <ClassesSection />
        </div>
      </section>

      {/* ÚLTIMAS NOTICIAS */}
      <section className="py-20 bg-gray-950 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">Mantente informado</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Últimas Noticias</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { href: '/announcements', title: 'Próximos Eventos', desc: 'Conoce los próximos combates y competencias', label: 'Ver eventos →' },
              { href: '/fighters', title: 'Nuestros Peleadores', desc: 'Conoce a nuestros atletas de alto rendimiento', label: 'Ver peleadores →' },
              { href: '/announcements', title: 'Anuncios Importantes', desc: 'Mantente informado sobre cambios y novedades', label: 'Leer más →' },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group bg-black border border-gray-800 hover:border-red-600 overflow-hidden transition-all hover:scale-105">
                <div className="h-40 bg-red-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-800 to-black opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-1 bg-red-600 group-hover:w-24 transition-all duration-300" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-white uppercase mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                  <span className="text-red-500 font-bold text-sm uppercase tracking-wider">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/announcements" className="inline-block border-2 border-red-600 hover:bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-widest transition-all">
              Ver Todas las Noticias
            </Link>
          </div>
        </div>
      </section>

      {/* INSCRIPCIÓN CTA */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">¿Listo para Empezar?</h2>
          <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">Agenda tu clase de prueba gratis y descubre por qué somos la mejor academia de MMA en México</p>
          <a href="https://wa.me/525535147658?text=Hola,%20quiero%20agendar%20una%20clase%20de%20prueba" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-black hover:bg-gray-900 text-white px-10 py-4 font-bold uppercase tracking-widest transition-all hover:scale-105 text-base">
            Agendar Clase de Prueba
          </a>
        </div>
      </section>

      {/* PLANES Y PRECIOS */}
      <section id="precios" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">Inversión en ti</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Planes y Precios</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4" />
          </div>

          <PlansSection />

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-10">
            <div className="border border-red-600 p-8 text-center">
              <h3 className="text-2xl font-black text-white uppercase mb-1">Day Pass</h3>
              <p className="text-gray-400 text-sm mb-4">Acceso completo 1 día</p>
              <div className="text-5xl font-black text-red-600 mb-1">$150</div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">MXN</p>
            </div>
            <div className="border border-gray-700 p-8 text-center">
              <h3 className="text-2xl font-black text-white uppercase mb-1">Inscripción</h3>
              <p className="text-gray-400 text-sm mb-4">Cuota mantenimiento anual</p>
              <div className="text-2xl font-black text-white mb-1">Nuevo ingreso <span className="text-red-600">$1,000</span></div>
              <div className="text-2xl font-black text-white">Socio activo <span className="text-red-600">$500</span></div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4 text-sm">¿Dudas sobre planes?</p>
            <a href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20los%20planes" target="_blank" rel="noopener noreferrer"
              className="inline-block border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 font-bold uppercase tracking-widest transition-all text-sm">
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* VISÍTANOS */}
      <section className="py-20 bg-gray-950 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">Encuéntranos</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Visítanos</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="h-96 border border-gray-800">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.538257132739!2d-99.12251052662423!3d19.30243604482848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce018d14f87053%3A0xd45df628e7cb4d3!2sReal%20Fighters%20M%C3%A9xico!5e0!3m2!1ses-419!2smx!4v1772743928302!5m2!1ses-419!2smx"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-[0.3em] mb-3">Dirección</h3>
                <p className="text-gray-300 leading-relaxed">Calz. del Hueso 590, Coapa<br />Los Girasoles, Coyoacán, 04920<br />Ciudad de México, CDMX</p>
                <a href="https://maps.app.goo.gl/jifg5vMojdo5j72f7" target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-4 border-2 border-red-600 hover:bg-red-600 text-white px-6 py-2 font-bold uppercase tracking-wider text-sm transition-all">
                  Ver en Google Maps
                </a>
              </div>
              <div>
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-[0.3em] mb-3">Horarios del Gimnasio</h3>
                <div className="text-gray-300 space-y-1 text-sm">
                  <p>Lunes a Viernes: 7:00 AM – 10:00 PM</p>
                  <p>Sábados: 9:00 AM – 2:00 PM</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-[0.3em] mb-3">Contacto</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Tel: <a href="tel:+525535147658" className="text-white hover:text-red-500 transition">+52 55 3514 7658</a></p>
                  <p>Email: <a href="mailto:hola@realfighters.mx" className="text-white hover:text-red-500 transition">hola@realfighters.mx</a></p>
                </div>
                <a href="https://wa.me/525535147658?text=Hola,%20quiero%20más%20información" target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-bold uppercase tracking-wider text-sm transition-all">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-900 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-black text-white uppercase mb-2">Real Fighters <span className="text-red-600">México</span></div>
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">Academia de MMA • Est. 2014</p>
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://www.instagram.com/realfightersmx" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition text-xs uppercase tracking-wider">Instagram</a>
            <a href="https://www.facebook.com/realfightersmx" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition text-xs uppercase tracking-wider">Facebook</a>
            <Link href="/aviso-privacidad" className="text-gray-500 hover:text-red-500 transition text-xs uppercase tracking-wider">Privacidad</Link>
          </div>
          <p className="text-gray-700 text-xs">&copy; 2025 Real Fighters México. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <a href="https://wa.me/525535147658" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg shadow-red-900/50 transition-transform hover:scale-110"
        aria-label="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.196-1.624A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.887 9.887 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.106 12c0-5.457 4.437-9.894 9.894-9.894 5.457 0 9.894 4.437 9.894 9.894 0 5.457-4.437 9.894-9.894 9.894z"/>
        </svg>
      </a>
    </div>
  )
}