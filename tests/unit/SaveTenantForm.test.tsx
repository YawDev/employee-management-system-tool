import { fireEvent, render, screen } from "@testing-library/react";
import SaveTenantForm from "@/components/ui/Tenants/SaveTenantForm";

const tenant = {
  tenantId: 1,
  uid: "3f9a2b10-7c4e-4d1a-9b55-0e8f1d2ac21e",
  name: "Acme Corp",
  logo: "acme-logo.png",
};

describe("SaveTenantForm", () => {
  it("renders empty in create mode", () => {
    render(<SaveTenantForm />);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByText("No file chosen")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create tenant" })).toBeInTheDocument();
  });

  it("prefills the tenant in edit mode", () => {
    render(<SaveTenantForm tenant={tenant} />);

    expect(screen.getByLabelText("Name")).toHaveValue("Acme Corp");
    expect(screen.getByText("acme-logo.png")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("shows the selected logo filename", () => {
    render(<SaveTenantForm />);

    const file = new File(["logo"], "globex.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Logo file"), { target: { files: [file] } });

    expect(screen.getByText("globex.png")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replace" })).toBeInTheDocument();
  });

  it("removes the logo", () => {
    render(<SaveTenantForm tenant={tenant} />);

    fireEvent.click(screen.getByRole("button", { name: "Remove logo" }));

    expect(screen.getByText("No file chosen")).toBeInTheDocument();
  });

  it("requires a name", () => {
    render(<SaveTenantForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create tenant" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a tenant name.");
  });
});
