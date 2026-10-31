'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ESTATUS_BECA,
  ESTATUS_LABEL,
  INGRESO_LABEL,
  MOTIVO_LABEL,
  TIPO_LABEL,
  estadoConvocatoria,
  folioBeca,
  parseBecasConfig,
  type BecasConfig,
} from '@/lib/becas'

type Estatus = (typeof ESTATUS_BECA)[number]
type Fila = {
  id: number
  created_at: string
  convocatoria: string
  tipo: keyof typeof TIPO_LABEL
  motivos: (keyof typeof MOTIVO_LABEL)[]
  nombre: string
  telefono: string
  email: string | null
  fecha_nacimiento: string
  es_menor: boolean
  filial: string
  disciplina: string
  es_alumno: boolean
  estatus: Estatus
  porcentaje_beca: number | null
}
type Detalle = {
  solicitud: Fila & {
    tutor_nombre: string | null
    tiempo_entrenando: string | null
    exposicion: string
    notas_admin: string | null
    revisado_por: string | null
    revisado_at: string | null
    datos: {
      socioeconomico: { ocupacion: string | null; dependientes: number | null; ingreso_rango: keyof typeof INGRESO_LABEL | null; situacion: string | null } | null
      desempeno: { record: string | null; logros: string | null; link: string | null } | null
    }
  }
  documentos: { nombre: string; url: string | null }[]
}

const ESTATUS_CLS: Record<Estatus, string> = {
  pendiente: 'bg-gray-100 text-gray-700',
  en_revision: 'bg-amber-100 text-amber-800',
  aprobada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-700',
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function csvCell(v: unknown) {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function BecasTab() {
  const [cfg, setCfg] = useState<BecasConfig | null>(null)
  const [cfgSaving, setCfgSaving] = useState(false)
  const [cfgMsg, setCfgMsg] = useState<string | null>(null)

  const [rows, setRows] = useState<Fila[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fTipo, setFTipo] = useState('')
  const [fMotivo, setFMotivo] = useState('')
  const [fEstatus, setFEstatus] = useState('')
  const [q, setQ] = useState('')
  const [abierta, setAbierta] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('config').select('data').eq('key', 'becas').maybeSingle().then(({ data }) => setCfg(parseBecasConfig(data?.data)))
  }, [])

  const cargar = useCallback(async () => {
    if (!cfg) return
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`/api/admin/becas?convocatoria=${encodeURIComponent(cfg.convocatoria)}`, { headers: await authHeader() })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Error al cargar')
      setRows(j.solicitudes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [cfg])

  useEffect(() => { cargar() }, [cargar])

  async function guardarConfig(e: React.FormEvent) {
    e.preventDefault()
    if (!cfg) return
    if (cfg.cierra_en < cfg.abre_en) { setCfgMsg('La fecha de cierre debe ser posterior a la de apertura'); return }
    setCfgSaving(true)
    setCfgMsg(null)
    const { error } = await supabase.from('config').upsert({ key: 'becas', data: cfg, updated_at: new Date() }, { onConflict: 'key' })
    setCfgSaving(false)
    if (error) { setCfgMsg(`No se pudo guardar: ${error.message}`); return }
    setCfgMsg('Guardado. La página pública se actualiza en máximo 1 minuto.')
  }

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase()
    return rows.filter((r) =>
      (!fTipo || r.tipo === fTipo) &&
      (!fMotivo || r.motivos.includes(fMotivo as Fila['motivos'][number])) &&
      (!fEstatus || r.estatus === fEstatus) &&
      (!s || r.nombre.toLowerCase().includes(s) || r.telefono.includes(s) || folioBeca(r.id).toLowerCase().includes(s))
    )
  }, [rows, fTipo, fMotivo, fEstatus, q])

  const conteo = useMemo(() => {
    const c = { total: rows.length, amateur: 0, profesional: 0, pendiente: 0, aprobada: 0 }
    for (const r of rows) {
      c[r.tipo]++
      if (r.estatus === 'pendiente' || r.estatus === 'en_revision') c.pendiente++
      if (r.estatus === 'aprobada') c.aprobada++
    }
    return c
  }, [rows])

  function exportarCSV() {
    const head = ['Folio', 'Fecha', 'Tipo', 'Motivos', 'Nombre', 'Teléfono', 'Correo', 'Nacimiento', 'Menor', 'Filial', 'Disciplina', 'Alumno', 'Estatus', '% Beca']
    const lines = filtradas.map((r) => [
      folioBeca(r.id), r.created_at.slice(0, 10), TIPO_LABEL[r.tipo], r.motivos.map((m) => MOTIVO_LABEL[m]).join(' + '),
      r.nombre, r.telefono, r.email, r.fecha_nacimiento, r.es_menor ? 'Sí' : 'No', r.filial, r.disciplina,
      r.es_alumno ? 'Sí' : 'No', ESTATUS_LABEL[r.estatus], r.porcentaje_beca ?? '',
    ].map(csvCell).join(','))
    const blob = new Blob(['﻿' + [head.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `becas-${cfg?.convocatoria}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const estado = cfg ? estadoConvocatoria(cfg) : null
  const selCls = 'rounded-lg border border-gray-300 px-3 py-2 text-sm'

  return (
    <div className="space-y-6">
      {/* Configuración de la convocatoria */}
      <form onSubmit={guardarConfig} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">Convocatoria</h3>
          {estado && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado === 'abierta' ? 'bg-green-100 text-green-800' : estado === 'proxima' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'}`}>
              {estado === 'abierta' ? 'Abierta' : estado === 'proxima' ? 'Próxima' : 'Cerrada'}
            </span>
          )}
          <a href="/becas" target="_blank" className="text-sm text-red-600 underline">Ver página pública</a>
        </div>
        {cfg && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <label className="text-sm text-gray-700">Clave
              <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={cfg.convocatoria} onChange={(e) => setCfg({ ...cfg, convocatoria: e.target.value.trim() })} />
            </label>
            <label className="text-sm text-gray-700">Abre
              <input type="date" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={cfg.abre_en} onChange={(e) => setCfg({ ...cfg, abre_en: e.target.value })} />
            </label>
            <label className="text-sm text-gray-700">Cierra
              <input type="date" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={cfg.cierra_en} onChange={(e) => setCfg({ ...cfg, cierra_en: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-4 w-4 accent-red-600" checked={cfg.activa} onChange={(e) => setCfg({ ...cfg, activa: e.target.checked })} />
              Convocatoria activa
            </label>
            <button disabled={cfgSaving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
              {cfgSaving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        )}
        {cfgMsg && <p className="mt-2 text-sm text-gray-600">{cfgMsg}</p>}
        <p className="mt-2 text-xs text-gray-500">Cambiar la clave inicia una convocatoria nueva; las solicitudes anteriores se conservan con su clave.</p>
      </form>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ['Solicitudes', conteo.total],
          ['Amateur', conteo.amateur],
          ['Profesional', conteo.profesional],
          ['Por revisar', conteo.pendiente],
          ['Aprobadas', conteo.aprobada],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500">{l}</p>
            <p className="text-2xl font-bold text-gray-900">{v}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <input className={`${selCls} min-w-[200px] flex-1`} placeholder="Buscar nombre, teléfono o folio" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={selCls} value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={selCls} value={fMotivo} onChange={(e) => setFMotivo(e.target.value)}>
          <option value="">Todos los motivos</option>
          {Object.entries(MOTIVO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={selCls} value={fEstatus} onChange={(e) => setFEstatus(e.target.value)}>
          <option value="">Todos los estatus</option>
          {ESTATUS_BECA.map((k) => <option key={k} value={k}>{ESTATUS_LABEL[k]}</option>)}
        </select>
        <button type="button" onClick={cargar} className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">Actualizar</button>
        <button type="button" onClick={exportarCSV} disabled={!filtradas.length} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">Exportar CSV</button>
      </div>

      {/* Tabla */}
      {error ? (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      ) : loading ? (
        <p className="text-gray-500">Cargando solicitudes…</p>
      ) : !filtradas.length ? (
        <p className="py-8 text-center text-gray-500">{rows.length ? 'Sin resultados con esos filtros.' : 'Aún no hay solicitudes en esta convocatoria.'}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2">Folio</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Motivo</th>
                <th className="px-3 py-2">Filial</th>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filtradas.map((r) => (
                <tr key={r.id} onClick={() => setAbierta(r.id)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs">{folioBeca(r.id)}</td>
                  <td className="px-3 py-2">
                    <span className="font-medium">{r.nombre}</span>
                    {r.es_alumno && <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">ALUMNO</span>}
                    {r.es_menor && <span className="ml-1 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">MENOR</span>}
                  </td>
                  <td className="px-3 py-2">{TIPO_LABEL[r.tipo]}</td>
                  <td className="px-3 py-2">{r.motivos.map((m) => MOTIVO_LABEL[m]).join(' + ')}</td>
                  <td className="px-3 py-2">{r.filial}</td>
                  <td className="whitespace-nowrap px-3 py-2">{new Date(r.created_at).toLocaleDateString('es-MX')}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ESTATUS_CLS[r.estatus]}`}>
                      {ESTATUS_LABEL[r.estatus]}{r.estatus === 'aprobada' && r.porcentaje_beca != null ? ` · ${r.porcentaje_beca}%` : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {abierta && <BecaModal id={abierta} onClose={() => setAbierta(null)} onSaved={() => { setAbierta(null); cargar() }} />}
    </div>
  )
}

function Dato({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === '') return null
  return (
    <div>
      <dt className="text-xs uppercase text-gray-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-gray-900">{value}</dd>
    </div>
  )
}

function BecaModal({ id, onClose, onSaved }: { id: number; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Detalle | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [estatus, setEstatus] = useState<Estatus>('pendiente')
  const [pct, setPct] = useState('')
  const [notas, setNotas] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      const r = await fetch(`/api/admin/becas/${id}`, { headers: await authHeader() })
      const j = await r.json()
      if (!r.ok) { setErr(j.error || 'No se pudo cargar'); return }
      setD(j)
      setEstatus(j.solicitud.estatus)
      setPct(j.solicitud.porcentaje_beca != null ? String(j.solicitud.porcentaje_beca) : '')
      setNotas(j.solicitud.notas_admin || '')
    })()
  }, [id])

  async function guardar() {
    setSaving(true)
    setErr(null)
    const r = await fetch(`/api/admin/becas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({ estatus, porcentaje_beca: estatus === 'aprobada' && pct !== '' ? Number(pct) : null, notas_admin: notas || null }),
    })
    const j = await r.json().catch(() => ({}))
    setSaving(false)
    if (!r.ok) { setErr(j.error || 'No se pudo guardar'); return }
    onSaved()
  }

  const s = d?.solicitud
  const socio = s?.datos?.socioeconomico
  const desemp = s?.datos?.desempeno
  const wa = s ? `https://wa.me/52${s.telefono}` : '#'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 text-gray-900 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-gray-500">{folioBeca(id)}</p>
            <h3 className="text-2xl font-bold">{s?.nombre || 'Cargando…'}</h3>
            {s && <p className="text-sm text-gray-600">{TIPO_LABEL[s.tipo]} · {s.motivos.map((m) => MOTIVO_LABEL[m]).join(' + ')}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg px-3 py-1 text-2xl leading-none text-gray-500 hover:bg-gray-100" aria-label="Cerrar">×</button>
        </div>

        {err && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}

        {s && (
          <div className="space-y-5">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Dato label="Teléfono" value={<a href={wa} target="_blank" className="text-green-700 underline">{s.telefono}</a>} />
              <Dato label="Correo" value={s.email} />
              <Dato label="Nacimiento" value={`${s.fecha_nacimiento}${s.es_menor ? ' (menor de edad)' : ''}`} />
              <Dato label="Tutor" value={s.tutor_nombre} />
              <Dato label="Filial / disciplina" value={`${s.filial} · ${s.disciplina}`} />
              <Dato label="¿Ya es alumno?" value={s.es_alumno ? 'Sí' : 'No'} />
              <Dato label="Tiempo entrenando" value={s.tiempo_entrenando} />
              <Dato label="Enviada" value={new Date(s.created_at).toLocaleString('es-MX')} />
            </dl>

            {socio && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-bold text-red-600">Socioeconómico</h4>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Dato label="Ocupación" value={socio.ocupacion} />
                  <Dato label="Dependientes" value={socio.dependientes} />
                  <Dato label="Ingreso del hogar" value={socio.ingreso_rango ? INGRESO_LABEL[socio.ingreso_rango] : null} />
                  <div className="sm:col-span-2"><Dato label="Situación" value={socio.situacion} /></div>
                </dl>
              </div>
            )}

            {desemp && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-bold text-red-600">Desempeño</h4>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Dato label="Récord" value={desemp.record} />
                  <Dato label="Link" value={desemp.link ? <a href={desemp.link} target="_blank" rel="noopener noreferrer" className="break-all text-blue-700 underline">{desemp.link}</a> : null} />
                  <div className="sm:col-span-2"><Dato label="Logros" value={desemp.logros} /></div>
                </dl>
              </div>
            )}

            <Dato label="Exposición de motivos" value={s.exposicion} />

            <div>
              <p className="text-xs uppercase text-gray-500">Comprobantes</p>
              {d.documentos.length ? (
                <ul className="mt-1 space-y-1">
                  {d.documentos.map((doc) => (
                    <li key={doc.nombre}>
                      {doc.url ? <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 underline">{doc.nombre}</a> : <span className="text-sm">{doc.nombre}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Sin archivos</p>
              )}
            </div>

            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <h4 className="font-bold">Dictamen</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">Estatus
                  <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={estatus} onChange={(e) => setEstatus(e.target.value as Estatus)}>
                    {ESTATUS_BECA.map((k) => <option key={k} value={k}>{ESTATUS_LABEL[k]}</option>)}
                  </select>
                </label>
                {estatus === 'aprobada' && (
                  <label className="text-sm">% de beca
                    <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" inputMode="numeric" value={pct} onChange={(e) => setPct(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="Ej. 50" />
                  </label>
                )}
              </div>
              <label className="block text-sm">Notas internas
                <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
              </label>
              {s.revisado_at && <p className="text-xs text-gray-500">Última revisión: {s.revisado_por} · {new Date(s.revisado_at).toLocaleString('es-MX')}</p>}
              <button onClick={guardar} disabled={saving || (estatus === 'aprobada' && Number(pct) > 100)} className="w-full rounded-lg bg-red-600 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {saving ? 'Guardando…' : 'Guardar dictamen'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
