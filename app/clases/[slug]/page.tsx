import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Users } from 'lucide-react';
import { classes } from '../../../lib/classes-data';

export default function ClaseDetailPage({ params }: { params: { slug: string } }) {
  const clase = classes.find(c => c.slug === params.slug);

  if (!clase) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/clases"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Clases
          </Link>
        </div>
      </div>

      {/* Hero con imagen de fondo */}
      <section className="relative h-96 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src={clase.imageUrl}
            alt={clase.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${clase.color} opacity-90`}></div>
        </div>
        
        {/* Contenido */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          <div className="text-8xl mb-4">{clase.icon}</div>
          <h1 className="text-5xl font-bold mb-4">{clase.name}</h1>
          <p className="text-2xl text-white/90 max-w-2xl">{clase.shortDescription}</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Descripción */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de esta clase</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {clase.fullDescription}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Edad */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Users className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Edad Recomendada</h3>
              <p className="text-gray-700">{clase.ageRange}</p>
            </div>

            {/* Horarios */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Calendar className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Días</h3>
              <p className="text-gray-700">{clase.schedule.days}</p>
            </div>

            {/* Costo */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Mensualidad</h3>
              <p className="text-gray-700">{clase.pricing.monthly}</p>
            </div>
          </div>

          {/* Horarios detallados */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Horarios Disponibles</h2>
            <ul className="space-y-2">
              {clase.schedule.times.map((time, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                  {time}
                </li>
              ))}
            </ul>
          </div>

          {/* Costos detallados */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inversión</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-700 font-semibold">Mensualidad</span>
                <span className="text-2xl font-bold text-red-600">{clase.pricing.monthly}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Inscripción</span>
                <span className="text-lg text-gray-700">{clase.pricing.inscription}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a 
              href="https://wa.me/5255351476588"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl"
            >
              Agendar Clase 
            </a>
            <p className="text-gray-600 mt-4 text-sm">
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}