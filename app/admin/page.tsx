'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, Plus, LogOut, UserCircle, Newspaper, Eye, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor';
import { uploadImage, validateImageFile } from '@/lib/upload-image';

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'fighters' | 'events' | 'fights' | 'announcements'>('fighters');
  
  // Stats
  const [stats, setStats] = useState({ fighters: 0, events: 0, fights: 0, activeFighters: 0, announcements: 0 })
  
  // Fighter form
  const [fighterForm, setFighterForm] = useState({ name: '', nickname: '', division: '', gym: '' })
  
  // Event form
  const [eventForm, setEventForm] = useState({ name: '', org: '', event_date: '', location: '' })
  
  // Fight form
  const [fightForm, setFightForm] = useState({ 
    event_id: '', red_fighter_id: '', blue_fighter_id: '', 
    result: 'red', method: '', round: 1 
  })
  
  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState({
    id: null as number | null,
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    published: false
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Lists for dropdowns
  const [events, setEvents] = useState<any[]>([])
  const [fighters, setFighters] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  
  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Preview modal
  const [previewAnnouncement, setPreviewAnnouncement] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadStats()
      loadEvents()
      loadFighters()
      loadAnnouncements()
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
      const [fightersRes, eventsRes, fightsRes, activeRes, announcementsRes] = await Promise.all([
        supabase.from('fighters').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('fights').select('id', { count: 'exact', head: true }),
        supabase.from('fighters').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('announcements').select('id', { count: 'exact', head: true })
      ])
      
      setStats({
        fighters: fightersRes.count || 0,
        events: eventsRes.count || 0,
        fights: fightsRes.count || 0,
        activeFighters: activeRes.count || 0,
        announcements: announcementsRes.count || 0
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

  async function loadAnnouncements() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setAnnouncements(data || [])
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

  // ============================================
  // FUNCIONES PARA ANUNCIOS
  // ============================================

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setImageFile(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleCreateOrUpdateAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let imageUrl = announcementForm.featured_image_url

      // Si hay una nueva imagen, subirla primero
      if (imageFile) {
        setUploadingImage(true)
        const uploadedUrl = await uploadImage(imageFile, 'announcement-images')
        setUploadingImage(false)
        
        if (!uploadedUrl) {
          throw new Error('Error al subir la imagen')
        }
        
        imageUrl = uploadedUrl
      }

      // Generar excerpt si está vacío (primeros 150 caracteres del contenido sin HTML)
      let excerpt = announcementForm.excerpt
      if (!excerpt && announcementForm.content) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = announcementForm.content
        const textContent = tempDiv.textContent || tempDiv.innerText || ''
        excerpt = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '')
      }

      const announcementData = {
        title: announcementForm.title,
        content: announcementForm.content,
        excerpt: excerpt,
        featured_image_url: imageUrl || null,
        published: announcementForm.published,
        author_email: user?.email
      }

      if (announcementForm.id) {
        // Actualizar anuncio existente
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', announcementForm.id)

        if (error) throw error
        setMessage({ type: 'success', text: '✅ Anuncio actualizado exitosamente' })
      } else {
        // Crear nuevo anuncio
        const { error } = await supabase
          .from('announcements')
          .insert(announcementData)

        if (error) throw error
        setMessage({ type: 'success', text: '✅ Anuncio creado exitosamente' })
      }

      // Resetear form
      setAnnouncementForm({
        id: null,
        title: '',
        content: '',
        excerpt: '',
        featured_image_url: '',
        published: false
      })
      setImageFile(null)
      setImagePreview('')
      
      loadStats()
      loadAnnouncements()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditAnnouncement(announcement: any) {
    setAnnouncementForm({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      excerpt: announcement.excerpt || '',
      featured_image_url: announcement.featured_image_url || '',
      published: announcement.published
    })
    setImagePreview(announcement.featured_image_url || '')
    setImageFile(null)
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteAnnouncement(id: number) {
    if (!confirm('¿Estás seguro de eliminar este anuncio? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: '✅ Anuncio eliminado exitosamente' })
      loadStats()
      loadAnnouncements()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  async function handleTogglePublish(announcement: any) {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ published: !announcement.published })
        .eq('id', announcement.id)

      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: `✅ Anuncio ${!announcement.published ? 'publicado' : 'despublicado'} exitosamente` 
      })
      loadAnnouncements()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function cancelEdit() {
    setAnnouncementForm({
      id: null,
      title: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      published: false
    })
    setImageFile(null)
    setImagePreview('')
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
              <p className="text-gray-400">Gestión de peleadores, eventos, combates y anuncios</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <UserCircle className="w-5 h-5" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Peleadores</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeFighters}</p>
                <p className="text-xs text-gray-500">de {stats.fighters} totales</p>
              </div>
              <Users className="w-12 h-12 text-red-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Eventos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
              </div>
              <Calendar className="w-12 h-12 text-red-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Combates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.fights}</p>
              </div>
              <Trophy className="w-12 h-12 text-red-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Anuncios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.announcements}</p>
                <p className="text-xs text-gray-500">
                  {announcements.filter(a => a.published).length} publicados
                </p>
              </div>
              <Newspaper className="w-12 h-12 text-red-600 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('fighters')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'fighters'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Peleadores</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'events'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Eventos</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('fights')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'fights'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Combates</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'announcements'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Newspaper className="w-4 h-4" />
                  <span>Anuncios</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* FIGHTERS TAB */}
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
                        placeholder="Juan Pérez"
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
                        placeholder="El Tigre"
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
                        placeholder="Peso Welter"
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
                        placeholder="Real Fighters MMA"
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

            {/* EVENTS TAB */}
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

            {/* FIGHTS TAB */}
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

            {/* ANNOUNCEMENTS TAB - NUEVO */}
            {activeTab === 'announcements' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {announcementForm.id ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
                </h2>

                <form onSubmit={handleCreateOrUpdateAnnouncement} className="space-y-6">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Anuncio *
                    </label>
                    <input
                      type="text"
                      required
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                      placeholder="Ej: ¡Próximo evento en Arena CDMX!"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                    />
                  </div>

                  {/* Imagen destacada */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen Destacada
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                      <p className="text-xs text-gray-500">
                        JPG, PNG o WebP. Máximo 5MB. Recomendado: 1200x630px
                      </p>
                      
                      {/* Preview de imagen */}
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview('')
                              setAnnouncementForm({...announcementForm, featured_image_url: ''})
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Editor de contenido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido *
                    </label>
                    <RichTextEditor
                      content={announcementForm.content}
                      onChange={(html) => setAnnouncementForm({...announcementForm, content: html})}
                      placeholder="Escribe el contenido del anuncio aquí. Puedes usar negritas, listas, títulos..."
                    />
                  </div>

                  {/* Excerpt opcional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extracto (Opcional)
                    </label>
                    <textarea
                      value={announcementForm.excerpt}
                      onChange={(e) => setAnnouncementForm({...announcementForm, excerpt: e.target.value})}
                      placeholder="Breve resumen para mostrar en las cards (se genera automáticamente si lo dejas vacío)"
                      rows={3}
                      maxLength={200}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {announcementForm.excerpt.length}/200 caracteres
                    </p>
                  </div>

                  {/* Toggle publicar */}
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                    <input
                      type="checkbox"
                      id="published"
                      checked={announcementForm.published}
                      onChange={(e) => setAnnouncementForm({...announcementForm, published: e.target.checked})}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">
                      Publicar inmediatamente (visible en el sitio público)
                    </label>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? 'Subiendo imagen...' : (announcementForm.id ? 'Actualizar Anuncio' : 'Crear Anuncio')}
                    </button>
                    
                    {announcementForm.id && (
                      <button 
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                {/* Lista de anuncios existentes */}
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Anuncios Existentes ({announcements.length})
                  </h3>

                  <div className="space-y-4">
                    {announcements.map(announcement => (
                      <div 
                        key={announcement.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                announcement.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {announcement.published ? 'Publicado' : 'Borrador'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {announcement.excerpt || 'Sin extracto'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Creado: {new Date(announcement.created_at).toLocaleDateString('es-MX')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => setPreviewAnnouncement(announcement)}
                              className="p-2 hover:bg-gray-100 rounded transition"
                              title="Vista previa"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="p-2 hover:bg-blue-100 rounded transition"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleTogglePublish(announcement)}
                              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                                announcement.published
                                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {announcement.published ? 'Despublicar' : 'Publicar'}
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="p-2 hover:bg-red-100 rounded transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Preview */}
      {previewAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Vista Previa</h3>
                <button
                  onClick={() => setPreviewAnnouncement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {previewAnnouncement.featured_image_url && (
                <img 
                  src={previewAnnouncement.featured_image_url}
                  alt={previewAnnouncement.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {previewAnnouncement.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>{new Date(previewAnnouncement.created_at).toLocaleDateString('es-MX', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{previewAnnouncement.author_email}</span>
              </div>

              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewAnnouncement.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}