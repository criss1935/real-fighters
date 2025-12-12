import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'

type Fighter = {
  id: number
  name: string
  nickname: string | null
  height_cm: number | null
  weight_kg: number | null
  division: string | null
  discipline: string | null
  gym: string | null
  photo_url: string | null
  is_active: boolean
}

type FighterRecord = {
  wins: number
  losses: number
  draws: number
  no_contest: number
}

type Fight = {
  id: number
  event_id: number
  result: string
  method: string | null
  round: number | null
  time: string | null
  opponent_id: number
  opponent_name: string
  event_name: string
  event_date: string | null
  was_red_corner: boolean
}

async function getFighter(id: string): Promise<Fighter | null> {
  const { data, error } = await supabase
    .from('fighters')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching fighter:', error)
    return null
  }
  
  return data
}

async function getFighterRecord(fighterId: string): Promise<FighterRecord> {
  const { data, error } = await supabase
    .from('fighter_records')
    .select('wins, losses, draws, no_contest')
    .eq('fighter_id', fighterId)
    .single()
  
  if (error || !data) {
    return { wins: 0, losses: 0, draws: 0, no_contest: 0 }
  }
  
  return data
}

async function getFighterFights(fighterId: string): Promise<Fight[]> {
  const { data: fights, error } = await supabase
    .from('fights')
    .select(`
      id,
      event_id,
      red_fighter_id,
      blue_fighter_id,
      result,
      method,
      round,
      time,
      events (
        id,
        name,
        event_date
      )
    `)
    .or(`red_fighter_id.eq.${fighterId},blue_fighter_id.eq.${fighterId}`)
    .order('id', { ascending: false })
  
  if (error || !fights) {
    return []
  }

  // Obtener información de los oponentes
  const fightsWithOpponents = await Promise.all(
    fights.map(async (fight: any) => {
      const wasRedCorner = fight.red_fighter_id.toString() === fighterId
      const opponentId = wasRedCorner ? fight.blue_fighter_id : fight.red_fighter_id
      
      const { data: opponent } = await supabase
        .from('fighters')
        .select('name')
        .eq('id', opponentId)
        .single()
      
      return {
        id: fight.id,
        event_id: fight.event_id,
        result: fight.result,
        method: fight.method,
        round: fight.round,
        time: fight.time,
        opponent_id: opponentId,
        opponent_name: opponent?.name || 'Desconocido',
        event_name: fight.events?.name || 'Evento sin nombre',
        event_date: fight.events?.event_date,
        was_red_corner: wasRedCorner
      }
    })
  )

  return fightsWithOpponents
}

function getResultText(fight: Fight): { text: string; color: string } {
  const { result, was_red_corner } = fight
  
  if (result === 'draw') return { text: 'Empate', color: 'bg-yellow-100 text-yellow-700' }
  if (result === 'nc') return { text: 'NC', color: 'bg-gray-100 text-gray-700' }
  
  const won = (was_red_corner && result === 'red') || (!was_red_corner && result === 'blue')
  
  return won 
    ? { text: 'Victoria', color: 'bg-green-100 text-green-700' }
    : { text: 'Derrota', color: 'bg-red-100 text-red-700' }
}

export default async function FighterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const fighter = await getFighter(id)
  
  if (!fighter) {
    notFound()
  }

  const record = await getFighterRecord(id)
  const fights = await getFighterFights(id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/fighters" className="inline-flex items-center text-gray-600 hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a peleadores
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photo and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="aspect-square overflow-hidden bg-gray-200 relative">
                <Image
                  src={fighter.photo_url || 'https://via.placeholder.com/400x400?text=No+Photo'}
                  alt={fighter.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {fighter.name}
                </h1>
                {fighter.nickname && (
                  <p className="text-lg text-gray-600 italic mb-4">
                    &quot;{fighter.nickname}&quot;
                  </p>
                )}
                
                <div className="space-y-3">
                  {fighter.division && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">División:</span>
                      <span className="font-semibold text-red-600">{fighter.division}</span>
                    </div>
                  )}
                  {fighter.discipline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disciplina:</span>
                      <span className="font-semibold">{fighter.discipline}</span>
                    </div>
                  )}
                  {fighter.gym && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Filial:</span>
                      <span className="font-semibold">{fighter.gym}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-semibold ${fighter.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                      {fighter.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Fight History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Record */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Récord Profesional</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{record.wins}</div>
                  <div className="text-sm text-gray-600 mt-1">Victorias</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{record.losses}</div>
                  <div className="text-sm text-gray-600 mt-1">Derrotas</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{record.draws}</div>
                  <div className="text-sm text-gray-600 mt-1">Empates</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600">{record.no_contest}</div>
                  <div className="text-sm text-gray-600 mt-1">Sin resultado</div>
                </div>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Características Físicas</h2>
              <div className="grid grid-cols-2 gap-6">
                {fighter.height_cm && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Altura</div>
                    <div className="text-2xl font-bold text-gray-900">{fighter.height_cm} cm</div>
                  </div>
                )}
                {fighter.weight_kg && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Peso</div>
                    <div className="text-2xl font-bold text-gray-900">{fighter.weight_kg} kg</div>
                  </div>
                )}
              </div>
            </div>

            {/* Fight History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Peleas</h2>
              {fights.length > 0 ? (
                <div className="space-y-4">
                  {fights.map((fight) => {
                    const { text: resultText, color: resultColor } = getResultText(fight)
                    
                    return (
                      <div key={fight.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Link href={`/events/${fight.event_id}`} className="font-semibold text-gray-900 hover:text-red-600 transition">
                              {fight.event_name}
                            </Link>
                            {fight.event_date && (
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(fight.event_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${resultColor}`}>
                            {resultText}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">vs {fight.opponent_name}</span>
                          {fight.method && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{fight.method}</span>
                            </>
                          )}
                          {fight.round && (
                            <>
                              <span className="mx-2">•</span>
                              <span>R{fight.round}</span>
                            </>
                          )}
                          {fight.time && <span> {fight.time}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aún no hay peleas registradas para este peleador
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}