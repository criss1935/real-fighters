import Link from 'next/link';
import { Fighter } from '@/lib/mockData';

export default function FighterCard({ fighter }: { fighter: Fighter }) {
  const { wins, losses, draws } = fighter.record;
  const recordString = `${wins}-${losses}-${draws}`;

  return (
    <Link href={`/fighters/${fighter.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer">
        <div className="aspect-square overflow-hidden bg-gray-200">
          <img
            src={fighter.photo_url}
            alt={fighter.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900">{fighter.name}</h3>
          {fighter.nickname && (
            <p className="text-sm text-gray-500 italic mb-2">&quot;{fighter.nickname}&quot;</p>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-red-600">{fighter.division}</span>
            <span className={`text-xs px-2 py-1 rounded ${fighter.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {fighter.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{fighter.gym}</span>
            <span className="font-bold text-gray-900">{recordString}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}