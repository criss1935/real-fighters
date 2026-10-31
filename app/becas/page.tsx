import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { estadoConvocatoria, parseBecasConfig } from '@/lib/becas'
import BecasForm from './BecasForm'

export const metadata: Metadata = {
  title: 'Convocatoria de Becas | Real Fighters México',
  description: 'Registra tu solicitud de beca Amateur o Profesional en Real Fighters México, por situación socioeconómica o desempeño deportivo.',
}

export const revalidate = 60

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
function fechaLarga(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${y}`
}

async function load() {
  const { data } = await supabase.from('config').select('key, data').in('key', ['becas', 'classes', 'filiales'])
  const get = (k: string) => data?.find((r) => r.key === k)?.data
  const cfg = parseBecasConfig(get('becas'))
  const disciplinas = ((get('classes') as { name?: string }[] | undefined) || []).map((c) => c.name?.trim()).filter(Boolean) as string[]
  const filiales = ((get('filiales') as { name?: string; status?: string }[] | undefined) || [])
    .filter((f) => !f.status || f.status === 'Activa')
    .map((f) => f.name?.trim())
    .filter(Boolean) as string[]
  return {
    cfg,
    disciplinas: disciplinas.length ? disciplinas : ['MMA', 'Muay Thai', 'Jiu Jitsu', 'Boxeo Mexicano'],
    filiales: filiales.length ? filiales : ['Real Fighters Matriz'],
  }
}

export default async function BecasPage() {
  const { cfg, disciplinas, filiales } = await load()
  const estado = estadoConvocatoria(cfg)

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-red-600/40 bg-gradient-to-b from-zinc-950 to-black">
        <div className="container mx-auto max-w-3xl px-4 py-14 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Convocatoria {cfg.convocatoria}</p>
          <h1 className="text-5xl leading-none md:text-7xl">Becas Real Fighters</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-300">
            Apoyamos a atletas <strong className="text-white">amateur</strong> y <strong className="text-white">profesionales</strong> por
            su situación socioeconómica o por su desempeño deportivo.
          </p>
          <div className="mt-6 inline-flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-3 text-sm text-zinc-300">
            <span>
              Abre: <strong className="text-white">{fechaLarga(cfg.abre_en)}</strong>
            </span>
            <span>
              Cierra: <strong className="text-white">{fechaLarga(cfg.cierra_en)}</strong>
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-4 py-10">
        {estado === 'abierta' ? (
          <BecasForm disciplinas={disciplinas} filiales={filiales} />
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <h2 className="text-3xl">{estado === 'proxima' ? 'La convocatoria abre pronto' : 'Convocatoria cerrada'}</h2>
            <p className="mt-3 text-zinc-400">
              {estado === 'proxima'
                ? `El registro estará disponible a partir del ${fechaLarga(cfg.abre_en)}.`
                : 'El periodo de registro terminó. Mantente atento a nuestras redes para la próxima convocatoria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
