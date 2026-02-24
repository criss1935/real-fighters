import Link from 'next/link';

const filiales = [
  {
    id: 1,
    name: "Real Fighters Coyoacán",
    slug: "coyoacan",
    status: "Activa",
    address: "Calz. del Hueso 590, Coapa, Los Girasoles, Coyoacán, 04920 CDMX",
    phone: "55 8841 9852",
    email: "coyoacan@realfighters.mx",
    whatsapp: "525588419852",
    mapLink: "https://maps.google.com/?q=Calz.+del+Hueso+590,+Coapa,+Los+Girasoles,+Coyoacán,+04920+Ciudad+de+México",
    horarios: {
      "Lunes a Viernes": "7:00 AM - 10:00 PM",
      "Sábados": "9:00 AM - 2:00 PM",
      "Domingos": "Cerrado"
    },
    servicios: ["MMA", "Muay Thai", "BJJ", "Boxeo", "CrossFit", "Kids"],
    precios: {
      basico: "$800",
      rfm: "$1,500",
      daypass: "$150"
    },
    descripcion: "Nuestra sede principal en Coyoacán cuenta con instalaciones de primer nivel, tatami profesional, área de pesas y vestuarios completos.",
    disponible: true
  },
  {
    id: 2,
    name: "STRIKERS San Buenaventura",
    slug: "strikers-sanbuena",
    status: "Próximamente",
    address: "Entre calle Chopos y Paseo de las Aves, San Buenaventura, Ixtapaluca, Estado de México",
    phone: "Próximamente",
    email: "strikers@realfighters.mx",
    whatsapp: "525588419852",
    mapLink: "#",
    horarios: {
      "Lunes a Sábado": "Información próximamente"
    },
    servicios: ["Kickboxing", "K-1", "Striking", "Boxeo"],
    precios: {
      individual: "$25",
      mensual: "$450"
    },
    descripcion: "Academia enfocada en la formación integral de competidores, trabajando bajo una metodología profesional y disciplinada.",
    disponible: false
  },
  {
    id: 3,
    name: "STRIKERS Cuatro Vientos",
    slug: "strikers-cuatrovientos",
    status: "Próximamente",
    address: "Calle Granizo, a un costado de la Alberca Olímpica, Cuatro Vientos, Ixtapaluca, Estado de México",
    phone: "Próximamente",
    email: "strikers@realfighters.mx",
    whatsapp: "525588419852",
    mapLink: "#",
    horarios: {
      "Lunes a Sábado": "Información próximamente"
    },
    servicios: ["Kickboxing", "K-1", "Striking", "Boxeo"],
    precios: {
      individual: "$25",
      mensual: "$450"
    },
    descripcion: "Academia enfocada en la formación integral de competidores, trabajando bajo una metodología profesional y disciplinada.",
    disponible: false
  },
  {
    id: 4,
    name: "Strikers Jiutepec",
    slug: "strikers-jiutepec",
    status: "Próximamente",
    address: "Tabachin 11, El Edén, Jiutepec, Morelos",
    phone: "777 363 8266",
    email: "jiutepec@realfighters.mx",
    whatsapp: "527773638266",
    mapLink: "#",
    horarios: {
      "Lunes a Sábado": "Información próximamente"
    },
    servicios: ["MMA", "Kickboxing", "Muay Thai"],
    precios: {
      mensual: "Próximamente"
    },
    descripcion: "Próximamente más información sobre esta filial.",
    disponible: false
  },
  {
    id: 5,
    name: "Scouting MMA Jiutepec",
    slug: "scouting-jiutepec",
    status: "Próximamente",
    address: "Francisco I Madero (altos subodega), Jiutepec, Morelos",
    phone: "785 108 5382",
    email: "scouting@realfighters.mx",
    whatsapp: "527851085382",
    mapLink: "#",
    horarios: {
      "Lunes a Sábado": "Información próximamente"
    },
    servicios: ["MMA", "Grappling"],
    precios: {
      mensual: "Próximamente"
    },
    descripcion: "Próximamente más información sobre esta filial.",
    disponible: false
  },
  {
    id: 6,
    name: "Real Fighters Papantla",
    slug: "papantla",
    status: "Próximamente",
    address: "Papantla, Veracruz",
    phone: "Próximamente",
    email: "papantla@realfighters.mx",
    whatsapp: "525588419852",
    mapLink: "#",
    horarios: {
      "Lunes a Sábado": "Información próximamente"
    },
    servicios: ["MMA", "Muay Thai", "BJJ"],
    precios: {
      mensual: "Próximamente"
    },
    descripcion: "Próximamente más información sobre esta filial.",
    disponible: false
  }
];

export default function FilialesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Nuestras Filiales</h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Encuentra la ubicación más cercana a ti
          </p>
        </div>
      </section>

      {/* Filiales Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filiales.map((filial) => (
              <div 
                key={filial.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition ${
                  !filial.disponible ? 'opacity-75' : ''
                }`}
              >
                {/* Placeholder de imagen */}
                <div className="h-64 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden flex items-center justify-center">
                  <span className="text-6xl font-bold text-white opacity-50">
                    {filial.name.split(' ')[0].substring(0, 2).toUpperCase()}
                  </span>
                  <div className="absolute top-4 right-4">
                    {filial.disponible ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ✓ Activa
                      </span>
                    ) : (
                      <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                        🚧 Próximamente
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {filial.name}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {filial.descripcion}
                  </p>

                  {/* Dirección */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      📍 Dirección
                    </h3>
                    <p className="text-gray-600 mb-3">{filial.address}</p>
                    {filial.disponible && filial.mapLink !== '#' && (
                      <a 
                        href={filial.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition"
                      >
                        Ver en Google Maps
                      </a>
                    )}
                  </div>

                  {/* Contacto */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      📞 Contacto
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        Teléfono: {filial.phone !== 'Próximamente' ? (
                          <a href={`tel:${filial.phone.replace(/\s/g, '')}`} className="text-red-600 hover:underline">
                            {filial.phone}
                          </a>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Próximamente</span>
                        )}
                      </p>
                      <p className="text-gray-600">
                        Email: <a href={`mailto:${filial.email}`} className="text-red-600 hover:underline">{filial.email}</a>
                      </p>
                      {filial.disponible && (
                        <a 
                          href={`https://wa.me/${filial.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition mt-2"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Horarios */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      🕐 Horarios
                    </h3>
                    <div className="bg-gray-50 rounded p-4 space-y-1 text-sm">
                      {Object.entries(filial.horarios).map(([dia, horario]) => (
                        <div key={dia} className="flex justify-between">
                          <span className="font-semibold text-gray-700">{dia}:</span>
                          <span className={`${!filial.disponible ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {horario}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Servicios */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      🥊 Disciplinas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filial.servicios.map((servicio) => (
                        <span 
                          key={servicio}
                          className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full"
                        >
                          {servicio}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      💰 Precios
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {Object.entries(filial.precios).map(([tipo, precio]) => (
                        <div key={tipo} className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-600 mb-1 capitalize">
                            {tipo === 'basico' ? 'Plan Básico' : 
                             tipo === 'rfm' ? 'Plan #RFM' :
                             tipo === 'daypass' ? 'Day Pass' :
                             tipo === 'individual' ? 'Clase' :
                             tipo === 'mensual' ? 'Mensual' : tipo}
                          </p>
                          <p className={`text-lg font-bold ${
                            precio === 'Próximamente' ? 'text-yellow-600 text-xs' : 'text-red-600'
                          }`}>
                            {precio}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">¿Quieres abrir una nueva filial?</h3>
            <p className="mb-6 text-red-100">
              Únete a la red Real Fighters y forma parte de la comunidad de artes marciales más grande de México
            </p>
            <Link 
              href="https://wa.me/525588419852?text=Hola,%20me%20interesa%20abrir%20una%20filial%20de%20Real%20Fighters"
              className="inline-block bg-white hover:bg-gray-100 text-red-600 px-8 py-3 rounded-lg font-semibold transition"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}