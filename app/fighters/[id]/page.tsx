'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Trophy, Target, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type Fighter = {
  id: number
  nombre: string
  apodo: string | null
  altura_cm: number | null
  peso_kg: number | null
  alcance_cm: number | null
  guardia: string | null
  division: string | null
  disciplina: string | null
  gimnasio: string | null
  foto_url: string | null
  record_profesional: string | null
  record_amateur: string | null
  link_tapology: string | null
  entrenador: string | null
  campeonatos: string | null
}

type Fight = {
  id: number
  event_id: number
  event_name: string
  event_date: string | null
  red_fighter_id: number
  blue_fighter_id: number
  red_fighter_name: string
  blue_fighter_name: string
  result: 'red' | 'blue' | 'draw' | 'nc'
  method: string | null
  round: number | null
  time: string | null
}

// Función para parsear récord de texto
function parseRecord(recordText: string | null): { wins: number; losses: number; draws: number } {
  if (!recordText) return { wins: 0, losses: 0, draws: 0 }
  
  // Ignorar casos sin récord
  const textLower = recordText.toLowerCase().trim()
  if (textLower === 'n/a' || textLower === '.' || textLower === '0' || textLower === 'mma') {
    return { wins: 0, losses: 0, draws: 0 }
  }
  
  // Ignorar fechas (dd/mm/yyyy o dd-mmm)
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(recordText) || /^\d{2}-[a-z]{3}$/i.test(recordText)) {
    return { wins: 0, losses: 0, draws: 0 }
  }
  
  // Tomar solo la primera línea si hay múltiples líneas
  const firstLine = recordText.split('\n')[0].trim()
  
  // Limpiar texto: quitar disciplinas, paréntesis, etc.
  let cleaned = firstLine
    .replace(/MMA|Box|Boxeo|Muay Thai|Kickboxing|BJJ|sucio|pro/gi, '')
    .replace(/\(|\)/g, '')
    .trim()
  
  // Patrón 1: "W-L-D" o "W-L" (con guiones)
  let match = cleaned.match(/(\d+)-(\d+)(?:-(\d+))?/)
  if (match) {
    return {
      wins: parseInt(match[1]) || 0,
      losses: parseInt(match[2]) || 0,
      draws: parseInt(match[3]) || 0
    }
  }
  
  // Patrón 2: "W L D" o "W L" (con espacios)
  match = cleaned.match(/^(\d+)\s+(\d+)(?:\s+(\d+))?/)
  if (match) {
    return {
      wins: parseInt(match[1]) || 0,
      losses: parseInt(match[2]) || 0,
      draws: parseInt(match[3]) || 0
    }
  }
  
  // Patrón 3: Texto complejo - extraer números
  const numbers = cleaned.match(/\d+/g)
  if (numbers && numbers.length >= 2) {
    return {
      wins: parseInt(numbers[0]) || 0,
      losses: parseInt(numbers[1]) || 0,
      draws: numbers[2] ? parseInt(numbers[2]) : 0
    }
  }
  
  // Ignorar números únicos mayores a 100 (probablemente fechas)
  if (numbers && numbers.length === 1) {
    const num = parseInt(numbers[0])
    if (num > 100) return { wins: 0, losses: 0, draws: 0 }
  }
  
  return { wins: 0, losses: 0, draws: 0 }
}

export default function FighterDetailPage() {
  const params = useParams()
  const fighterId = params.id as string

  const [fighter, setFighter] = useState<Fighter | null>(null)
  const [fights, setFights] = useState<Fight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFighterData() {
      // Obtener datos del peleador
      const { data: fighterData, error: fighterError } = await supabase
        .from('fighters')
        .select('*')
        .eq('id', fighterId)
        .single()

      if (fighterError || !fighterData) {
        console.error('Error loading fighter:', fighterError)
        setLoading(false)
        return
      }

      setFighter(fighterData)

      // Intentar obtener peleas de la tabla fights
      const { data: fightsData } = await supabase
        .from('fights')
        .select(`
          *,
          event:events(name, event_date),
          red_fighter:fighters!fights_red_fighter_id_fkey(nombre),
          blue_fighter:fighters!fights_blue_fighter_id_fkey(nombre)
        `)
        .or(`red_fighter_id.eq.${fighterId},blue_fighter_id.eq.${fighterId}`)
        .order('created_at', { ascending: false })

      if (fightsData && fightsData.length > 0) {
        const formattedFights = fightsData.map((fight: any) => ({
          id: fight.id,
          event_id: fight.event_id,
          event_name: fight.event?.name || 'Evento sin nombre',
          event_date: fight.event?.event_date || null,
          red_fighter_id: fight.red_fighter_id,
          blue_fighter_id: fight.blue_fighter_id,
          red_fighter_name: fight.red_fighter?.nombre || 'Desconocido',
          blue_fighter_name: fight.blue_fighter?.nombre || 'Desconocido',
          result: fight.result,
          method: fight.method,
          round: fight.round,
          time: fight.time
        }))
        setFights(formattedFights)
      }

      setLoading(false)
    }

    loadFighterData()
  }, [fighterId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!fighter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Peleador no encontrado</p>
          <Link href="/fighters" className="text-blue-600 hover:underline">
            Volver a peleadores
          </Link>
        </div>
      </div>
    )
  }

  const record = parseRecord(fighter.record_profesional)
  const totalFights = record.wins + record.losses + record.draws
  const winPercentage = totalFights > 0 ? ((record.wins / totalFights) * 100).toFixed(0) : '0'

  const getFightResult = (fight: Fight) => {
    const isFighterRed = fight.red_fighter_id === parseInt(fighterId)
    const isFighterBlue = fight.blue_fighter_id === parseInt(fighterId)
    
    if (fight.result === 'draw') return { text: 'Empate', color: 'text-gray-600' }
    if (fight.result === 'nc') return { text: 'Sin resultado', color: 'text-gray-500' }
    
    const won = (isFighterRed && fight.result === 'red') || (isFighterBlue && fight.result === 'blue')
    return won 
      ? { text: 'Victoria', color: 'text-green-600' }
      : { text: 'Derrota', color: 'text-red-600' }
  }

  const getOpponentName = (fight: Fight) => {
    return fight.red_fighter_id === parseInt(fighterId) 
      ? fight.blue_fighter_name 
      : fight.red_fighter_name
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con foto de fondo */}
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-gray-800">
        {fighter.foto_url && (
          <Image
            src={fighter.foto_url}
            alt={fighter.nombre}
            fill
            className="object-cover opacity-30"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-80" />
        
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-8">
          <Link 
            href="/fighters"
            className="inline-flex items-center text-white hover:text-gray-300 mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a peleadores
          </Link>
          
          <h1 className="text-5xl font-bold text-white mb-2">
            {fighter.nombre}
          </h1>
          
          {fighter.apodo && fighter.apodo !== 'N/A' && fighter.apodo !== '.' && (
            <p className="text-2xl text-gray-300 mb-4">
              "{fighter.apodo}"
            </p>
          )}
          
          {/* Récords destacados */}
          <div className="flex items-center space-x-6 text-white flex-wrap gap-4">
            {/* Récord Profesional */}
            {totalFights > 0 && (
              <div className="bg-black bg-opacity-50 px-6 py-3 rounded-lg">
                <div className="text-sm text-gray-300">Récord Profesional</div>
                <div className="text-3xl font-bold">
                  <span className="text-green-400">{record.wins}</span>
                  {' - '}
                  <span className="text-red-400">{record.losses}</span>
                  {record.draws > 0 && (
                    <>
                      {' - '}
                      <span className="text-gray-400">{record.draws}</span>
                    </>
                  )}
                </div>
                {totalFights > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {winPercentage}% victorias
                  </div>
                )}
              </div>
            )}
            
            {/* Récord Amateur */}
            {fighter.record_amateur && fighter.record_amateur !== '0' && (
              <div className="bg-black bg-opacity-50 px-6 py-3 rounded-lg">
                <div className="text-sm text-gray-300">Récord Amateur</div>
                <div className="text-xl font-bold text-white">
                  {fighter.record_amateur}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Información
              </h2>
              
              <div className="space-y-4">
                {fighter.disciplina && (
                  <div>
                    <div className="text-sm text-gray-600">Disciplina</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.disciplina}
                    </div>
                  </div>
                )}
                
                {fighter.division && (
                  <div>
                    <div className="text-sm text-gray-600">División</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.division}
                    </div>
                  </div>
                )}
                
                {fighter.gimnasio && (
                  <div>
                    <div className="text-sm text-gray-600">Filial</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.gimnasio}
                    </div>
                  </div>
                )}
                
                {fighter.entrenador && (
                  <div>
                    <div className="text-sm text-gray-600">Entrenador</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.entrenador}
                    </div>
                  </div>
                )}
                
                {fighter.altura_cm && (
                  <div>
                    <div className="text-sm text-gray-600">Altura</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.altura_cm} cm
                    </div>
                  </div>
                )}
                
                {fighter.peso_kg && (
                  <div>
                    <div className="text-sm text-gray-600">Peso</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.peso_kg} kg
                    </div>
                  </div>
                )}
                
                {fighter.alcance_cm && (
                  <div>
                    <div className="text-sm text-gray-600">Alcance</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.alcance_cm} cm
                    </div>
                  </div>
                )}
                
                {fighter.guardia && (
                  <div>
                    <div className="text-sm text-gray-600">Guardia</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {fighter.guardia}
                    </div>
                  </div>
                )}
                
                {fighter.link_tapology && fighter.link_tapology !== 'N/A' && (
                  <div>
                    <a 
                      href={fighter.link_tapology}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ver en Tapology
                    </a>
                  </div>
                )}
              </div>
              
              {/* Campeonatos */}
              {fighter.campeonatos && fighter.campeonatos !== '0' && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                    Campeonatos
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {fighter.campeonatos}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Historial */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
                Historial de Peleas
              </h2>
              
              {fights.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 mb-2">
                    No hay peleas registradas en el sistema
                  </p>
                  {(fighter.record_profesional || fighter.record_amateur) && (
                    <p className="text-sm text-gray-500">
                      Récord registrado: {fighter.record_profesional || fighter.record_amateur}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {fights.map((fight) => {
                    const result = getFightResult(fight)
                    const opponent = getOpponentName(fight)
                    
                    return (
                      <div 
                        key={fight.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {fight.event_name}
                            </h3>
                            {fight.event_date && (
                              <p className="text-sm text-gray-600">
                                {new Date(fight.event_date).toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            )}
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            result.text === 'Victoria' 
                              ? 'bg-green-100 text-green-800' 
                              : result.text === 'Derrota'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {result.text}
                          </span>
                        </div>
                        
                        <div className="text-gray-700 mb-2">
                          <strong>vs</strong> {opponent}
                        </div>
                        
                        {fight.method && (
                          <div className="text-sm text-gray-600">
                            <strong>Método:</strong> {fight.method}
                            {fight.round && ` • Round ${fight.round}`}
                            {fight.time && ` • ${fight.time}`}
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
      </div>
    </div>
  )
}