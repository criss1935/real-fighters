'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { esMenor } from '@/lib/inscripcion-schema'
import {
  becaSchema,
  DOC_MAX_BYTES,
  DOC_MAX_FILES,
  DOC_MIME,
  INGRESO_LABEL,
  NIVEL_LABEL,
  NIVELES,
  PERFIL_LABEL,
  PERFILES,
  RANGOS_INGRESO,
} from '@/lib/becas'

type Perfil = (typeof PERFILES)[number]

const PERFIL_DESC: Record<Perfil, string> = {
  alumno: 'Ya soy alumno regular de Real Fighters.',
  nuevo: 'Quiero empezar a entrenar, aunque no tenga experiencia.',
}

const inputCls = 'w-full rounded-lg border border-zinc-300 px-4 py-3 text-base focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30'
const cardBase = 'rounded-xl border-2 p-4 text-left transition'
const cardOn = 'border-red-600 bg-red-600/10'
const cardOff = 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:p-7">
      <h3 className="mb-5 flex items-center gap-3 text-2xl md:text-3xl">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 font-sans text-base font-bold">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({ label, required, hint, error, children }: { label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
      {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
    </label>
  )
}

function formatBytes(n: number) {
  return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`
}

export default function BecasForm({ disciplinas, filiales }: { disciplinas: string[]; filiales: string[] }) {
  const [perfil, setPerfil] = useState<Perfil | ''>('')
  const [g, setG] = useState({ nombre: '', telefono: '', email: '', fecha_nacimiento: '', tutor_nombre: '', filial: '', disciplina: '', tiempo_entrenando: '' })
  const [esc, setEsc] = useState({ nivel_educativo: '', escuela: '', grado: '', promedio: '', esfuerzo: '' })
  const [socioSi, setSocioSi] = useState<'' | 'si' | 'no'>('')
  const [socio, setSocio] = useState({ ocupacion: '', dependientes: '', ingreso_rango: '', situacion: '' })
  const [motivacion, setMotivacion] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [privacidad, setPrivacidad] = useState(false)
  const [veracidad, setVeracidad] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [fatal, setFatal] = useState<string | null>(null)
  const [done, setDone] = useState<{ folio: string; fallidos: number } | null>(null)

  const menor = useMemo(() => (g.fecha_nacimiento ? esMenor(g.fecha_nacimiento) : false), [g.fecha_nacimiento])
  const upd = <K extends keyof typeof g>(k: K, v: string) => setG((s) => ({ ...s, [k]: v }))
  const updE = <K extends keyof typeof esc>(k: K, v: string) => setEsc((s) => ({ ...s, [k]: v }))

  function addFiles(list: FileList | null) {
    if (!list) return
    const next = [...files]
    const errs: string[] = []
    for (const f of Array.from(list)) {
      if (next.length >= DOC_MAX_FILES) { errs.push(`Máximo ${DOC_MAX_FILES} archivos`); break }
      if (!(DOC_MIME as readonly string[]).includes(f.type)) { errs.push(`${f.name}: solo PDF, JPG o PNG`); continue }
      if (f.size > DOC_MAX_BYTES) { errs.push(`${f.name}: pesa más de 5 MB`); continue }
      next.push(f)
    }
    setFiles(next)
    setErrors((e) => ({ ...e, documentos: errs.join(' · ') }))
  }

  function buildPayload() {
    return {
      perfil,
      socioeconomico: socioSi === 'si',
      nombre: g.nombre,
      telefono: g.telefono,
      email: g.email,
      fecha_nacimiento: g.fecha_nacimiento,
      tutor_nombre: g.tutor_nombre,
      filial: g.filial,
      disciplina: g.disciplina,
      tiempo_entrenando: perfil === 'alumno' ? g.tiempo_entrenando : '',
      escolar: {
        nivel_educativo: esc.nivel_educativo,
        escuela: esc.escuela,
        grado: esc.grado,
        promedio: esc.promedio === '' ? undefined : Number(esc.promedio),
        esfuerzo: esc.esfuerzo,
      },
      socio: {
        ocupacion: socio.ocupacion,
        dependientes: socio.dependientes === '' ? null : Number(socio.dependientes),
        ingreso_rango: socio.ingreso_rango || null,
        situacion: socio.situacion,
      },
      motivacion,
      documentos: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      acepta_privacidad: privacidad,
      declara_veracidad: veracidad,
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFatal(null)
    const payload = buildPayload()
    const v = becaSchema.safeParse(payload)
    if (!v.success || socioSi === '') {
      const map: Record<string, string> = {}
      for (const i of v.success ? [] : v.error.issues) {
        const k = i.path.join('.')
        if (!map[k]) map[k] = i.message
      }
      if (socioSi === '') map.socioSi = 'Indica si tu situación socioeconómica es parte del motivo'
      setErrors(map)
      setFatal('Revisa los campos marcados en rojo.')
      return
    }
    setErrors({})
    setSending(true)
    try {
      const r = await fetch('/api/becas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const res = await r.json().catch(() => ({}))
      if (!r.ok || !res.ok) {
        if (res.field) setErrors({ [res.field]: res.error })
        throw new Error(res.error || 'No se pudo enviar la solicitud')
      }
      let fallidos = 0
      const uploads: { path: string; token: string }[] = res.uploads || []
      for (const [i, u] of uploads.entries()) {
        const { error } = await supabase.storage.from(res.bucket).uploadToSignedUrl(u.path, u.token, files[i], { contentType: files[i].type })
        if (error) fallidos++
      }
      fallidos += Math.max(0, files.length - uploads.length)
      setDone({ folio: res.folio, fallidos })
      document.getElementById('solicitud')?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      setFatal(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-red-600/50 bg-zinc-950 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">Solicitud recibida</p>
        <p className="mt-2 text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{done.folio}</p>
        <p className="mt-4 text-zinc-300">
          Guarda tu folio. El Comité revisará tu solicitud y recepción te comunicará el resultado por WhatsApp a más tardar el 6 de diciembre.
        </p>
        {done.fallidos > 0 && (
          <p className="mt-4 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-300">
            {done.fallidos === 1 ? 'Un archivo no se pudo subir' : `${done.fallidos} archivos no se pudieron subir`}. Tu solicitud sí quedó
            registrada; entrega el comprobante en recepción mencionando tu folio.
          </p>
        )}
        <Link href="/" className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-bold hover:bg-red-700">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const err = (k: string) => errors[k]
  let n = 0

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Section n={++n} title="¿Ya entrenas en RFM o quieres iniciar?">
        <div className="grid gap-3 sm:grid-cols-2">
          {PERFILES.map((p) => (
            <button key={p} type="button" onClick={() => setPerfil(p)} className={`${cardBase} ${perfil === p ? cardOn : cardOff}`} aria-pressed={perfil === p}>
              <span className="block text-lg font-bold">{PERFIL_LABEL[p]}</span>
              <span className="mt-1 block text-sm text-zinc-400">{PERFIL_DESC[p]}</span>
            </button>
          ))}
        </div>
        {err('perfil') && <p className="mt-2 text-sm text-red-400">{err('perfil')}</p>}
        {perfil === 'alumno' && (
          <div className="mt-4 max-w-sm">
            <Field label="¿Cuánto tiempo llevas entrenando en RFM?" error={err('tiempo_entrenando')}>
              <input className={inputCls} value={g.tiempo_entrenando} onChange={(e) => upd('tiempo_entrenando', e.target.value)} placeholder="Ej. 8 meses" />
            </Field>
          </div>
        )}
      </Section>

      <Section n={++n} title="Datos personales">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Nombre completo" required error={err('nombre')}>
              <input className={inputCls} value={g.nombre} onChange={(e) => upd('nombre', e.target.value)} autoComplete="name" />
            </Field>
          </div>
          <Field label="Teléfono / WhatsApp" required error={err('telefono')}>
            <input className={inputCls} inputMode="tel" value={g.telefono} onChange={(e) => upd('telefono', e.target.value)} placeholder="10 dígitos" autoComplete="tel" />
          </Field>
          <Field label="Correo electrónico" error={err('email')}>
            <input className={inputCls} type="email" inputMode="email" value={g.email} onChange={(e) => upd('email', e.target.value)} autoComplete="email" />
          </Field>
          <Field label="Fecha de nacimiento" required error={err('fecha_nacimiento')}>
            <input className={inputCls} type="date" max={new Date().toISOString().slice(0, 10)} value={g.fecha_nacimiento} onChange={(e) => upd('fecha_nacimiento', e.target.value)} />
          </Field>
          {menor && (
            <Field label="Nombre del padre, madre o tutor" required error={err('tutor_nombre')} hint="Obligatorio para menores de edad">
              <input className={inputCls} value={g.tutor_nombre} onChange={(e) => upd('tutor_nombre', e.target.value)} />
            </Field>
          )}
          <Field label="Filial" required error={err('filial')}>
            <select className={inputCls} value={g.filial} onChange={(e) => upd('filial', e.target.value)}>
              <option value="">Selecciona…</option>
              {filiales.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Disciplina que más te motiva" required error={err('disciplina')} hint="El Plan #RFM incluye todas las disciplinas">
            <select className={inputCls} value={g.disciplina} onChange={(e) => upd('disciplina', e.target.value)}>
              <option value="">Selecciona…</option>
              {disciplinas.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section n={++n} title="Rendimiento escolar">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nivel educativo" required error={err('escolar.nivel_educativo')}>
            <select className={inputCls} value={esc.nivel_educativo} onChange={(e) => updE('nivel_educativo', e.target.value)}>
              <option value="">Selecciona…</option>
              {NIVELES.map((l) => <option key={l} value={l}>{NIVEL_LABEL[l]}</option>)}
            </select>
          </Field>
          <Field label="Grado o semestre" required error={err('escolar.grado')}>
            <input className={inputCls} value={esc.grado} onChange={(e) => updE('grado', e.target.value)} placeholder="Ej. 2° de secundaria, 5° semestre" />
          </Field>
          <Field label="Escuela" error={err('escolar.escuela')}>
            <input className={inputCls} value={esc.escuela} onChange={(e) => updE('escuela', e.target.value)} />
          </Field>
          <Field label="Promedio reciente" required error={err('escolar.promedio')} hint="Escala de 0 a 10">
            <input className={inputCls} inputMode="decimal" value={esc.promedio} onChange={(e) => updE('promedio', e.target.value.replace(/[^\d.]/g, '').slice(0, 5))} placeholder="Ej. 8.7" />
          </Field>
          <div className="md:col-span-2">
            <Field label="¿Qué esfuerzo o mejora escolar quieres destacar?" required error={err('escolar.esfuerzo')} hint="Una materia que sacaste adelante, constancia, un reconocimiento, cómo mejoraste…">
              <textarea className={inputCls} rows={4} maxLength={1500} value={esc.esfuerzo} onChange={(e) => updE('esfuerzo', e.target.value)} />
            </Field>
          </div>
        </div>
      </Section>

      <Section n={++n} title="Situación socioeconómica">
        <span className="mb-2 block text-sm font-semibold text-zinc-200">
          ¿Tu situación socioeconómica es parte del motivo de tu solicitud? <span className="text-red-500">*</span>
        </span>
        <div className="grid max-w-sm grid-cols-2 gap-3">
          {(['si', 'no'] as const).map((v) => (
            <button key={v} type="button" onClick={() => setSocioSi(v)} className={`${cardBase} py-3 text-center font-bold ${socioSi === v ? cardOn : cardOff}`}>
              {v === 'si' ? 'Sí' : 'No'}
            </button>
          ))}
        </div>
        {err('socioSi') && <p className="mt-2 text-sm text-red-400">{err('socioSi')}</p>}
        {socioSi === 'si' && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Ocupación de quien sostiene el hogar" error={err('socio.ocupacion')}>
              <input className={inputCls} value={socio.ocupacion} onChange={(e) => setSocio({ ...socio, ocupacion: e.target.value })} />
            </Field>
            <Field label="Personas que dependen de ese ingreso" error={err('socio.dependientes')}>
              <input className={inputCls} inputMode="numeric" value={socio.dependientes} onChange={(e) => setSocio({ ...socio, dependientes: e.target.value.replace(/\D/g, '').slice(0, 2) })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Ingreso mensual aproximado del hogar" required error={err('socio.ingreso_rango')}>
                <select className={inputCls} value={socio.ingreso_rango} onChange={(e) => setSocio({ ...socio, ingreso_rango: e.target.value })}>
                  <option value="">Selecciona…</option>
                  {RANGOS_INGRESO.map((r) => <option key={r} value={r}>{INGRESO_LABEL[r]}</option>)}
                </select>
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Describe brevemente tu situación" required error={err('socio.situacion')}>
                <textarea className={inputCls} rows={3} maxLength={1500} value={socio.situacion} onChange={(e) => setSocio({ ...socio, situacion: e.target.value })} />
              </Field>
            </div>
          </div>
        )}
      </Section>

      <Section n={++n} title="Motivación personal">
        <Field label="¿Por qué quieres entrenar y crecer en RFM?" required error={err('motivacion')} hint={`${motivacion.trim().length}/2000 · mínimo 50 caracteres`}>
          <textarea className={inputCls} rows={5} maxLength={2000} value={motivacion} onChange={(e) => setMotivacion(e.target.value)} />
        </Field>
      </Section>

      <Section n={++n} title="Comprobantes escolares (opcional)">
        <p className="mb-3 text-sm text-zinc-400">
          Boleta, constancia de estudios o reconocimientos. Son confidenciales: solo los ve el Comité. PDF, JPG o PNG, máximo {DOC_MAX_FILES} archivos de 5 MB.
        </p>
        <label className={`flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center ${files.length >= DOC_MAX_FILES ? 'pointer-events-none border-zinc-800 text-zinc-600' : 'border-zinc-700 text-zinc-300 hover:border-red-600'}`}>
          <input type="file" className="sr-only" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          {files.length >= DOC_MAX_FILES ? 'Límite de archivos alcanzado' : 'Toca para adjuntar archivos'}
        </label>
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-zinc-900 px-3 py-2 text-sm">
                <span className="truncate">{f.name} <span className="text-zinc-500">· {formatBytes(f.size)}</span></span>
                <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="shrink-0 text-red-400 hover:text-red-300">Quitar</button>
              </li>
            ))}
          </ul>
        )}
        {err('documentos') && <p className="mt-2 text-sm text-red-400">{err('documentos')}</p>}
      </Section>

      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:p-7">
        <label className="flex items-start gap-3 text-sm text-zinc-300">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-red-600" checked={privacidad} onChange={(e) => setPrivacidad(e.target.checked)} />
          <span>
            He leído y acepto el <Link href="/aviso-privacidad" target="_blank" className="text-red-500 underline">aviso de privacidad</Link>, incluido el tratamiento de mis datos escolares y socioeconómicos para evaluar esta solicitud.
          </span>
        </label>
        {err('acepta_privacidad') && <p className="text-sm text-red-400">{err('acepta_privacidad')}</p>}
        <label className="flex items-start gap-3 text-sm text-zinc-300">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-red-600" checked={veracidad} onChange={(e) => setVeracidad(e.target.checked)} />
          <span>Declaro que la información proporcionada es verídica. RFM puede solicitar documentos adicionales para verificarla.</span>
        </label>
        {err('declara_veracidad') && <p className="text-sm text-red-400">{err('declara_veracidad')}</p>}
      </div>

      {fatal && <p className="rounded-lg bg-red-600/15 p-3 text-center text-red-300">{fatal}</p>}

      <button type="submit" disabled={sending} className="w-full rounded-xl bg-red-600 py-4 text-xl font-bold uppercase tracking-wide hover:bg-red-700 disabled:opacity-50">
        {sending ? 'Enviando…' : 'Enviar solicitud'}
      </button>
    </form>
  )
}
