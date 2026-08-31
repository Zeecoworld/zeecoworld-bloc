import { createPost } from "@/lib/actions";
import { PostForm } from "@/components/PostForm";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-[var(--dark)] mb-8">New post</h1>
      <PostForm action={createPost} error={error} submitLabel="Create post" />
    </div>
  );
}
