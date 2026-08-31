-- Run this once in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row
  execute function set_updated_at();

alter table posts enable row level security;

-- Anyone (including anonymous visitors) can read published posts.
drop policy if exists "Public can read published posts" on posts;
create policy "Public can read published posts"
  on posts for select
  using (published = true);

-- Only logged-in users (i.e. you, the admin) can create/edit/delete.
-- Do NOT enable public sign-up in Supabase Auth settings — this policy
-- trusts anyone with an account, so keep the user list to just yourself.
drop policy if exists "Authenticated can manage posts" on posts;
create policy "Authenticated can manage posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Lets the admin dashboard see drafts too, still gated by the policy above.
drop policy if exists "Authenticated can read all posts" on posts;
create policy "Authenticated can read all posts"
  on posts for select
  using (auth.role() = 'authenticated');
