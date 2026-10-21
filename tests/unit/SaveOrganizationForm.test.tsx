import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SaveOrganizationForm from "@/components/ui/Organizations/SaveOrganizationForm";
import {
  createOrganizationAction,
  updateOrganizationAction,
} from "@/app/(dashboard)/organizations/actions";

jest.mock("@/app/(dashboard)/organizations/actions", () => ({
  createOrganizationAction: jest.fn(),
  updateOrganizationAction: jest.fn(),
}));

const tenants = [
  { tenantId: 1, uid: "u1", name: "Acme Corp", logo: null, organizationCount: 2 },
  { tenantId: 2, uid: "u2", name: "Globex", logo: null, organizationCount: 0 },
];

const organization = {
  organizationId: 5,
  name: "Acme Retail",
  industry: "Retail",
  tenantId: 1,
  tenant: tenants[0],
  departments: [],
};

beforeEach(() => jest.clearAllMocks());

const submittedForm = (action: unknown) => (action as jest.Mock).mock.calls[0][1] as FormData;

describe("SaveOrganizationForm", () => {
  it("renders empty in create mode with a tenant picker", () => {
    render(<SaveOrganizationForm tenants={tenants} />);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Tenant")).toHaveValue("");
    expect(screen.getByRole("option", { name: "Globex" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create organization" })).toBeInTheDocument();
  });

  it("prefills the tenant when coming from a tenant page", () => {
    render(<SaveOrganizationForm tenants={tenants} defaultTenantId={2} />);

    expect(screen.getByLabelText("Tenant")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/tenants/2");
  });

  it("requires a name", () => {
    render(<SaveOrganizationForm tenants={tenants} defaultTenantId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Create organization" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter an organization name.");
    expect(createOrganizationAction).not.toHaveBeenCalled();
  });

  it("requires a tenant", () => {
    render(<SaveOrganizationForm tenants={tenants} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Acme Retail" } });
    fireEvent.click(screen.getByRole("button", { name: "Create organization" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Choose a tenant.");
    expect(createOrganizationAction).not.toHaveBeenCalled();
  });

  it("submits name, industry and tenant to the create action", async () => {
    (createOrganizationAction as jest.Mock).mockResolvedValue({ error: null });
    render(<SaveOrganizationForm tenants={tenants} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Globex Energy" } });
    fireEvent.change(screen.getByLabelText(/Industry/), { target: { value: "Energy" } });
    fireEvent.change(screen.getByLabelText("Tenant"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Create organization" }));

    await waitFor(() => expect(createOrganizationAction).toHaveBeenCalled());
    const data = submittedForm(createOrganizationAction);
    expect(data.get("name")).toBe("Globex Energy");
    expect(data.get("industry")).toBe("Energy");
    expect(data.get("tenantId")).toBe("2");
  });

  it("shows the server's error and keeps the typed name", async () => {
    (createOrganizationAction as jest.Mock).mockResolvedValue({
      error: "Organization name already exists for this tenant.",
      name: "Acme Retail",
    });
    render(<SaveOrganizationForm tenants={tenants} defaultTenantId={1} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Acme Retail" } });
    fireEvent.click(screen.getByRole("button", { name: "Create organization" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Organization name already exists for this tenant.");
    expect(screen.getByLabelText("Name")).toHaveValue("Acme Retail");
  });

  it("in edit mode shows the tenant read-only and submits ids to the update action", async () => {
    (updateOrganizationAction as jest.Mock).mockResolvedValue({ error: null });
    render(<SaveOrganizationForm organization={organization} />);

    expect(screen.getByLabelText("Name")).toHaveValue("Acme Retail");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(updateOrganizationAction).toHaveBeenCalled());
    const data = submittedForm(updateOrganizationAction);
    expect(data.get("organizationId")).toBe("5");
    expect(data.get("tenantId")).toBe("1");
    expect(createOrganizationAction).not.toHaveBeenCalled();
  });
});
