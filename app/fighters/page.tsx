'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function FightersPage() {
  const [fighters, setFighters] = useState<any[]>([])
  const [filteredFighters, setFilteredFighters] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDivision, setSelectedDivision] = useState('all')
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFighters()
  }, [])

  useEffect(() => {
    filterFighters()
  }, [fighters, searchTerm, selectedDivision, selectedDiscipline])

  async function loadFighters() {
    try {
      console.log('🔍 Cargando peleadores...')
      
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .order('nombre')

      console.log('Data:', data)
      console.log('Error:', error)

      if (error) throw error

      if (data) {
        // Cargar records
        const { data: recordsData } = await supabase
          .from('fighter_records')
          .select('*')

        // Mapear con nombres correctos
        const mapped = data.map(f => ({
          id: f.id,
          name: f.nombre,
          nickname: f.apodo,
          division: f.division || f.categoria_peso,
          discipline: f.disciplina,
          gym: f.gimnasio || f.academia,
          photo_url: f.foto_perfil || f.foto_url,
          is_active: f.activo,
          fighter_records: recordsData?.filter(r => r.fighter_id === f.id) || 
                          [{ wins: 0, losses: 0, draws: 0, no_contest: 0 }]
        }))

        console.log('✅ Peleadores mapeados:', mapped)
        setFighters(mapped)
        setFilteredFighters(mapped)
      }
      
      setLoading(false)
    } catch (err: any) {
      console.error('ERROR:', err)
      alert(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  function filterFighters() {
    let filtered = fighters

    // Filtro por búsqueda (nombre o apodo)
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.nickname && f.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por división
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(f => f.division === selectedDivision)
    }

    // Filtro por disciplina
    if (selectedDiscipline !== 'all') {
      filtered = filtered.filter(f => f.discipline === selectedDiscipline)
    }

    setFilteredFighters(filtered)
  }

  const divisions = Array.from(new Set(fighters.map(f => f.division).filter(Boolean)))
  const disciplines = Array.from(new Set(fighters.map(f => f.discipline).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando peleadores...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Nuestros Peleadores</h1>
          <p className="text-xl text-gray-600">
            {filteredFighters.length} peleador{filteredFighters.length !== 1 ? 'es' : ''} activo{filteredFighters.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Leyenda de búsqueda */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <p className="text-blue-900 text-center font-semibold">
            Busca peleador por: <span className="text-blue-700">Categoría, Disciplina o Nombre</span>
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda por nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez o 'El Jaguar'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por categoría
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {divisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            {/* Filtro por disciplina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por disciplina
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas las disciplinas</option>
                {disciplines.map(disc => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(searchTerm || selectedDivision !== 'all' || selectedDiscipline !== 'all') && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDivision('all')
                  setSelectedDiscipline('all')
                }}
                className="text-red-600 hover:text-red-700 font-semibold text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Grid de peleadores */}
        {filteredFighters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron peleadores con esos criterios.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDivision('all')
                setSelectedDiscipline('all')
              }}
              className="mt-4 text-red-600 hover:text-red-700 font-semibold"
            >
              Ver todos los peleadores
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFighters.map((fighter: any) => {
              const record = fighter.fighter_records?.[0] || { wins: 0, losses: 0, draws: 0, no_contest: 0 }
              const recordString = `${record.wins}-${record.losses}-${record.draws}`

              return (
                <Link 
                  href={`/fighters/${fighter.id}`} 
                  key={fighter.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                >
                  {/* Foto */}
                  <div className="relative h-64 bg-gray-200">
                    {fighter.photo_url ? (
                      <Image
                        src={fighter.photo_url}
                        alt={fighter.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <span className="text-6xl text-white opacity-50">🥊</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {fighter.name}
                    </h3>
                    {fighter.nickname && (
                      <p className="text-sm text-gray-600 italic mb-2">"{fighter.nickname}"</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{fighter.division || 'Sin división'}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                        {recordString}
                      </span>
                    </div>

                    {fighter.discipline && (
                      <p className="text-xs text-gray-500">
                        {fighter.discipline}
                      </p>
                    )}

                    {fighter.gym && (
                      <p className="text-xs text-gray-500 mt-1">
                        {fighter.gym}
                      </p>
                    )}
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