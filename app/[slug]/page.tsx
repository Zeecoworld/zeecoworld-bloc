import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import {
  formatDate,
  normalizePostContent,
  readingTime,
  type Post,
} from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<Post>();
  return data ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `https://zeecomedia.net/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const content = normalizePostContent(post.content);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-[var(--gray)] hover:text-[var(--primary)]">
        ← Back to blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-semibold text-[var(--dark)] mt-6 mb-3">
        {post.title}
      </h1>
      <p className="text-sm text-[var(--gray)] mb-8">
        {formatDate(post.created_at)} · {readingTime(content)} min read
      </p>

      {post.cover_image && (
        <div className="relative w-full h-72 rounded-xl overflow-hidden mb-10">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="768px"
            priority
          />
        </div>
      )}

      <div className="prose-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
