import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteTenantDialog from "@/components/ui/Tenants/DeleteTenantDialog";
import { deleteTenantAction } from "@/app/(dashboard)/tenants/actions";

jest.mock("@/app/(dashboard)/tenants/actions", () => ({
  deleteTenantAction: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

function openDialog() {
  render(<DeleteTenantDialog tenantId={7} tenantName="Acme Corp" />);
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
}

describe("DeleteTenantDialog", () => {
  it("opens a confirmation that warns about the cascade", () => {
    openDialog();

    expect(screen.getByRole("dialog", { name: "Delete Acme Corp?" })).toBeInTheDocument();
    expect(screen.getByText(/organizations, departments, managers and employees/)).toBeInTheDocument();
  });

  it("only enables delete once the tenant name is typed", () => {
    openDialog();
    const confirm = screen.getByRole("button", { name: "Delete tenant" });

    expect(confirm).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Type Acme Corp to confirm"), {
      target: { value: "Acme Corp" },
    });

    expect(confirm).toBeEnabled();
  });

  it("closes on cancel", () => {
    openDialog();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits the tenant id once confirmed", async () => {
    (deleteTenantAction as jest.Mock).mockResolvedValue({ error: null });
    openDialog();

    fireEvent.change(screen.getByLabelText("Type Acme Corp to confirm"), {
      target: { value: "Acme Corp" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Delete tenant" }));

    await waitFor(() => expect(deleteTenantAction).toHaveBeenCalled());
    const formData = (deleteTenantAction as jest.Mock).mock.calls[0][1] as FormData;
    expect(formData.get("tenantId")).toBe("7");
  });

  it("shows the server's error and stays open", async () => {
    (deleteTenantAction as jest.Mock).mockResolvedValue({ error: "This tenant no longer exists." });
    openDialog();

    fireEvent.change(screen.getByLabelText("Type Acme Corp to confirm"), {
      target: { value: "Acme Corp" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Delete tenant" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("This tenant no longer exists.");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
