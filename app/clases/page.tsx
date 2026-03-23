'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const colorMap: Record<string, string> = {
  'bg-red-600': 'bg-red-600',
  'bg-orange-600': 'bg-orange-600',
  'bg-blue-600': 'bg-blue-600',
  'bg-yellow-600': 'bg-yellow-600',
  'bg-green-600': 'bg-green-600',
  'bg-purple-600': 'bg-purple-600',
  'bg-pink-600': 'bg-pink-600',
  'bg-indigo-600': 'bg-indigo-600',
  'bg-gray-600': 'bg-gray-600',
  'bg-gray-900': 'bg-gray-900',
  'bg-red-700': 'bg-red-700',
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  async function loadClasses() {
    try {
      const { data } = await supabase
        .from('config')
        .select('data')
        .eq('key', 'classes')
        .single()

      if (data?.data) {
        setClasses(data.data)
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-4">Cargando clases...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Nuestras Clases</h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8">
            Encuentra la disciplina perfecta para ti
          </p>
          <a
            href="https://wa.me/525535147658?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20clases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
          >
            Consultar Horarios y Precios
          </a>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {classes.map((clase: any, index: number) => (
              <ClassCard key={index} clase={clase} index={index} bgColor={colorMap[clase.color] || 'bg-gray-600'} />
            ))}
          </div>
        </div>
      </section>

      {/* RFM Plan Section */}
      <section className="bg-gradient-to-r from-red-900 to-red-800 py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-bold mb-6">
              MÁS POPULAR
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Plan RFM</h2>
            <p className="text-xl text-red-100 mb-8">Acceso ilimitado a TODAS las clases</p>
            <div className="text-6xl font-bold mb-8">
              $1,600
              <span className="text-2xl font-normal">/mes</span>
            </div>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8 text-red-50">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Todas las disciplinas incluidas</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Horarios flexibles</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Acceso a todas las instalaciones</span>
              </li>
            </ul>
            <a
              href="https://wa.me/525535147658?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Plan%20RFM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white hover:bg-gray-100 text-red-900 px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Inscribirme al Plan RFM
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para Comenzar?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Agenda tu clase muestra y descubre por qué somos la mejor academia de MMA en México
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/525535147658?text=Hola%2C%20quiero%20agendar%20una%20clase%20muestra"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Agendar Clase 
            </a>
            <Link
              href="/filiales"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Ver Ubicaciones
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Componente separado para cada tarjeta de clase
function ClassCard({ clase, index, bgColor }: any) {
  const isSemiPro = clase.name?.includes('Semi Pro')
  const inscribeUrl = buildWhatsAppUrl(`Hola, quiero información sobre ${clase.name}`)
  const trialUrl = buildWhatsAppUrl(`Quiero agendar una clase de ${clase.name}`)

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        isSemiPro ? 'border-4 border-yellow-500' : ''
      } flex flex-col md:flex ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      <div className="md:w-1/2 relative h-64 md:h-auto md:min-h-[400px]">
        {clase.imageUrl ? (
          <Image src={clase.imageUrl} alt={clase.name} fill className="object-cover" />
        ) : (
          <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
            <span className="text-6xl text-white/20">🥋</span>
          </div>
        )}
      </div>

      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className={`inline-block ${bgColor} text-white px-4 py-2 rounded-lg text-sm font-bold mb-4 self-start`}>
          {clase.ageRange || 'Todas las edades'}
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">{clase.name}</h2>

        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          {clase.fullDescription || clase.shortDescription}
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">HORARIOS</h3>
          <p className="text-gray-700">
            <span className="font-semibold">{clase.schedule?.days}</span>
            {clase.schedule?.times && clase.schedule.times.length > 0 && (
              <>
                {' • '}
                {clase.schedule.times.join(' • ')}
              </>
            )}
          </p>
          {clase.schedule?.extra && <p className="text-gray-600 text-sm mt-1">{clase.schedule.extra}</p>}
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">INVERSIÓN</h3>
          <p className="text-3xl font-bold text-red-600">
            {clase.pricing?.monthly}
            {clase.pricing?.monthly?.includes('$') && (
              <span className="text-lg text-gray-600 font-normal">/mes</span>
            )}
          </p>
          {clase.pricing?.inscription && (
            <p className="text-sm text-gray-600 mt-1">Inscripción: {clase.pricing.inscription}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={inscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 ${bgColor} hover:opacity-90 text-white text-center px-6 py-3 rounded-lg font-semibold transition`}
          >
            Inscribirme
          </a>
          <a
            href={trialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 text-center px-6 py-3 rounded-lg font-semibold transition"
          >
            Clase 
          </a>
        </div>
      </div>
    </div>
  )
}

// Función helper para construir URLs de WhatsApp
function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/525535147658?text=${encoded}`
}