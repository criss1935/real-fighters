import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
// Force deploy fix

export async function POST(req: NextRequest) {
  try {
    // Verificar token de autorización
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('Token recibido:', token ? 'presente' : 'ausente')
    console.log('Token esperado:', process.env.INTAKE_TOKEN ? 'configurado' : 'NO CONFIGURADO')
    
    if (token !== process.env.INTAKE_TOKEN) {
      console.error('Token inválido')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Leer payload
    const body = await req.json()
    console.log('Payload recibido:', JSON.stringify(body, null, 2))

    const {
      name,
      nickname,
      height_cm,
      weight_kg,
      reach_cm,
      stance,
      division,
      discipline,  // ← AGREGAR ESTO
      gym,
      photo_url
    } = body

    // Validar campos requeridos
    if (!name) {
      console.error('Nombre faltante')
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const fighterData = {
      name,
      nickname: nickname || null,
      height_cm: height_cm ? Number(height_cm) : null,
      weight_kg: weight_kg ? Number(weight_kg) : null,
      reach_cm: reach_cm ? Number(reach_cm) : null,
      stance: stance || null,
      division: division || null,
      discipline: discipline || null,  // ← AGREGAR ESTO
      gym: gym || null,
      photo_url: photo_url || null,
      is_active: true
    }

    console.log('Datos a insertar:', JSON.stringify(fighterData, null, 2))

    // Upsert (insert or update) basado en unique(name, gym)
    const { data, error } = await supabaseAdmin
      .from('fighters')
      .upsert(
        fighterData,
        {
          onConflict: 'name,gym',
          ignoreDuplicates: false
        }
      )
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      )
    }

    console.log('✅ Peleador guardado exitosamente:', data)

    return NextResponse.json({
      ok: true,
      fighter_id: data?.[0]?.id,
      data: data
    })

  } catch (error: any) {
    console.error('❌ Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}