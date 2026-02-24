import Link from 'next/link';
import { ChevronRight, DollarSign, Calendar as CalendarIcon, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

async function getLatestAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return data || [];
}

export const revalidate = 60;

export default async function Home() {
  const announcements = await getLatestAnnouncements();

  return (
    <div>
      {/* Hero Section con Logo de Fondo */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-32 overflow-hidden">
        {/* Logo de fondo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Image
            src="/logo-realfighters.jpg"
            alt="Real Fighters Logo"
            width={600}
            height={600}
            className="object-contain"
          />
        </div>
        
        {/* Contenido del Hero */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6">
            Real Fighters
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Portal profesional de peleadores. Perfiles verificados, récords actualizados, historial completo de combates.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/fighters"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Ver Peleadores
            </Link>
            <Link 
              href="/events"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section - ARRIBA */}
      {announcements.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Últimas Noticias
              </h2>
              {announcements.length >= 3 && (
                <Link 
                  href="/announcements"
                  className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`/announcements/${announcement.id}`}
                  className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {announcement.featured_image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={announcement.featured_image_url}
                        alt={announcement.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {announcement.excerpt || announcement.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(announcement.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-red-600 font-semibold text-sm group-hover:underline">
                        Leer más →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLASES Y HORARIOS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Clases y Horarios
            </h2>
            <p className="text-gray-600">
              Programas para todas las edades y niveles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* MMA KIDS A */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">MMA KIDS A</h3>
              <p className="text-sm text-gray-600 mb-2">Programa específico para niños de:</p>
              <p className="font-semibold text-red-600 mb-3">4 hasta 8 años de edad</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes / Miércoles / Viernes</p>
                <p><strong>Horario:</strong> 16:00 a 17:00 hrs</p>
              </div>
            </div>

            {/* MMA KIDS B */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">MMA KIDS B</h3>
              <p className="text-sm text-gray-600 mb-2">Programa específico para niños de:</p>
              <p className="font-semibold text-red-600 mb-3">8 hasta 11 años de edad</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes / Miércoles / Viernes</p>
                <p><strong>Horario:</strong> 17:00 a 18:00 hrs</p>
              </div>
            </div>

            {/* BOX KIDS B */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BOX KIDS B</h3>
              <p className="text-sm text-gray-600 mb-2">Programa específico para niños de:</p>
              <p className="font-semibold text-red-600 mb-3">6 hasta 11 años de edad</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes a Viernes</p>
                <p><strong>Horario:</strong> 17:00 a 18:00 hrs</p>
              </div>
            </div>

            {/* MMA JUVENIL A */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">MMA JUVENIL A</h3>
              <p className="text-sm text-gray-600 mb-2">Programa específico para jóvenes de:</p>
              <p className="font-semibold text-red-600 mb-3">12 hasta 15 años de edad</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes / Miércoles / Viernes</p>
                <p><strong>Horario:</strong> 18:00 a 19:00 hrs</p>
              </div>
            </div>

            {/* MMA JUVENIL B */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">MMA JUVENIL B</h3>
              <p className="text-sm text-gray-600 mb-2">Programa específico para jóvenes de:</p>
              <p className="font-semibold text-red-600 mb-3">15 hasta 17 años de edad</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes / Miércoles / Viernes</p>
                <p><strong>Horario:</strong> 19:00 a 20:00 hrs</p>
              </div>
            </div>

            {/* MMA ADULTOS */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">MMA ADULTOS</h3>
              <p className="text-sm text-gray-600 mb-2">Programa para adultos de:</p>
              <p className="font-semibold text-red-600 mb-3">18 años de edad en adelante</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes / Miércoles / Viernes</p>
                <p><strong>Horarios:</strong></p>
                <p>• 7:00 a 8:00 am</p>
                <p>• 9:00 a 10:30 am</p>
                <p>• 20:00 a 21:30 hrs</p>
              </div>
            </div>

            {/* MUAY THAI */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">MUAY THAI</h3>
              <p className="text-sm text-gray-600 mb-2">Programa para jóvenes y adultos de:</p>
              <p className="font-semibold text-red-600 mb-3">11 años de edad en adelante</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Martes / Jueves / Sábado</p>
                <p><strong>Horarios:</strong></p>
                <p>• 9:00 a 10:30 am (Sábado)</p>
                <p>• 19:00 a 20:00 hrs (Principiantes)</p>
                <p>• 20:00 a 21:30 hrs (Todos los niveles)</p>
              </div>
            </div>

            {/* BJJ */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BJJ (JIU JITSU BRASILEÑO)</h3>
              <p className="text-sm text-gray-600 mb-2">Programa para jóvenes y adultos de:</p>
              <p className="font-semibold text-red-600 mb-3">11 años de edad en adelante</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Martes y Jueves</p>
                <p><strong>Horarios:</strong></p>
                <p>• 7:00 a 8:30 am</p>
                <p>• 20:00 a 21:30 hrs</p>
              </div>
            </div>

            {/* BOXEO MEXICANO */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BOXEO MEXICANO</h3>
              <p className="text-sm text-gray-600 mb-2">Programa para jóvenes y adultos de:</p>
              <p className="font-semibold text-red-600 mb-3">10 años de edad en adelante</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes a Viernes</p>
                <p><strong>Horarios:</strong></p>
                <p>• 7:00 a 11:00 am</p>
                <p>• 18:00 a 22:00 hrs</p>
              </div>
            </div>

            {/* CROSSFIT */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">CROSSFIT</h3>
              <p className="text-sm text-gray-600 mb-2">Programa para jóvenes y adultos de:</p>
              <p className="font-semibold text-red-600 mb-3">11 años de edad en adelante</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Días:</strong> Lunes a Sábado</p>
                <p><strong>Horarios:</strong></p>
                <p>17:00 / 18:00 / 19:00 / 20:00 / 21:00 hrs</p>
              </div>
            </div>

            {/* PELEADORES PROFESIONALES */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">PELEADORES PROFESIONALES</h3>
              <p className="text-sm text-gray-600 mb-2">Entrenamiento avanzado para:</p>
              <p className="font-semibold text-red-600 mb-3">Peleadores profesionales y semi-pro</p>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Lunes a Viernes:</strong></p>
                <p>11:00 AM - 2:00 PM</p>
                <p>8:00 PM - 10:00 PM</p>
                <p className="mb-1 mt-2"><strong>Domingo:</strong></p>
                <p>12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES Y COSTOS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planes y Costos
            </h2>
            <p className="text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* PLAN BÁSICO */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-red-600 transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PLAN BÁSICO</h3>
              <p className="text-sm text-gray-600 mb-4">MMA o MUAY THAI o BJJ</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-red-600">$800</span>
                <span className="text-gray-600"> / mensual</span>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">✓ Horario Libre</p>
                <p className="text-gray-700">✓ 1 disciplina a elegir</p>
              </div>
            </div>

            {/* PLAN BOX */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-red-600 transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PLAN BOX</h3>
              <p className="text-sm text-gray-600 mb-4">Boxeo Mexicano</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-red-600">$800</span>
                <span className="text-gray-600"> / mensual</span>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">✓ Horario Libre</p>
                <p className="text-gray-700">✓ Boxeo Mexicano</p>
              </div>
            </div>

            {/* PLAN CROSSFIT */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-red-600 transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PLAN CROSSFIT</h3>
              <p className="text-sm text-gray-600 mb-4">Acondicionamiento funcional</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-red-600">$800</span>
                <span className="text-gray-600"> / mensual</span>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">✓ Horario Libre</p>
                <p className="text-gray-700">✓ CrossFit</p>
              </div>
            </div>

            {/* PLAN #RFM - DESTACADO */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-xl p-8 border-2 border-red-600 transform md:scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                MÁS POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">PLAN #RFM</h3>
              <p className="text-sm text-red-100 mb-4">Todas las disciplinas incluidas</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$1,500</span>
                <span className="text-red-100"> / mensual</span>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-white">✓ Todas las disciplinas</p>
                <p className="text-white">✓ Horario Libre</p>
                <p className="text-white">✓ Acceso ilimitado</p>
              </div>
            </div>

            {/* DAY PASS */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-red-600 transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">DAY PASS</h3>
              <p className="text-sm text-gray-600 mb-4">Acceso completo 1 día</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-red-600">$150</span>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">✓ 1 día completo</p>
                <p className="text-gray-700">✓ Todas las clases</p>
              </div>
            </div>

            {/* INSCRIPCIÓN */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 border-2 border-gray-200 col-span-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">INSCRIPCIÓN</h3>
              <p className="text-sm text-gray-600 mb-4">(Cuota Mantenimiento Anual)</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nuevos Ingreso</p>
                  <span className="text-3xl font-bold text-red-600">$1,000</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">Socio Activo</p>
                  <span className="text-3xl font-bold text-red-600">$500</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Contacto */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">¿Tienes dudas sobre los planes?</p>
            <a 
              href="https://wa.me/525588419852"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Contáctanos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dirección */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Dirección</h3>
              <p className="text-sm mb-4">
                Calz. del Hueso 590, Coapa,<br />
                Los Girasoles, Coyoacán, 04920<br />
                Ciudad de México, CDMX
              </p>
              <a 
                href="https://maps.google.com/?q=Calz.+del+Hueso+590,+Coapa,+Los+Girasoles,+Coyoacán,+04920+Ciudad+de+México"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition mt-2"
              >
                📍 Ver en Google Maps
              </a>
              <div className="mt-4">
                <h4 className="text-white font-semibold mb-2">Horarios</h4>
                <p className="text-xs">Lunes a Viernes: 7:00 AM - 10:00 PM</p>
                <p className="text-xs">Sábados: 9:00 AM - 2:00 PM</p>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
              <div className="space-y-2 text-sm">
                <p>📞 Recepción: <a href="tel:5588419852" className="hover:text-red-500">55 8841 9852</a></p>
                <p>📱 WhatsApp: <a href="https://wa.me/525588419852" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">+52 55 8841 9852</a></p>
                <p>📧 <a href="mailto:hola@realfighters.mx" className="hover:text-red-500">hola@realfighters.mx</a></p>
                <p>📧 <a href="mailto:facturacion@realfighters.mx" className="hover:text-red-500">facturacion@realfighters.mx</a></p>
                <p>📧 <a href="mailto:administracion@realfighters.mx" className="hover:text-red-500">administracion@realfighters.mx</a></p>
              </div>
            </div>

            {/* Redes Sociales y Sugerencias */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-4 mb-6">
                <a 
                  href="https://www.instagram.com/realfightersmx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition transform hover:scale-110"
                  title="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/RealFightersMexico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition transform hover:scale-110"
                  title="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-semibold mb-3">Sugerencias y Quejas</h4>
                <a 
                  href="https://wa.me/525588419852?text=Hola,%20tengo%20una%20sugerencia/queja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition"
                >
                  📝 Enviar Sugerencia/Queja
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
            <p>&copy; 2024 Real Fighters. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-500 mt-2">
              Todos los datos son publicados con consentimiento explícito. 
              Para correcciones: <a href="mailto:info@realfighters.mx" className="text-red-500 hover:underline">info@realfighters.mx</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}