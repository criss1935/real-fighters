'use client'

import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

type Student = {
  id: number
  name: string
  email: string | null
  phone: string | null
  birth_date: string | null
  weight_kg: number | null
  height_cm: number | null
  discipline: string | null
  belt_level: string | null
  enrollment_date: string
  gym: string | null
  status: string
  photo_url: string | null
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')
  const [selectedGym, setSelectedGym] = useState<string>('all')

  // Obtener datos
  useEffect(() => {
    async function getStudents() {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('name')
      
      if (error) {
        console.error('Error fetching students:', error)
        setLoading(false)
        return
      }
      
      setStudents(data || [])
      setFilteredStudents(data || [])
      setLoading(false)
    }
    
    getStudents()
  }, [])

  // Aplicar filtros
  useEffect(() => {
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

    // Filtro por gimnasio/filial
    if (selectedGym !== 'all') {
      filtered = filtered.filter(s => s.gym === selectedGym)
    }

    setFilteredStudents(filtered)
  }, [searchTerm, selectedDiscipline, selectedGym, students])

  // Obtener valores únicos para los filtros
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Alumnos
          </h1>
          <p className="text-gray-600">
            {filteredStudents.length} de {students.length} alumnos activos
          </p>
        </div>
        
        {/* Filtros */}
        {students.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nombre..."
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
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        /* Mensaje cuando no hay alumnos */
        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aún no hay alumnos registrados
              </h3>
              <p className="text-gray-600">
                Los alumnos aparecerán aquí una vez que se complete el formulario de registro.
              </p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron alumnos con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Foto */}
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={student.photo_url || 'https://via.placeholder.com/400x400?text=Sin+Foto'}
                    alt={student.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {student.name}
                  </h2>
                  
                  <div className="space-y-2">
                    {student.discipline && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disciplina:</span>
                        <span className="font-semibold text-gray-900">{student.discipline}</span>
                      </div>
                    )}
                    
                    {student.belt_level && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Nivel:</span>
                        <span className="font-semibold text-gray-900">{student.belt_level}</span>
                      </div>
                    )}
                    
                    {student.weight_kg && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Peso:</span>
                        <span className="font-semibold text-gray-900">{student.weight_kg} kg</span>
                      </div>
                    )}
                    
                    {student.height_cm && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Altura:</span>
                        <span className="font-semibold text-gray-900">{student.height_cm} cm</span>
                      </div>
                    )}
                    
                    {student.gym && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Filial:</span>
                        <span className="font-semibold text-gray-900">{student.gym}</span>
                      </div>
                    )}
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