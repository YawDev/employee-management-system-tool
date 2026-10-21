import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteOrganizationDialog from "@/components/ui/Organizations/DeleteOrganizationDialog";
import { deleteOrganizationAction } from "@/app/(dashboard)/organizations/actions";

jest.mock("@/app/(dashboard)/organizations/actions", () => ({
  deleteOrganizationAction: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

function openDialog() {
  render(<DeleteOrganizationDialog organizationId={5} organizationName="Acme Retail" tenantId={1} />);
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
}

function confirmAndDelete() {
  fireEvent.change(screen.getByLabelText("Type Acme Retail to confirm"), {
    target: { value: "Acme Retail" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Delete organization" }));
}

describe("DeleteOrganizationDialog", () => {
  it("opens a confirmation that explains the departments rule", () => {
    openDialog();

    expect(screen.getByRole("dialog", { name: "Delete Acme Retail?" })).toBeInTheDocument();
    expect(screen.getByText(/still has departments/)).toBeInTheDocument();
  });

  it("only enables delete once the name is typed", () => {
    openDialog();
    const confirm = screen.getByRole("button", { name: "Delete organization" });

    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Type Acme Retail to confirm"), {
      target: { value: "Acme Retail" },
    });
    expect(confirm).toBeEnabled();
  });

  it("submits the organization and tenant ids", async () => {
    (deleteOrganizationAction as jest.Mock).mockResolvedValue({ error: null });
    openDialog();

    confirmAndDelete();

    await waitFor(() => expect(deleteOrganizationAction).toHaveBeenCalled());
    const data = (deleteOrganizationAction as jest.Mock).mock.calls[0][1] as FormData;
    expect(data.get("organizationId")).toBe("5");
    expect(data.get("tenantId")).toBe("1");
  });

  it("shows the server's error and stays open", async () => {
    (deleteOrganizationAction as jest.Mock).mockResolvedValue({
      error: "Organization still has departments. Delete or move them first.",
    });
    openDialog();

    confirmAndDelete();

    expect(await screen.findByRole("alert")).toHaveTextContent("still has departments");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on cancel", () => {
    openDialog();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
