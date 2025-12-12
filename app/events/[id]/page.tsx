import { mockEvents, mockEventFights } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Building2 } from 'lucide-react';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = mockEvents.find(e => e.id === parseInt(params.id));
  
  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/events" className="inline-flex items-center text-gray-600 hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a eventos
          </Link>
        </div>
      </div>

      {/* Event Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-6 text-red-100">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              <span>{event.org}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Fight Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Cartelera de Combates</h2>
            <p className="text-gray-600 mt-1">{mockEventFights.length} peleas programadas</p>
          </div>

          <div className="divide-y divide-gray-200">
            {mockEventFights.map((fight, index) => (
              <div key={fight.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-500">
                    COMBATE #{mockEventFights.length - index}
                  </span>
                  {fight.result && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Finalizada
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Fighter 1 */}
                  <Link href={`/fighters/${fight.fighter1_id}`} className="text-center md:text-right">
                    <div className="font-bold text-lg text-gray-900 hover:text-red-600 transition">
                      {fight.fighter1}
                    </div>
                    {fight.result === fight.fighter1 && (
                      <div className="text-sm text-green-600 font-semibold mt-1">GANADOR</div>
                    )}
                  </Link>

                  {/* VS */}
                  <div className="text-center">
                    <div className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg font-bold">
                      VS
                    </div>
                  </div>

                  {/* Fighter 2 */}
                  <Link href={`/fighters/${fight.fighter2_id}`} className="text-center md:text-left">
                    <div className="font-bold text-lg text-gray-900 hover:text-red-600 transition">
                      {fight.fighter2}
                    </div>
                    {fight.result === fight.fighter2 && (
                      <div className="text-sm text-green-600 font-semibold mt-1">GANADOR</div>
                    )}
                    {fight.result === 'Draw' && (
                      <div className="text-sm text-yellow-600 font-semibold mt-1">EMPATE</div>
                    )}
                  </Link>
                </div>

                {/* Fight Details */}
                {fight.method && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
                      <span><strong>Método:</strong> {fight.method}</span>
                      <span><strong>Round:</strong> {fight.round}</span>
                      <span><strong>Tiempo:</strong> {fight.time}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {mockEventFights.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No hay combates registrados para este evento aún
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
