import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "@/lib/actions";
import { PostForm } from "@/components/PostForm";
import type { Post } from "@/lib/posts";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle<Post>();

  if (!post) notFound();

  const action = updatePost.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-[var(--dark)] mb-8">Edit post</h1>
      <PostForm post={post} action={action} error={error} submitLabel="Save changes" />
    </div>
  );
}
