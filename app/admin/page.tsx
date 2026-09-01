import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePost, logout, togglePublish } from "@/lib/actions";
import { formatDate, type Post } from "@/lib/posts";
import { DeleteButton } from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Post[]>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[var(--dark)]">Posts</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="bg-[var(--primary)] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
          >
            New post
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-[var(--gray)] hover:text-[var(--dark)] px-3 py-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {(!posts || posts.length === 0) && (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center text-[var(--gray)]">
          No posts yet.{" "}
          <Link href="/admin/new" className="text-[var(--primary)] underline">
            Write your first one
          </Link>
          .
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {posts?.map((post) => (
          <div key={post.id} className="flex items-center justify-between py-4 gap-4">
            <div className="min-w-0">
              <p className="font-medium text-[var(--dark)] truncate">{post.title}</p>
              <p className="text-sm text-[var(--gray)]">
                {formatDate(post.created_at)} ·{" "}
                <span className={post.published ? "text-green-600" : "text-[var(--gray)]"}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <form
                action={async () => {
                  "use server";
                  await togglePublish(post.id, post.slug, post.published);
                }}
              >
                <button
                  type="submit"
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-[var(--light)]"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
              </form>
              <Link
                href={`/admin/edit/${post.id}`}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-[var(--light)]"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePost(post.id);
                }}
              >
                <DeleteButton />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
