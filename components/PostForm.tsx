"use client";

import { useState } from "react";
import Image from "next/image";
import type { Post } from "@/lib/posts";

export function PostForm({
  post,
  action,
  error,
  submitLabel,
}: {
  post?: Post;
  action: (formData: FormData) => void;
  error?: string;
  submitLabel: string;
}) {
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const body = new FormData();
      body.append("file", file);

      // Hardcoded to match this app's fixed basePath ("/blog") in next.config.ts.
      const res = await fetch("/blog/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
      } else {
        setCoverImage(data.url);
      }
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--dark)] mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={post?.title}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--dark)] mb-1">
          Slug{" "}
          <span className="text-[var(--gray)] font-normal">
            (leave blank to auto-generate from title)
          </span>
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={post?.slug}
          placeholder="my-post-title"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--dark)] mb-1">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={2}
          placeholder="One or two sentences shown on the blog index"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--dark)] mb-1">
          Cover image
        </label>

        {coverImage && (
          <div className="relative w-full max-w-xs aspect-[16/9] rounded-lg overflow-hidden bg-[var(--light)] mb-3">
            <Image
              src={coverImage}
              alt="Cover preview"
              fill
              className="object-cover"
              sizes="320px"
              unoptimized
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-[var(--light)] transition-colors">
            {uploading ? "Uploading..." : coverImage ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {coverImage && (
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="text-sm text-[var(--gray)] hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>

        {uploadError && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {uploadError}
          </p>
        )}

        <input type="hidden" name="cover_image" value={coverImage} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--dark)] mb-1">
          Content{" "}
          <span className="text-[var(--gray)] font-normal">(Markdown supported)</span>
        </label>
        <textarea
          name="content"
          defaultValue={post?.content}
          required
          rows={16}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--dark)]">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published}
          className="rounded border-gray-300"
        />
        Published (visible on the public blog)
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="bg-[var(--primary)] text-white rounded-lg px-5 py-2.5 font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
