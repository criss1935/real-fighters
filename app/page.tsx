import Link from 'next/link';
import { Users, Calendar, Trophy, Shield, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">24</h3>
              <p className="text-gray-600">Peleadores Activos</p>
            </div>
            <div className="p-6">
              <Calendar className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">48</h3>
              <p className="text-gray-600">Eventos Realizados</p>
            </div>
            <div className="p-6">
              <Trophy className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">156</h3>
              <p className="text-gray-600">Combates Registrados</p>
            </div>
            <div className="p-6">
              <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">78%</h3>
              <p className="text-gray-600">Tasa de Victoria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section - NUEVA */}
      {announcements.length > 0 && (
        <section className="py-16 bg-gray-50">
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
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Características del Portal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Perfiles Profesionales</h3>
              <p className="text-gray-600">
                Cada peleador tiene su perfil completo con foto, medidas, récord y historial de peleas.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Récords Automáticos</h3>
              <p className="text-gray-600">
                Los récords se calculan automáticamente desde el historial de peleas. Siempre precisos.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Eventos Organizados</h3>
              <p className="text-gray-600">
                Historial completo de eventos con todas las peleas y resultados de cada cartelera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para tener tu perfil profesional?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Únete a la academia y obtén tu ficha verificada de peleador
          </p>
          <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition">
            Contactar Academia
          </button>
        </div>
      </section>
    </div>
  );
}