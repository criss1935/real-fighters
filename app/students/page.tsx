'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [selectedGym, setSelectedGym] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedDiscipline, selectedGym])

  async function loadStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('status', 'active')
      .order('belt_level', { ascending: false })
      .order('name')

    if (data) {
      setStudents(data)
      setFilteredStudents(data)
    }
    setLoading(false)
  }

  function filterStudents() {
    let filtered = students

    // Filtro por búsqueda (nombre)
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por disciplina
    if (selectedDiscipline !== 'all') {
      filtered = filtered.filter(s => s.discipline === selectedDiscipline)
    }

    // Filtro por filial/gym
    if (selectedGym !== 'all') {
      filtered = filtered.filter(s => s.gym === selectedGym)
    }

    setFilteredStudents(filtered)
  }

  const disciplines = Array.from(new Set(students.map(s => s.discipline).filter(Boolean)))
  const gyms = Array.from(new Set(students.map(s => s.gym).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando alumnos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Nuestros Alumnos</h1>
          <p className="text-xl text-gray-600">
            {filteredStudents.length} alumno{filteredStudents.length !== 1 ? 's' : ''} activo{filteredStudents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Foto de equipo */}
        <div className="mb-8 max-w-5xl mx-auto">
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/team-photo.jpg"
              alt="Foto de Equipo Real Fighters"
              fill
              className="object-cover"
              onError={(e) => {
                // Si no existe la imagen, mostrar placeholder
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center"><span class="text-6xl text-white opacity-50">🥋</span></div>'
              }}
            />
          </div>
          <p className="text-center text-gray-600 mt-4 italic">Real Fighters - Familia Unida 🇲🇽</p>
        </div>

        {/* Leyenda de búsqueda */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <p className="text-green-900 text-center font-semibold">
            🔍 Busca alumno activo por: <span className="text-green-700">Disciplina, Filial o Nombre</span>
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
                placeholder="Ej: Juan Pérez"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por disciplina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por disciplina
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todas las disciplinas</option>
                {disciplines.map(disc => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>

            {/* Filtro por filial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por filial
              </label>
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todas las filiales</option>
                {gyms.map(gym => (
                  <option key={gym} value={gym}>{gym}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(searchTerm || selectedDiscipline !== 'all' || selectedGym !== 'all') && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDiscipline('all')
                  setSelectedGym('all')
                }}
                className="text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                ✕ Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Grid de alumnos */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron alumnos con esos criterios.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDiscipline('all')
                setSelectedGym('all')
              }}
              className="mt-4 text-green-600 hover:text-green-700 font-semibold"
            >
              Ver todos los alumnos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <div 
                key={student.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {/* Foto */}
                <div className="relative h-64 bg-gray-200">
                  {student.photo_url ? (
                    <Image
                      src={student.photo_url}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800">
                      <span className="text-6xl text-white opacity-50">👤</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {student.name}
                  </h3>
                  
                  <div className="mt-2 space-y-1">
                    {student.discipline && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Disciplina:</span> {student.discipline}
                      </p>
                    )}
                    
                    {student.belt_level && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Grado:</span>{' '}
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold">
                          {student.belt_level}
                        </span>
                      </p>
                    )}

                    {student.weight_kg && (
                      <p className="text-xs text-gray-500">
                        Peso: {student.weight_kg} kg
                      </p>
                    )}

                    {student.gym && (
                      <p className="text-xs text-gray-500">
                        📍 {student.gym}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                        ✓ Activo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}