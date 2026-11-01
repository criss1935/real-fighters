'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { estadoConvocatoria, fechaLarga, parseBecasConfig, type BecasConfig, type EstadoConvocatoria } from '@/lib/becas'

// Cache a nivel módulo: una sola consulta por carga de página aunque varios componentes usen el hook
let cache: Promise<BecasConfig> | null = null
function loadConfig() {
  if (!cache) {
    cache = Promise.resolve(supabase.from('config').select('data').eq('key', 'becas').maybeSingle())
      .then(({ data }) => parseBecasConfig(data?.data))
      .catch(() => parseBecasConfig(null))
  }
  return cache
}

export function useBecas(): { cfg: BecasConfig | null; estado: EstadoConvocatoria | null } {
  const [cfg, setCfg] = useState<BecasConfig | null>(null)
  useEffect(() => {
    let alive = true
    loadConfig().then((c) => alive && setCfg(c))
    return () => { alive = false }
  }, [])
  return { cfg, estado: cfg ? estadoConvocatoria(cfg) : null }
}

/** Franja delgada arriba del header en todo el sitio mientras la convocatoria está abierta o próxima. */
export function BecasTopBar() {
  const { cfg, estado } = useBecas()
  if (!cfg || !estado || estado === 'cerrada') return null
  return (
    <Link
      href="/becas"
      className="block bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-red-700"
    >
      <GraduationCap className="mr-1.5 inline h-4 w-4 -translate-y-px" aria-hidden />
      {estado === 'abierta' ? (
        <>Becas RFM: registro abierto hasta el {fechaLarga(cfg.cierra_en, false)}</>
      ) : (
        <>Becas RFM: registro a partir del {fechaLarga(cfg.abre_en, false)}</>
      )}
      <span className="ml-2 underline underline-offset-2">Solicita la tuya</span>
    </Link>
  )
}

/** Badge para el link "Becas" del menú. */
export function BecasNavBadge() {
  const { estado } = useBecas()
  if (estado !== 'abierta') return null
  return (
    <span className="ml-1.5 rounded-full bg-red-600 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase leading-none tracking-wide text-white">
      Abierta
    </span>
  )
}

/** Banner grande para la página de inicio. */
export function BecasHomeBanner() {
  const { cfg, estado } = useBecas()
  if (!cfg || !estado || estado === 'cerrada') return null
  return (
    <section className="bg-black px-4 py-12 md:py-16">
      <Link
        href="/becas"
        className="group relative mx-auto block max-w-6xl overflow-hidden rounded-2xl border border-red-600/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950 p-7 shadow-2xl transition hover:border-red-500 md:p-12"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/25 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              <GraduationCap className="h-4 w-4" aria-hidden />
              {estado === 'abierta' ? 'Convocatoria abierta' : 'Próximamente'}
            </p>
            <h2 className="text-4xl leading-none text-white md:text-6xl">Becas RFM</h2>
            <p className="mt-2 text-2xl text-red-500 md:text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              Tu esfuerzo abre camino.
            </p>
            <p className="mt-4 max-w-2xl text-base text-zinc-300 md:text-lg">
              10 becas anuales para estudiantes con el Plan #RFM: hasta el <strong className="text-white">100% de la mensualidad</strong> y la
              inscripción anual cubierta. No necesitas experiencia.
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Registro del {fechaLarga(cfg.abre_en, false)} al {fechaLarga(cfg.cierra_en)}
            </p>
          </div>
          <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-4 text-lg font-bold uppercase tracking-wide text-white transition group-hover:bg-red-700">
            Solicitar beca
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </Link>
    </section>
  )
}

/** Pastilla dentro del hero de inicio (visible sin hacer scroll). */
export function BecasHeroPill() {
  const { estado } = useBecas()
  if (!estado || estado === 'cerrada') return null
  return (
    <Link
      href="/becas"
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500 bg-red-600/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-red-600/40"
    >
      <GraduationCap className="h-4 w-4" aria-hidden />
      {estado === 'abierta' ? 'Becas RFM: convocatoria abierta' : 'Becas RFM: próximamente'}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  )
}
