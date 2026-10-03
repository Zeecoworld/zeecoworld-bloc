import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { POSTS_PER_PAGE, type Post } from "@/lib/posts";
import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Page ${page}`,
    alternates: {
      canonical: `https://zeecomedia.net/blog/page/${page}`,
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  // Page 1 lives at /blog itself — keep a single canonical URL for it.
  if (page === 1) {
    redirect("/");
  }

  const supabase = await createClient();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<Post[]>();

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / POSTS_PER_PAGE));

  if (page > totalPages) {
    notFound();
  }

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
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
