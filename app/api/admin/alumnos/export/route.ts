import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

type Row = Record<string, unknown>

function sheet(wb: ExcelJS.Workbook, name: string, cols: { header: string; key: string; width?: number }[], rows: Row[]) {
  const ws = wb.addWorksheet(name)
  ws.columns = cols.map((c) => ({ ...c, width: c.width ?? 18 }))
  ws.addRows(rows)
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB91C1C' } }
  ws.views = [{ state: 'frozen', ySplit: 1 }]
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } }
}

export async function GET(req: NextRequest) {
  if (!hasServiceRole) return NextResponse.json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const [st, pr, ct, cs] = await Promise.all([
    supabaseAdmin.from('students').select('*').order('name'),
    supabaseAdmin.from('students_private').select('*'),
    supabaseAdmin.from('student_emergency_contacts').select('*').order('student_id').order('orden'),
    supabaseAdmin.from('student_consents').select('student_id, tipo, version, firmado_por, firmado_at').order('student_id'),
  ])
  if (st.error || pr.error || ct.error || cs.error) {
    return NextResponse.json({ error: 'No se pudieron leer los datos' }, { status: 500 })
  }

  const priv = new Map((pr.data || []).map((p) => [p.student_id, p]))
  const names = new Map((st.data || []).map((s) => [s.id, s.name]))
  const contactos = new Map<number, Row[]>()
  for (const c of ct.data || []) {
    const arr = contactos.get(c.student_id) || []
    arr.push(c)
    contactos.set(c.student_id, arr)
  }

  const alumnos = (st.data || []).map((s) => {
    const p = priv.get(s.id) || {}
    const c1 = contactos.get(s.id)?.[0] || {}
    return {
      folio: `RFM-${String(s.id).padStart(6, '0')}`,
      num_anterior: s.legacy_num,
      nombre: s.name,
      celular: s.phone,
      email: s.email,
      fecha_nacimiento: s.birth_date,
      sexo: p.sexo,
      disciplina: s.discipline,
      filial: s.gym,
      membresia: s.membership,
      estatus: s.status,
      inscripcion: s.enrollment_date,
      peso_kg: s.weight_kg,
      estatura_cm: s.height_cm,
      direccion: p.address,
      somatotipo: p.somatotipo,
      motivo_ejercicio: Array.isArray(p.motivo_ejercicio) ? p.motivo_ejercicio.join(', ') : '',
      historia_deportiva: p.historia_deportiva,
      conocimientos_previos: p.conocimientos_previos,
      objetivo_1: p.objetivo_1,
      objetivo_2: p.objetivo_2,
      lesiones: p.lesiones,
      enfermedades: p.enfermedades,
      tipo_sangre: p.blood_type,
      alergias: p.alergias_medicamento,
      menor: p.es_menor ? 'Sí' : 'No',
      tutor: p.tutor_nombre,
      contacto_emergencia: c1.nombre,
      tel_emergencia: c1.telefono,
      expediente_completo: p.expediente_completado_at ? 'Sí' : 'No',
      expediente_fecha: p.expediente_completado_at ? String(p.expediente_completado_at).slice(0, 10) : '',
      foto: s.photo_url ? 'Sí' : 'No',
    }
  })

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Real Fighters México'
  sheet(
    wb,
    'Alumnos',
    Object.keys(alumnos[0] || { folio: '' }).map((k) => ({ header: k.replace(/_/g, ' ').toUpperCase(), key: k, width: ['nombre', 'direccion', 'historia_deportiva', 'email'].includes(k) ? 32 : 18 })),
    alumnos
  )
  sheet(
    wb,
    'Contactos emergencia',
    [
      { header: 'ALUMNO', key: 'alumno', width: 32 },
      { header: 'ORDEN', key: 'orden', width: 8 },
      { header: 'NOMBRE', key: 'nombre', width: 32 },
      { header: 'PARENTESCO', key: 'parentesco' },
      { header: 'TELÉFONO', key: 'telefono' },
    ],
    (ct.data || []).map((c) => ({ ...c, alumno: names.get(c.student_id) }))
  )
  sheet(
    wb,
    'Documentos firmados',
    [
      { header: 'ALUMNO', key: 'alumno', width: 32 },
      { header: 'DOCUMENTO', key: 'tipo', width: 22 },
      { header: 'VERSIÓN', key: 'version', width: 10 },
      { header: 'FIRMÓ', key: 'firmado_por', width: 32 },
      { header: 'FECHA', key: 'fecha', width: 20 },
    ],
    (cs.data || []).map((c) => ({ ...c, alumno: names.get(c.student_id), fecha: String(c.firmado_at).replace('T', ' ').slice(0, 16) }))
  )

  const buf = await wb.xlsx.writeBuffer()
  const fecha = new Date().toISOString().slice(0, 10)
  return new NextResponse(buf as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="alumnos-real-fighters-${fecha}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
