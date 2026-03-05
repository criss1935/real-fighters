'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ClassesPage() {
  const classes = [
    {
      slug: 'mma',
      name: 'MMA',
      ageRange: 'Adultos',
      shortDescription: 'Artes Marciales Mixtas - Técnica completa de striking y grappling',
      fullDescription: 'Las artes marciales mixtas combinan lo mejor del striking (golpes) y el grappling (lucha). Aprenderás técnicas de múltiples disciplinas incluyendo boxeo, muay thai, wrestling y jiu-jitsu brasileño. Entrenamiento completo que desarrolla fuerza, resistencia y habilidades de combate.',
      schedule: {
        days: 'Lunes a Viernes',
        times: ['7:00 a 9:00 hrs', '19:00 a 21:00 hrs']
      },
      pricing: {
        monthly: '$900',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-red-600',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSXQCY0_EpcnC-aD55TgOP4QOLWXEreS7DqA&s'
    },
    {
      slug: 'muay-thai',
      name: 'Muay Thai',
      ageRange: 'Adultos',
      shortDescription: 'El arte de las 8 extremidades - El striking más completo',
      fullDescription: 'El Muay Thai es conocido como el arte de las 8 extremidades porque utiliza puños, codos, rodillas y piernas. Desarrollarás una técnica de striking devastadora mientras mejoras tu condición física y mental. Ideal para defensa personal y competencia.',
      schedule: {
        days: 'Lunes a Viernes',
        times: ['18:00 a 20:00 hrs']
      },
      pricing: {
        monthly: '$900',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-orange-600',
      imageUrl: 'https://www.warriorsbarcelona.com/wp-content/uploads/2023/05/muay-thai-1-999x675.jpg'
    },
    {
      slug: 'bjj',
      name: 'Brazilian Jiu-Jitsu',
      ageRange: 'Adultos',
      shortDescription: 'El arte suave - Grappling y sumisiones de nivel mundial',
      fullDescription: 'El Brazilian Jiu-Jitsu es un arte marcial basado en el grappling y la lucha en el suelo. Aprenderás a controlar y someter oponentes usando técnica y palancas en lugar de fuerza bruta. Excelente para competencia deportiva y defensa personal efectiva.',
      schedule: {
        days: 'Martes / Jueves / Sábado',
        times: ['8:00 a 10:00 hrs']
      },
      pricing: {
        monthly: '$900',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-blue-600',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_16TvoAskTlwrlFgUH_L4DWhEFGEH0c7N_g&s'
    },
    {
      slug: 'boxeo',
      name: 'Boxeo',
      ageRange: 'Adultos',
      shortDescription: 'El noble arte - Técnica de golpeo con manos',
      fullDescription: 'El boxeo desarrolla velocidad, precisión y movimiento de pies. Aprenderás combinaciones de golpes, defensa, esquivas y contra-ataques. Excelente acondicionamiento cardiovascular y desarrollo de reflejos.',
      schedule: {
        days: 'Lunes a Viernes',
        times: ['6:00 a 8:00 hrs', '18:00 a 20:00 hrs']
      },
      pricing: {
        monthly: '$1,200',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-yellow-600',
      imageUrl: ''
    },
    {
      slug: 'crossfit',
      name: 'CrossFit',
      ageRange: 'Adultos',
      shortDescription: 'Acondicionamiento físico funcional de alta intensidad',
      fullDescription: 'CrossFit combina levantamiento de pesas, ejercicios cardiovasculares y gimnasia. Entrenamientos variados e intensos (WODs) que mejoran fuerza, resistencia, flexibilidad y coordinación. Perfecto como complemento para artes marciales o fitness general.',
      schedule: {
        days: 'Lunes a Viernes',
        times: ['6:00 a 7:00 hrs', '19:00 a 20:00 hrs']
      },
      pricing: {
        monthly: '$1,200',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-green-600',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Ve3p-30JD0NZYr3rGGiVPSkQrJ504AHb2g&s'
    },
    {
      slug: 'capoeira',
      name: 'Capoeira',
      ageRange: 'Todas las edades',
      shortDescription: 'Arte marcial brasileño con música, acrobacia y cultura',
      fullDescription: 'La Capoeira es un arte marcial afrobrasileño que combina elementos de danza, acrobacia y música. Desarrolla flexibilidad, equilibrio, ritmo y expresión corporal mientras aprendes movimientos fluidos y espectaculares.',
      schedule: {
        days: 'Sábados',
        times: ['10:00 a 12:00 hrs']
      },
      pricing: {
        monthly: 'Incluido en planes',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-purple-600',
      imageUrl: 'data:image/jpeg;base64,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'
    },
    {
      slug: 'mma-kids-a',
      name: 'MMA Kids A',
      ageRange: '4 a 7 años',
      shortDescription: 'Introducción a las artes marciales para niños pequeños',
      fullDescription: 'Las artes marciales mixtas para niños pequeños se enfocan en desarrollo motor, disciplina y diversión. Movimientos básicos adaptados a su edad que mejoran coordinación, confianza y respeto.',
      schedule: {
        days: 'Lunes / Miércoles / Viernes',
        times: ['16:00 a 17:00 hrs']
      },
      pricing: {
        monthly: '$800',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-pink-600',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR89ZNAYcdQBZKZUvPEkZfcEP4LGQIHTeBzuA&s'
    },
    {
      slug: 'mma-kids-b',
      name: 'MMA Kids B',
      ageRange: '8 a 11 años',
      shortDescription: 'Técnica y disciplina para niños intermedios',
      fullDescription: 'Los niños en este rango desarrollan técnica más avanzada de MMA. Aprenden combinaciones, movimientos de grappling básico y valores como perseverancia, trabajo en equipo y auto-control.',
      schedule: {
        days: 'Lunes / Miércoles / Viernes',
        times: ['17:00 a 18:00 hrs']
      },
      pricing: {
        monthly: '$800',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-indigo-600',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlIxBF0XsSgPbTjgOPFTrBcP4tZpln4fJ0Zw&s'
    },
    {
      slug: 'box-kids',
      name: 'Box Kids',
      ageRange: '6 hasta 11 años de edad',
      shortDescription: 'Boxeo para niños y adolescentes - Técnica y disciplina',
      fullDescription: 'El boxeo es un arte marcial basado en el uso técnico de los puños, el movimiento de pies y la defensa. Los niños aprenden disciplina, coordinación y autoconfianza mientras desarrollan habilidades atléticas fundamentales.',
      schedule: {
        days: 'Lunes a Viernes',
        times: ['17:00 a 18:00 hrs']
      },
      pricing: {
        monthly: '$800',
        inscription: '$1,000 (Nuevos) / $500 (Socios activos)'
      },
      color: 'bg-red-700',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5Y3gd24FouB1uWSX4LpZ1gx6L5jPAm-UlMA&s'
    },
    {
      slug: 'semi-pro',
      name: 'Semi Pro y Profesionales',
      ageRange: 'Competidores',
      shortDescription: 'Entrenamiento de alto rendimiento para peleadores',
      fullDescription: 'Programa especializado para atletas que compiten o buscan llevar sus habilidades al siguiente nivel. Incluye preparación física específica, trabajo técnico avanzado, estrategia de combate y sparring controlado. Requiere evaluación previa.',
      schedule: {
        days: 'Lunes a Viernes',
        times: ['11:00 a 14:00 hrs', '20:00 a 22:00 hrs'],
        extra: 'Domingos 12:00 a 14:00 hrs'
      },
      pricing: {
        monthly: 'Evaluación requerida',
        inscription: 'Consultar'
      },
      color: 'bg-gray-900',
      imageUrl: 'data:image/jpeg;base64,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',
      featured: true
    }
  ]

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
            href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20las%20clases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
          >
            Consultar Horarios y Precios
          </a>
        </div>
      </section>

      {/* Lista de Clases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {classes.map((clase, index) => (
              <div
                key={clase.slug}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  clase.featured ? 'border-4 border-yellow-500' : ''
                } ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex`}
              >
                {/* Imagen */}
                <div className="md:w-1/2 relative h-64 md:h-auto min-h-[400px]">
                  <Image
                    src={clase.imageUrl}
                    alt={clase.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className={`inline-block ${clase.color} text-white px-4 py-2 rounded-lg text-sm font-bold mb-4 self-start`}>
                    {clase.ageRange}
                  </div>

                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {clase.name}
                  </h2>

                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {clase.fullDescription}
                  </p>

                  {/* Horarios */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      HORARIOS
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-semibold">{clase.schedule.days}</span>
                      {' • '}
                      {clase.schedule.times.join(' • ')}
                    </p>
                    {clase.schedule.extra && (
                      <p className="text-gray-600 text-sm mt-1">{clase.schedule.extra}</p>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      INVERSIÓN
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      {clase.pricing.monthly}
                      {clase.pricing.monthly.includes('$') && (
                        <span className="text-lg text-gray-600 font-normal">/mes</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Inscripción: {clase.pricing.inscription}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={`https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20${clase.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 ${clase.color} hover:opacity-90 text-white text-center px-6 py-3 rounded-lg font-semibold transition`}
                    >
                      Inscribirme
                    </a>
                    <a
                      href={`https://wa.me/525535147658?text=Quiero%20agendar%20una%20clase%20${clase.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 text-center px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Clase
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan RFM - Sección especial */}
      <section className="bg-gradient-to-r from-red-900 to-red-800 py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-bold mb-6">
              MÁS POPULAR
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Plan #RFM</h2>
            <p className="text-xl text-red-100 mb-8">
              Acceso ilimitado a TODAS las clases
            </p>
            <div className="text-6xl font-bold mb-8">
              $1,600<span className="text-2xl font-normal">/mes</span>
            </div>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8 text-red-50">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Todas las disciplinas incluidas (MMA, Muay Thai, BJJ, Box, CrossFit, Capoeira)</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Horarios flexibles 7 días a la semana</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Acceso a todas las instalaciones</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">✓</span>
                <span>Seguimiento personalizado</span>
              </li>
            </ul>
            <a
              href="https://wa.me/525535147658?text=Hola,%20quiero%20información%20sobre%20el%20Plan%20RFM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white hover:bg-gray-100 text-red-900 px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Inscribirme al Plan RFM
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Listo para Comenzar?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Agenda tu clase  y descubre por qué somos la mejor academia de MMA en México
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/525535147658?text=Hola,%20quiero%20agendar%20una%20clase%"
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