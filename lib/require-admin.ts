import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Mismo criterio que usa /admin y las policies RLS del proyecto.
const ADMIN_EMAILS = ['gil.hnava@gmail.com']

export async function requireAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  const user = data?.user
  if (error || !user) return null
  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    (user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false)
  return isAdmin ? user : null
}

// Rate limit en memoria por IP. Suficiente para una tablet en recepción;
// en serverless cada instancia lleva su propio contador.
const hits = new Map<string, number[]>()
export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  hits.set(key, arr)
  return arr.length > max
}

export function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}
