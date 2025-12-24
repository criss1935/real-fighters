import Link from 'next/link';
import { classes } from '@/lib/classes-data';

export default function ClasesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nuestras Clases</h1>
          <p className="text-xl text-gray-300">
            Programas especializados para todas las edades y niveles
          </p>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((clase) => (
              <Link
                key={clase.slug}
                href={`/clases/${clase.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className={`${clase.color} h-24 flex items-center justify-center text-6xl`}>
                  {clase.icon}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                    {clase.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {clase.ageRange}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {clase.shortDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{clase.schedule.days}</span>
                    <span className="text-red-600 font-semibold group-hover:underline">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}