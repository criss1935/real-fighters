import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

async function getAnnouncement(id: string) {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getRelatedAnnouncements(currentId: string) {
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .eq('published', true)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(3);

  return data || [];
}

export const revalidate = 60; // Revalidar cada 60 segundos

export default async function AnnouncementPage({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncement(params.id);

  if (!announcement) {
    notFound();
  }

  const relatedAnnouncements = await getRelatedAnnouncements(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Article content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured image */}
          {announcement.featured_image_url && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={announcement.featured_image_url}
                alt={announcement.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {announcement.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(announcement.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            {announcement.author_email && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{announcement.author_email.split('@')[0]}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </article>

      {/* Related announcements */}
      {relatedAnnouncements.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Más Noticias
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedAnnouncements.map((related) => (
                <Link
                  key={related.id}
                  href={`/announcements/${related.id}`}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition group"
                >
                  {related.featured_image_url && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={related.featured_image_url}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(related.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Quieres saber más sobre nuestra academia?
          </h2>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/fighters"
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
            >
              Ver Peleadores
            </Link>
            <Link 
              href="/events"
              className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}