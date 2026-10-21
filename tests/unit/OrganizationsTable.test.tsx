import { fireEvent, render, screen } from "@testing-library/react";
import OrganizationsTable from "@/components/ui/Organizations/OrganizationsTable";

const organizations = [
  { organizationId: 1, name: "Acme Retail", tenantId: 1, industry: "Retail", tenantName: "Acme Corp" },
  { organizationId: 2, name: "Acme Labs", tenantId: 1, industry: "Research", tenantName: "Acme Corp" },
  { organizationId: 3, name: "Globex Energy", tenantId: 2, industry: "", tenantName: "Globex" },
];

const search = (value: string) =>
  fireEvent.change(screen.getByLabelText("Search"), { target: { value } });

describe("OrganizationsTable", () => {
  it("renders the column labels", () => {
    render(<OrganizationsTable organizations={organizations} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Tenant")).toBeInTheDocument();
    expect(screen.getByText("Industry")).toBeInTheDocument();
  });

  it("links each organization to its detail page", () => {
    render(<OrganizationsTable organizations={organizations} />);

    expect(screen.getByRole("link", { name: "Acme Retail" })).toHaveAttribute("href", "/organizations/1");
  });

  it("links the tenant name to the tenant page", () => {
    render(<OrganizationsTable organizations={organizations} />);

    expect(screen.getByRole("link", { name: "Globex" })).toHaveAttribute("href", "/tenants/2");
  });

  it("shows a dash when industry is empty", () => {
    render(<OrganizationsTable organizations={organizations} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("filters by organization name, case-insensitively", () => {
    render(<OrganizationsTable organizations={organizations} />);

    search("labs");

    expect(screen.getByRole("link", { name: "Acme Labs" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Acme Retail" })).not.toBeInTheDocument();
  });

  it("filters by tenant name", () => {
    render(<OrganizationsTable organizations={organizations} />);

    search("globex");

    expect(screen.getByRole("link", { name: "Globex Energy" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Acme Retail" })).not.toBeInTheDocument();
  });

  it("says when nothing matches the search", () => {
    render(<OrganizationsTable organizations={organizations} />);

    search("initech");

    expect(screen.getByText('No organizations match "initech".')).toBeInTheDocument();
  });

  it("shows an empty state when there are no organizations", () => {
    render(<OrganizationsTable organizations={[]} />);

    expect(screen.getByText("No organizations yet.")).toBeInTheDocument();
  });

  it("returns to page 1 when the search changes", () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      organizationId: i + 1,
      name: `Org ${i + 1}`,
      tenantId: 1,
      industry: "Retail",
      tenantName: "Acme Corp",
    }));
    render(<OrganizationsTable organizations={many} />);

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByRole("link", { name: "Org 11" })).toBeInTheDocument();

    search("org");

    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Org 1" })).toBeInTheDocument();
  });
});
