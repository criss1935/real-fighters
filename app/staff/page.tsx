'use client'

import { useState } from 'react'
import Image from 'next/image'

type StaffMember = {
  id: number
  name: string
  role: string
  type: 'teacher' | 'staff'
  specialty?: string
  photo?: string
  bio?: string
}

const staffData: StaffMember[] = [
  // PROFESORES
  {
    id: 1,
    name: 'Coach Principal',
    role: 'Instructor MMA',
    type: 'teacher',
    specialty: 'MMA, Muay Thai',
    bio: 'Más de 10 años de experiencia entrenando campeones.'
  },
  {
    id: 2,
    name: 'Profesor BJJ',
    role: 'Instructor Brazilian Jiu-Jitsu',
    type: 'teacher',
    specialty: 'BJJ, Grappling',
    bio: 'Cinturón negro con 15 años de experiencia.'
  },
  {
    id: 3,
    name: 'Coach Box',
    role: 'Instructor de Boxeo',
    type: 'teacher',
    specialty: 'Boxeo',
    bio: 'Ex-boxeador profesional con record de 20-5-0.'
  },
  {
    id: 4,
    name: 'Instructor CrossFit',
    role: 'Coach de CrossFit',
    type: 'teacher',
    specialty: 'CrossFit, Acondicionamiento',
    bio: 'Certificado Level 2 CrossFit.'
  },

  // STAFF GENERAL
  {
    id: 5,
    name: 'Recepcionista',
    role: 'Recepción',
    type: 'staff',
    bio: 'Atención al cliente y gestión de inscripciones.'
  },
  {
    id: 6,
    name: 'Administrador',
    role: 'Administración',
    type: 'staff',
    bio: 'Gestión administrativa y contabilidad.'
  },
  {
    id: 7,
    name: 'Nutriólogo',
    role: 'Nutrición Deportiva',
    type: 'staff',
    bio: 'Planes nutricionales personalizados para atletas.'
  }
]

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'staff'>('teachers')

  const teachers = staffData.filter(s => s.type === 'teacher')
  const staffGeneral = staffData.filter(s => s.type === 'staff')

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
              onClick={() => setActiveTab('teachers')}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                activeTab === 'teachers'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👨‍🏫 Profesores
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                activeTab === 'staff'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👥 Staff General
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'teachers' ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Instructores y Coaches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                  >
                    {/* Foto */}
                    <div className="relative h-64 bg-gray-200">
                      {teacher.photo ? (
                        <Image
                          src={teacher.photo}
                          alt={teacher.name}
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
                        {teacher.name}
                      </h3>
                      <p className="text-red-600 font-semibold mb-3">
                        {teacher.role}
                      </p>
                      {teacher.specialty && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-semibold">Especialidad:</span> {teacher.specialty}
                        </p>
                      )}
                      {teacher.bio && (
                        <p className="text-gray-600 text-sm">
                          {teacher.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Personal Administrativo
              </h2>
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
                        <p className="text-gray-600 text-sm">
                          {staff.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
            href="https://wa.me/525535147658?text=Hola,%20me%20interesa%20trabajar%20en%20Real%20Fighters"
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