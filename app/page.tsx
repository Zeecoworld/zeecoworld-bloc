import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { POSTS_PER_PAGE, type Post } from "@/lib/posts";
import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://zeecomedia.net/blog",
  },
};

export default async function BlogIndex() {
  const supabase = await createClient();
  const { data: posts, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(0, POSTS_PER_PAGE - 1)
    .returns<Post[]>();

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / POSTS_PER_PAGE));

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--dark)] mb-3">
          From the Zeecomedia team
        </h1>
        <p className="text-[var(--gray)] max-w-xl">
          Notes on building web, mobile, API, and AI systems — the practical
          kind, from projects we&apos;ve actually shipped.
        </p>
      </div>

      <PostList posts={posts ?? []} />
      <Pagination currentPage={1} totalPages={totalPages} />
    </div>
  );
}
