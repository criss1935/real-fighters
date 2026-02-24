import Image from 'next/image';
import Link from 'next/link';

const staffMembers = [
  {
    id: 1,
    name: "Gil Nava",
    role: "Director / Head Coach",
    department: "Dirección",
    image: "/staff/gil-nava.jpg",
    bio: "Coach principal con más de 15 años de experiencia en artes marciales mixtas.",
    specialties: ["MMA", "Muay Thai", "BJJ"],
    email: "gil@realfighters.mx",
    phone: "55 8841 9852"
  },
  {
    id: 2,
    name: "Recepción",
    role: "Atención al Cliente",
    department: "Recepción",
    image: "/staff/recepcion.jpg",
    bio: "Equipo de recepción disponible para atención, inscripciones y dudas.",
    email: "hola@realfighters.mx",
    phone: "55 8841 9852"
  },
  {
    id: 3,
    name: "Administración",
    role: "Gestión y Finanzas",
    department: "Administración",
    image: "/staff/admin.jpg",
    bio: "Equipo administrativo encargado de pagos, facturación y gestión de alumnos.",
    email: "administracion@realfighters.mx",
    phone: "55 8841 9852"
  }
  // Puedes agregar más miembros aquí
];

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Nuestro Equipo</h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Conoce a los profesionales que hacen posible Real Fighters
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                {/* Imagen */}
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700">
                      <span className="text-6xl font-bold text-white opacity-50">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {member.department}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-3">
                    {member.role}
                  </p>

                  <p className="text-gray-600 text-sm mb-4">
                    {member.bio}
                  </p>

                  {member.specialties && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contacto */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    {member.email && (
                      <p className="text-gray-600">
                        📧 <a href={`mailto:${member.email}`} className="text-red-600 hover:underline">
                          {member.email}
                        </a>
                      </p>
                    )}
                    {member.phone && (
                      <p className="text-gray-600">
                        📞 <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-red-600 hover:underline">
                          {member.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">¿Quieres formar parte del equipo?</p>
            <Link 
              href="https://wa.me/525588419852?text=Hola,%20me%20interesa%20trabajar%20en%20Real%20Fighters"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Únete al Equipo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}