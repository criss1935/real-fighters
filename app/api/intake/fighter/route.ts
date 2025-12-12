import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
// Force deploy fix
export async function POST(req: NextRequest) {
  try {
    // Verificar token de autorización
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token !== process.env.INTAKE_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Leer payload
    const body = await req.json()
    const {
      name,
      nickname,
      height_cm,
      weight_kg,
      reach_cm,
      stance,
      division,
      gym,
      photo_url
    } = body

    // Validar campos requeridos
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Upsert (insert or update) basado en unique(name, gym)
    const { data, error } = await supabaseAdmin
      .from('fighters')
      .upsert(
        {
          name,
          nickname: nickname || null,
          height_cm: height_cm ? Number(height_cm) : null,
          weight_kg: weight_kg ? Number(weight_kg) : null,
          reach_cm: reach_cm ? Number(reach_cm) : null,
          stance: stance || null,
          division: division || null,
          gym: gym || null,
          photo_url: photo_url || null,
        },
        {
          onConflict: 'name,gym',
          ignoreDuplicates: false
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      fighter_id: data.id
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}