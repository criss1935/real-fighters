import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// No truena al importar: si falta la llave, el build del sitio sigue funcionando
// y solo las rutas que la necesitan responden 503 (ver hasServiceRole).
export const hasServiceRole = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseServiceKey)

// Cliente con service role - SOLO para API routes (server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || 'missing-service-role-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
