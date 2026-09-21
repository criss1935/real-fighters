import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Kiosco from './Kiosco'

export const metadata: Metadata = {
  title: 'Inscripción | Real Fighters México',
  robots: { index: false, follow: false },
}

export const revalidate = 300

async function loadOptions() {
  const { data } = await supabase.from('config').select('key, data').in('key', ['classes', 'filiales'])
  const get = (k: string) => (data?.find((r) => r.key === k)?.data as { name?: string; status?: string }[] | undefined) || []
  const disciplinas = get('classes').map((c) => c.name?.trim()).filter(Boolean) as string[]
  const filiales = get('filiales')
    .filter((f) => !f.status || f.status === 'Activa')
    .map((f) => f.name?.trim())
    .filter(Boolean) as string[]
  return {
    disciplinas: disciplinas.length ? disciplinas : ['MMA', 'Muay Thai', 'Jiu Jitsu', 'Boxeo Mexicano', 'CrossFit'],
    filiales: filiales.length ? filiales : ['Real Fighters Matriz'],
  }
}

export default async function InscripcionPage() {
  const opts = await loadOptions()
  return <Kiosco disciplinas={opts.disciplinas} filiales={opts.filiales} />
}
