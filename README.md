# Zeecomedia Blog

A standalone Next.js + Supabase blog, meant to live at `zeecomedia.net/blog`
while your existing static site (homepage + `/services/`) stays exactly as
it is.

## What's inside

- **Public pages:** `/` (post list) and `/[slug]` (single post) — styled to
  match zeecomedia.net's colors and font.
- **Admin:** `/admin/login`, `/admin` (dashboard), `/admin/new`,
  `/admin/edit/[id]` — create, edit, publish/unpublish, and delete posts,
  with drag-free "click to upload" cover images (stored in Supabase
  Storage). Protected by Supabase Auth; only signed-in users can reach it.
- **Supabase** stores posts and post images, and handles admin login.
  Public visitors only ever see posts where `published = true`.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is
   plenty to start).
2. In the SQL editor, run `supabase/schema.sql` from this repo. It creates
   the `posts` table and the row-level security policies.
3. Then run `supabase/storage.sql` — it creates a public `post-images`
   storage bucket for cover images, with upload/edit/delete restricted to
   logged-in users.
4. In **Authentication → Providers**, make sure **email/password** is
   enabled.
5. In **Authentication → Users**, manually add yourself as a user (email +
   password). **Do not enable public sign-up** — the app treats "any
   logged-in user" as an admin, so keep the user list to just yourself.
6. In **Project Settings → API**, copy the **Project URL** and
   **anon public key**.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the two Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

The app runs with `basePath: "/blog"` (see `next.config.ts`), so visit
`http://localhost:3000/blog` locally, not the bare root.

## 4. Deploy

Deploy this app to Vercel (or any Node host) as its own project — separate
from your static site. Add the same two environment variables in the
Vercel project settings.

Then, on your **main site's** hosting (wherever zeecomedia.net is served
from), add a rewrite so requests to `/blog/*` are proxied to this app,
for example on Vercel:

```json
{
  "rewrites": [
    {
      "source": "/blog/:path*",
      "destination": "https://your-blog-app.vercel.app/blog/:path*"
    }
  ]
}
```

Because this app already has `basePath: "/blog"` baked in, the destination
path matches 1:1 — no path rewriting needed. If your main site isn't on
Vercel, look for the equivalent "reverse proxy" or "rewrite" feature
(Netlify redirects, Cloudflare Workers, nginx `proxy_pass`, etc.).

This keeps `zeecomedia.net/blog` as the URL visitors and Google see, so
none of the SEO work already done on the main domain is affected.

## 5. Writing posts

- Go to `zeecomedia.net/blog/admin`, sign in, and click **New post**.
- Content supports **Markdown** (headings, links, lists, code blocks,
  images, etc.).
- A post stays a draft (not visible publicly) until you check
  **Published**, or hit **Publish** from the dashboard later.
- Slug auto-generates from the title if left blank.

## Later improvements (not included yet)

- **Rich text editor:** the content field is a plain Markdown textarea. A
  WYSIWYG editor (e.g. Tiptap) is a drop-in upgrade if you'd rather not
  write Markdown by hand.
- **Orphaned images:** replacing a cover image doesn't delete the old file
  from storage. Not a problem at low volume, but worth a cleanup job later.
- **RSS feed / sitemap entry for `/blog`:** worth adding once you have a
  handful of posts, so the blog feeds into your existing SEO setup.
