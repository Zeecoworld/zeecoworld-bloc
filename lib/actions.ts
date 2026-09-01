"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/posts";
import { pingIndexNow } from "@/lib/indexnow";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Invalid email or password.")}`);
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const coverImage = String(formData.get("cover_image") ?? "").trim();
  const published = formData.get("published") === "on";
  let slug = String(formData.get("slug") ?? "").trim();

  if (!slug) slug = slugify(title);
  else slug = slugify(slug);

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    cover_image: coverImage || null,
    published,
  });

  if (error) {
    redirect(`/admin/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");

  if (published) {
    await pingIndexNow([`https://zeecomedia.net/blog/${slug}`]);
  }

  redirect("/admin");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const coverImage = String(formData.get("cover_image") ?? "").trim();
  const published = formData.get("published") === "on";
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_image: coverImage || null,
      published,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/edit/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath(`/${slug}`);

  if (published) {
    await pingIndexNow([`https://zeecomedia.net/blog/${slug}`]);
  }

  redirect("/admin");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/");
  redirect("/admin");
}

export async function togglePublish(id: string, slug: string, published: boolean) {
  const supabase = await createClient();
  const nowPublished = !published;
  await supabase.from("posts").update({ published: nowPublished }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");

  if (nowPublished) {
    await pingIndexNow([`https://zeecomedia.net/blog/${slug}`]);
  }
}