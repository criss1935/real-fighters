import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

// Expediente privado de un alumno + URLs firmadas (60 s) de sus firmas.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasServiceRole) return NextResponse.json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  const studentId = Number(id)
  if (!Number.isInteger(studentId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const [pr, ct, cs] = await Promise.all([
    supabaseAdmin.from('students_private').select('*').eq('student_id', studentId).maybeSingle(),
    supabaseAdmin.from('student_emergency_contacts').select('nombre, parentesco, telefono, orden').eq('student_id', studentId).order('orden'),
    supabaseAdmin.from('student_consents').select('tipo, version, firma_path, firmado_por, firmado_at').eq('student_id', studentId).order('firmado_at'),
  ])

  const consents = await Promise.all(
    (cs.data || []).map(async (c) => {
      const { data } = await supabaseAdmin.storage.from('firmas').createSignedUrl(c.firma_path, 60)
      return { ...c, firma_url: data?.signedUrl || null }
    })
  )

  return NextResponse.json({ privado: pr.data, contactos: ct.data || [], consentimientos: consents })
}
