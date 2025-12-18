import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

async function getAllAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return data || [];
}

export const revalidate = 60; // Revalidar cada 60 segundos

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Noticias y Anuncios</h1>
          <p className="text-xl text-gray-300">
            Mantente al día con las últimas novedades de Real Fighters
          </p>
        </div>
      </div>

      {/* Announcements grid */}
      <div className="container mx-auto px-4 py-12">
        {announcements.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No hay anuncios publicados todavía.
            </p>
            <Link 
              href="/"
              className="inline-block mt-4 text-red-600 hover:text-red-700 font-semibold"
            >
              Volver al inicio →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                    {announcement.title}
                  </h2>
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
                    <span className="text-red-600 font-semibold text-sm flex items-center gap-1 group-hover:underline">
                      Leer más
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}