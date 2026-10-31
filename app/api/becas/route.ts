import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { clientIp, rateLimited } from '@/lib/require-admin'
import { esMenor } from '@/lib/inscripcion-schema'
import { becaSchema, estadoConvocatoria, folioBeca, parseBecasConfig, safeFileName, DOCS_BUCKET } from '@/lib/becas'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Los archivos NO pasan por aquí (límite de body de Vercel ~4.5 MB):
// se devuelven URLs firmadas de subida y el navegador sube directo a Storage.
export async function POST(req: NextRequest) {
  if (!hasServiceRole) return NextResponse.json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })

  const ip = clientIp(req)
  if (rateLimited(`becas:${ip}`, 10, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados envíos desde este dispositivo. Intenta más tarde.' }, { status: 429 })
  }

  const { data: cfgRow } = await supabaseAdmin.from('config').select('data').eq('key', 'becas').maybeSingle()
  const cfg = parseBecasConfig(cfgRow?.data)
  const estado = estadoConvocatoria(cfg)
  if (estado !== 'abierta') {
    return NextResponse.json(
      { ok: false, error: estado === 'proxima' ? 'La convocatoria aún no abre.' : 'La convocatoria está cerrada.' },
      { status: 403 }
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida' }, { status: 400 })
  }

  const parsed = becaSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ ok: false, error: first?.message || 'Datos inválidos', field: first?.path.join('.') }, { status: 400 })
  }
  const d = parsed.data
  const menor = esMenor(d.fecha_nacimiento)

  const { data: row, error } = await supabaseAdmin
    .from('beca_solicitudes')
    .insert({
      convocatoria: cfg.convocatoria,
      perfil: d.perfil,
      motivos: d.socioeconomico ? ['escolar', 'socioeconomico'] : ['escolar'],
      nombre: d.nombre,
      telefono: d.telefono.replace(/\D/g, '').slice(-10),
      email: d.email,
      fecha_nacimiento: d.fecha_nacimiento,
      es_menor: menor,
      tutor_nombre: menor ? d.tutor_nombre : null,
      filial: d.filial,
      disciplina: d.disciplina,
      tiempo_entrenando: d.perfil === 'alumno' ? d.tiempo_entrenando : null,
      nivel_educativo: d.escolar.nivel_educativo,
      escuela: d.escolar.escuela,
      grado: d.escolar.grado,
      promedio: Math.round(d.escolar.promedio * 100) / 100,
      datos: {
        esfuerzo_escolar: d.escolar.esfuerzo,
        socioeconomico: d.socioeconomico ? d.socio : null,
      },
      motivacion: d.motivacion,
      ip: ip !== 'unknown' ? ip : null,
      user_agent: req.headers.get('user-agent')?.slice(0, 300) || null,
    })
    .select('id')
    .single()

  if (error || !row) {
    if (error?.code === '23505') {
      return NextResponse.json({ ok: false, error: 'Ya existe una solicitud con este teléfono en esta convocatoria.' }, { status: 409 })
    }
    console.error('[becas]', error?.message)
    return NextResponse.json({ ok: false, error: 'No se pudo registrar la solicitud, intenta de nuevo.' }, { status: 500 })
  }

  const uploads: { path: string; token: string }[] = []
  for (const [i, doc] of d.documentos.entries()) {
    const path = `${cfg.convocatoria}/${row.id}/${i + 1}-${safeFileName(doc.name)}`
    const { data: signed, error: upErr } = await supabaseAdmin.storage.from(DOCS_BUCKET).createSignedUploadUrl(path)
    if (upErr || !signed) {
      console.error('[becas] signed upload', upErr?.message)
      continue
    }
    uploads.push({ path, token: signed.token })
  }

  return NextResponse.json({ ok: true, id: row.id, folio: folioBeca(row.id), uploads, bucket: DOCS_BUCKET })
}
