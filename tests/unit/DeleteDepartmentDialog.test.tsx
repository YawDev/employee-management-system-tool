import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteDepartmentDialog from "@/components/ui/Departments/DeleteDepartmentDialog";
import { deleteDepartmentAction } from "@/app/(dashboard)/organizations/[id]/departments/actions";

jest.mock("@/app/(dashboard)/organizations/[id]/departments/actions", () => ({
  deleteDepartmentAction: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

function openDialog() {
  render(<DeleteDepartmentDialog departmentId="dep-5" departmentName="Engineering" organizationId={1} />);
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
}

function confirmAndDelete() {
  fireEvent.change(screen.getByLabelText("Type Engineering to confirm"), {
    target: { value: "Engineering" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Delete department" }));
}

describe("DeleteDepartmentDialog", () => {
  it("opens a confirmation that explains the people rule", () => {
    openDialog();

    expect(screen.getByRole("dialog", { name: "Delete Engineering?" })).toBeInTheDocument();
    expect(screen.getByText(/still has employees or managers/)).toBeInTheDocument();
  });

  it("only enables delete once the name is typed", () => {
    openDialog();
    const confirm = screen.getByRole("button", { name: "Delete department" });

    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Type Engineering to confirm"), {
      target: { value: "Engineering" },
    });
    expect(confirm).toBeEnabled();
  });

  it("submits the department and organization ids", async () => {
    (deleteDepartmentAction as jest.Mock).mockResolvedValue({ error: null });
    openDialog();

    confirmAndDelete();

    await waitFor(() => expect(deleteDepartmentAction).toHaveBeenCalled());
    const data = (deleteDepartmentAction as jest.Mock).mock.calls[0][1] as FormData;
    expect(data.get("departmentId")).toBe("dep-5");
    expect(data.get("organizationId")).toBe("1");
  });

  it("shows the server's error and stays open", async () => {
    (deleteDepartmentAction as jest.Mock).mockResolvedValue({
      error: "Department still has employees or managers. Reassign them first.",
    });
    openDialog();

    confirmAndDelete();

    expect(await screen.findByRole("alert")).toHaveTextContent("still has employees or managers");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on cancel", () => {
    openDialog();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
