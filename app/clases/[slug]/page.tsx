'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, Users } from 'lucide-react'

export default function ClaseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [clase, setClase] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadClase() {
      const { data } = await supabase.from('config').select('data').eq('key', 'classes').single()
      if (data?.data) {
        const found = data.data.find((c: any) => c.slug === slug)
        setClase(found || null)
      }
      setLoading(false)
    }
    loadClase()
  }, [slug])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Cargando...</div></div>
  if (!clase) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-gray-600 mb-4">Clase no encontrada</p><Link href="/clases" className="text-red-600 hover:underline">Volver a clases</Link></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/clases" className="inline-flex items-center text-gray-600 hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver a Clases
          </Link>
        </div>
      </div>

      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          {clase.imageUrl ? (
            <img src={clase.imageUrl} alt={clase.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
          <div className={`absolute inset-0 ${clase.color || 'bg-red-600'} opacity-90`} />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold mb-4">{clase.name}</h1>
          <p className="text-2xl text-white/90 max-w-2xl">{clase.shortDescription}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {clase.fullDescription && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de esta clase</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{clase.fullDescription}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {clase.ageRange && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Users className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Edad Recomendada</h3>
                <p className="text-gray-700">{clase.ageRange}</p>
              </div>
            )}
            {clase.schedule?.days && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Calendar className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Días</h3>
                <p className="text-gray-700">{clase.schedule.days}</p>
              </div>
            )}
            {clase.pricing?.monthly && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Mensualidad</h3>
                <p className="text-gray-700">{clase.pricing.monthly}</p>
              </div>
            )}
          </div>

          {clase.schedule?.times?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Horarios Disponibles</h2>
              <ul className="space-y-2">
                {clase.schedule.times.map((time: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3" />{time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(clase.pricing?.monthly || clase.pricing?.inscription) && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Inversión</h2>
              <div className="space-y-4">
                {clase.pricing.monthly && (
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-700 font-semibold">Mensualidad</span>
                    <span className="text-2xl font-bold text-red-600">{clase.pricing.monthly}</span>
                  </div>
                )}
                {clase.pricing.inscription && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Inscripción</span>
                    <span className="text-lg text-gray-700">{clase.pricing.inscription}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <a href="https://wa.me/5535147658" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg">
              Agendar Clase →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}