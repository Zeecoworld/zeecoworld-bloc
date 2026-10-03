export const POSTS_PER_PAGE = 6;

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Cleans up post content that was pasted from a chat/AI "markdown" code block.
 * - If the content contains a ```markdown (or ```md) fence, only the text
 *   inside that fence is kept, so it renders as formatted markdown instead of
 *   a black code block.
 * - A leading "# Title" line is removed, because the page already shows the
 *   post title as its <h1>.
 */
export function normalizePostContent(content: string): string {
  let text = content.replace(/\r\n/g, "\n").trim();

  const fenced = text.match(/```(?:markdown|md)[^\n]*\n([\s\S]*)\n```\s*$/i);
  if (fenced) {
    text = fenced[1].trim();
  }

  text = text.replace(/^#\s+.+\n+/, "");

  return text;
}
