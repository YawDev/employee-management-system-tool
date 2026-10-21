import { fireEvent, render, screen } from "@testing-library/react";
import OrganizationDepartments from "@/components/ui/Organizations/OrganizationDepartments";

const departments = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    departmentId: `dep-${i + 1}`,
    name: `Dept ${i + 1}`,
    organizationId: 1,
    description: i === 0 ? "Builds things" : null,
  }));

describe("OrganizationDepartments", () => {
  it("shows the total count and each department name", () => {
    render(<OrganizationDepartments organizationId={1} departments={departments(2)} />);

    expect(screen.getByText("· 2")).toBeInTheDocument();
    expect(screen.getByText("Dept 1")).toBeInTheDocument();
  });

  it("shows an empty state", () => {
    render(<OrganizationDepartments organizationId={1} departments={[]} />);

    expect(screen.getByText("No departments yet.")).toBeInTheDocument();
  });

  it("paginates past ten departments", () => {
    render(<OrganizationDepartments organizationId={1} departments={departments(12)} />);

    expect(screen.queryByText("Dept 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByText("Dept 11")).toBeInTheDocument();
    expect(screen.queryByText("Dept 1")).not.toBeInTheDocument();
  });

  it("links each department to its page under the organization", () => {
    render(<OrganizationDepartments organizationId={1} departments={departments(1)} />);

    expect(screen.getByRole("link", { name: "Dept 1" })).toHaveAttribute(
      "href",
      "/organizations/1/departments/dep-1",
    );
  });

  it("links to create a department in this organization", () => {
    render(<OrganizationDepartments organizationId={1} departments={[]} />);

    expect(screen.getByRole("link", { name: "Add department" })).toHaveAttribute(
      "href",
      "/organizations/1/departments/create",
    );
  });
});
