"use client";

export function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Delete this post? This can't be undone.")) {
          e.preventDefault();
        }
      }}
      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
