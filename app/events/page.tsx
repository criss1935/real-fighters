'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Building2 } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })
      setEvents(data || [])
      setLoading(false)
    }
    loadEvents()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Cargando eventos...</div>
    </div>
  )

  const upcoming = events.filter(e => new Date(e.event_date) > new Date()).length
  const orgs = new Set(events.map(e => e.org).filter(Boolean)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Eventos</h1>
          <p className="text-gray-600">Historial completo de carteleras y eventos de la academia</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-1">{events.length}</div>
              <div className="text-sm text-gray-600">Eventos Totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-1">{upcoming}</div>
              <div className="text-sm text-gray-600">Próximos Eventos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-1">{orgs}</div>
              <div className="text-sm text-gray-600">Organizaciones</div>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay eventos registrados aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => {
              const isPast = new Date(event.event_date) < new Date()
              const formattedDate = new Date(event.event_date).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric'
              })
              return (
                <Link href={`/events/${event.id}`} key={event.id}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer border-l-4 border-red-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {isPast ? 'Realizado' : 'Próximo'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {event.org && <div className="flex items-center"><Building2 className="w-4 h-4 mr-2 text-gray-400" /><span>{event.org}</span></div>}
                      <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" /><span className="capitalize">{formattedDate}</span></div>
                      {event.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /><span>{event.location}</span></div>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-red-600 font-semibold text-sm">Ver cartelera →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}