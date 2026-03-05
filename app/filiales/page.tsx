'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { X, MapPin, Phone, Mail, Clock } from 'lucide-react'

type Filial = {
  id: number
  name: string
  slug: string
  status: string
  address: string
  phone: string
  email: string
  whatsapp: string
  mapLink: string
  horarios: Record<string, string>
  servicios: string[]
  precios: Record<string, string>
  descripcion: string
  disponible: boolean
  image_url: string
}

export default function FilialesPage() {
  const [filiales, setFiliales] = useState<Filial[]>([])
  const [selectedFilial, setSelectedFilial] = useState<Filial | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFiliales()
  }, [])

  async function loadFiliales() {
    const { data } = await supabase
      .from('config')
      .select('data')
      .eq('key', 'filiales')
      .single()

    if (data?.data) {
      setFiliales(data.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando filiales...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Nuestras Filiales</h1>
          <p className="text-xl text-gray-600">
            Encuentra la ubicación más cercana a ti
          </p>
        </div>

        {/* Grid de filiales - Solo foto, nombre, dirección y WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filiales.map((filial) => (
            <div
              key={filial.id}
              onClick={() => setSelectedFilial(filial)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
            >
              {/* Foto */}
              <div className="relative h-64 bg-gray-200">
                {filial.image_url ? (
                  <Image
                    src={filial.image_url}
                    alt={filial.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
                    <span className="text-6xl text-white opacity-50">🏢</span>
                  </div>
                )}
                {!filial.disponible && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <span className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg">
                      Próximamente
                    </span>
                  </div>
                )}
              </div>

              {/* Info básica */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {filial.name}
                </h3>

                <div className="space-y-3 text-sm">
                  {/* Dirección */}
                  {filial.address && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{filial.address}</span>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {filial.whatsapp && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <a
                        href={`https://wa.me/${filial.whatsapp.replace(/\D/g, '')}?text=Hola,%20quiero%20información%20sobre%20${filial.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        {filial.whatsapp}
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedFilial(filial)}
                  className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Ver Detalles →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de detalles */}
        {selectedFilial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedFilial.name}
                </h2>
                <button
                  onClick={() => setSelectedFilial(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-6">
                {/* Imagen */}
                {selectedFilial.image_url && (
                  <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                    <Image
                      src={selectedFilial.image_url}
                      alt={selectedFilial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Descripción */}
                {selectedFilial.descripcion && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Descripción</h3>
                    <p className="text-gray-700">{selectedFilial.descripcion}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Información de contacto */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contacto</h3>
                    <div className="space-y-3">
                      {selectedFilial.address && (
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-700">{selectedFilial.address}</p>
                            {selectedFilial.mapLink && (
                              <a
                                href={selectedFilial.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 text-sm font-semibold mt-1 inline-block"
                              >
                                Ver en Google Maps →
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedFilial.phone && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                          <a
                            href={`tel:${selectedFilial.phone}`}
                            className="text-gray-700 hover:text-red-600"
                          >
                            {selectedFilial.phone}
                          </a>
                        </div>
                      )}

                      {selectedFilial.whatsapp && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                          <a
                            href={`https://wa.me/${selectedFilial.whatsapp.replace(/\D/g, '')}?text=Hola,%20quiero%20información`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-semibold"
                          >
                            WhatsApp: {selectedFilial.whatsapp}
                          </a>
                        </div>
                      )}

                      {selectedFilial.email && (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                          <a
                            href={`mailto:${selectedFilial.email}`}
                            className="text-gray-700 hover:text-red-600"
                          >
                            {selectedFilial.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horarios */}
                  {selectedFilial.horarios && Object.keys(selectedFilial.horarios).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Horarios
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(selectedFilial.horarios).map(([dia, horario]) => (
                          <div key={dia} className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700 capitalize">{dia}:</span>
                            <span className="text-gray-600">{horario}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clases/Servicios */}
                {selectedFilial.servicios && selectedFilial.servicios.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Clases Disponibles</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedFilial.servicios.map((servicio, index) => (
                        <div
                          key={index}
                          className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center text-sm font-semibold text-red-700"
                        >
                          {servicio}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precios */}
                {selectedFilial.precios && Object.keys(selectedFilial.precios).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Precios</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {Object.entries(selectedFilial.precios).map(([plan, precio]) => (
                        <div key={plan} className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold capitalize">{plan}:</span>
                          <span className="text-red-600 font-bold text-lg">{precio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {selectedFilial.whatsapp && (
                    <a
                      href={`https://wa.me/${selectedFilial.whatsapp.replace(/\D/g, '')}?text=Hola,%20quiero%20inscribirme%20en%20${selectedFilial.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition"
                    >
                      💬 Inscribirme por WhatsApp
                    </a>
                  )}
                  {selectedFilial.mapLink && (
                    <a
                      href={selectedFilial.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition"
                    >
                      📍 Cómo Llegar
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}