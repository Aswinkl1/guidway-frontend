export const Pagination = ({
  page,
  totalItems,
  limit,
  onPageChange,
}: {
  page: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | null)[] = [1];
    if (page > 3) pages.push(null);
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push(null);
    pages.push(totalPages);
    return pages;
  };

  const btnBase =
    "inline-flex items-center justify-center h-9 min-w-[36px] px-3 rounded-full border border-gray-200 text-sm cursor-pointer transition-colors hover:bg-gray-100 disabled:opacity-35 disabled:cursor-not-allowed";
  const activeBtn = "bg-gray-900 text-white border-gray-900 font-medium";

  return (
    <div className="flex flex-col gap-6 py-8">
      {/* <div className="rounded-xl border border-gray-100 bg-white px-5 py-4">
        <p className="text-xs text-gray-400 mb-1">Sessions</p>
        <p className="text-sm font-medium">
          Showing {start}–{end} of {totalItems} sessions
        </p>
      </div> */}

      <nav
        className="flex items-center justify-center gap-1.5 flex-wrap"
        aria-label="Pagination"
      >
        <button
          className={`${btnBase} gap-1 px-3.5`}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹ Prev
        </button>

        {getPages().map((pg, i) =>
          pg === null ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={pg}
              className={`${btnBase} ${pg === page ? activeBtn : ""}`}
              onClick={() => onPageChange(pg)}
            >
              {pg}
            </button>
          ),
        )}

        <button
          className={`${btnBase} gap-1 px-3.5`}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next ›
        </button>
      </nav>
    </div>
  );
};
