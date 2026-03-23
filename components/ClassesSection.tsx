'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

const colorMap: any = {
  'bg-red-600': { bg: 'from-red-900 to-red-800', icon: 'bg-red-700', text: 'text-red-100' },
  'bg-orange-600': { bg: 'from-orange-900 to-orange-800', icon: 'bg-orange-700', text: 'text-orange-100' },
  'bg-blue-600': { bg: 'from-blue-900 to-blue-800', icon: 'bg-blue-700', text: 'text-blue-100' },
  'bg-yellow-600': { bg: 'from-yellow-900 to-yellow-800', icon: 'bg-yellow-700', text: 'text-yellow-100' },
  'bg-green-600': { bg: 'from-green-900 to-green-800', icon: 'bg-green-700', text: 'text-green-100' },
  'bg-purple-600': { bg: 'from-purple-900 to-purple-800', icon: 'bg-purple-700', text: 'text-purple-100' },
  'bg-pink-600': { bg: 'from-pink-900 to-pink-800', icon: 'bg-pink-700', text: 'text-pink-100' },
  'bg-indigo-600': { bg: 'from-indigo-900 to-indigo-800', icon: 'bg-indigo-700', text: 'text-indigo-100' },
  'bg-gray-600': { bg: 'from-gray-900 to-gray-800', icon: 'bg-yellow-600', text: 'text-gray-100' }
}

export default function ClassesSection() {
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
    return <div className="text-center text-gray-400 py-12">Cargando clases...</div>
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {classes.map((clase: any, idx: number) => {
          const colors = colorMap[clase.color] || colorMap['bg-gray-600']
          const isSemiPro = clase.name.includes('Semi Pro')
          
          return (
            <div 
              key={idx}
              className={`bg-gradient-to-br ${colors.bg} rounded-lg overflow-hidden hover:transform hover:scale-105 transition shadow-xl ${isSemiPro ? 'border-2 border-yellow-500' : ''}`}
            >
              {/* IMAGEN */}
              {clase.imageUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={clase.imageUrl}
                    alt={clase.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className={`h-48 ${colors.icon} flex items-center justify-center`}>
                  <div className="w-16 h-16 bg-black/20 rounded-lg"></div>
                </div>
              )}
              
              {/* CONTENIDO */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{clase.name}</h3>
                <p className={`${colors.text} mb-4`}>{clase.shortDescription}</p>
                
                <div className={`text-sm ${colors.text} space-y-1`}>
                  <p><strong>Horario:</strong> {clase.schedule.days}</p>
                  {clase.schedule.times?.map((time: string, i: number) => (
                    <p key={i}>{time}</p>
                  ))}
                  <p><strong>Precio:</strong> {clase.pricing.monthly}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/clases"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg"
        >
          Ver Todas las Clases
        </Link>
      </div>
    </>
  )
}