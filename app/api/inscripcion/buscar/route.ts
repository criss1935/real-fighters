import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { clientIp, rateLimited } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

// Búsqueda pública del kiosco: devuelve SOLO id, nombre y membresía.
export async function GET(req: NextRequest) {
  if (!hasServiceRole) return NextResponse.json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  if (rateLimited(`buscar:${clientIp(req)}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas búsquedas, espera un momento' }, { status: 429 })
  }

  const q = (req.nextUrl.searchParams.get('q') || '').trim()
  if (q.length < 3) return NextResponse.json({ results: [] })

  const digits = q.replace(/\D/g, '')
  const safe = q.replace(/[%_,()]/g, ' ')

  let query = supabaseAdmin.from('students').select('id, name, membership').limit(8)
  query = digits.length >= 4 ? query.ilike('phone', `%${digits}%`) : query.ilike('name', `%${safe}%`)

  const { data, error } = await query.order('name')
  if (error) return NextResponse.json({ error: 'No se pudo buscar' }, { status: 500 })
  return NextResponse.json({ results: data || [] })
}
