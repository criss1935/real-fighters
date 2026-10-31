import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { CUPOS, PORCENTAJES, estadoConvocatoria, fechaLarga, parseBecasConfig } from '@/lib/becas'
import BecasForm from './BecasForm'

export const metadata: Metadata = {
  title: 'Becas RFM | Real Fighters México',
  description:
    'Tu esfuerzo abre camino. 10 becas anuales para estudiantes que quieran entrenar en Real Fighters México con el Plan #RFM.',
}

export const revalidate = 60

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

const CRITERIOS = [
  ['Rendimiento escolar', 'Calificaciones, constancia, esfuerzo y mejora.'],
  ['Compromiso', 'Asistencia, disciplina y respeto.'],
  ['Situación socioeconómica', 'Cuando sea parte del motivo de solicitud.'],
  ['Motivación personal', 'Tus razones para querer entrenar y crecer en RFM.'],
] as const

const CAMPANAS = [
  'La posada anual de Real Fighters México.',
  'Actividades de venta.',
  'Venta de playeras de recaudación.',
  'Venta anual de chocolates.',
  'Aportaciones voluntarias de personas y negocios que quieran apoyar.',
]

const INFORME = [
  'Total recaudado y gastos directos de las campañas.',
  'Saldo neto disponible para becas.',
  'Número de becas otorgadas por porcentaje.',
  'Mensualidades cubiertas y saldo reservado para el siguiente ciclo.',
]

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-3xl leading-none md:text-4xl">{children}</h2>
}

function Dot() {
  return <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-600" aria-hidden />
}

export default async function BecasPage() {
  const { cfg, disciplinas, filiales } = await load()
  const estado = estadoConvocatoria(cfg)
  const anio = Number(cfg.abre_en.slice(0, 4))

  const fechas: [string, string][] = [
    ['Registro', `Del ${fechaLarga(cfg.abre_en, false)} al ${fechaLarga(cfg.cierra_en, false)}, hasta las 11:59 p. m.`],
    ['Revisión', '1 al 4 de diciembre.'],
    ['Resultados', 'A más tardar el 6 de diciembre, en la posada anual.'],
    ['Inicio de las becas', '1 de diciembre.'],
    ['Vigencia', `Hasta el 30 de noviembre de ${anio + 1}.`],
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-red-600/40 bg-gradient-to-b from-zinc-950 to-black">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-4xl px-4 py-16 md:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">Becas RFM</p>
          <h1 className="text-5xl leading-[0.95] md:text-8xl">Tu esfuerzo abre camino.</h1>
          <p className="mt-4 text-2xl text-zinc-300 md:text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            Entrena. Aprende. Crece.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            En Real Fighters México creemos que el esfuerzo también merece oportunidades. Por eso creamos un programa que reconoce el
            rendimiento escolar, impulsa la disciplina y permite que más personas entrenen en nuestra comunidad.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#solicitud" className="rounded-xl bg-red-600 px-7 py-4 text-lg font-bold uppercase tracking-wide hover:bg-red-700">
              {estado === 'abierta' ? 'Solicitar beca' : 'Ver solicitud'}
            </a>
            <span className="text-sm text-zinc-400">
              Registro del {fechaLarga(cfg.abre_en, false)} al {fechaLarga(cfg.cierra_en)}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl space-y-16 px-4 py-14 md:py-20">
        {/* Qué es */}
        <section>
          <p className="max-w-3xl text-lg leading-relaxed text-zinc-300">
            Abrimos <strong className="text-white">10 becas anuales</strong> para estudiantes que quieran entrenar en RFM. No necesitas ser
            competidor ni tener experiencia: puedes iniciar desde cero y elegir la disciplina que más te motive.
          </p>
        </section>

        {/* Becas */}
        <section>
          <H2>10 becas para entrenar con el Plan #RFM</H2>
          <p className="mb-6 max-w-3xl text-zinc-300">
            Las becas dan acceso al Plan #RFM, nuestro paquete más amplio, con todas las disciplinas incluidas.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PORCENTAJES.map((p) => (
              <div key={p} className={`rounded-2xl border p-6 ${p === 100 ? 'border-red-600 bg-red-600/10' : 'border-zinc-800 bg-zinc-950'}`}>
                <p className="text-6xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {p}%
                </p>
                <p className="mt-2 text-sm uppercase tracking-wide text-zinc-400">de apoyo mensual</p>
                <p className="mt-4 text-lg font-bold">
                  {CUPOS[p]} {CUPOS[p] === 1 ? 'beca' : 'becas'}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 font-semibold">
            Todas las becas incluyen la inscripción anual al 100%.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            El apoyo se aplica directamente a la mensualidad de entrenamiento. No se entrega dinero en efectivo. No cubre equipo personal,
            viajes, competencias, atención médica ni gastos de otros programas deportivos.
          </p>
        </section>

        {/* Criterios */}
        <section>
          <H2>Reconocemos tu esfuerzo dentro y fuera del gimnasio</H2>
          <p className="mb-6 text-zinc-300">La selección toma en cuenta:</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CRITERIOS.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-zinc-800 border-l-4 border-l-red-600 bg-zinc-950 p-5">
                <p className="font-bold">{t}</p>
                <p className="mt-1 text-sm text-zinc-400">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl leading-relaxed text-zinc-300">
            No buscamos premiar solo a quien tiene el promedio más alto. También reconocemos a quien se esfuerza, supera dificultades y
            trabaja para mejorar.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Esta convocatoria es para alumnos regulares de RFM. No es una selección de peleadores ni un programa de desarrollo de atletas
            amateur o profesionales.
          </p>
        </section>

        {/* Fondo */}
        <section>
          <H2>Una beca que se construye en comunidad</H2>
          <p className="mb-4 max-w-3xl text-zinc-300">
            Las mensualidades becadas se cubrirán con el <strong className="text-white">Fondo de Becas RFM</strong>, formado con campañas
            de recaudación como:
          </p>
          <ul className="mb-6 space-y-2">
            {CAMPANAS.map((c) => (
              <li key={c} className="flex gap-3 text-zinc-300">
                <Dot />
                {c}
              </li>
            ))}
          </ul>
          <p className="max-w-3xl leading-relaxed text-zinc-300">
            Quienes reciban una beca podrán participar como <strong className="text-white">embajadores de la campaña</strong>: ayudando a
            difundirla, invitando a la comunidad y colaborando en actividades acordadas. No tendrán que comprar productos, adelantar dinero
            ni cubrir personalmente su mensualidad. Lo recaudado se administra en un fondo común y se destina al pago de las mensualidades
            becadas.
          </p>
          <p className="mt-4 text-lg font-semibold">Así, cada entrenamiento se convierte en una oportunidad que la comunidad ayuda a sostener.</p>
        </section>

        {/* Fechas */}
        <section>
          <H2>Fechas de la convocatoria</H2>
          <ol className="divide-y divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {fechas.map(([t, d]) => (
              <li key={t} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                <span className="w-44 shrink-0 font-bold text-red-500">{t}</span>
                <span className="text-zinc-300">{d}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
            La convocatoria ofrece diez becas. La asignación de cada porcentaje dependerá de la evaluación del Comité y de que el fondo
            tenga recursos suficientes para sostener el ciclo.
          </p>
        </section>

        {/* Transparencia */}
        <section>
          <H2>Nuestro compromiso de transparencia</H2>
          <p className="mb-4 text-zinc-300">Al cierre del ciclo, RFM publicará un informe general con:</p>
          <ul className="mb-4 space-y-2">
            {INFORME.map((c) => (
              <li key={c} className="flex gap-3 text-zinc-300">
                <Dot />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-sm text-zinc-400">El informe no publicará nombres, teléfonos, calificaciones ni documentos de los becarios.</p>
        </section>

        {/* Solicitud */}
        <section id="solicitud" className="scroll-mt-24">
          <H2>Solicita tu beca</H2>
          <p className="mb-8 max-w-3xl text-zinc-300">
            Completa el formulario y guarda el folio que recibirás al enviarlo. El Comité revisará cada solicitud y recepción te comunicará
            el resultado por WhatsApp.
          </p>
          {estado === 'abierta' ? (
            <BecasForm disciplinas={disciplinas} filiales={filiales} />
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
              <h3 className="text-3xl">{estado === 'proxima' ? 'El registro abre pronto' : 'Registro cerrado'}</h3>
              <p className="mt-3 text-zinc-400">
                {estado === 'proxima'
                  ? `El formulario estará disponible a partir del ${fechaLarga(cfg.abre_en)}.`
                  : 'El periodo de registro terminó. Mantente atento a nuestras redes para la próxima convocatoria.'}
              </p>
            </div>
          )}
        </section>

        <p className="border-t border-zinc-800 pt-10 text-center text-3xl leading-tight md:text-4xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
          Diez oportunidades. Una comunidad detrás.
          <br />
          <span className="text-red-500">RFM: tu esfuerzo abre camino.</span>
        </p>
      </div>
    </div>
  )
}
