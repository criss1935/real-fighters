'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

type Fighter = {
  id: number
  name: string
  nickname: string | null
  height_cm: number
  weight_kg: number
  reach_cm: number | null
  stance: string
  division: string
  discipline: string | null
  gym: string
  photo_url: string | null
  is_active: boolean
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

  // Obtener datos
  useEffect(() => {
    async function getFighters() {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) {
        console.error('Error fetching fighters:', error)
        setLoading(false)
        return
      }
      
      setFighters(data || [])
      setFilteredFighters(data || [])
      setLoading(false)
    }
    
    getFighters()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = fighters

    // Filtro por búsqueda (nombre o apodo)
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.nickname && f.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por disciplina
    if (selectedDiscipline !== 'all') {
      filtered = filtered.filter(f => f.discipline === selectedDiscipline)
    }

    // Filtro por división
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(f => f.division === selectedDivision)
    }

    // Filtro por gimnasio/filial
    if (selectedGym !== 'all') {
      filtered = filtered.filter(f => f.gym === selectedGym)
    }

    setFilteredFighters(filtered)
  }, [searchTerm, selectedDiscipline, selectedDivision, selectedGym, fighters])

  // Obtener valores únicos para los filtros
  const disciplines = Array.from(new Set(fighters.map(f => f.discipline).filter(Boolean)))
  const divisions = Array.from(new Set(fighters.map(f => f.division).filter(Boolean)))
  const gyms = Array.from(new Set(fighters.map(f => f.gym).filter(Boolean)))

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <option key={d} value={d!}>{d}</option>
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
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Filial (Gimnasio) */}
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
                  <option key={g} value={g}>{g}</option>
                ))}
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
                    src={fighter.photo_url || 'https://via.placeholder.com/400x400?text=No+Photo'}
                    alt={fighter.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="p-6">
                  {/* Nombre */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {fighter.name}
                  </h2>
                  
                  {/* Apodo */}
                  {fighter.nickname && (
                    <p className="text-lg text-gray-600 mb-3">
                      "{fighter.nickname}"
                    </p>
                  )}
                  
                  {/* Stats rápidas */}
                  <div className="space-y-2">
                    {fighter.discipline && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disciplina:</span>
                        <span className="font-semibold text-gray-900">
                          {fighter.discipline}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">División:</span>
                      <span className="font-semibold text-gray-900">
                        {fighter.division}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Filial:</span>
                      <span className="font-semibold text-gray-900">
                        {fighter.gym}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-semibold text-gray-900">
                        {fighter.weight_kg} kg
                      </span>
                    </div>
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