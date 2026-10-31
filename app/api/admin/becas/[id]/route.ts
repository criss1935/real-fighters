import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'
import { DOCS_BUCKET, ESTATUS_BECA, PORCENTAJES } from '@/lib/becas'

export const dynamic = 'force-dynamic'

function parseId(raw: string) {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Detalle completo + URLs firmadas (5 min) de los comprobantes.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasServiceRole) return NextResponse.json({ error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const id = parseId((await params).id)
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const { data: sol, error } = await supabaseAdmin.from('beca_solicitudes').select('*').eq('id', id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!sol) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })

  const folder = `${sol.convocatoria}/${id}`
  const { data: files } = await supabaseAdmin.storage.from(DOCS_BUCKET).list(folder, { limit: 20 })
  const documentos = await Promise.all(
    (files || [])
      .filter((f) => f.id)
      .map(async (f) => {
        const { data } = await supabaseAdmin.storage.from(DOCS_BUCKET).createSignedUrl(`${folder}/${f.name}`, 300)
        return { nombre: f.name, url: data?.signedUrl || null }
      })
  )

  return NextResponse.json({ solicitud: sol, documentos })
}

const patchSchema = z
  .object({
    estatus: z.enum(ESTATUS_BECA),
    porcentaje_beca: z.number().int().refine((p) => (PORCENTAJES as readonly number[]).includes(p), 'Porcentaje inválido').nullable(),
    notas_admin: z.string().trim().max(2000).nullable(),
  })
  .refine((d) => d.estatus !== 'aprobada' || d.porcentaje_beca != null, { message: 'Elige el porcentaje de la beca aprobada' })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasServiceRole) return NextResponse.json({ error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const id = parseId((await params).id)
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Datos inválidos' }, { status: 400 })
  const d = parsed.data

  const { error } = await supabaseAdmin
    .from('beca_solicitudes')
    .update({
      estatus: d.estatus,
      porcentaje_beca: d.estatus === 'aprobada' ? d.porcentaje_beca : null,
      notas_admin: d.notas_admin || null,
      revisado_por: admin.email || admin.id,
      revisado_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
