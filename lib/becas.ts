import { z } from 'zod'
import { esMenor } from '@/lib/inscripcion-schema'

export const TIPOS_BECA = ['amateur', 'profesional'] as const
export const MOTIVOS_BECA = ['socioeconomico', 'desempeno'] as const
export const ESTATUS_BECA = ['pendiente', 'en_revision', 'aprobada', 'rechazada'] as const
export const RANGOS_INGRESO = ['menos_5k', '5k_10k', '10k_20k', '20k_35k', 'mas_35k'] as const

export const TIPO_LABEL: Record<(typeof TIPOS_BECA)[number], string> = {
  amateur: 'Beca Amateur',
  profesional: 'Beca Profesional',
}
export const MOTIVO_LABEL: Record<(typeof MOTIVOS_BECA)[number], string> = {
  socioeconomico: 'Situación socioeconómica',
  desempeno: 'Desempeño deportivo',
}
export const ESTATUS_LABEL: Record<(typeof ESTATUS_BECA)[number], string> = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}
export const INGRESO_LABEL: Record<(typeof RANGOS_INGRESO)[number], string> = {
  menos_5k: 'Menos de $5,000',
  '5k_10k': '$5,000 – $10,000',
  '10k_20k': '$10,000 – $20,000',
  '20k_35k': '$20,000 – $35,000',
  mas_35k: 'Más de $35,000',
}

export const DOC_MIME = ['application/pdf', 'image/jpeg', 'image/png'] as const
export const DOC_MAX_BYTES = 5 * 1024 * 1024
export const DOC_MAX_FILES = 3
export const DOCS_BUCKET = 'becas-docs'

export type BecasConfig = { activa: boolean; convocatoria: string; abre_en: string; cierra_en: string }

export const DEFAULT_BECAS_CONFIG: BecasConfig = {
  activa: false,
  convocatoria: '2026-11',
  abre_en: '2026-11-01',
  cierra_en: '2026-11-10',
}

/** Fecha de hoy (YYYY-MM-DD) en hora de CDMX. */
export function hoyCDMX(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(now)
}

export type EstadoConvocatoria = 'abierta' | 'proxima' | 'cerrada'

/** Ventana inclusiva: abre a las 00:00 del día de apertura y cierra al final del día de cierre (CDMX). */
export function estadoConvocatoria(cfg: BecasConfig, now = new Date()): EstadoConvocatoria {
  if (!cfg.activa) return 'cerrada'
  const hoy = hoyCDMX(now)
  if (hoy < cfg.abre_en) return 'proxima'
  if (hoy > cfg.cierra_en) return 'cerrada'
  return 'abierta'
}

export function parseBecasConfig(raw: unknown): BecasConfig {
  const r = (raw || {}) as Partial<BecasConfig>
  const fecha = /^\d{4}-\d{2}-\d{2}$/
  return {
    activa: Boolean(r.activa),
    convocatoria: typeof r.convocatoria === 'string' && r.convocatoria ? r.convocatoria : DEFAULT_BECAS_CONFIG.convocatoria,
    abre_en: typeof r.abre_en === 'string' && fecha.test(r.abre_en) ? r.abre_en : DEFAULT_BECAS_CONFIG.abre_en,
    cierra_en: typeof r.cierra_en === 'string' && fecha.test(r.cierra_en) ? r.cierra_en : DEFAULT_BECAS_CONFIG.cierra_en,
  }
}

const opt = (max = 500) => z.string().trim().max(max).optional().transform((v) => (v ? v : null))
const telefono = z.string().trim().regex(/^[\d\s+()-]{10,20}$/, 'Teléfono inválido (10 dígitos)')

export const docMetaSchema = z.object({
  name: z.string().trim().min(1).max(150),
  type: z.enum(DOC_MIME, { message: 'Solo se aceptan PDF, JPG o PNG' }),
  size: z.number().int().positive().max(DOC_MAX_BYTES, 'Cada archivo debe pesar máximo 5 MB'),
})

export const becaSchema = z
  .object({
    tipo: z.enum(TIPOS_BECA, { message: 'Elige el tipo de beca' }),
    motivos: z.array(z.enum(MOTIVOS_BECA)).min(1, 'Elige al menos un motivo').max(2),
    nombre: z.string().trim().min(3, 'Nombre muy corto').max(120),
    telefono,
    email: z.string().trim().email('Correo inválido').max(120).optional().or(z.literal('')).transform((v) => (v ? v.toLowerCase() : null)),
    fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
    tutor_nombre: opt(120),
    filial: z.string().trim().min(1, 'Elige una filial').max(80),
    disciplina: z.string().trim().min(1, 'Elige una disciplina').max(60),
    es_alumno: z.boolean(),
    tiempo_entrenando: opt(60),
    socio: z.object({
      ocupacion: opt(120),
      dependientes: z.number().int().min(0).max(20).nullable(),
      ingreso_rango: z.enum(RANGOS_INGRESO).nullable(),
      situacion: opt(1500),
    }),
    desempeno: z.object({
      record: opt(120),
      logros: opt(1500),
      link: z.string().trim().url('Link inválido').max(300).optional().or(z.literal('')).transform((v) => (v ? v : null)),
    }),
    exposicion: z.string().trim().min(50, 'Cuéntanos un poco más (mínimo 50 caracteres)').max(2000),
    documentos: z.array(docMetaSchema).max(DOC_MAX_FILES, `Máximo ${DOC_MAX_FILES} archivos`),
    acepta_privacidad: z.literal(true, { message: 'Debes aceptar el aviso de privacidad' }),
    declara_veracidad: z.literal(true, { message: 'Debes declarar que la información es verídica' }),
  })
  .superRefine((d, ctx) => {
    const nac = new Date(d.fecha_nacimiento + 'T00:00:00')
    if (isNaN(nac.getTime()) || nac > new Date() || nac.getFullYear() < 1940) {
      ctx.addIssue({ code: 'custom', path: ['fecha_nacimiento'], message: 'Fecha de nacimiento inválida' })
    } else if (esMenor(d.fecha_nacimiento) && !d.tutor_nombre) {
      ctx.addIssue({ code: 'custom', path: ['tutor_nombre'], message: 'Para menores de edad, el nombre del padre o tutor es obligatorio' })
    }
    if (d.motivos.includes('socioeconomico')) {
      if (!d.socio.ingreso_rango) ctx.addIssue({ code: 'custom', path: ['socio', 'ingreso_rango'], message: 'Indica el ingreso mensual del hogar' })
      if (!d.socio.situacion) ctx.addIssue({ code: 'custom', path: ['socio', 'situacion'], message: 'Describe brevemente tu situación' })
    }
    if (d.motivos.includes('desempeno') && !d.desempeno.logros && !d.desempeno.record) {
      ctx.addIssue({ code: 'custom', path: ['desempeno', 'logros'], message: 'Indica tu récord o tus logros deportivos' })
    }
  })

export type BecaInput = z.input<typeof becaSchema>

export function folioBeca(id: number) {
  return `BECA-${String(id).padStart(5, '0')}`
}

export function safeFileName(name: string) {
  const dot = name.lastIndexOf('.')
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) : ''
  return `${base || 'archivo'}${ext ? '.' + ext : ''}`
}
