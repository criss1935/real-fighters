'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Building2 } from 'lucide-react'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<any>(null)
  const [fights, setFights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (eventData) setEvent(eventData)

      const { data: fightsData } = await supabase
        .from('fights')
        .select(`
          *,
          red_fighter:fighters!fights_red_fighter_id_fkey(id, nombre)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true })

      if (fightsData) setFights(fightsData)
      setLoading(false)
    }
    loadData()
  }, [eventId])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Cargando evento...</div>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Evento no encontrado</p>
        <Link href="/events" className="text-red-600 hover:underline">Volver a eventos</Link>
      </div>
    </div>
  )

  const formattedDate = new Date(event.event_date).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const getResult = (fight: any) => {
    if (fight.result === 'draw') return { text: 'Empate', color: 'text-yellow-600' }
    if (fight.result === 'nc') return { text: 'Sin resultado', color: 'text-gray-500' }
    if (fight.result === 'red') return { text: 'Victoria', color: 'text-green-600' }
    return { text: 'Derrota', color: 'text-red-600' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/events" className="inline-flex items-center text-gray-600 hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a eventos
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-6 text-red-100">
            {event.org && <div className="flex items-center"><Building2 className="w-5 h-5 mr-2" /><span>{event.org}</span></div>}
            <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" /><span className="capitalize">{formattedDate}</span></div>
            {event.location && <div className="flex items-center"><MapPin className="w-5 h-5 mr-2" /><span>{event.location}</span></div>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Cartelera de Combates</h2>
            <p className="text-gray-600 mt-1">{fights.length} combate{fights.length !== 1 ? 's' : ''} registrado{fights.length !== 1 ? 's' : ''}</p>
          </div>

          {fights.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No hay combates registrados para este evento</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {fights.map((fight, index) => {
                const result = getResult(fight)
                return (
                  <div key={fight.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500">COMBATE #{index + 1}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Finalizado</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <Link href={`/fighters/${fight.red_fighter_id}`} className="text-center md:text-right">
                        <div className="font-bold text-lg text-gray-900 hover:text-red-600 transition">
                          {fight.red_fighter?.nombre || 'Desconocido'}
                        </div>
                        <div className={`text-sm font-semibold mt-1 ${result.color}`}>{result.text}</div>
                      </Link>

                      <div className="text-center">
                        <div className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg font-bold">VS</div>
                      </div>

                      <div className="text-center md:text-left">
                        <div className="font-bold text-lg text-gray-900">
                          {fight.opponent_name || 'Oponente externo'}
                        </div>
                        {fight.result === 'blue' && <div className="text-sm text-green-600 font-semibold mt-1">GANADOR</div>}
                      </div>
                    </div>

                    {fight.method && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
                          <span><strong>Método:</strong> {fight.method}</span>
                          {fight.round && <span><strong>Round:</strong> {fight.round}</span>}
                          {fight.time && <span><strong>Tiempo:</strong> {fight.time}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}