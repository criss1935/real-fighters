import { mockEvents } from '@/lib/mockData';
import EventCard from '@/components/EventCard';

export default function EventsPage() {
  // Sort events by date (most recent first)
  const sortedEvents = [...mockEvents].sort((a, b) => 
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Eventos</h1>
        <p className="text-gray-600">
          Historial completo de carteleras y eventos de la academia
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-red-600 mb-1">{mockEvents.length}</div>
            <div className="text-sm text-gray-600">Eventos Totales</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 mb-1">
              {mockEvents.filter(e => new Date(e.event_date) > new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Próximos Eventos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 mb-1">
              {new Set(mockEvents.map(e => e.org)).size}
            </div>
            <div className="text-sm text-gray-600">Organizaciones</div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay eventos registrados aún</p>
        </div>
      )}
    </div>
  );
}
