-- Portfolio — evaluator schema, RLS, storage (run in Supabase SQL Editor)
-- Official docs: https://supabase.com/docs/guides/database/postgres/row-level-security

-- ---------------------------------------------------------------------------
-- Roles & profiles
-- ---------------------------------------------------------------------------

create type public.app_role as enum ('student', 'evaluator');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Helper: evaluator check (used by RLS policies)
-- ---------------------------------------------------------------------------

create or replace function public.is_evaluator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'evaluator'::public.app_role
  );
$$;

revoke all on function public.is_evaluator() from public;
grant execute on function public.is_evaluator() to authenticated;

-- ---------------------------------------------------------------------------
-- Project assets (metadata — files live in Storage)
-- ---------------------------------------------------------------------------

create type public.asset_type as enum ('image', 'video', 'model3d', 'document');

create table public.project_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  asset_type public.asset_type not null,
  storage_path text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  constraint project_assets_storage_path_nonempty check (char_length(trim(storage_path)) > 0)
);

create index project_assets_owner_id_idx on public.project_assets (owner_id);
create index project_assets_is_public_idx on public.project_assets (is_public);

alter table public.project_assets enable row level security;

create policy "project_assets_select_public"
  on public.project_assets
  for select
  to anon, authenticated
  using (is_public = true);

create policy "project_assets_owner_select"
  on public.project_assets
  for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "project_assets_evaluator_select"
  on public.project_assets
  for select
  to authenticated
  using (public.is_evaluator());

create policy "project_assets_owner_insert"
  on public.project_assets
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "project_assets_owner_update"
  on public.project_assets
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "project_assets_owner_delete"
  on public.project_assets
  for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Auto-create profile on sign-up (default role: student)
-- Evaluators: set role manually in Table Editor or SQL after account creation
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'student');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage: private bucket for evaluator media
-- Docs: https://supabase.com/docs/guides/storage/security/access-control
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evaluator-assets',
  'evaluator-assets',
  false,
  524288000,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'video/mp4',
    'video/webm',
    'model/gltf-binary',
    'model/gltf+json',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "evaluator_assets_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'evaluator-assets'
    and (
      public.is_evaluator()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

create policy "evaluator_assets_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'evaluator-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "evaluator_assets_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'evaluator-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'evaluator-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "evaluator_assets_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'evaluator-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
