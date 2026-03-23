'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type StaffMember = {
  id: number
  name: string
  role: string
  type: 'coach' | 'staff'
  specialty?: string
  photo?: string
  bio?: string
  certifications?: string
}

export default function StaffPage() {
  const [staffData, setStaffData] = useState<StaffMember[]>([])
  const [activeTab, setActiveTab] = useState<'coaches' | 'staff'>('coaches')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStaffData()
  }, [])

  async function loadStaffData() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('full_name')

      if (error) throw error

      if (data) {
        // Mapear datos de Supabase
        const mapped = data.map((s: any) => {
          // Determinar tipo basado en specialty/disciplines
          const adminRoles = ['Recepcion', 'Administración', 'Administration', 'Reception']
          const isAdmin = adminRoles.some(role => 
            s.specialty?.toLowerCase().includes(role.toLowerCase()) ||
            s.disciplines?.toLowerCase().includes(role.toLowerCase())
          )

          return {
            id: s.id,
            name: s.full_name,
            role: s.specialty || s.disciplines || 'Staff',
            type: isAdmin ? 'staff' : 'coach',
            specialty: s.disciplines || s.specialty,
            photo: s.photo_url,
            bio: s.certifications, // Usar certifications como descripción
            certifications: s.certifications
          }
        })

        console.log('✅ Staff cargado:', mapped)
        setStaffData(mapped)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('ERROR cargando staff:', err)
      setLoading(false)
    }
  }

  const coaches = staffData.filter(s => s.type === 'coach')
  const staffGeneral = staffData.filter(s => s.type === 'staff')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando equipo...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Nuestro Equipo</h1>
          <p className="text-xl text-gray-600">
            Conoce a los profesionales que hacen posible Real Fighters
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex">
            <button
              onClick={() => setActiveTab('coaches')}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                activeTab === 'coaches'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👨‍🏫 Coaches e Instructores ({coaches.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                activeTab === 'staff'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👥 Staff General ({staffGeneral.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'coaches' ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Instructores y Coaches
              </h2>
              {coaches.length === 0 ? (
                <p className="text-center text-gray-600">No hay coaches registrados.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {coaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                    >
                      {/* Foto */}
                      <div className="relative h-64 bg-gray-200">
                        {coach.photo ? (
                          <Image
                            src={coach.photo}
                            alt={coach.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
                            <span className="text-6xl text-white opacity-50">🥋</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {coach.name}
                        </h3>
                        <p className="text-red-600 font-semibold mb-3">
                          {coach.role}
                        </p>
                        {coach.specialty && (
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-semibold">Disciplinas:</span> {coach.specialty}
                          </p>
                        )}
                        {coach.bio && (
                          <div className="text-gray-600 text-sm">
                            <p className="font-semibold mb-2">Certificaciones:</p>
                            <p className="line-clamp-4">{coach.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Personal Administrativo
              </h2>
              {staffGeneral.length === 0 ? (
                <p className="text-center text-gray-600">No hay personal administrativo registrado.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {staffGeneral.map((staff) => (
                    <div
                      key={staff.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                    >
                      {/* Foto */}
                      <div className="relative h-64 bg-gray-200">
                        {staff.photo ? (
                          <Image
                            src={staff.photo}
                            alt={staff.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
                            <span className="text-6xl text-white opacity-50">👤</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {staff.name}
                        </h3>
                        <p className="text-blue-600 font-semibold mb-3">
                          {staff.role}
                        </p>
                        {staff.bio && (
                          <div className="text-gray-600 text-sm">
                            <p className="font-semibold mb-2">Habilidades:</p>
                            <p className="line-clamp-4">{staff.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">¿Quieres unirte al equipo?</h3>
          <p className="mb-6 text-red-100">
            Estamos buscando profesionales apasionados por las artes marciales
          </p>
          <a
            href="https://wa.me/525535147658?text=Hola%2C%20me%20interesa%20trabajar%20en%20Real%20Fighters"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white hover:bg-gray-100 text-red-600 px-8 py-3 rounded-lg font-semibold transition"
          >
            Enviar CV
          </a>
        </div>
      </div>
    </div>
  )
}