import { render, screen } from "@testing-library/react";
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
});
