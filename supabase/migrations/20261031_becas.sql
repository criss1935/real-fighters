-- Convocatoria de becas (amateur / profesional · socioeconómica / desempeño)
-- Solo el service role escribe/lee: el formulario público y el panel admin pasan por API routes.

create table if not exists public.beca_solicitudes (
  id                 bigint generated always as identity primary key,
  created_at         timestamptz not null default now(),
  convocatoria       text not null,
  tipo               text not null check (tipo in ('amateur', 'profesional')),
  motivos            text[] not null check (array_length(motivos, 1) between 1 and 2
                                            and motivos <@ array['socioeconomico', 'desempeno']),
  nombre             text not null,
  telefono           text not null,
  email              text,
  fecha_nacimiento   date not null,
  es_menor           boolean not null default false,
  tutor_nombre       text,
  filial             text not null,
  disciplina         text not null,
  es_alumno          boolean not null default false,
  tiempo_entrenando  text,
  datos              jsonb not null default '{}'::jsonb,   -- detalle socioeconómico / desempeño
  exposicion         text not null,
  estatus            text not null default 'pendiente'
                     check (estatus in ('pendiente', 'en_revision', 'aprobada', 'rechazada')),
  porcentaje_beca    smallint check (porcentaje_beca between 0 and 100),
  notas_admin        text,
  revisado_por       text,
  revisado_at        timestamptz,
  ip                 text,
  user_agent         text
);

create unique index if not exists beca_solicitudes_conv_tel_uidx
  on public.beca_solicitudes (convocatoria, telefono);
create index if not exists beca_solicitudes_conv_estatus_idx
  on public.beca_solicitudes (convocatoria, estatus, created_at desc);

alter table public.beca_solicitudes enable row level security;
revoke all on public.beca_solicitudes from anon, authenticated;

-- Bucket privado para comprobantes (PDF/JPG/PNG, máx 5 MB c/u)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('becas-docs', 'becas-docs', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Ventana de la convocatoria (editable desde /admin → Becas)
insert into public.config (key, data)
values ('becas', jsonb_build_object(
  'activa', true,
  'convocatoria', '2026-11',
  'abre_en', '2026-11-01',
  'cierra_en', '2026-11-10'
))
on conflict (key) do nothing;
