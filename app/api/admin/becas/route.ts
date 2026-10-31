import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

const LIST_COLS =
  'id, created_at, convocatoria, tipo, motivos, nombre, telefono, email, fecha_nacimiento, es_menor, filial, disciplina, es_alumno, estatus, porcentaje_beca, revisado_at'

export async function GET(req: NextRequest) {
  if (!hasServiceRole) return NextResponse.json({ error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const convocatoria = req.nextUrl.searchParams.get('convocatoria')
  let q = supabaseAdmin.from('beca_solicitudes').select(LIST_COLS).order('created_at', { ascending: false }).limit(1000)
  if (convocatoria) q = q.eq('convocatoria', convocatoria)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ solicitudes: data || [] })
}
