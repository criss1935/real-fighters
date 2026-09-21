import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin'
import { inscripcionSchema, esMenor } from '@/lib/inscripcion-schema'
import { CONSENT_ORDER, CONSENT_VERSION } from '@/lib/consentimientos'
import { clientIp, rateLimited } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const PHOTO_BUCKET = 'students-photos'
const SIGN_BUCKET = 'firmas'

function dataUrlToBuffer(dataUrl: string): Buffer {
  return Buffer.from(dataUrl.split(',')[1], 'base64')
}

export async function POST(req: NextRequest) {
  if (!hasServiceRole) return NextResponse.json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor' }, { status: 503 })
  const ip = clientIp(req)
  if (rateLimited(`inscripcion:${ip}`, 30, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados envíos desde este dispositivo. Intenta más tarde.' }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida' }, { status: 400 })
  }

  const parsed = inscripcionSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json(
      { ok: false, error: first?.message || 'Datos inválidos', field: first?.path.join('.') },
      { status: 400 }
    )
  }
  const d = parsed.data
  const menor = esMenor(d.general.birth_date)

  const uploaded: { bucket: string; path: string }[] = []
  let createdStudentId: number | null = null

  try {
    // 1) students (solo datos públicos/no sensibles)
    const studentRow = {
      name: d.general.name,
      phone: d.general.phone.replace(/\D/g, ''),
      email: d.general.email,
      birth_date: d.general.birth_date,
      discipline: d.general.discipline,
      gym: d.general.gym,
      weight_kg: d.general.weight_kg,
      height_cm: d.general.height_cm,
      status: 'active',
      updated_at: new Date().toISOString(),
    }

    let studentId: number
    if (d.studentId) {
      const { data, error } = await supabaseAdmin
        .from('students')
        .update(studentRow)
        .eq('id', d.studentId)
        .select('id')
        .single()
      if (error || !data) throw new Error('No encontramos tu registro de alumno')
      studentId = data.id
    } else {
      const { data, error } = await supabaseAdmin
        .from('students')
        .insert({ ...studentRow, enrollment_date: new Date().toISOString().slice(0, 10) })
        .select('id')
        .single()
      if (error || !data) throw new Error('No se pudo crear el alumno')
      studentId = data.id
      createdStudentId = studentId
    }

    // 2) students_private
    const { error: privErr } = await supabaseAdmin.from('students_private').upsert(
      {
        student_id: studentId,
        sexo: d.perfil.sexo,
        address: d.perfil.address,
        somatotipo: d.perfil.somatotipo,
        motivo_ejercicio: d.perfil.motivo_ejercicio,
        historia_deportiva: d.perfil.historia_deportiva,
        conocimientos_previos: d.perfil.conocimientos_previos,
        objetivo_1: d.perfil.objetivo_1,
        objetivo_2: d.perfil.objetivo_2,
        lesiones: d.medico.lesiones,
        enfermedades: d.medico.enfermedades,
        blood_type: d.medico.blood_type,
        alergias_medicamento: d.medico.alergias_medicamento,
        es_menor: menor,
        tutor_nombre: menor ? d.general.tutor_nombre : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id' }
    )
    if (privErr) throw new Error('No se pudo guardar el expediente')

    // 3) contactos de emergencia
    await supabaseAdmin.from('student_emergency_contacts').delete().eq('student_id', studentId)
    const { error: contErr } = await supabaseAdmin.from('student_emergency_contacts').insert(
      d.contactos.map((c, i) => ({
        student_id: studentId,
        nombre: c.nombre,
        parentesco: c.parentesco,
        telefono: c.telefono.replace(/\D/g, ''),
        orden: i + 1,
      }))
    )
    if (contErr) throw new Error('No se pudieron guardar los contactos de emergencia')

    // 4) foto
    if (d.foto) {
      const path = `kiosco/${studentId}.jpg`
      const { error } = await supabaseAdmin.storage
        .from(PHOTO_BUCKET)
        .upload(path, dataUrlToBuffer(d.foto), { contentType: 'image/jpeg', upsert: true })
      if (error) throw new Error('No se pudo subir la foto')
      uploaded.push({ bucket: PHOTO_BUCKET, path })
      const { data: pub } = supabaseAdmin.storage.from(PHOTO_BUCKET).getPublicUrl(path)
      await supabaseAdmin.from('students').update({ photo_url: `${pub.publicUrl}?v=${Date.now()}` }).eq('id', studentId)
    }

    // 5) firmas + consentimientos
    const ua = req.headers.get('user-agent')?.slice(0, 300) || null
    const consentRows = []
    for (const tipo of CONSENT_ORDER) {
      const path = `${studentId}/${tipo}-${CONSENT_VERSION}.png`
      const { error } = await supabaseAdmin.storage
        .from(SIGN_BUCKET)
        .upload(path, dataUrlToBuffer(d.firmas[tipo]), { contentType: 'image/png', upsert: true })
      if (error) throw new Error('No se pudieron guardar las firmas')
      uploaded.push({ bucket: SIGN_BUCKET, path })
      consentRows.push({
        student_id: studentId,
        tipo,
        version: CONSENT_VERSION,
        firma_path: path,
        firmado_por: d.firmas.firmado_por,
        firmado_at: new Date().toISOString(),
        ip: ip !== 'unknown' ? ip : null,
        user_agent: ua,
      })
    }
    const { error: consErr } = await supabaseAdmin
      .from('student_consents')
      .upsert(consentRows, { onConflict: 'student_id,tipo,version' })
    if (consErr) throw new Error('No se pudieron registrar los documentos firmados')

    // 6) marcar expediente completo
    await supabaseAdmin
      .from('students_private')
      .update({ expediente_completado_at: new Date().toISOString() })
      .eq('student_id', studentId)

    return NextResponse.json({ ok: true, studentId, folio: `RFM-${String(studentId).padStart(6, '0')}` })
  } catch (e) {
    // Rollback de lo que se alcanzó a subir en este intento
    for (const u of uploaded) {
      await supabaseAdmin.storage.from(u.bucket).remove([u.path]).catch(() => {})
    }
    if (createdStudentId) {
      await supabaseAdmin.from('students').delete().eq('id', createdStudentId)
    }
    const msg = e instanceof Error ? e.message : 'Error inesperado'
    console.error('[inscripcion]', msg)
    return NextResponse.json({ ok: false, error: `${msg}. No se guardó la inscripción, intenta de nuevo.` }, { status: 500 })
  }
}
