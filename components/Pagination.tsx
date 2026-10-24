import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage === 2 ? "/" : `/page/${currentPage - 1}`;
  const nextHref = `/page/${currentPage + 1}`;

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          &larr; Newer posts
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-[var(--gray)]">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Older posts &rarr;
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
