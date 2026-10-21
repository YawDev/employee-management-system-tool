import { fireEvent, render, screen } from "@testing-library/react";
import TenantOrganizations from "@/components/ui/Tenants/TenantOrganizations";

const orgs = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    organizationId: i + 1,
    name: `Org ${i + 1}`,
    tenantId: 1,
    industry: "Retail",
    tenantName: "Acme Corp",
  }));

describe("TenantOrganizations", () => {
  it("shows the total count, not the page count", () => {
    render(<TenantOrganizations tenantId={1} organizations={orgs(12)} />);

    expect(screen.getByText("· 12")).toBeInTheDocument();
  });

  it("paginates the tenant's organizations", () => {
    render(<TenantOrganizations tenantId={1} organizations={orgs(12)} />);

    expect(screen.queryByRole("link", { name: "Org 11" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("link", { name: "Org 11" })).toHaveAttribute("href", "/organizations/11");
    expect(screen.queryByRole("link", { name: "Org 1" })).not.toBeInTheDocument();
  });

  it("shows the empty state with no pagination", () => {
    render(<TenantOrganizations tenantId={1} organizations={[]} />);

    expect(screen.getByText("No organizations yet.")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Pagination" })).not.toBeInTheDocument();
  });
});
