'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const DOC_LABEL: Record<string, string> = {
  reglamento: 'Reglamento de uso',
  carta_compromiso: 'Carta compromiso',
  aviso_privacidad: 'Aviso de privacidad',
  carta_responsiva: 'Carta responsiva',
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Estado del expediente de cada alumno (lo lee el admin con su sesión; RLS lo permite solo a admin)
export function useExpedientes(refreshKey: unknown) {
  const [map, setMap] = useState<Record<number, string | null>>({})
  useEffect(() => {
    supabase
      .from('students_private')
      .select('student_id, expediente_completado_at')
      .then(({ data }) => {
        const m: Record<number, string | null> = {}
        for (const r of data || []) m[r.student_id] = r.expediente_completado_at
        setMap(m)
      })
  }, [refreshKey])
  return map
}

export function ExportAlumnosButton() {
  const [busy, setBusy] = useState(false)
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try {
          const r = await fetch('/api/admin/alumnos/export', { headers: await authHeader() })
          if (!r.ok) throw new Error()
          const blob = await r.blob()
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = `alumnos-real-fighters-${new Date().toISOString().slice(0, 10)}.xlsx`
          a.click()
          URL.revokeObjectURL(a.href)
        } catch {
          alert('No se pudo generar el Excel')
        } finally {
          setBusy(false)
        }
      }}
      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
    >
      {busy ? 'Generando…' : 'Exportar Excel'}
    </button>
  )
}

type Expediente = {
  privado: Record<string, unknown> | null
  contactos: { nombre: string; parentesco: string | null; telefono: string | null; orden: number }[]
  consentimientos: { tipo: string; version: string; firmado_por: string; firmado_at: string; firma_url: string | null }[]
}

export function ExpedienteModal({ student, onClose }: { student: { id: number; name: string } | null; onClose: () => void }) {
  const [data, setData] = useState<Expediente | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!student) return
    setData(null)
    setErr(null)
    ;(async () => {
      const r = await fetch(`/api/admin/alumnos/${student.id}/expediente`, { headers: await authHeader() })
      if (!r.ok) return setErr('No se pudo cargar el expediente')
      setData(await r.json())
    })()
  }, [student])

  if (!student) return null
  const p = data?.privado
  const row = (label: string, value: unknown) =>
    value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0) ? (
      <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="col-span-2 text-gray-900 whitespace-pre-line">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
      </div>
    ) : null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-gray-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Expediente</h3>
            <p className="text-gray-600">{student.name} · RFM-{String(student.id).padStart(6, '0')}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">×</button>
        </div>

        {err && <p className="text-red-600">{err}</p>}
        {!data && !err && <p className="text-gray-500">Cargando…</p>}

        {data && !p?.expediente_completado_at && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-800 text-sm">Este alumno todavía no llena su expediente en la tablet.</p>
        )}

        {data && p && (
          <>
            <h4 className="font-bold mt-2 mb-1">Perfil</h4>
            {row('Sexo', p.sexo)}
            {row('Dirección', p.address)}
            {row('Somatotipo', p.somatotipo)}
            {row('Motivo', p.motivo_ejercicio)}
            {row('Historia deportiva', p.historia_deportiva)}
            {row('Conocimientos', p.conocimientos_previos)}
            {row('Objetivo 1', p.objetivo_1)}
            {row('Objetivo 2', p.objetivo_2)}
            {row('Menor de edad', p.es_menor ? `Sí · tutor: ${p.tutor_nombre || '—'}` : null)}

            <h4 className="font-bold mt-4 mb-1">Médico</h4>
            {row('Tipo de sangre', p.blood_type)}
            {row('Lesiones', p.lesiones)}
            {row('Enfermedades', p.enfermedades)}
            {row('Alergias', p.alergias_medicamento)}
          </>
        )}

        {data && data.contactos.length > 0 && (
          <>
            <h4 className="font-bold mt-4 mb-1">Contactos de emergencia</h4>
            {data.contactos.map((c) => row(`Contacto ${c.orden}`, `${c.nombre}${c.parentesco ? ` (${c.parentesco})` : ''} · ${c.telefono || ''}`))}
          </>
        )}

        {data && data.consentimientos.length > 0 && (
          <>
            <h4 className="font-bold mt-4 mb-2">Documentos firmados</h4>
            <div className="grid grid-cols-2 gap-3">
              {data.consentimientos.map((c) => (
                <div key={c.tipo} className="border rounded-lg p-2">
                  <p className="text-sm font-semibold">{DOC_LABEL[c.tipo] || c.tipo}</p>
                  <p className="text-xs text-gray-500">
                    {c.firmado_por} · {new Date(c.firmado_at).toLocaleDateString('es-MX')}
                  </p>
                  {c.firma_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.firma_url} alt={`Firma ${c.tipo}`} className="mt-2 w-full h-20 object-contain bg-gray-50 rounded" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
