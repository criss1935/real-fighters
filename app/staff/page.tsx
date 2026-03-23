'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  type: 'coach' | 'staff';
  specialty: string;
  photo: string;
  bio: string;
  certifications: string;
}

export default function StaffPage() {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'coaches' | 'staff'>('coaches');

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        console.error('Error cargando staff:', error);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      // Mapear los datos de Supabase a la interfaz StaffMember
      const mapped: StaffMember[] = data.map((staff: any) => {
        // Determinar si es coach o staff basado en el specialty
        const isCoach = staff.specialty && 
          (staff.specialty.toLowerCase().includes('entrenador') ||
           staff.specialty.toLowerCase().includes('instructor') ||
           staff.specialty.toLowerCase().includes('coach'));
        
        const staffType: 'coach' | 'staff' = isCoach ? 'coach' : 'staff';

        return {
          id: staff.id,
          name: staff.full_name || '',
          role: staff.specialty || 'Personal',
          type: staffType,
          specialty: staff.disciplines || '',
          photo: staff.photo_url || '/default-avatar.png',
          bio: staff.bio || '',
          certifications: staff.certifications || ''
        };
      });

      console.log('✅ Staff cargado:', mapped);
      setStaffData(mapped);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const coaches = staffData.filter((member) => member.type === 'coach');
  const staff = staffData.filter((member) => member.type === 'staff');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nuestro Equipo</h1>
          <p className="text-xl text-gray-300">
            Profesionales dedicados a tu entrenamiento y desarrollo
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('coaches')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'coaches'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👨‍🏫 Coaches e Instructores ({coaches.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'staff'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Staff General ({staff.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'coaches' && (
          <div>
            {coaches.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay entrenadores disponibles en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            {staff.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay personal administrativo disponible en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staff.map((member) => (
                  <StaffCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: StaffMember }) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden group">
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={coach.photo}
          alt={coach.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
          <p className="text-white text-sm leading-relaxed">{coach.bio}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h3>
        <p className="text-red-600 font-semibold mb-3">{coach.role}</p>

        {coach.specialty && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Especialidad:</strong> {coach.specialty}
            </p>
          </div>
        )}

        {coach.certifications && (
          <div className="flex items-start gap-2 mb-4">
            <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <strong>Certificaciones:</strong> {coach.certifications}
            </p>
          </div>
        )}

        {/* Contact placeholder */}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <button className="flex items-center gap-2 hover:text-red-600 transition">
            <Mail className="w-4 h-4" />
            <span>Contactar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Photo */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{member.role}</p>

        {member.specialty && (
          <p className="text-xs text-gray-500 mb-4">
            <strong>Área:</strong> {member.specialty}
          </p>
        )}

        {/* Contact placeholder */}
        <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition">
          <Mail className="w-4 h-4" />
          <span className="text-sm">Contactar</span>
        </button>
      </div>
    </div>
  );
}