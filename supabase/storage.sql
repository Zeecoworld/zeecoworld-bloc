-- Run this once in the Supabase SQL editor, after schema.sql.
-- Creates a public bucket for post cover images with admin-only writes.

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view post images" on storage.objects;
create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "Authenticated can upload post images" on storage.objects;
create policy "Authenticated can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated can update post images" on storage.objects;
create policy "Authenticated can update post images"
  on storage.objects for update
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated can delete post images" on storage.objects;
create policy "Authenticated can delete post images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');
