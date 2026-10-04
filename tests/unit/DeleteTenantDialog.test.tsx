import { fireEvent, render, screen } from "@testing-library/react";
import DeleteTenantDialog from "@/components/ui/Tenants/DeleteTenantDialog";

function openDialog() {
  render(<DeleteTenantDialog tenantName="Acme Corp" />);
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
});
