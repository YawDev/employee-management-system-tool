"use client";

import { useState } from "react";

export const PAGE_SIZE = 10;

// Client-side paging over an already-fetched list (same logic as the blog's Drafts).
export function usePagination<T>(items: T[], pageSize = PAGE_SIZE) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Keep the page in range when the list shrinks (e.g. a search narrows the results).
  // Adjusted during render rather than in an effect, so no frame ever slices an empty page.
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  const page = Math.min(currentPage, totalPages);

  const indexOfLast = page * pageSize;
  const pageItems = items.slice(indexOfLast - pageSize, indexOfLast);

  return { currentPage: page, setCurrentPage, totalPages, pageItems };
}
