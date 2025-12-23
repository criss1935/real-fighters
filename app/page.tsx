import Link from 'next/link';
import { ChevronRight, DollarSign, Calendar as CalendarIcon, Gift } from 'lucide-react';
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

export const revalidate = 60; // Revalidar cada 60 segundos

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

      {/* Clases, Costos y Promociones Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Información de la Academia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CLASES */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CalendarIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Clases</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>MMA Principiantes:</strong> Lun-Mié-Vie 7:00 PM</p>
                <p><strong>MMA Avanzado:</strong> Mar-Jue 7:00 PM</p>
                <p><strong>Jiu-Jitsu:</strong> Lun-Mié-Vie 8:30 PM</p>
                <p><strong>Muay Thai:</strong> Mar-Jue-Sáb 8:00 PM</p>
                <p><strong>BJJ:</strong> Sábados 10:00 AM</p>
              </div>
            </div>

            {/* COSTOS */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Costos</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Mensualidad:</strong> $800 MXN</p>
                <p><strong>Clase individual:</strong> $150 MXN</p>
                <p><strong>3 clases semanales:</strong> $600 MXN/mes</p>
                <p><strong>Inscripción:</strong> $200 MXN (única vez)</p>
                <p className="text-sm text-gray-500 mt-4">
                  * Descuentos disponibles para estudiantes y familias
                </p>
              </div>
            </div>

            {/* PROMOCIONES */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Promociones</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>🎁 Primera clase GRATIS</strong></p>
                <p><strong>👨‍👩‍👧 Descuento familiar:</strong> 15% en 2da inscripción</p>
                <p><strong>🎓 Estudiantes:</strong> 10% de descuento con credencial</p>
                <p><strong>⏰ Pago anticipado:</strong> 3 meses = 5% descuento</p>
                <p className="text-sm text-red-600 mt-4 font-semibold">
                  ¡Pregunta por nuestros paquetes especiales!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer con información real */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info de la academia */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Real Fighters</h3>
              <p className="text-sm mb-4">
                Portal profesional de peleadores de la academia. Récords verificados y actualizados.
              </p>
            </div>

            {/* Dirección */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Dirección</h3>
              <p className="text-sm">
                Calz. del Hueso 590, Coapa,<br />
                Los Girasoles, Coyoacán, 04920<br />
                Ciudad de México, CDMX
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
              <div className="space-y-2 text-sm">
                <p>📞 Recepción: <a href="tel:5588419852" className="hover:text-red-500">55 8841 9852</a></p>
                <p>📱 WhatsApp: <a href="https://wa.me/5255351476588" className="hover:text-red-500">+52 55 3514 7658</a></p>
                <p>📧 <a href="mailto:hola@realfighters.mx" className="hover:text-red-500">hola@realfighters.mx</a></p>
                <p>📧 <a href="mailto:facturacion@realfighters.mx" className="hover:text-red-500">facturacion@realfighters.mx</a></p>
                <p>📧 <a href="mailto:administracion@realfighters.mx" className="hover:text-red-500">administracion@realfighters.mx</a></p>
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