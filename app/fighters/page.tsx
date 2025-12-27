'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

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
  activo: boolean
  record_profesional: string | null
  record_amateur: string | null
  // Récord parseado
  wins: number
  losses: number
  draws: number
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
  // Ejemplo: "2 2 0 box" → 2-2-0
  match = cleaned.match(/^(\d+)\s+(\d+)(?:\s+(\d+))?/)
  if (match) {
    return {
      wins: parseInt(match[1]) || 0,
      losses: parseInt(match[2]) || 0,
      draws: parseInt(match[3]) || 0
    }
  }
  
  // Patrón 3: Texto complejo como "Box 1 perdida pro mma 6 3 pérdidas"
  // Buscar números sueltos: el primero es wins, el segundo losses
  const numbers = cleaned.match(/\d+/g)
  if (numbers && numbers.length >= 2) {
    return {
      wins: parseInt(numbers[0]) || 0,
      losses: parseInt(numbers[1]) || 0,
      draws: numbers[2] ? parseInt(numbers[2]) : 0
    }
  }
  
  // Si solo hay un número, puede ser peleas totales o descripción
  if (numbers && numbers.length === 1) {
    // Ignorar si parece fecha o año
    const num = parseInt(numbers[0])
    if (num > 100) return { wins: 0, losses: 0, draws: 0 }
  }
  
  return { wins: 0, losses: 0, draws: 0 }
}

export default function FightersPage() {
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [filteredFighters, setFilteredFighters] = useState<Fighter[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')
  const [selectedDivision, setSelectedDivision] = useState<string>('all')
  const [selectedGym, setSelectedGym] = useState<string>('all')
  const [recordFilter, setRecordFilter] = useState<string>('all')

  // Obtener datos
  useEffect(() => {
    async function getFighters() {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .eq('activo', true)
        .order('nombre')
      
      if (error) {
        console.error('Error fetching fighters:', error)
        setLoading(false)
        return
      }

      // Parsear récords de texto
      const fightersWithRecords = (data || []).map(fighter => {
        const record = parseRecord(fighter.record_profesional)
        return {
          ...fighter,
          wins: record.wins,
          losses: record.losses,
          draws: record.draws
        }
      })
      
      setFighters(fightersWithRecords)
      setFilteredFighters(fightersWithRecords)
      setLoading(false)
    }
    
    getFighters()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = fighters

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.apodo && f.apodo.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por disciplina
    if (selectedDiscipline !== 'all') {
      filtered = filtered.filter(f => f.disciplina === selectedDiscipline)
    }

    // Filtro por división
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(f => f.division === selectedDivision)
    }

    // Filtro por gimnasio
    if (selectedGym !== 'all') {
      filtered = filtered.filter(f => f.gimnasio === selectedGym)
    }

    // Filtro por récord
    if (recordFilter !== 'all') {
      filtered = filtered.filter(f => {
        const wins = f.wins || 0
        const losses = f.losses || 0
        
        switch(recordFilter) {
          case 'more_5_wins':
            return wins > 5
          case 'less_5_wins':
            return wins < 5 && wins > 0
          case 'more_3_losses':
            return losses > 3
          case 'less_3_losses':
            return losses < 3 && losses > 0
          case 'undefeated':
            return losses === 0 && wins > 0
          case 'no_record':
            return wins === 0 && losses === 0
          default:
            return true
        }
      })
    }

    setFilteredFighters(filtered)
  }, [searchTerm, selectedDiscipline, selectedDivision, selectedGym, recordFilter, fighters])

  // Valores únicos para filtros
  const disciplines = Array.from(new Set(fighters.map(f => f.disciplina).filter(Boolean)))
  const divisions = Array.from(new Set(fighters.map(f => f.division).filter(Boolean)))
  const gyms = Array.from(new Set(fighters.map(f => f.gimnasio).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando peleadores...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Peleadores
          </h1>
          <p className="text-gray-600">
            {filteredFighters.length} de {fighters.length} peleadores
          </p>
        </div>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nombre o apodo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Disciplina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disciplina
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                {disciplines.map(d => (
                  <option key={d || 'empty'} value={d || ''}>{d}</option>
                ))}
              </select>
            </div>

            {/* División */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                División
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                {divisions.map(d => (
                  <option key={d || 'empty'} value={d || ''}>{d}</option>
                ))}
              </select>
            </div>

            {/* Filial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filial
              </label>
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                {gyms.map(g => (
                  <option key={g || 'empty'} value={g || ''}>{g}</option>
                ))}
              </select>
            </div>

            {/* Récord */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Récord
              </label>
              <select
                value={recordFilter}
                onChange={(e) => setRecordFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="undefeated">Invictos</option>
                <option value="more_5_wins">Más de 5 victorias</option>
                <option value="less_5_wins">1-5 victorias</option>
                <option value="more_3_losses">Más de 3 derrotas</option>
                <option value="less_3_losses">1-3 derrotas</option>
                <option value="no_record">Sin récord registrado</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Grid de peleadores */}
        {filteredFighters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron peleadores con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFighters.map((fighter) => (
              <Link 
                key={fighter.id} 
                href={`/fighters/${fighter.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Foto */}
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={fighter.foto_url || 'https://via.placeholder.com/400x400?text=No+Photo'}
                    alt={fighter.nombre}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Badge de récord */}
                  {(fighter.wins > 0 || fighter.losses > 0) && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg">
                      <div className="text-xs font-semibold">RÉCORD</div>
                      <div className="text-lg font-bold">
                        {fighter.wins}-{fighter.losses}{fighter.draws > 0 ? `-${fighter.draws}` : ''}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-6">
                  {/* Nombre */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {fighter.nombre}
                  </h2>
                  
                  {/* Apodo */}
                  {fighter.apodo && fighter.apodo !== 'N/A' && fighter.apodo !== '.' && (
                    <p className="text-lg text-gray-600 mb-3">
                      "{fighter.apodo}"
                    </p>
                  )}
                  
                  {/* Stats */}
                  <div className="space-y-2">
                    {/* Récord detallado */}
                    {(fighter.wins > 0 || fighter.losses > 0) && (
                      <div className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Récord Pro:</span>
                        <span className="font-semibold">
                          <span className="text-green-600">{fighter.wins}V</span>
                          {' - '}
                          <span className="text-red-600">{fighter.losses}D</span>
                          {fighter.draws > 0 && (
                            <>
                              {' - '}
                              <span className="text-gray-600">{fighter.draws}E</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Récord amateur si existe */}
                    {fighter.record_amateur && fighter.record_amateur !== '0' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Amateur:</span>
                        <span className="font-semibold text-gray-900">
                          {fighter.record_amateur}
                        </span>
                      </div>
                    )}

                    {fighter.disciplina && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disciplina:</span>
                        <span className="font-semibold text-gray-900">
                          {fighter.disciplina}
                        </span>
                      </div>
                    )}
                    
                    {fighter.division && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">División:</span>
                        <span className="font-semibold text-gray-900">
                          {fighter.division}
                        </span>
                      </div>
                    )}
                    
                    {fighter.gimnasio && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Filial:</span>
                        <span className="font-semibold text-gray-900 text-xs">
                          {fighter.gimnasio}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Ver perfil */}
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-blue-600 text-sm font-medium">
                      Ver perfil completo →
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