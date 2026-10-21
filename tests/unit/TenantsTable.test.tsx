import { fireEvent, render, screen } from "@testing-library/react";
import TenantsTable from "@/components/ui/Tenants/TenantsTable";

const tenants = [
  { tenantId: 1, name: "Acme Corp", organizationCount: 3 },
  { tenantId: 2, name: "Globex", organizationCount: 0 },
];

describe("TenantsTable", () => {
  it("renders the column labels", () => {
    render(<TenantsTable tenants={tenants} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
  });

  it("renders a row per tenant with its organization count", () => {
    render(<TenantsTable tenants={tenants} />);

    expect(screen.getByRole("link", { name: /Acme Corp/ })).toHaveTextContent("3");
    expect(screen.getByRole("link", { name: /Globex/ })).toHaveTextContent("0");
  });

  it("links each row to the tenant detail page", () => {
    render(<TenantsTable tenants={tenants} />);

    expect(screen.getByRole("link", { name: /Acme Corp/ })).toHaveAttribute(
      "href",
      "/tenants/1",
    );
  });

  it("shows ten tenants per page and the rest on page 2", () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      tenantId: i + 1,
      name: `Tenant ${i + 1}`,
      organizationCount: 0,
    }));
    render(<TenantsTable tenants={many} />);

    expect(screen.getByRole("link", { name: /Tenant 10\b/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Tenant 11\b/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByRole("link", { name: /Tenant 11\b/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Tenant 1\b/ })).not.toBeInTheDocument();
  });

  it("hides pagination for a single page", () => {
    render(<TenantsTable tenants={tenants} />);

    expect(screen.queryByRole("navigation", { name: "Pagination" })).not.toBeInTheDocument();
  });
});
