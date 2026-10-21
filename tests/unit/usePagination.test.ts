import { act, renderHook } from "@testing-library/react";
import { PAGE_SIZE, usePagination } from "@/lib/usePagination";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe("usePagination", () => {
  it("returns the first page of items", () => {
    const { result } = renderHook(() => usePagination(range(25)));

    expect(PAGE_SIZE).toBe(10);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageItems).toEqual(range(10));
  });

  it("slices the requested page, including a short last page", () => {
    const { result } = renderHook(() => usePagination(range(25)));

    act(() => result.current.setCurrentPage(3));

    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25]);
  });

  it("reports one page for an empty list", () => {
    const { result } = renderHook(() => usePagination([]));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageItems).toEqual([]);
  });

  it("pulls the page back into range when the list shrinks", () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items), {
      initialProps: { items: range(25) },
    });

    act(() => result.current.setCurrentPage(3));
    rerender({ items: range(12) });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual([11, 12]);
  });
});
