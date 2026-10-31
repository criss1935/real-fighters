-- Becas RFM v2: becas para estudiantes por rendimiento escolar (reemplaza amateur/profesional).
-- La tabla v1 (sin registros) se conserva renombrada como beca_solicitudes_v1.

alter table public.beca_solicitudes rename to beca_solicitudes_v1;
alter index public.beca_solicitudes_conv_tel_uidx rename to beca_solicitudes_v1_conv_tel_uidx;
alter index public.beca_solicitudes_conv_estatus_idx rename to beca_solicitudes_v1_conv_estatus_idx;

create table public.beca_solicitudes (
  id                 bigint generated always as identity primary key,
  created_at         timestamptz not null default now(),
  convocatoria       text not null,
  perfil             text not null check (perfil in ('alumno', 'nuevo')),          -- ya entrena en RFM / quiere iniciar
  motivos            text[] not null check ('escolar' = any (motivos)
                                            and motivos <@ array['escolar', 'socioeconomico']),
  nombre             text not null,
  telefono           text not null,
  email              text,
  fecha_nacimiento   date not null,
  es_menor           boolean not null default false,
  tutor_nombre       text,
  filial             text not null,
  disciplina         text not null,
  tiempo_entrenando  text,
  nivel_educativo    text not null check (nivel_educativo in ('primaria', 'secundaria', 'preparatoria', 'universidad', 'posgrado', 'otro')),
  escuela            text,
  grado              text not null,
  promedio           numeric(4, 2) not null check (promedio between 0 and 10),
  datos              jsonb not null default '{}'::jsonb,   -- esfuerzo escolar + detalle socioeconómico
  motivacion         text not null,
  estatus            text not null default 'pendiente'
                     check (estatus in ('pendiente', 'en_revision', 'aprobada', 'rechazada')),
  porcentaje_beca    smallint check (porcentaje_beca in (25, 50, 100)),
  notas_admin        text,
  revisado_por       text,
  revisado_at        timestamptz,
  ip                 text,
  user_agent         text,
  check (estatus <> 'aprobada' or porcentaje_beca is not null)
);

create unique index beca_solicitudes_conv_tel_uidx on public.beca_solicitudes (convocatoria, telefono);
create index beca_solicitudes_conv_estatus_idx on public.beca_solicitudes (convocatoria, estatus, created_at desc);

alter table public.beca_solicitudes enable row level security;
revoke all on public.beca_solicitudes from anon, authenticated;

-- Registro del 1 al 30 de noviembre
update public.config
set data = data || jsonb_build_object('cierra_en', '2026-11-30'), updated_at = now()
where key = 'becas';
