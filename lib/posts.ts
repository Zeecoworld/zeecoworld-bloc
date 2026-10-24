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
 * Cleans up post content that was pasted from a chat/AI "markdown" code block,
 * so it renders as normal formatted markdown instead of a black code box.
 *
 * - If the post is wrapped in a code fence (``` or ~~~, labelled markdown/md or
 *   unlabelled) that opens near the top and closes near the end, only the text
 *   inside is kept. Everything before it (stray headings, a "Markdown" label)
 *   is dropped.
 * - If the whole post is an indented code block (4 spaces / tab), it is dedented.
 * - A leading "# Title" line is removed, because the page already shows the
 *   title as its <h1>.
 *
 * Normal articles that merely contain a few code samples are left untouched.
 */
export function normalizePostContent(content: string): string {
  let lines = content
    .replace(/\r\n/g, "\n")
    // Stray labels copied along with a chat "markdown" code block.
    .replace(/^#{1,6}[ \t]*complete markdown blog post[ \t]*$/gim, "")
    .replace(/^[ \t]*markdown[ \t]*\n(?=\s*(```|~~~))/gim, "")
    .replace(/^(\s*\n)+/, "")
    .trimEnd()
    .split("\n");

  const fenceRe = /^\s*(`{3,}|~{3,})\s*([A-Za-z0-9_+-]*)/;
  const fenceIdx: number[] = [];
  lines.forEach((line, i) => {
    if (fenceRe.test(line)) fenceIdx.push(i);
  });

  if (fenceIdx.length >= 2) {
    const first = fenceIdx[0];
    const last = fenceIdx[fenceIdx.length - 1];
    const lang = (lines[first].match(fenceRe)?.[2] ?? "").toLowerCase();
    const labelOk = lang === "" || lang === "markdown" || lang === "md";
    const trailing = lines.slice(last + 1).filter((l) => l.trim()).length;
    const leading = lines.slice(0, first).filter((l) => l.trim()).length;

    if (labelOk && trailing === 0 && leading <= 8) {
      lines = lines.slice(first + 1, last);
    }
  }

  const nonEmpty = lines.filter((l) => l.trim());
  const indented = nonEmpty.filter((l) => /^( {4}|\t)/.test(l)).length;
  if (nonEmpty.length > 0 && indented / nonEmpty.length > 0.8) {
    lines = lines.map((l) => l.replace(/^( {4}|\t)/, ""));
  }

  let text = lines.join("\n").trim();
  text = text.replace(/^#\s+.+\n+/, "");
  return text;
}
