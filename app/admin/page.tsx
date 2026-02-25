'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, LogOut, UserCircle, Newspaper, Eye, Trash2, Edit, X, Upload, Home, BookOpen, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor';
import { uploadImage, validateImageFile, deleteImage } from '@/lib/upload-image';

type TabType = 'students' | 'fighters' | 'events' | 'fights' | 'announcements' | 'filiales' | 'classes' | 'plans';

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('students');
  
  // ============ STATS ============
  const [stats, setStats] = useState({ 
    students: 0, 
    fighters: 0, 
    events: 0, 
    fights: 0, 
    announcements: 0,
    filiales: 0,
    classes: 0
  })
  
  // ============ STUDENTS STATE ============
  const [studentForm, setStudentForm] = useState({
    id: null as number | null,
    name: '', email: '', phone: '', birth_date: '', discipline: '', belt_level: '',
    enrollment_date: '', gym: '', status: 'active', photo_url: '', notes: '', weight_kg: '', height_cm: ''
  })
  const [students, setStudents] = useState<any[]>([])
  const [studentImageFile, setStudentImageFile] = useState<File | null>(null)
  const [studentImagePreview, setStudentImagePreview] = useState<string>('')
  const [uploadingStudentImage, setUploadingStudentImage] = useState(false)

  // ============ FIGHTERS STATE ============
  const [fighterForm, setFighterForm] = useState({ 
    id: null as number | null, name: '', nickname: '', division: '', gym: '', photo_url: '', is_active: true
  })
  const [fighterImageFile, setFighterImageFile] = useState<File | null>(null)
  const [fighterImagePreview, setFighterImagePreview] = useState<string>('')
  const [uploadingFighterImage, setUploadingFighterImage] = useState(false)
  const [fighters, setFighters] = useState<any[]>([])
  const [allFighters, setAllFighters] = useState<any[]>([])

  // ============ FILIALES STATE ============
  const [filialesData, setFilialesData] = useState<any[]>([])
  const [filialForm, setFilialForm] = useState({
    id: Date.now(),
    name: '', slug: '', status: 'Activa', address: '', phone: '', email: '', whatsapp: '',
    mapLink: '', horarios: {}, servicios: [] as string[], precios: {}, descripcion: '',
    disponible: true, image_url: ''
  })
  const [filialImageFile, setFilialImageFile] = useState<File | null>(null)
  const [filialImagePreview, setFilialImagePreview] = useState<string>('')
  const [uploadingFilialImage, setUploadingFilialImage] = useState(false)
  const [editingFilialId, setEditingFilialId] = useState<number | null>(null)

  // ============ CLASSES STATE ============
  const [classesData, setClassesData] = useState<any[]>([])
  const [classForm, setClassForm] = useState({
    slug: '', name: '', shortDescription: '', fullDescription: '', ageRange: '',
    schedule: { days: '', times: [] as string[] },
    pricing: { monthly: '', inscription: '' },
    color: 'bg-blue-600', imageUrl: ''
  })
  const [classImageFile, setClassImageFile] = useState<File | null>(null)
  const [classImagePreview, setClassImagePreview] = useState<string>('')
  const [uploadingClassImage, setUploadingClassImage] = useState(false)
  const [editingClassSlug, setEditingClassSlug] = useState<string | null>(null)

  // ============ PLANS STATE ============
  const [plansData, setPlansData] = useState<any[]>([])
  const [planForm, setPlanForm] = useState({
    id: Date.now(), name: '', subtitle: '', price: '', period: 'mensual', features: [] as string[], highlighted: false
  })
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null)

  // ============ EVENTS STATE ============
  const [eventForm, setEventForm] = useState({ id: null as number | null, name: '', org: '', event_date: '', location: '' })
  const [events, setEvents] = useState<any[]>([])

  // ============ FIGHTS STATE ============
  const [fightForm, setFightForm] = useState({ event_id: '', red_fighter_id: '', blue_fighter_id: '', result: 'red', method: '', round: 1 })

  // ============ ANNOUNCEMENTS STATE ============
  const [announcementForm, setAnnouncementForm] = useState({
    id: null as number | null, title: '', content: '', excerpt: '', featured_image_url: '', published: false
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [previewAnnouncement, setPreviewAnnouncement] = useState<any>(null)

  // ============ MESSAGES ============
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // ============ LIFECYCLE ============
  useEffect(() => { checkAuth() }, [])

  useEffect(() => {
    if (user) {
      loadStats()
      loadStudents()
      loadFighters()
      loadAllFighters()
      loadEvents()
      loadAnnouncements()
      loadConfigData()
    }
  }, [user])

  // ============ AUTH ============
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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // ============ STATS ============
  async function loadStats() {
    try {
      const [studentsRes, fightersRes, eventsRes, fightsRes, announcementsRes] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('fighters').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('fights').select('id', { count: 'exact', head: true }),
        supabase.from('announcements').select('id', { count: 'exact', head: true })
      ])
      
      setStats({
        students: studentsRes.count || 0,
        fighters: fightersRes.count || 0,
        events: eventsRes.count || 0,
        fights: fightsRes.count || 0,
        announcements: announcementsRes.count || 0,
        filiales: filialesData.length,
        classes: classesData.length
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // ============ CONFIG DATA ============
  async function loadConfigData() {
    try {
      const [filialesRes, classesRes, plansRes] = await Promise.all([
        supabase.from('config').select('data').eq('key', 'filiales').single(),
        supabase.from('config').select('data').eq('key', 'classes').single(),
        supabase.from('config').select('data').eq('key', 'plans').single()
      ])

      if (filialesRes.data?.data) setFilialesData(filialesRes.data.data)
      if (classesRes.data?.data) setClassesData(classesRes.data.data)
      if (plansRes.data?.data) setPlansData(plansRes.data.data)
    } catch (error) {
      console.error('Error loading config data:', error)
    }
  }

  async function saveConfigData(key: string, data: any) {
    try {
      const { error } = await supabase
        .from('config')
        .upsert({ key, data, updated_at: new Date() }, { onConflict: 'key' })

      if (error) throw error
      setMessage({ type: 'success', text: '✅ Cambios guardados exitosamente' })
      loadConfigData()
      loadStats()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ STUDENTS FUNCTIONS ============
  function handleStudentImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    setStudentImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setStudentImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function loadStudents() {
    const { data } = await supabase.from('students').select('*').order('name')
    setStudents(data || [])
  }

  async function handleCreateOrUpdateStudent(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let photoUrl = studentForm.photo_url

      if (studentImageFile) {
        setUploadingStudentImage(true)
        const uploadedUrl = await uploadImage(studentImageFile, 'students-photos')
        setUploadingStudentImage(false)
        
        if (!uploadedUrl) throw new Error('Error al subir la imagen')
        if (studentForm.photo_url) {
          await deleteImage(studentForm.photo_url, 'students-photos')
        }
        photoUrl = uploadedUrl
      }

      const studentData = {
        name: studentForm.name,
        email: studentForm.email || null,
        phone: studentForm.phone || null,
        birth_date: studentForm.birth_date || null,
        discipline: studentForm.discipline || null,
        belt_level: studentForm.belt_level || null,
        enrollment_date: studentForm.enrollment_date || null,
        gym: studentForm.gym || null,
        status: studentForm.status,
        photo_url: photoUrl || null,
        notes: studentForm.notes || null,
        weight_kg: studentForm.weight_kg ? parseFloat(studentForm.weight_kg) : null,
        height_cm: studentForm.height_cm ? parseFloat(studentForm.height_cm) : null
      }

      if (studentForm.id) {
        const { error } = await supabase.from('students').update(studentData).eq('id', studentForm.id)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Alumno actualizado exitosamente' })
      } else {
        const { error } = await supabase.from('students').insert(studentData)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Alumno creado exitosamente' })
      }

      setStudentForm({
        id: null, name: '', email: '', phone: '', birth_date: '', discipline: '', 
        belt_level: '', enrollment_date: '', gym: '', status: 'active', photo_url: '', 
        notes: '', weight_kg: '', height_cm: ''
      })
      setStudentImageFile(null)
      setStudentImagePreview('')
      
      loadStats()
      loadStudents()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditStudent(student: any) {
    setStudentForm({
      id: student.id, name: student.name, email: student.email || '', phone: student.phone || '',
      birth_date: student.birth_date || '', discipline: student.discipline || '', 
      belt_level: student.belt_level || '', enrollment_date: student.enrollment_date || '',
      gym: student.gym || '', status: student.status || 'active', photo_url: student.photo_url || '',
      notes: student.notes || '', weight_kg: student.weight_kg ? String(student.weight_kg) : '',
      height_cm: student.height_cm ? String(student.height_cm) : ''
    })
    setStudentImagePreview(student.photo_url || '')
    setStudentImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteStudent(id: number, photoUrl: string | null) {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return

    try {
      if (photoUrl) {
        try {
          if (photoUrl.includes('students-photos')) {
            await deleteImage(photoUrl, 'students-photos')
          }
        } catch (e) {
          console.log('No se pudo eliminar la foto')
        }
      }

      const { error } = await supabase.from('students').delete().eq('id', id)
      if (error) throw error

      setMessage({ type: 'success', text: '✅ Alumno eliminado exitosamente' })
      loadStats()
      loadStudents()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ FIGHTERS FUNCTIONS ============
  function handleFighterImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    setFighterImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setFighterImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function loadFighters() {
    const { data } = await supabase.from('fighters').select('*').eq('is_active', true).order('name')
    setFighters(data || [])
  }

  async function loadAllFighters() {
    const { data } = await supabase.from('fighters').select('*').order('name')
    setAllFighters(data || [])
  }

  async function handleCreateOrUpdateFighter(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let photoUrl = fighterForm.photo_url

      if (fighterImageFile) {
        setUploadingFighterImage(true)
        const uploadedUrl = await uploadImage(fighterImageFile, 'fighters-photos')
        setUploadingFighterImage(false)
        
        if (!uploadedUrl) throw new Error('Error al subir la imagen')
        if (fighterForm.photo_url) {
          await deleteImage(fighterForm.photo_url, 'fighters-photos')
        }
        photoUrl = uploadedUrl
      }

      const fighterData = {
        name: fighterForm.name,
        nickname: fighterForm.nickname || null,
        division: fighterForm.division || null,
        gym: fighterForm.gym || null,
        photo_url: photoUrl || null,
        is_active: fighterForm.is_active,
        discipline: 'MMA'
      }

      if (fighterForm.id) {
        const { error } = await supabase.from('fighters').update(fighterData).eq('id', fighterForm.id)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Peleador actualizado exitosamente' })
      } else {
        const { error } = await supabase.from('fighters').insert(fighterData)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Peleador creado exitosamente' })
      }

      setFighterForm({ id: null, name: '', nickname: '', division: '', gym: '', photo_url: '', is_active: true })
      setFighterImageFile(null)
      setFighterImagePreview('')
      
      loadStats()
      loadFighters()
      loadAllFighters()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditFighter(fighter: any) {
    setFighterForm({
      id: fighter.id, name: fighter.name, nickname: fighter.nickname || '', 
      division: fighter.division || '', gym: fighter.gym || '', 
      photo_url: fighter.photo_url || '', is_active: fighter.is_active
    })
    setFighterImagePreview(fighter.photo_url || '')
    setFighterImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteFighter(id: number, photoUrl: string | null) {
    if (!confirm('¿Estás seguro de eliminar este peleador?')) return

    try {
      if (photoUrl) {
        try {
          if (photoUrl.includes('fighters-photos')) {
            await deleteImage(photoUrl, 'fighters-photos')
          }
        } catch (e) {
          console.log('No se pudo eliminar la foto')
        }
      }

      const { error } = await supabase.from('fighters').delete().eq('id', id)
      if (error) throw error

      setMessage({ type: 'success', text: '✅ Peleador eliminado exitosamente' })
      loadStats()
      loadFighters()
      loadAllFighters()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  async function handleToggleFighterActive(fighter: any) {
    try {
      const { error } = await supabase.from('fighters').update({ is_active: !fighter.is_active }).eq('id', fighter.id)
      if (error) throw error

      setMessage({ type: 'success', text: `✅ Peleador ${!fighter.is_active ? 'activado' : 'desactivado'} exitosamente` })
      loadFighters()
      loadAllFighters()
      loadStats()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ FILIALES FUNCTIONS ============
  function handleFilialImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    setFilialImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setFilialImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleCreateOrUpdateFilial(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let imageUrl = filialForm.image_url

      if (filialImageFile) {
        setUploadingFilialImage(true)
        const uploadedUrl = await uploadImage(filialImageFile, 'filiales-images')
        setUploadingFilialImage(false)
        
        if (!uploadedUrl) throw new Error('Error al subir la imagen')
        imageUrl = uploadedUrl
      }

      const newFilial = {
        ...filialForm,
        image_url: imageUrl,
        slug: filialForm.name.toLowerCase().replace(/\s+/g, '-')
      }

      let updatedFiliales: any[] = []

      if (editingFilialId) {
        updatedFiliales = filialesData.map(f => f.id === editingFilialId ? { ...newFilial, id: editingFilialId } : f)
      } else {
        updatedFiliales = [...filialesData, newFilial]
      }

      await saveConfigData('filiales', updatedFiliales)

      setFilialForm({
        id: Date.now(), name: '', slug: '', status: 'Activa', address: '', phone: '', email: '', whatsapp: '',
        mapLink: '', horarios: {}, servicios: [], precios: {}, descripcion: '', disponible: true, image_url: ''
      })
      setFilialImageFile(null)
      setFilialImagePreview('')
      setEditingFilialId(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditFilial(filial: any) {
    setFilialForm(filial)
    setFilialImagePreview(filial.image_url || '')
    setFilialImageFile(null)
    setEditingFilialId(filial.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteFilial(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta filial?')) return
    try {
      const updatedFiliales = filialesData.filter(f => f.id !== id)
      await saveConfigData('filiales', updatedFiliales)
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ CLASSES FUNCTIONS ============
  function handleClassImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    setClassImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setClassImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleCreateOrUpdateClass(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let imageUrl = classForm.imageUrl

      if (classImageFile) {
        setUploadingClassImage(true)
        const uploadedUrl = await uploadImage(classImageFile, 'classes-images')
        setUploadingClassImage(false)
        
        if (!uploadedUrl) throw new Error('Error al subir la imagen')
        imageUrl = uploadedUrl
      }

      const newClass = {
        ...classForm,
        imageUrl: imageUrl,
        slug: classForm.slug || classForm.name.toLowerCase().replace(/\s+/g, '-')
      }

      let updatedClasses: any[] = []

      if (editingClassSlug) {
        updatedClasses = classesData.map(c => c.slug === editingClassSlug ? newClass : c)
      } else {
        updatedClasses = [...classesData, newClass]
      }

      await saveConfigData('classes', updatedClasses)

      setClassForm({
        slug: '', name: '', shortDescription: '', fullDescription: '', ageRange: '',
        schedule: { days: '', times: [] },
        pricing: { monthly: '', inscription: '' },
        color: 'bg-blue-600',
        imageUrl: ''
      })
      setClassImageFile(null)
      setClassImagePreview('')
      setEditingClassSlug(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditClass(clase: any) {
    setClassForm(clase)
    setClassImagePreview(clase.imageUrl || '')
    setClassImageFile(null)
    setEditingClassSlug(clase.slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteClass(slug: string) {
    if (!confirm('¿Estás seguro de eliminar esta clase?')) return
    try {
      const updatedClasses = classesData.filter(c => c.slug !== slug)
      await saveConfigData('classes', updatedClasses)
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ PLANS FUNCTIONS ============
  async function handleCreateOrUpdatePlan(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let updatedPlans: any[] = []

      if (editingPlanId) {
        updatedPlans = plansData.map(p => p.id === editingPlanId ? planForm : p)
      } else {
        updatedPlans = [...plansData, planForm]
      }

      await saveConfigData('plans', updatedPlans)

      setPlanForm({
        id: Date.now(), name: '', subtitle: '', price: '', period: 'mensual', features: [], highlighted: false
      })
      setEditingPlanId(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditPlan(plan: any) {
    setPlanForm(plan)
    setEditingPlanId(plan.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeletePlan(id: number) {
    if (!confirm('¿Estás seguro de eliminar este plan?')) return
    try {
      const updatedPlans = plansData.filter(p => p.id !== id)
      await saveConfigData('plans', updatedPlans)
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ EVENTS FUNCTIONS ============
  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data || [])
  }

  async function handleCreateOrUpdateEvent(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      const eventData = {
        name: eventForm.name,
        org: eventForm.org || null,
        event_date: eventForm.event_date || null,
        location: eventForm.location || null
      }

      if (eventForm.id) {
        const { error } = await supabase.from('events').update(eventData).eq('id', eventForm.id)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Evento actualizado exitosamente' })
      } else {
        const { error } = await supabase.from('events').insert(eventData)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Evento creado exitosamente' })
      }

      setEventForm({ id: null, name: '', org: '', event_date: '', location: '' })
      loadStats()
      loadEvents()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  function handleEditEvent(event: any) {
    setEventForm({
      id: event.id, name: event.name, org: event.org || '', event_date: event.event_date || '', location: event.location || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return

    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error

      setMessage({ type: 'success', text: '✅ Evento eliminado exitosamente' })
      loadStats()
      loadEvents()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ FIGHTS FUNCTIONS ============
  async function handleCreateFight(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      const { error } = await supabase.from('fights').insert({
        event_id: parseInt(fightForm.event_id),
        red_fighter_id: parseInt(fightForm.red_fighter_id),
        blue_fighter_id: parseInt(fightForm.blue_fighter_id),
        result: fightForm.result,
        method: fightForm.method || null,
        round: fightForm.round || null
      })

      if (error) throw error

      await supabase.rpc('refresh_fighter_records')

      setMessage({ type: 'success', text: '✅ Combate registrado y récords actualizados' })
      setFightForm({ event_id: '', red_fighter_id: '', blue_fighter_id: '', result: 'red', method: '', round: 1 })
      loadStats()
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  // ============ ANNOUNCEMENTS FUNCTIONS ============
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function loadAnnouncements() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setAnnouncements(data || [])
  }

  async function handleCreateOrUpdateAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      let imageUrl = announcementForm.featured_image_url

      if (imageFile) {
        setUploadingImage(true)
        const uploadedUrl = await uploadImage(imageFile, 'announcement-images')
        setUploadingImage(false)
        
        if (!uploadedUrl) throw new Error('Error al subir la imagen')
        imageUrl = uploadedUrl
      }

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
        const { error } = await supabase.from('announcements').update(announcementData).eq('id', announcementForm.id)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Anuncio actualizado exitosamente' })
      } else {
        const { error } = await supabase.from('announcements').insert(announcementData)
        if (error) throw error
        setMessage({ type: 'success', text: '✅ Anuncio creado exitosamente' })
      }

      setAnnouncementForm({
        id: null, title: '', content: '', excerpt: '', featured_image_url: '', published: false
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
      id: announcement.id, title: announcement.title, content: announcement.content,
      excerpt: announcement.excerpt || '', featured_image_url: announcement.featured_image_url || '',
      published: announcement.published
    })
    setImagePreview(announcement.featured_image_url || '')
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDeleteAnnouncement(id: number) {
    if (!confirm('¿Estás seguro de eliminar este anuncio?')) return

    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
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
      const { error } = await supabase.from('announcements').update({ published: !announcement.published }).eq('id', announcement.id)
      if (error) throw error

      setMessage({ type: 'success', text: `✅ Anuncio ${!announcement.published ? 'publicado' : 'despublicado'} exitosamente` })
      loadAnnouncements()
    } catch (error: any) {
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

  const TabButton = ({ id, label, icon: Icon }: { id: TabType; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-4 px-2 border-b-2 font-medium text-sm transition whitespace-nowrap ${
        activeTab === id
          ? 'border-red-600 text-red-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-gray-400">Gestión completa del sitio Real Fighters</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Alumnos</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.students}</p>
              </div>
              <Users className="w-8 md:w-12 h-8 md:h-12 text-blue-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Peleadores</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.fighters}</p>
              </div>
              <Trophy className="w-8 md:w-12 h-8 md:h-12 text-red-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Eventos</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.events}</p>
              </div>
              <Calendar className="w-8 md:w-12 h-8 md:h-12 text-purple-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Anuncios</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.announcements}</p>
              </div>
              <Newspaper className="w-8 md:w-12 h-8 md:h-12 text-orange-600 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-2 px-6 min-w-max">
              <TabButton id="students" label="Alumnos" icon={Users} />
              <TabButton id="fighters" label="Peleadores" icon={Trophy} />
              <TabButton id="filiales" label="Filiales" icon={Home} />
              <TabButton id="classes" label="Clases" icon={BookOpen} />
              <TabButton id="plans" label="Planes" icon={DollarSign} />
              <TabButton id="events" label="Eventos" icon={Calendar} />
              <TabButton id="fights" label="Combates" icon={Trophy} />
              <TabButton id="announcements" label="Anuncios" icon={Newspaper} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* STUDENTS */}
            {activeTab === 'students' && (
              <AdminStudentsTab 
                studentForm={studentForm} setStudentForm={setStudentForm}
                studentImageFile={studentImageFile} studentImagePreview={studentImagePreview}
                handleStudentImageSelect={handleStudentImageSelect}
                handleCreateOrUpdateStudent={handleCreateOrUpdateStudent}
                uploadingStudentImage={uploadingStudentImage}
                students={students}
                handleEditStudent={handleEditStudent}
                handleDeleteStudent={handleDeleteStudent}
              />
            )}

            {/* FIGHTERS */}
            {activeTab === 'fighters' && (
              <AdminFightersTab 
                fighterForm={fighterForm} setFighterForm={setFighterForm}
                fighterImageFile={fighterImageFile} fighterImagePreview={fighterImagePreview}
                handleFighterImageSelect={handleFighterImageSelect}
                handleCreateOrUpdateFighter={handleCreateOrUpdateFighter}
                uploadingFighterImage={uploadingFighterImage}
                allFighters={allFighters}
                handleEditFighter={handleEditFighter}
                handleDeleteFighter={handleDeleteFighter}
                handleToggleFighterActive={handleToggleFighterActive}
              />
            )}

            {/* FILIALES */}
            {activeTab === 'filiales' && (
              <AdminFilialesTab 
                filialForm={filialForm} setFilialForm={setFilialForm}
                filialImageFile={filialImageFile} filialImagePreview={filialImagePreview}
                handleFilialImageSelect={handleFilialImageSelect}
                handleCreateOrUpdateFilial={handleCreateOrUpdateFilial}
                uploadingFilialImage={uploadingFilialImage}
                filialesData={filialesData}
                handleEditFilial={handleEditFilial}
                handleDeleteFilial={handleDeleteFilial}
                editingFilialId={editingFilialId}
              />
            )}

            {/* CLASSES */}
            {activeTab === 'classes' && (
              <AdminClassesTab 
                classForm={classForm} setClassForm={setClassForm}
                classImageFile={classImageFile} classImagePreview={classImagePreview}
                handleClassImageSelect={handleClassImageSelect}
                handleCreateOrUpdateClass={handleCreateOrUpdateClass}
                uploadingClassImage={uploadingClassImage}
                classesData={classesData}
                handleEditClass={handleEditClass}
                handleDeleteClass={handleDeleteClass}
                editingClassSlug={editingClassSlug}
              />
            )}

            {/* PLANS */}
            {activeTab === 'plans' && (
              <AdminPlansTab 
                planForm={planForm} setPlanForm={setPlanForm}
                handleCreateOrUpdatePlan={handleCreateOrUpdatePlan}
                plansData={plansData}
                handleEditPlan={handleEditPlan}
                handleDeletePlan={handleDeletePlan}
                editingPlanId={editingPlanId}
              />
            )}

            {/* EVENTS */}
            {activeTab === 'events' && (
              <AdminEventsTab 
                eventForm={eventForm} setEventForm={setEventForm}
                handleCreateOrUpdateEvent={handleCreateOrUpdateEvent}
                events={events}
                handleEditEvent={handleEditEvent}
                handleDeleteEvent={handleDeleteEvent}
              />
            )}

            {/* FIGHTS */}
            {activeTab === 'fights' && (
              <AdminFightsTab 
                fightForm={fightForm} setFightForm={setFightForm}
                handleCreateFight={handleCreateFight}
                events={events}
                fighters={fighters}
              />
            )}

            {/* ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <AdminAnnouncementsTab 
                announcementForm={announcementForm} setAnnouncementForm={setAnnouncementForm}
                imageFile={imageFile} imagePreview={imagePreview}
                handleImageSelect={handleImageSelect}
                handleCreateOrUpdateAnnouncement={handleCreateOrUpdateAnnouncement}
                uploadingImage={uploadingImage}
                announcements={announcements}
                handleEditAnnouncement={handleEditAnnouncement}
                handleDeleteAnnouncement={handleDeleteAnnouncement}
                handleTogglePublish={handleTogglePublish}
                setPreviewAnnouncement={setPreviewAnnouncement}
              />
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
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

// ============ TAB COMPONENTS ============

function AdminStudentsTab({ studentForm, setStudentForm, studentImageFile, studentImagePreview, handleStudentImageSelect, handleCreateOrUpdateStudent, uploadingStudentImage, students, handleEditStudent, handleDeleteStudent }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {studentForm.id ? 'Editar Alumno' : 'Crear Nuevo Alumno'}
      </h2>

      <form onSubmit={handleCreateOrUpdateStudent} className="space-y-6 mb-12 pb-12 border-b">
        {/* Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto del Alumno</label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleStudentImageSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500">JPG, PNG o WebP. Máximo 5MB</p>
            
            {studentImagePreview && (
              <div className="relative inline-block">
                <img 
                  src={studentImagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setStudentForm({...studentForm, photo_url: ''})
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Básico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" required value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} placeholder="Nombre Completo *" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="email" value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="tel" value={studentForm.phone} onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} placeholder="Teléfono" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="date" value={studentForm.birth_date} onChange={(e) => setStudentForm({...studentForm, birth_date: e.target.value})} placeholder="Fecha de Nacimiento" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <select value={studentForm.discipline} onChange={(e) => setStudentForm({...studentForm, discipline: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Disciplina</option>
            <option value="MMA">MMA</option>
            <option value="Muay Thai">Muay Thai</option>
            <option value="BJJ">BJJ</option>
            <option value="Boxeo">Boxeo</option>
            <option value="CrossFit">CrossFit</option>
          </select>
          <input type="text" value={studentForm.belt_level} onChange={(e) => setStudentForm({...studentForm, belt_level: e.target.value})} placeholder="Nivel de Cinturón" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="date" value={studentForm.enrollment_date} onChange={(e) => setStudentForm({...studentForm, enrollment_date: e.target.value})} placeholder="Fecha de Inscripción" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="text" value={studentForm.gym} onChange={(e) => setStudentForm({...studentForm, gym: e.target.value})} placeholder="Gimnasio" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="number" step="0.1" value={studentForm.weight_kg} onChange={(e) => setStudentForm({...studentForm, weight_kg: e.target.value})} placeholder="Peso (kg)" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="number" step="1" value={studentForm.height_cm} onChange={(e) => setStudentForm({...studentForm, height_cm: e.target.value})} placeholder="Altura (cm)" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <select value={studentForm.status} onChange={(e) => setStudentForm({...studentForm, status: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>

        <textarea value={studentForm.notes} onChange={(e) => setStudentForm({...studentForm, notes: e.target.value})} placeholder="Notas adicionales..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

        <button 
          type="submit"
          disabled={uploadingStudentImage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {uploadingStudentImage ? 'Subiendo...' : (studentForm.id ? 'Actualizar' : 'Crear')}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Alumnos ({students.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student: any)=> (
          <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start space-x-4 mb-4">
              {student.photo_url ? (
                <img src={student.photo_url} alt={student.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 truncate">{student.name}</h4>
                {student.discipline && <p className="text-sm text-gray-600">{student.discipline}</p>}
                {student.belt_level && <p className="text-xs text-gray-500">Cinturón: {student.belt_level}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleEditStudent(student)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button onClick={() => handleDeleteStudent(student.id, student.photo_url)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminFightersTab({ fighterForm, setFighterForm, fighterImageFile, fighterImagePreview, handleFighterImageSelect, handleCreateOrUpdateFighter, uploadingFighterImage, allFighters, handleEditFighter, handleDeleteFighter, handleToggleFighterActive }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {fighterForm.id ? 'Editar Peleador' : 'Crear Nuevo Peleador'}
      </h2>

      <form onSubmit={handleCreateOrUpdateFighter} className="space-y-6 mb-12 pb-12 border-b">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
          <input type="file" accept="image/*" onChange={handleFighterImageSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
          {fighterImagePreview && <div className="mt-3 relative inline-block">
            <img src={fighterImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
            <button type="button" onClick={() => setFighterForm({...fighterForm, photo_url: ''})} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"><X className="w-4 h-4" /></button>
          </div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" required value={fighterForm.name} onChange={(e) => setFighterForm({...fighterForm, name: e.target.value})} placeholder="Nombre Completo *" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          <input type="text" value={fighterForm.nickname} onChange={(e) => setFighterForm({...fighterForm, nickname: e.target.value})} placeholder="Apodo" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          <input type="text" value={fighterForm.division} onChange={(e) => setFighterForm({...fighterForm, division: e.target.value})} placeholder="División" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          <input type="text" value={fighterForm.gym} onChange={(e) => setFighterForm({...fighterForm, gym: e.target.value})} placeholder="Gimnasio" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>

        <label className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
          <input type="checkbox" checked={fighterForm.is_active} onChange={(e) => setFighterForm({...fighterForm, is_active: e.target.checked})} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
          <span className="text-sm font-medium text-gray-700">Peleador activo</span>
        </label>

        <button type="submit" disabled={uploadingFighterImage} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">
          {uploadingFighterImage ? 'Subiendo...' : (fighterForm.id ? 'Actualizar' : 'Crear')}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Peleadores ({allFighters.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allFighters.map((fighter: any)=> (
          <div key={fighter.id} className={`bg-white border rounded-lg p-4 hover:shadow-md transition ${!fighter.is_active ? 'border-gray-300 opacity-60' : 'border-gray-200'}`}>
            <div className="flex items-start space-x-4 mb-4">
              {fighter.photo_url ? (
                <img src={fighter.photo_url} alt={fighter.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 truncate">{fighter.name}</h4>
                {fighter.nickname && <p className="text-sm text-gray-600">"{fighter.nickname}"</p>}
                {fighter.division && <p className="text-xs text-gray-500">{fighter.division}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleEditFighter(fighter)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button onClick={() => handleToggleFighterActive(fighter)} className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${fighter.is_active ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                {fighter.is_active ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={() => handleDeleteFighter(fighter.id, fighter.photo_url)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminFilialesTab({ filialForm, setFilialForm, filialImageFile, filialImagePreview, handleFilialImageSelect, handleCreateOrUpdateFilial, uploadingFilialImage, filialesData, handleEditFilial, handleDeleteFilial, editingFilialId }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {editingFilialId ? 'Editar Filial' : 'Crear Nueva Filial'}
      </h2>

      <form onSubmit={handleCreateOrUpdateFilial} className="space-y-6 mb-12 pb-12 border-b">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
          <input type="file" accept="image/*" onChange={handleFilialImageSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
          {filialImagePreview && <div className="mt-3 relative inline-block">
            <img src={filialImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
          </div>}
        </div>

        <input type="text" required value={filialForm.name} onChange={(e) => setFilialForm({...filialForm, name: e.target.value})} placeholder="Nombre *" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={filialForm.address} onChange={(e) => setFilialForm({...filialForm, address: e.target.value})} placeholder="Dirección" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="tel" value={filialForm.phone} onChange={(e) => setFilialForm({...filialForm, phone: e.target.value})} placeholder="Teléfono" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="email" value={filialForm.email} onChange={(e) => setFilialForm({...filialForm, email: e.target.value})} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="tel" value={filialForm.whatsapp} onChange={(e) => setFilialForm({...filialForm, whatsapp: e.target.value})} placeholder="WhatsApp" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>

        <textarea value={filialForm.descripcion} onChange={(e) => setFilialForm({...filialForm, descripcion: e.target.value})} placeholder="Descripción" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

        <button type="submit" disabled={uploadingFilialImage} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">
          {uploadingFilialImage ? 'Subiendo...' : (editingFilialId ? 'Actualizar' : 'Crear')}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Filiales ({filialesData.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filialesData.map((filial: any) => (
          <div key={filial.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start space-x-4 mb-4">
              {filial.image_url ? (
                <img src={filial.image_url} alt={filial.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{filial.name}</h4>
                <p className="text-xs text-gray-500">{filial.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleEditFilial(filial)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button onClick={() => handleDeleteFilial(filial.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminClassesTab({ classForm, setClassForm, classImageFile, classImagePreview, handleClassImageSelect, handleCreateOrUpdateClass, uploadingClassImage, classesData, handleEditClass, handleDeleteClass, editingClassSlug }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {editingClassSlug ? 'Editar Clase' : 'Crear Nueva Clase'}
      </h2>

      <form onSubmit={handleCreateOrUpdateClass} className="space-y-6 mb-12 pb-12 border-b">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
          <input type="file" accept="image/*" onChange={handleClassImageSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          {classImagePreview && <div className="mt-3 relative inline-block">
            <img src={classImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
          </div>}
        </div>

        <input type="text" required value={classForm.name} onChange={(e) => setClassForm({...classForm, name: e.target.value})} placeholder="Nombre de Clase *" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={classForm.ageRange} onChange={(e) => setClassForm({...classForm, ageRange: e.target.value})} placeholder="Rango de Edad" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <input type="text" value={classForm.schedule.days} onChange={(e) => setClassForm({...classForm, schedule: {...classForm.schedule, days: e.target.value}})} placeholder="Días" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <input type="text" value={classForm.pricing.monthly} onChange={(e) => setClassForm({...classForm, pricing: {...classForm.pricing, monthly: e.target.value}})} placeholder="Precio Mensual" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <select value={classForm.color} onChange={(e) => setClassForm({...classForm, color: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="bg-blue-600">Azul</option>
            <option value="bg-red-600">Rojo</option>
            <option value="bg-green-600">Verde</option>
            <option value="bg-yellow-600">Amarillo</option>
            <option value="bg-purple-600">Púrpura</option>
          </select>
        </div>

        <textarea value={classForm.shortDescription} onChange={(e) => setClassForm({...classForm, shortDescription: e.target.value})} placeholder="Descripción Corta" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        <textarea value={classForm.fullDescription} onChange={(e) => setClassForm({...classForm, fullDescription: e.target.value})} placeholder="Descripción Completa" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />

        <button type="submit" disabled={uploadingClassImage} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">
          {uploadingClassImage ? 'Subiendo...' : (editingClassSlug ? 'Actualizar' : 'Crear')}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Clases ({classesData.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classesData.map((clase: any) => (
          <div key={clase.slug} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start space-x-4 mb-4">
              {clase.imageUrl ? (
                <img src={clase.imageUrl} alt={clase.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{clase.name}</h4>
                <p className="text-xs text-gray-500">{clase.ageRange}</p>
                <p className="text-sm text-gray-600 font-semibold">{clase.pricing.monthly}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleEditClass(clase)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button onClick={() => handleDeleteClass(clase.slug)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminPlansTab({ planForm, setPlanForm, handleCreateOrUpdatePlan, plansData, handleEditPlan, handleDeletePlan, editingPlanId }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {editingPlanId ? 'Editar Plan' : 'Crear Nuevo Plan'}
      </h2>

      <form onSubmit={handleCreateOrUpdatePlan} className="space-y-6 mb-12 pb-12 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" required value={planForm.name} onChange={(e) => setPlanForm({...planForm, name: e.target.value})} placeholder="Nombre del Plan *" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
          <input type="text" value={planForm.subtitle} onChange={(e) => setPlanForm({...planForm, subtitle: e.target.value})} placeholder="Subtítulo" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
          <input type="text" value={planForm.price} onChange={(e) => setPlanForm({...planForm, price: e.target.value})} placeholder="Precio" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
          <select value={planForm.period} onChange={(e) => setPlanForm({...planForm, period: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
            <option value="mensual">Mensual</option>
            <option value="día">Día</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        <label className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
          <input type="checkbox" checked={planForm.highlighted} onChange={(e) => setPlanForm({...planForm, highlighted: e.target.checked})} className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Destacado</span>
        </label>

        <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition">
          {editingPlanId ? 'Actualizar' : 'Crear'}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Planes ({plansData.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plansData.map((plan: any) => (
          <div key={plan.id} className={`border rounded-lg p-4 hover:shadow-md transition ${plan.highlighted ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
            <h4 className="font-bold text-gray-900 mb-1">{plan.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{plan.subtitle}</p>
            <p className="text-2xl font-bold text-yellow-600 mb-4">{plan.price}</p>

            <div className="flex items-center gap-2">
              <button onClick={() => handleEditPlan(plan)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button onClick={() => handleDeletePlan(plan.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminEventsTab({ eventForm, setEventForm, handleCreateOrUpdateEvent, events, handleEditEvent, handleDeleteEvent }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {eventForm.id ? 'Editar Evento' : 'Crear Nuevo Evento'}
      </h2>

      <form onSubmit={handleCreateOrUpdateEvent} className="space-y-4 mb-12 pb-12 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" required value={eventForm.name} onChange={(e) => setEventForm({...eventForm, name: e.target.value})} placeholder="Nombre del Evento *" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="text" value={eventForm.org} onChange={(e) => setEventForm({...eventForm, org: e.target.value})} placeholder="Organización" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="date" value={eventForm.event_date} onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="text" value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} placeholder="Ubicación" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>

        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition">
          {eventForm.id ? 'Actualizar' : 'Crear'}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Eventos ({events.length})</h3>
      <div className="space-y-4">
        {events.map((event: any) => (
          <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{event.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {event.org && <p><strong>Org:</strong> {event.org}</p>}
                  {event.event_date && <p><strong>Fecha:</strong> {new Date(event.event_date).toLocaleDateString('es-MX')}</p>}
                  {event.location && <p className="col-span-2"><strong>Ubicación:</strong> {event.location}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleEditEvent(event)} className="p-2 hover:bg-blue-100 rounded transition">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button onClick={() => handleDeleteEvent(event.id)} className="p-2 hover:bg-red-100 rounded transition">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminFightsTab({ fightForm, setFightForm, handleCreateFight, events, fighters }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Registrar Nuevo Combate</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-blue-800 text-sm">Al registrar un combate, el récord de los peleadores se actualiza automáticamente.</p>
      </div>

      <form onSubmit={handleCreateFight} className="space-y-4">
        <select required value={fightForm.event_id} onChange={(e) => setFightForm({...fightForm, event_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
          <option value="">Seleccionar evento...</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name} - {event.event_date}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select required value={fightForm.red_fighter_id} onChange={(e) => setFightForm({...fightForm, red_fighter_id: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="">Peleador Esquina Roja...</option>
            {fighters.map((fighter: any) => (
              <option key={fighter.id} value={fighter.id}>{fighter.name}</option>
            ))}
          </select>
          <select required value={fightForm.blue_fighter_id} onChange={(e) => setFightForm({...fightForm, blue_fighter_id: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="">Peleador Esquina Azul...</option>
            {fighters.map((fighter: any) => (
              <option key={fighter.id} value={fighter.id}>{fighter.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select required value={fightForm.result} onChange={(e) => setFightForm({...fightForm, result: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="red">Victoria Rojo</option>
            <option value="blue">Victoria Azul</option>
            <option value="draw">Empate</option>
            <option value="nc">Sin Resultado</option>
          </select>
          <input type="text" value={fightForm.method} onChange={(e) => setFightForm({...fightForm, method: e.target.value})} placeholder="Método (KO, TKO, etc)" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          <input type="number" min="1" value={fightForm.round} onChange={(e) => setFightForm({...fightForm, round: parseInt(e.target.value)})} placeholder="Round" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>

        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
          Registrar Combate
        </button>
      </form>
    </div>
  )
}

function AdminAnnouncementsTab({ announcementForm, setAnnouncementForm, imageFile, imagePreview, handleImageSelect, handleCreateOrUpdateAnnouncement, uploadingImage, announcements, handleEditAnnouncement, handleDeleteAnnouncement, handleTogglePublish, setPreviewAnnouncement }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {announcementForm.id ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
      </h2>

      <form onSubmit={handleCreateOrUpdateAnnouncement} className="space-y-6 mb-12 pb-12 border-b">
        <input type="text" required value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} placeholder="Título del Anuncio *" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Destacada</label>
          <input type="file" accept="image/*" onChange={handleImageSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
          {imagePreview && <div className="mt-3 relative">
            <img src={imagePreview} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200" />
          </div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
          <RichTextEditor content={announcementForm.content} onChange={(html) => setAnnouncementForm({...announcementForm, content: html})} placeholder="Escribe el contenido del anuncio aquí..." />
        </div>

        <textarea value={announcementForm.excerpt} onChange={(e) => setAnnouncementForm({...announcementForm, excerpt: e.target.value})} placeholder="Extracto (se genera automáticamente si lo dejas vacío)" rows={3} maxLength={200} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

        <label className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
          <input type="checkbox" checked={announcementForm.published} onChange={(e) => setAnnouncementForm({...announcementForm, published: e.target.checked})} className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />
          <span className="text-sm font-medium text-gray-700">Publicar inmediatamente</span>
        </label>

        <button type="submit" disabled={uploadingImage} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">
          {uploadingImage ? 'Subiendo...' : (announcementForm.id ? 'Actualizar' : 'Crear')}
        </button>
      </form>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Anuncios ({announcements.length})</h3>
      <div className="space-y-4">
        {announcements.map((announcement: any ) X=> (
          <div key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${announcement.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {announcement.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{announcement.excerpt || 'Sin extracto'}</p>
                <p className="text-xs text-gray-400">{new Date(announcement.created_at).toLocaleDateString('es-MX')}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewAnnouncement(announcement)} className="p-2 hover:bg-gray-100 rounded transition">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => handleEditAnnouncement(announcement)} className="p-2 hover:bg-blue-100 rounded transition">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button onClick={() => handleTogglePublish(announcement)} className={`px-3 py-1 rounded text-xs font-semibold transition ${announcement.published ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                  {announcement.published ? 'Despublicar' : 'Publicar'}
                </button>
                <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="p-2 hover:bg-red-100 rounded transition">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}