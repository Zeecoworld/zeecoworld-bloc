import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/posts";

// Served at /blog/sitemap.xml (basePath is applied automatically to this
// file-convention route, same as it is to normal pages).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true)
    .returns<Pick<Post, "slug" | "updated_at">[]>();

  const postEntries: MetadataRoute.Sitemap =
    posts?.map((post) => ({
      url: `https://zeecomedia.net/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    })) ?? [];

  return [
    {
      url: "https://zeecomedia.net/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
  ];
}