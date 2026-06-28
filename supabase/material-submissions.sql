-- Run this once in the Supabase SQL editor.
-- Files are stored privately in Storage. Public users can only upload and
-- create a submission record; they cannot read submitted files or submissions.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'material-submissions',
  'material-submissions',
  false,
  262144000,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/octet-stream',
    'image/png',
    'image/jpeg',
    'image/heic',
    'image/heif',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-m4v',
    'video/x-msvideo',
    'video/x-matroska',
    'text/plain'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.material_submissions (
  id uuid primary key default gen_random_uuid(),
  anonymous boolean not null default true,
  name text,
  email text,
  year text not null,
  subject text not null,
  description text,
  files jsonb not null,
  total_bytes bigint not null default 0,
  status text not null default 'new',
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint material_submissions_year_check
    check (year in ('viti1', 'viti2', 'viti3', 'master', 'provime-pranuese', 'tjeter')),
  constraint material_submissions_subject_check
    check (length(trim(subject)) between 2 and 120),
  constraint material_submissions_description_check
    check (description is null or length(description) <= 1200),
  constraint material_submissions_files_check
    check (jsonb_typeof(files) = 'array' and jsonb_array_length(files) between 1 and 50),
  constraint material_submissions_total_bytes_check
    check (total_bytes > 0 and total_bytes <= 786432000),
  constraint material_submissions_status_check
    check (status in ('new', 'reviewing', 'accepted', 'rejected'))
);

alter table public.material_submissions enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.material_submissions to anon, authenticated;

drop policy if exists "Anyone can create material submissions"
on public.material_submissions;

create policy "Anyone can create material submissions"
on public.material_submissions
for insert
to anon, authenticated
with check (
  (user_id is null or user_id = (select auth.uid()))
  and jsonb_typeof(files) = 'array'
  and jsonb_array_length(files) between 1 and 50
  and total_bytes > 0
  and total_bytes <= 786432000
);

drop policy if exists "Anyone can upload material submission files"
on storage.objects;

create policy "Anyone can upload material submission files"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'material-submissions'
  and (storage.foldername(name))[1] = 'incoming'
);

-- Verification:
-- select id, name, public, file_size_limit from storage.buckets where id = 'material-submissions';
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'material_submissions';
