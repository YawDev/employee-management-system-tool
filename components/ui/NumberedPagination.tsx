import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const NumberedPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Nothing to paginate when there's a single page (or none).
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseClasses =
    "flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors duration-150";
  const arrowClasses = `${baseClasses} border-slate-200 bg-white text-slate-600 hover:bg-navy-500/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={arrowClasses}
      >
        <IconChevronLeft size={14} aria-hidden="true" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`${baseClasses} ${
            page === currentPage
              ? "border-navy-500 bg-navy-500 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-navy-500/10"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={arrowClasses}
      >
        <IconChevronRight size={14} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default NumberedPagination;
