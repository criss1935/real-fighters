import { z } from 'zod'

const opt = z.string().trim().max(500).optional().transform((v) => (v ? v : null))
const telefono = z.string().trim().regex(/^[\d\s+()-]{8,20}$/, 'Teléfono inválido')

const dataUrlPng = z.string().regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/, 'Firma inválida').max(400_000)
const dataUrlJpeg = z.string().regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/, 'Foto inválida').max(1_500_000)

export const MOTIVOS = ['entrenamiento_diversion', 'salud_estetica', 'desarrollo_fisico', 'competencia'] as const

export const inscripcionSchema = z
  .object({
    studentId: z.number().int().positive().nullable(),
    general: z.object({
      name: z.string().trim().min(3, 'Nombre muy corto').max(120),
      phone: telefono,
      email: z.string().trim().email('Correo inválido').max(120).optional().or(z.literal('')).transform((v) => (v ? v.toLowerCase() : null)),
      birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
      discipline: z.string().trim().min(1, 'Elige una disciplina').max(60),
      gym: z.string().trim().min(1, 'Elige una filial').max(80),
      weight_kg: z.number().min(10).max(250).nullable(),
      height_cm: z.number().min(50).max(230).nullable(),
      tutor_nombre: opt,
    }),
    perfil: z.object({
      sexo: z.enum(['Masculino', 'Femenino']).nullable(),
      address: opt,
      somatotipo: z.enum(['endomorfica', 'mesomorfica', 'ectomorfa']).nullable(),
      motivo_ejercicio: z.array(z.enum(MOTIVOS)).max(4),
      historia_deportiva: opt,
      conocimientos_previos: z.enum(['poco', 'medio', 'alto']).nullable(),
      objetivo_1: opt,
      objetivo_2: opt,
    }),
    contactos: z
      .array(z.object({ nombre: z.string().trim().min(2).max(120), parentesco: opt, telefono }))
      .min(1, 'Agrega al menos un contacto de emergencia')
      .max(2),
    medico: z.object({
      lesiones: opt,
      enfermedades: opt,
      blood_type: z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).nullable(),
      alergias_medicamento: opt,
    }),
    foto: dataUrlJpeg.nullable(),
    firmas: z.object({
      firmado_por: z.string().trim().min(3, 'Escribe el nombre de quien firma').max(120),
      reglamento: dataUrlPng,
      carta_compromiso: dataUrlPng,
      aviso_privacidad: dataUrlPng,
      carta_responsiva: dataUrlPng,
    }),
  })
  .superRefine((d, ctx) => {
    if (esMenor(d.general.birth_date) && !d.general.tutor_nombre) {
      ctx.addIssue({ code: 'custom', path: ['general', 'tutor_nombre'], message: 'Para menores de edad, el nombre del padre o tutor es obligatorio' })
    }
    const nac = new Date(d.general.birth_date + 'T00:00:00')
    if (isNaN(nac.getTime()) || nac > new Date() || nac.getFullYear() < 1920) {
      ctx.addIssue({ code: 'custom', path: ['general', 'birth_date'], message: 'Fecha de nacimiento inválida' })
    }
  })

export type InscripcionInput = z.input<typeof inscripcionSchema>

export function edad(birth: string): number | null {
  const nac = new Date(birth + 'T00:00:00')
  if (isNaN(nac.getTime())) return null
  const hoy = new Date()
  let e = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) e--
  return e
}

export function esMenor(birth: string): boolean {
  const e = edad(birth)
  return e !== null && e < 18
}
