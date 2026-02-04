-- Desafio II - To-Do List API (Estilo Ragi)
-- Script para rodar no SQL Editor do Supabase
-- Objetivo: tabela tasks + RLS + policies garantindo que o usuário só acesse seus próprios dados

begin;

-- Recomendado: garantir extensão para UUID (geralmente já vem habilitada no Supabase)
create extension if not exists "pgcrypto";

-- Enum para status (mais legível e evolutivo do que boolean)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('pending', 'done');
  end if;
end $$;

-- Tabela principal
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text null,
  status public.task_status not null default 'pending',
  user_id uuid not null references auth.users (id) on delete cascade
);

-- Garantias adicionais
alter table public.tasks
  add constraint tasks_title_length_check
  check (char_length(title) >= 1 and char_length(title) <= 200);

alter table public.tasks
  add constraint tasks_description_length_check
  check (description is null or char_length(description) <= 2000);

-- Índices para performance (listagens por usuário e filtros por status)
create index if not exists tasks_user_id_created_at_idx
  on public.tasks (user_id, created_at desc);

create index if not exists tasks_user_id_status_created_at_idx
  on public.tasks (user_id, status, created_at desc);

-- RLS: obrigatório
alter table public.tasks enable row level security;

-- Boas práticas: remover policies antigas (idempotente)
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

-- SELECT: só enxerga o que é seu
create policy "tasks_select_own"
on public.tasks
for select
to authenticated
using (auth.uid() = user_id);

-- INSERT: só cria pra si mesmo
create policy "tasks_insert_own"
on public.tasks
for insert
to authenticated
with check (auth.uid() = user_id);

-- UPDATE: só atualiza o que é seu (e continua sendo seu)
create policy "tasks_update_own"
on public.tasks
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- DELETE: só deleta o que é seu
create policy "tasks_delete_own"
on public.tasks
for delete
to authenticated
using (auth.uid() = user_id);

commit;

