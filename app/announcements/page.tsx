'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  useEffect(() => {
    filterAnnouncements()
  }, [announcements, searchTerm])

  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (data) {
      setAnnouncements(data)
      setFilteredAnnouncements(data)
    }
    setLoading(false)
  }

  function filterAnnouncements() {
    if (!searchTerm) {
      setFilteredAnnouncements(announcements)
      return
    }

    const filtered = announcements.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.content && a.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    setFilteredAnnouncements(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando noticias...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Noticias y Anuncios</h1>
          <p className="text-xl text-gray-600">
            Mantente al día con las últimas noticias de Real Fighters
          </p>
        </div>

        {/* Buscador */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar noticias por título o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              Se encontraron {filteredAnnouncements.length} resultado{filteredAnnouncements.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Lista de noticias */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron noticias con ese término.' : 'No hay noticias publicadas.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
              >
                Ver todas las noticias
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnnouncements.map((announcement) => (
              <Link
                href={`/announcements/${announcement.id}`}
                key={announcement.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105"
              >
                {/* Imagen destacada */}
                <div className="relative h-48 bg-gray-200">
                  {announcement.featured_image_url ? (
                    <Image
                      src={announcement.featured_image_url}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700">
                      <span className="text-6xl text-white opacity-50">📰</span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {announcement.title}
                  </h2>

                  {announcement.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {announcement.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {new Date(announcement.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-orange-600 font-semibold hover:text-orange-700">
                      Leer más →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}