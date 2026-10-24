import Link from "next/link";
import Image from "next/image";
import { formatDate, readingTime, type Post } from "@/lib/posts";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center text-[var(--gray)]">
        No posts yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/${post.slug}`}
          className="group flex flex-col sm:flex-row gap-6 items-start rounded-xl p-4 -mx-4 hover:bg-[var(--light)] transition-colors"
        >
          {post.cover_image && (
            <div className="relative w-full sm:w-56 h-40 shrink-0 rounded-lg overflow-hidden bg-[var(--light)]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-[var(--gray)] mb-2">
              {formatDate(post.created_at)} · {readingTime(post.content)} min read
            </p>
            <h2 className="text-xl font-semibold text-[var(--dark)] group-hover:text-[var(--primary)] transition-colors mb-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-[var(--gray)] line-clamp-2">{post.excerpt}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
