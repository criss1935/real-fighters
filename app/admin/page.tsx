'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, Plus, LogOut, UserCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'fighters' | 'events' | 'fights'>('fighters');
  
  // Stats
  const [stats, setStats] = useState({ fighters: 0, events: 0, fights: 0, activeFighters: 0 })
  
  // Fighter form
  const [fighterForm, setFighterForm] = useState({ name: '', nickname: '', division: '', gym: '' })
  
  // Event form
  const [eventForm, setEventForm] = useState({ name: '', org: '', event_date: '', location: '' })
  
  // Fight form
  const [fightForm, setFightForm] = useState({ 
    event_id: '', red_fighter_id: '', blue_fighter_id: '', 
    result: 'red', method: '', round: 1 
  })
  
  // Lists for dropdowns
  const [events, setEvents] = useState<any[]>([])
  const [fighters, setFighters] = useState<any[]>([])
  
  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadStats()
      loadEvents()
      loadFighters()
    }
  }, [user])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const isAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
    
    if (!isAdmin) {
      await supabase.auth.signOut()
      router.push('/login')
      return
    }

    setUser(user)
    setLoading(false)
  }

  async function loadStats() {
    try {
      const [fightersRes, eventsRes, fightsRes, activeRes] = await Promise.all([
        supabase.from('fighters').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('fights').select('id', { count: 'exact', head: true }),
        supabase.from('fighters').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ])
      
      setStats({
        fighters: fightersRes.count || 0,
        events: eventsRes.count || 0,
        fights: fightsRes.count || 0,
        activeFighters: activeRes.count || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data || [])
  }

  async function loadFighters() {
    const { data } = await supabase.from('fighters').select('*').eq('is_active', true).order('name')
    setFighters(data || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleCreateFighter(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      const { error } = await supabase.from('fighters').insert({
        name: fighterForm.name,
        nickname: fighterForm.nickname || null,
        division: fighterForm.division || null,
        gym: fighterForm.gym || null,
        is_active: true,
        discipline: 'MMA'
      })

      if (error) throw error

      setMessage({ type: 'success', text: '✅ Peleador creado exitosamente' })
      setFighterForm({ name: '', nickname: '', division: '', gym: '' })
      loadStats()
      loadFighters()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      const { error } = await supabase.from('events').insert({
        name: eventForm.name,
        org: eventForm.org || null,
        event_date: eventForm.event_date || null,
        location: eventForm.location || null
      })

      if (error) throw error

      setMessage({ type: 'success', text: '✅ Evento creado exitosamente' })
      setEventForm({ name: '', org: '', event_date: '', location: '' })
      loadStats()
      loadEvents()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  async function handleCreateFight(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      // Crear pelea
      const { error } = await supabase.from('fights').insert({
        event_id: parseInt(fightForm.event_id),
        red_fighter_id: parseInt(fightForm.red_fighter_id),
        blue_fighter_id: parseInt(fightForm.blue_fighter_id),
        result: fightForm.result,
        method: fightForm.method || null,
        round: fightForm.round || null
      })

      if (error) throw error

      // Refrescar vista materializada para actualizar récords
      await supabase.rpc('refresh_fighter_records')

      setMessage({ type: 'success', text: '✅ Combate registrado y récords actualizados' })
      setFightForm({ 
        event_id: '', red_fighter_id: '', blue_fighter_id: '', 
        result: 'red', method: '', round: 1 
      })
      loadStats()
    } catch (error: any) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verificando acceso...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-gray-400">Gestión de peleadores, eventos y combates</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <UserCircle className="w-5 h-5" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-red-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.fighters}</div>
            <div className="text-sm text-gray-600 mt-1">Peleadores</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.events}</div>
            <div className="text-sm text-gray-600 mt-1">Eventos</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.fights}</div>
            <div className="text-sm text-gray-600 mt-1">Combates</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-500">Activos</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.activeFighters}</div>
            <div className="text-sm text-gray-600 mt-1">Peleadores</div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('fighters')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'fighters'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Peleadores
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'events'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Eventos
              </button>
              <button
                onClick={() => setActiveTab('fights')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'fights'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Combates
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'fighters' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Crear Nuevo Peleador</h2>
                
                <form onSubmit={handleCreateFighter} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={fighterForm.name}
                        onChange={(e) => setFighterForm({...fighterForm, name: e.target.value})}
                        placeholder="Carlos Méndez"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apodo
                      </label>
                      <input
                        type="text"
                        value={fighterForm.nickname}
                        onChange={(e) => setFighterForm({...fighterForm, nickname: e.target.value})}
                        placeholder="El Rayo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        División
                      </label>
                      <input
                        type="text"
                        value={fighterForm.division}
                        onChange={(e) => setFighterForm({...fighterForm, division: e.target.value})}
                        placeholder="Welterweight"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gimnasio
                      </label>
                      <input
                        type="text"
                        value={fighterForm.gym}
                        onChange={(e) => setFighterForm({...fighterForm, gym: e.target.value})}
                        placeholder="Real Fighters Mexico"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Crear Peleador
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Crear Nuevo Evento</h2>

                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Evento *
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.name}
                        onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                        placeholder="Noche de Campeones 16"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organización
                      </label>
                      <input
                        type="text"
                        value={eventForm.org}
                        onChange={(e) => setEventForm({...eventForm, org: e.target.value})}
                        placeholder="Fight Night México"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={eventForm.event_date}
                        onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                        placeholder="Arena Ciudad de México"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Crear Evento
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'fights' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Registrar Nuevo Combate</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Importante:</strong> Al registrar un combate, el récord de los peleadores se actualiza automáticamente.
                  </p>
                </div>

                <form onSubmit={handleCreateFight} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evento *
                    </label>
                    <select 
                      required
                      value={fightForm.event_id}
                      onChange={(e) => setFightForm({...fightForm, event_id: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar evento...</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.name} - {event.event_date}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peleador Esquina Roja *
                      </label>
                      <select 
                        required
                        value={fightForm.red_fighter_id}
                        onChange={(e) => setFightForm({...fightForm, red_fighter_id: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar peleador...</option>
                        {fighters.map(fighter => (
                          <option key={fighter.id} value={fighter.id}>
                            {fighter.name} {fighter.nickname ? `"${fighter.nickname}"` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peleador Esquina Azul *
                      </label>
                      <select 
                        required
                        value={fightForm.blue_fighter_id}
                        onChange={(e) => setFightForm({...fightForm, blue_fighter_id: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar peleador...</option>
                        {fighters.map(fighter => (
                          <option key={fighter.id} value={fighter.id}>
                            {fighter.name} {fighter.nickname ? `"${fighter.nickname}"` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resultado *
                      </label>
                      <select 
                        required
                        value={fightForm.result}
                        onChange={(e) => setFightForm({...fightForm, result: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="red">Victoria Rojo</option>
                        <option value="blue">Victoria Azul</option>
                        <option value="draw">Empate</option>
                        <option value="nc">Sin Resultado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método
                      </label>
                      <input
                        type="text"
                        value={fightForm.method}
                        onChange={(e) => setFightForm({...fightForm, method: e.target.value})}
                        placeholder="KO, TKO, Submission, Decision"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Round
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={fightForm.round}
                        onChange={(e) => setFightForm({...fightForm, round: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Registrar Combate
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}