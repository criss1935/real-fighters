'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Trophy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

function calcularEdad(fechaNacimiento?: string | null): number | null {
  if (!fechaNacimiento) return null
  const nacimiento = new Date(fechaNacimiento + 'T00:00:00')
  if (isNaN(nacimiento.getTime())) return null
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--
  return edad >= 0 && edad < 120 ? edad : null
}

function formatearFecha(fecha?: string | null): string {
  if (!fecha) return ''
  const d = new Date(fecha + 'T00:00:00')
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

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
  nivel: string | null
  records: { disciplina: string; record: string }[] | null
  link_tapology: string | null
  fecha_nacimiento: string | null
  entrenador: string | null
  campeonatos: { titulo: string; liga: string; fecha: string }[] | null
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
          
          {/* Nivel + récords por disciplina */}
          {fighter.nivel && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded bg-red-600 text-white">
                {fighter.nivel}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-6 text-white flex-wrap gap-4">
            {Array.isArray(fighter.records) && fighter.records.length > 0 ? (
              fighter.records.map((r, i) => (
                <div key={i} className="bg-black bg-opacity-50 px-6 py-3 rounded-lg">
                  <div className="text-sm text-gray-300">{r.disciplina}</div>
                  <div className="text-3xl font-bold text-white">{r.record}</div>
                </div>
              ))
            ) : (
              <>
                {/* Fallback: modelo anterior */}
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
                    <div className="text-xs text-gray-400 mt-1">
                      {winPercentage}% victorias
                    </div>
                  </div>
                )}

                {fighter.record_amateur && fighter.record_amateur !== '0' && (
                  <div className="bg-black bg-opacity-50 px-6 py-3 rounded-lg">
                    <div className="text-sm text-gray-300">Récord Amateur</div>
                    <div className="text-xl font-bold text-white">
                      {fighter.record_amateur}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Columna izquierda - Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
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
                
                {calcularEdad(fighter.fecha_nacimiento) !== null && (
                  <div>
                    <div className="text-sm text-gray-600">Edad</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {calcularEdad(fighter.fecha_nacimiento)} años
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatearFecha(fighter.fecha_nacimiento)}
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
              {Array.isArray(fighter.campeonatos) && fighter.campeonatos.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                    Campeonatos
                  </h3>
                  <ul className="space-y-2">
                    {fighter.campeonatos.map((c: any, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3"
                      >
                        <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">{c.titulo}</p>
                          {(c.liga || c.fecha) && (
                            <p className="text-sm text-gray-600">
                              {c.liga}
                              {c.liga && c.fecha && ' · '}
                              {c.fecha}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}