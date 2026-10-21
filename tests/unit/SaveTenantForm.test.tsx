import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SaveTenantForm from "@/components/ui/Tenants/SaveTenantForm";
import {
  createTenantAction,
  updateTenantAction,
} from "@/app/(dashboard)/tenants/actions";

jest.mock("@/app/(dashboard)/tenants/actions", () => ({
  createTenantAction: jest.fn(),
  updateTenantAction: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

const tenant = {
  tenantId: 1,
  uid: "3f9a2b10-7c4e-4d1a-9b55-0e8f1d2ac21e",
  name: "Acme Corp",
  logo: "acme-logo.png",
  organizationCount: 3,
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

  it("requires a name and doesn't call the action", () => {
    render(<SaveTenantForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create tenant" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a tenant name.");
    expect(createTenantAction).not.toHaveBeenCalled();
  });

  it("submits to the create action with the name and logo filename", async () => {
    (createTenantAction as jest.Mock).mockResolvedValue({ error: null });
    render(<SaveTenantForm />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Globex" } });
    const file = new File(["logo"], "globex.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Logo file"), { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Create tenant" }));

    await waitFor(() => expect(createTenantAction).toHaveBeenCalled());
    const formData = (createTenantAction as jest.Mock).mock.calls[0][1] as FormData;
    expect(formData.get("name")).toBe("Globex");
    expect(formData.get("logo")).toBe("globex.png");
  });

  it("shows the server's error", async () => {
    (createTenantAction as jest.Mock).mockResolvedValue({
      error: "Tenant name already exists.",
      name: "Acme Corp",
    });
    render(<SaveTenantForm />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Acme Corp" } });
    fireEvent.click(screen.getByRole("button", { name: "Create tenant" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Tenant name already exists.");
    expect(screen.getByLabelText("Name")).toHaveValue("Acme Corp");
  });

  it("submits edits to the update action with the tenant id", async () => {
    (updateTenantAction as jest.Mock).mockResolvedValue({ error: null });
    render(<SaveTenantForm tenant={tenant} />);

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(updateTenantAction).toHaveBeenCalled());
    const formData = (updateTenantAction as jest.Mock).mock.calls[0][1] as FormData;
    expect(formData.get("tenantId")).toBe("1");
    expect(formData.get("name")).toBe("Acme Corp");
    expect(createTenantAction).not.toHaveBeenCalled();
  });
});
