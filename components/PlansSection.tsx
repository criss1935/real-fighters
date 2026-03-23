'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PlansSection() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    try {
      const { data } = await supabase
        .from('config')
        .select('data')
        .eq('key', 'plans')
        .single()

      if (data?.data) {
        setPlans(data.data)
      }
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Cargando planes...</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {plans.map((plan: any) => (
        <div
          key={plan.id}
          className={`rounded-lg p-8 hover:transform hover:scale-105 transition shadow-xl ${
            plan.highlighted
              ? 'bg-gradient-to-b from-red-900 to-red-800 border-2 border-yellow-500 relative'
              : 'bg-gray-800 border border-gray-700'
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                MÁS POPULAR
              </span>
            </div>
          )}

          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

          <p className={`text-sm mb-6 ${plan.highlighted ? 'text-red-100' : 'text-gray-400'}`}>
            {plan.subtitle}
          </p>

          <div className="text-5xl font-bold text-white mb-6">
            {plan.price}
            <span className={`text-lg font-normal ${plan.highlighted ? 'text-red-100' : 'text-gray-400'}`}>
              /{plan.period}
            </span>
          </div>

          <ul className={`space-y-3 mb-8 text-sm ${plan.highlighted ? 'text-red-50' : 'text-gray-300'}`}>
            {plan.features?.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className={`mr-2 ${plan.highlighted ? 'text-yellow-400' : 'text-green-500'}`}>✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/525535147658?text=${encodeURIComponent(
              `Hola, quiero información sobre ${plan.name}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
              plan.highlighted
                ? 'bg-white hover:bg-gray-100 text-red-900 font-bold'
                : 'bg-white hover:bg-gray-100 text-gray-900'
            }`}
          >
            Inscribirme{plan.highlighted && ' Ahora'}
          </a>
        </div>
      ))}
    </div>
  )
}