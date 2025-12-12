import Link from 'next/link';
import { Event } from '@/lib/mockData';
import { Calendar, MapPin, Building2 } from 'lucide-react';

export default function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border-l-4 border-red-600">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            <span>{event.org}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-red-600 font-semibold text-sm hover:text-red-700">
            Ver detalles del evento →
          </span>
        </div>
      </div>
    </Link>
  );
}