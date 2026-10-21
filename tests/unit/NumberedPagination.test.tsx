import { fireEvent, render, screen } from "@testing-library/react";
import NumberedPagination from "@/components/ui/NumberedPagination";

describe("NumberedPagination", () => {
  it("renders nothing for a single page", () => {
    const { container } = render(
      <NumberedPagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a button per page and marks the current one", () => {
    render(<NumberedPagination currentPage={2} totalPages={3} onPageChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("disables Previous on the first page and Next on the last", () => {
    const { rerender } = render(
      <NumberedPagination currentPage={1} totalPages={3} onPageChange={jest.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();

    rerender(<NumberedPagination currentPage={3} totalPages={3} onPageChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("reports the requested page", () => {
    const onPageChange = jest.fn();
    render(<NumberedPagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(onPageChange.mock.calls).toEqual([[3], [1], [3]]);
  });
});
