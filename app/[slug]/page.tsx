import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { formatDate, readingTime, type Post } from "@/lib/posts";
import type { Metadata } from "next";

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<Post>();
  return data;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
      type: "article",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-sm text-[var(--gray)] mb-3">
        {formatDate(post.created_at)} · {readingTime(post.content)} min read
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold text-[var(--dark)] mb-8 leading-tight">
        {post.title}
      </h1>
      {post.cover_image && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10 bg-[var(--light)]">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="672px"
            priority
          />
        </div>
      )}
      <div className="prose-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
