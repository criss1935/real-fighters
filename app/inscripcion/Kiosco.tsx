'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CONSENTIMIENTOS, CONSENT_ORDER, type ConsentTipo } from '@/lib/consentimientos'
import { esMenor, edad, MOTIVOS } from '@/lib/inscripcion-schema'
import SignatureBox from './SignatureBox'

// ---------- tipos y estado inicial ----------
type Contacto = { nombre: string; parentesco: string; telefono: string }
type Form = {
  studentId: number | null
  general: { name: string; phone: string; email: string; birth_date: string; discipline: string; gym: string; weight_kg: string; height_cm: string; tutor_nombre: string }
  perfil: { sexo: '' | 'Masculino' | 'Femenino'; address: string; somatotipo: '' | 'endomorfica' | 'mesomorfica' | 'ectomorfa'; motivo_ejercicio: string[]; historia_deportiva: string; conocimientos_previos: '' | 'poco' | 'medio' | 'alto'; objetivo_1: string; objetivo_2: string }
  contactos: [Contacto, Contacto]
  medico: { lesiones: string; enfermedades: string; blood_type: string; alergias_medicamento: string }
  foto: string | null
  firmado_por: string
  firmas: Record<ConsentTipo, string | null>
}

const emptyForm = (): Form => ({
  studentId: null,
  general: { name: '', phone: '', email: '', birth_date: '', discipline: '', gym: '', weight_kg: '', height_cm: '', tutor_nombre: '' },
  perfil: { sexo: '', address: '', somatotipo: '', motivo_ejercicio: [], historia_deportiva: '', conocimientos_previos: '', objetivo_1: '', objetivo_2: '' },
  contactos: [
    { nombre: '', parentesco: '', telefono: '' },
    { nombre: '', parentesco: '', telefono: '' },
  ],
  medico: { lesiones: '', enfermedades: '', blood_type: '', alergias_medicamento: '' },
  foto: null,
  firmado_por: '',
  firmas: { reglamento: null, carta_compromiso: null, aviso_privacidad: null, carta_responsiva: null },
})

const MOTIVO_LABEL: Record<(typeof MOTIVOS)[number], string> = {
  entrenamiento_diversion: 'Entrenamiento y diversión',
  salud_estetica: 'Salud y estética',
  desarrollo_fisico: 'Desarrollo físico intenso',
  competencia: 'Competencia',
}

// Pasos: 0 inicio · 1 datos · 2 perfil · 3 emergencia · 4 médico · 5 foto · 6..9 documentos · 10 listo
const STEP_TITLES = ['Bienvenido', 'Datos generales', 'Tu perfil', 'Contactos de emergencia', 'Historial médico', 'Tu foto']
const FIRST_DOC_STEP = 6
const DONE_STEP = FIRST_DOC_STEP + CONSENT_ORDER.length
const INACTIVITY_MS = 5 * 60_000

// ---------- estilos base ----------
const inputCls = 'w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg focus:border-red-600 focus:outline-none'
const labelCls = 'block text-base font-semibold text-gray-800 mb-1'
const btnPrimary = 'rounded-xl bg-red-600 px-8 py-4 text-xl font-bold text-white active:bg-red-700 disabled:opacity-40'
const btnSecondary = 'rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-xl font-bold text-gray-800 active:bg-gray-100'

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-sm text-gray-500">{hint}</span>}
    </label>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 px-4 py-4 text-lg font-semibold transition ${
        active ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 bg-white text-gray-800'
      }`}
    >
      {children}
    </button>
  )
}

// Comprime la foto en el navegador (máx 800px, JPEG 0.8) antes de mandarla.
async function compressImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new window.Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = url
    })
    const scale = Math.min(1, 800 / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.8)
  } finally {
    URL.revokeObjectURL(url)
  }
}

const onlyDigits = (s: string) => s.replace(/\D/g, '')

export default function Kiosco({ disciplinas, filiales }: { disciplinas: string[]; filiales: string[] }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [folio, setFolio] = useState<string | null>(null)
  const [modo, setModo] = useState<'elegir' | 'buscar'>('elegir')
  const [q, setQ] = useState('')
  const [results, setResults] = useState<{ id: number; name: string; membership: string | null }[]>([])
  const [searching, setSearching] = useState(false)
  const [docRead, setDocRead] = useState(false)
  const [docAccepted, setDocAccepted] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const reset = useCallback(() => {
    setForm(emptyForm())
    setStep(0)
    setError(null)
    setFolio(null)
    setModo('elegir')
    setQ('')
    setResults([])
    setSending(false)
  }, [])

  // Si nadie toca la tablet por 5 min, regresa al inicio y borra todo.
  useEffect(() => {
    if (step === 0) return
    let t = setTimeout(reset, step === DONE_STEP ? 60_000 : INACTIVITY_MS)
    const bump = () => {
      clearTimeout(t)
      t = setTimeout(reset, step === DONE_STEP ? 60_000 : INACTIVITY_MS)
    }
    window.addEventListener('pointerdown', bump)
    window.addEventListener('keydown', bump)
    return () => {
      clearTimeout(t)
      window.removeEventListener('pointerdown', bump)
      window.removeEventListener('keydown', bump)
    }
  }, [step, reset])

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  // Búsqueda de alumno existente (debounced)
  useEffect(() => {
    if (modo !== 'buscar' || q.trim().length < 3) {
      setResults([])
      return
    }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/inscripcion/buscar?q=${encodeURIComponent(q.trim())}`)
        const j = await r.json()
        setResults(j.results || [])
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(t)
  }, [q, modo])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))
  const setG = (k: keyof Form['general'], v: string) => setForm((f) => ({ ...f, general: { ...f.general, [k]: v } }))
  const setP = <K extends keyof Form['perfil']>(k: K, v: Form['perfil'][K]) => setForm((f) => ({ ...f, perfil: { ...f.perfil, [k]: v } }))
  const setM = (k: keyof Form['medico'], v: string) => setForm((f) => ({ ...f, medico: { ...f.medico, [k]: v } }))
  const setC = (i: 0 | 1, k: keyof Contacto, v: string) =>
    setForm((f) => {
      const c = [...f.contactos] as [Contacto, Contacto]
      c[i] = { ...c[i], [k]: v }
      return { ...f, contactos: c }
    })

  const menor = form.general.birth_date ? esMenor(form.general.birth_date) : false

  // ---------- validación por paso ----------
  function validate(s: number): string | null {
    const g = form.general
    if (s === 1) {
      if (g.name.trim().length < 3) return 'Escribe tu nombre completo'
      if (onlyDigits(g.phone).length < 10) return 'El celular debe tener 10 dígitos'
      if (g.email && !/^\S+@\S+\.\S+$/.test(g.email)) return 'El correo no es válido'
      if (!g.birth_date) return 'Indica tu fecha de nacimiento'
      const e = edad(g.birth_date)
      if (e === null || e < 2 || e > 100) return 'Revisa tu fecha de nacimiento'
      if (!g.discipline) return 'Elige tu disciplina'
      if (!g.gym) return 'Elige tu filial'
      if (menor && g.tutor_nombre.trim().length < 3) return 'Como eres menor de edad, escribe el nombre de tu padre, madre o tutor'
    }
    if (s === 3) {
      const c = form.contactos[0]
      if (c.nombre.trim().length < 2) return 'Escribe el nombre de tu contacto de emergencia'
      if (onlyDigits(c.telefono).length < 10) return 'El teléfono del contacto debe tener 10 dígitos'
      const c2 = form.contactos[1]
      if (c2.nombre.trim() && onlyDigits(c2.telefono).length < 10) return 'Completa el teléfono del segundo contacto'
    }
    if (s >= FIRST_DOC_STEP && s < DONE_STEP) {
      const tipo = CONSENT_ORDER[s - FIRST_DOC_STEP]
      if (form.firmado_por.trim().length < 3) return 'Escribe el nombre completo de quien firma'
      if (!docAccepted) return 'Marca la casilla de que leíste y aceptas el documento'
      if (!form.firmas[tipo]) return 'Falta tu firma'
    }
    return null
  }

  function next() {
    const err = validate(step)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if (step === DONE_STEP - 1) {
      submit()
      return
    }
    if (step === 5 && !form.firmado_por) {
      set('firmado_por', menor ? form.general.tutor_nombre : form.general.name)
    }
    goTo(step + 1)
  }

  function goTo(s: number) {
    if (s >= FIRST_DOC_STEP && s < DONE_STEP) {
      const tipo = CONSENT_ORDER[s - FIRST_DOC_STEP]
      setForm((f) => ({ ...f, firmas: { ...f.firmas, [tipo]: null } }))
      setDocRead(false)
      setDocAccepted(false)
    }
    setStep(s)
  }

  async function submit() {
    setSending(true)
    setError(null)
    const num = (s: string) => (s.trim() === '' ? null : Number(s))
    const payload = {
      studentId: form.studentId,
      general: {
        name: form.general.name.trim(),
        phone: form.general.phone,
        email: form.general.email.trim(),
        birth_date: form.general.birth_date,
        discipline: form.general.discipline,
        gym: form.general.gym,
        weight_kg: num(form.general.weight_kg),
        height_cm: num(form.general.height_cm),
        tutor_nombre: menor ? form.general.tutor_nombre.trim() : '',
      },
      perfil: {
        ...form.perfil,
        sexo: form.perfil.sexo || null,
        somatotipo: form.perfil.somatotipo || null,
        conocimientos_previos: form.perfil.conocimientos_previos || null,
      },
      contactos: form.contactos.filter((c) => c.nombre.trim()),
      medico: { ...form.medico, blood_type: form.medico.blood_type && form.medico.blood_type !== 'nose' ? form.medico.blood_type : null },
      foto: form.foto,
      firmas: { firmado_por: form.firmado_por.trim(), ...form.firmas },
    }
    try {
      const r = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = await r.json()
      if (!r.ok || !j.ok) throw new Error(j.error || 'No se pudo guardar')
      setFolio(j.folio)
      setStep(DONE_STEP)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar, intenta de nuevo')
    } finally {
      setSending(false)
    }
  }

  // ---------- render ----------
  const totalSteps = DONE_STEP - 1
  const progress = step === 0 ? 0 : Math.min(100, Math.round((step / totalSteps) * 100))
  const docTipo = step >= FIRST_DOC_STEP && step < DONE_STEP ? CONSENT_ORDER[step - FIRST_DOC_STEP] : null
  const title = docTipo ? CONSENTIMIENTOS[docTipo].titulo : STEP_TITLES[step]

  return (
    <div className="min-h-screen bg-black text-white">
      <div ref={topRef} />
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Image src="/icon.png" alt="Real Fighters" width={48} height={48} className="rounded-full" />
          <div>
            <p className="text-2xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              Real Fighters México
            </p>
            <p className="text-sm text-gray-400">Expediente del alumno</p>
          </div>
        </div>
        {step > 0 && step < DONE_STEP && (
          <button onClick={reset} className="rounded-lg border border-gray-600 px-4 py-2 text-base text-gray-300 active:bg-gray-800">
            Cancelar
          </button>
        )}
      </header>

      {step > 0 && step < DONE_STEP && (
        <div className="px-6 pt-4">
          <div className="h-3 w-full rounded-full bg-gray-800">
            <div className="h-3 rounded-full bg-red-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Paso {step} de {totalSteps}
          </p>
        </div>
      )}

      <main className="mx-auto max-w-3xl px-6 py-6">
        {step !== DONE_STEP && (
          <h1 className="mb-6 text-5xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            {title}
          </h1>
        )}

        {/* PASO 0: inicio */}
        {step === 0 && modo === 'elegir' && (
          <div className="space-y-6">
            <p className="text-xl text-gray-300">
              Llena tu expediente para mantener tus datos al día. Te toma unos 5 minutos.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <button onClick={() => setModo('buscar')} className="rounded-2xl bg-white p-8 text-left text-gray-900 active:bg-gray-100">
                <span className="block text-3xl font-bold">Ya soy alumno</span>
                <span className="mt-2 block text-lg text-gray-600">Busca tu nombre y actualiza tus datos</span>
              </button>
              <button
                onClick={() => {
                  set('studentId', null)
                  goTo(1)
                }}
                className="rounded-2xl bg-red-600 p-8 text-left text-white active:bg-red-700"
              >
                <span className="block text-3xl font-bold">Soy nuevo</span>
                <span className="mt-2 block text-lg text-red-100">Inscríbete por primera vez</span>
              </button>
            </div>
          </div>
        )}

        {step === 0 && modo === 'buscar' && (
          <div className="space-y-4">
            <Field label="Escribe tu nombre o tu celular">
              <input autoFocus className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej. Juan Pérez o 5512345678" />
            </Field>
            {searching && <p className="text-gray-400">Buscando…</p>}
            {!searching && q.trim().length >= 3 && results.length === 0 && (
              <p className="text-gray-300">No encontramos coincidencias. Revisa cómo lo escribiste o regístrate como nuevo.</p>
            )}
            <div className="space-y-3">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setForm((f) => ({ ...f, studentId: r.id, general: { ...f.general, name: r.name } }))
                    goTo(1)
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-4 text-left text-gray-900 active:bg-gray-100"
                >
                  <span className="text-xl font-semibold">{r.name}</span>
                  {r.membership && <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">{r.membership}</span>}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => { setModo('elegir'); setQ('') }} className={btnSecondary}>
                Regresar
              </button>
              <button onClick={() => { set('studentId', null); goTo(1) }} className="text-lg text-gray-300 underline">
                No aparezco, soy nuevo
              </button>
            </div>
          </div>
        )}

        {step > 0 && step < DONE_STEP && (
          <div className="rounded-2xl bg-white p-6 text-gray-900 md:p-8">
            {/* PASO 1 */}
            {step === 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                {form.studentId && (
                  <p className="md:col-span-2 rounded-lg bg-green-50 p-3 text-green-800">
                    Estás actualizando tu registro. Revisa y completa tus datos.
                  </p>
                )}
                <div className="md:col-span-2">
                  <Field label="Nombre completo" required>
                    <input className={inputCls} value={form.general.name} onChange={(e) => setG('name', e.target.value)} autoComplete="off" />
                  </Field>
                </div>
                <Field label="Celular" required>
                  <input className={inputCls} inputMode="tel" value={form.general.phone} onChange={(e) => setG('phone', e.target.value)} placeholder="10 dígitos" />
                </Field>
                <Field label="Correo">
                  <input className={inputCls} type="email" inputMode="email" value={form.general.email} onChange={(e) => setG('email', e.target.value)} autoComplete="off" />
                </Field>
                <Field label="Fecha de nacimiento" required>
                  <input className={inputCls} type="date" value={form.general.birth_date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setG('birth_date', e.target.value)} />
                </Field>
                <Field label="Disciplina" required>
                  <select className={inputCls} value={form.general.discipline} onChange={(e) => setG('discipline', e.target.value)}>
                    <option value="">Elige…</option>
                    {disciplinas.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Filial" required>
                  <select className={inputCls} value={form.general.gym} onChange={(e) => setG('gym', e.target.value)}>
                    <option value="">Elige…</option>
                    {filiales.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Peso (kg)">
                    <input className={inputCls} inputMode="decimal" value={form.general.weight_kg} onChange={(e) => setG('weight_kg', e.target.value.replace(/[^\d.]/g, ''))} />
                  </Field>
                  <Field label="Estatura (cm)">
                    <input className={inputCls} inputMode="numeric" value={form.general.height_cm} onChange={(e) => setG('height_cm', onlyDigits(e.target.value))} />
                  </Field>
                </div>
                {menor && (
                  <div className="md:col-span-2 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
                    <Field label="Nombre del padre, madre o tutor" required hint="Como eres menor de edad, tu tutor debe firmar los documentos.">
                      <input className={inputCls} value={form.general.tutor_nombre} onChange={(e) => setG('tutor_nombre', e.target.value)} />
                    </Field>
                  </div>
                )}
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className={labelCls}>Sexo</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Masculino', 'Femenino'] as const).map((s) => (
                      <Choice key={s} active={form.perfil.sexo === s} onClick={() => setP('sexo', s)}>{s}</Choice>
                    ))}
                  </div>
                </div>
                <Field label="Dirección">
                  <textarea className={inputCls} rows={2} value={form.perfil.address} onChange={(e) => setP('address', e.target.value)} placeholder="Calle, número, colonia, alcaldía" />
                </Field>
                <div>
                  <span className={labelCls}>Tipo de cuerpo</span>
                  <div className="grid grid-cols-3 gap-3">
                    {([['endomorfica', 'Endomórfica'], ['mesomorfica', 'Mesomórfica'], ['ectomorfa', 'Ectomorfa']] as const).map(([v, l]) => (
                      <Choice key={v} active={form.perfil.somatotipo === v} onClick={() => setP('somatotipo', v)}>{l}</Choice>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={labelCls}>¿Por qué entrenas? (puedes elegir varios)</span>
                  <div className="grid grid-cols-2 gap-3">
                    {MOTIVOS.map((m) => {
                      const on = form.perfil.motivo_ejercicio.includes(m)
                      return (
                        <Choice
                          key={m}
                          active={on}
                          onClick={() =>
                            setP('motivo_ejercicio', on ? form.perfil.motivo_ejercicio.filter((x) => x !== m) : [...form.perfil.motivo_ejercicio, m])
                          }
                        >
                          {MOTIVO_LABEL[m]}
                        </Choice>
                      )
                    })}
                  </div>
                </div>
                <Field label="Historia deportiva" hint="Qué técnicas has practicado y cuánto tiempo">
                  <textarea className={inputCls} rows={3} value={form.perfil.historia_deportiva} onChange={(e) => setP('historia_deportiva', e.target.value)} />
                </Field>
                <div>
                  <span className={labelCls}>Conocimientos previos</span>
                  <div className="grid grid-cols-3 gap-3">
                    {([['poco', 'Poco'], ['medio', 'Medio'], ['alto', 'Alto']] as const).map(([v, l]) => (
                      <Choice key={v} active={form.perfil.conocimientos_previos === v} onClick={() => setP('conocimientos_previos', v)}>{l}</Choice>
                    ))}
                  </div>
                </div>
                <Field label="Objetivo 1">
                  <input className={inputCls} value={form.perfil.objetivo_1} onChange={(e) => setP('objetivo_1', e.target.value)} />
                </Field>
                <Field label="Objetivo 2">
                  <input className={inputCls} value={form.perfil.objetivo_2} onChange={(e) => setP('objetivo_2', e.target.value)} />
                </Field>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="space-y-8">
                {([0, 1] as const).map((i) => (
                  <div key={i} className="space-y-4">
                    <p className="text-xl font-bold">
                      Contacto {i + 1} {i === 0 ? <span className="text-red-600">*</span> : <span className="text-base font-normal text-gray-500">(opcional)</span>}
                    </p>
                    <Field label="Nombre">
                      <input className={inputCls} value={form.contactos[i].nombre} onChange={(e) => setC(i, 'nombre', e.target.value)} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Parentesco">
                        <input className={inputCls} value={form.contactos[i].parentesco} onChange={(e) => setC(i, 'parentesco', e.target.value)} placeholder="Mamá, esposo, hermano…" />
                      </Field>
                      <Field label="Teléfono">
                        <input className={inputCls} inputMode="tel" value={form.contactos[i].telefono} onChange={(e) => setC(i, 'telefono', e.target.value)} placeholder="10 dígitos" />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PASO 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <Field label="Lesiones importantes">
                  <textarea className={inputCls} rows={2} value={form.medico.lesiones} onChange={(e) => setM('lesiones', e.target.value)} placeholder="Escribe 'Ninguna' si no tienes" />
                </Field>
                <Field label="Enfermedades">
                  <textarea className={inputCls} rows={2} value={form.medico.enfermedades} onChange={(e) => setM('enfermedades', e.target.value)} placeholder="Escribe 'Ninguna' si no tienes" />
                </Field>
                <Field label="Tipo de sangre">
                  <select className={inputCls} value={form.medico.blood_type} onChange={(e) => setM('blood_type', e.target.value)}>
                    <option value="">Elige…</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="nose">No sé</option>
                  </select>
                </Field>
                <Field label="Alergias a medicamentos">
                  <textarea className={inputCls} rows={2} value={form.medico.alergias_medicamento} onChange={(e) => setM('alergias_medicamento', e.target.value)} placeholder="Escribe 'Ninguna' si no tienes" />
                </Field>
              </div>
            )}

            {/* PASO 5 */}
            {step === 5 && (
              <div className="space-y-5 text-center">
                <p className="text-lg text-gray-700">Tómate una foto de frente, con buena luz. Es la que aparecerá en tu perfil de alumno.</p>
                {form.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.foto} alt="Tu foto" className="mx-auto h-64 w-64 rounded-2xl object-cover" />
                ) : (
                  <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-2xl bg-gray-100 text-6xl">📷</div>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                  <label className={`${btnPrimary} cursor-pointer`}>
                    {form.foto ? 'Tomar otra' : 'Tomar foto'}
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ''
                        if (!file) return
                        try {
                          set('foto', await compressImage(file))
                        } catch {
                          setError('No se pudo leer la foto, intenta de nuevo')
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Si ahorita no puedes, puedes continuar sin foto.</p>
              </div>
            )}

            {/* PASOS 6-9: documentos */}
            {docTipo && (
              <div className="space-y-5">
                <div
                  className="h-80 overflow-y-auto whitespace-pre-line rounded-xl border-2 border-gray-200 bg-gray-50 p-5 text-base leading-relaxed text-gray-800"
                  onScroll={(e) => {
                    const el = e.currentTarget
                    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setDocRead(true)
                  }}
                  ref={(el) => {
                    if (el && !docRead && el.scrollHeight <= el.clientHeight + 24) setDocRead(true)
                  }}
                >
                  {CONSENTIMIENTOS[docTipo].texto}
                </div>
                {!docRead && <p className="text-sm text-amber-700">Desliza el texto hasta el final para poder aceptarlo.</p>}
                <label className={`flex items-center gap-3 text-lg ${docRead ? '' : 'opacity-40'}`}>
                  <input
                    type="checkbox"
                    disabled={!docRead}
                    checked={docAccepted}
                    onChange={(e) => setDocAccepted(e.target.checked)}
                    className="h-7 w-7 accent-red-600"
                  />
                  He leído y acepto el {CONSENTIMIENTOS[docTipo].titulo.toLowerCase()}
                </label>
                <Field label={menor ? 'Nombre del padre, madre o tutor que firma' : 'Nombre completo de quien firma'} required>
                  <input className={inputCls} value={form.firmado_por} onChange={(e) => set('firmado_por', e.target.value)} />
                </Field>
                <SignatureBox
                  resetKey={docTipo}
                  onChange={(v) => setForm((f) => ({ ...f, firmas: { ...f.firmas, [docTipo]: v } }))}
                />
              </div>
            )}

            {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-lg font-semibold text-red-700">{error}</p>}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setError(null)
                  goTo(step - 1)
                }}
                className={btnSecondary}
                disabled={sending}
              >
                Atrás
              </button>
              <button onClick={next} className={btnPrimary} disabled={sending}>
                {sending ? 'Guardando…' : step === DONE_STEP - 1 ? 'Firmar y terminar' : step === 5 && !form.foto ? 'Continuar sin foto' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}

        {/* LISTO */}
        {step === DONE_STEP && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-5xl">✓</div>
            <h1 className="text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              ¡Listo, {form.general.name.split(' ')[0]}!
            </h1>
            <p className="mt-4 text-2xl text-gray-300">Tu expediente quedó guardado.</p>
            {folio && <p className="mt-2 text-xl text-gray-400">Folio: <span className="font-bold text-white">{folio}</span></p>}
            <button onClick={reset} className={`${btnPrimary} mt-10`}>
              Siguiente alumno
            </button>
            <p className="mt-4 text-sm text-gray-500">Esta pantalla se reinicia sola en un minuto.</p>
          </div>
        )}
      </main>
    </div>
  )
}
