import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { normalizePostContent } from "@/lib/posts";

type CodeProps = { className?: string; children?: ReactNode };

/**
 * Renders a post's markdown. If the post (or part of it) was pasted as a
 * "markdown" code block, that block is rendered as formatted markdown instead
 * of a black code box. Real code samples (js, bash, ...) stay as code.
 */
function UnwrapMarkdownPre({ children }: { children?: ReactNode }) {
  const child = Children.toArray(children)[0];

  if (isValidElement(child)) {
    const code = child as ReactElement<CodeProps>;
    const lang = /language-([\w-]+)/.exec(code.props.className ?? "")?.[1]?.toLowerCase();
    const text = Children.toArray(code.props.children).join("").replace(/\n$/, "");

    const headingCount = (text.match(/^#{2,6}[ \t]+\S/gm) ?? []).length;
    const isMarkdownLang = lang === "markdown" || lang === "md";
    const looksLikeArticle = !lang && headingCount >= 2 && text.length > 500;

    if (isMarkdownLang || looksLikeArticle) {
      return <PostContent content={text} />;
    }
  }

  return <pre>{children}</pre>;
}

export function PostContent({ content }: { content: string }) {
  return (
    <ReactMarkdown components={{ pre: UnwrapMarkdownPre }}>
      {normalizePostContent(content)}
    </ReactMarkdown>
  );
}
