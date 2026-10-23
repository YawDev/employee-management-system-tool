import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SaveDepartmentForm from "@/components/ui/Departments/SaveDepartmentForm";
import {
  createDepartmentAction,
  updateDepartmentAction,
} from "@/app/(dashboard)/organizations/[id]/departments/actions";

jest.mock("@/app/(dashboard)/organizations/[id]/departments/actions", () => ({
  createDepartmentAction: jest.fn(),
  updateDepartmentAction: jest.fn(),
}));

const department = {
  departmentId: "dep-1",
  name: "Engineering",
  organizationId: 1,
  description: "Builds things",
};

beforeEach(() => jest.clearAllMocks());

const submittedForm = (action: unknown) => (action as jest.Mock).mock.calls[0][1] as FormData;

describe("SaveDepartmentForm", () => {
  it("renders empty in create mode and cancels back to the organization", () => {
    render(<SaveDepartmentForm organizationId={1} />);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Create department" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/organizations/1");
  });

  it("requires a name", () => {
    render(<SaveDepartmentForm organizationId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Create department" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a department name.");
    expect(createDepartmentAction).not.toHaveBeenCalled();
  });

  it("submits name, description and the organization id to the create action", async () => {
    (createDepartmentAction as jest.Mock).mockResolvedValue({ error: null });
    render(<SaveDepartmentForm organizationId={1} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Engineering" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Builds things" } });
    fireEvent.click(screen.getByRole("button", { name: "Create department" }));

    await waitFor(() => expect(createDepartmentAction).toHaveBeenCalled());
    const data = submittedForm(createDepartmentAction);
    expect(data.get("name")).toBe("Engineering");
    expect(data.get("description")).toBe("Builds things");
    expect(data.get("organizationId")).toBe("1");
  });

  it("shows the server's error and keeps the typed name", async () => {
    (createDepartmentAction as jest.Mock).mockResolvedValue({
      error: "Department name already exists for this organization.",
      name: "Engineering",
    });
    render(<SaveDepartmentForm organizationId={1} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Engineering" } });
    fireEvent.click(screen.getByRole("button", { name: "Create department" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("already exists");
    expect(screen.getByLabelText("Name")).toHaveValue("Engineering");
  });

  it("in edit mode prefills and submits ids to the update action", async () => {
    (updateDepartmentAction as jest.Mock).mockResolvedValue({ error: null });
    render(<SaveDepartmentForm organizationId={1} department={department} />);

    expect(screen.getByLabelText("Name")).toHaveValue("Engineering");
    expect(screen.getByLabelText("Description")).toHaveValue("Builds things");
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/organizations/1/departments/dep-1",
    );

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(updateDepartmentAction).toHaveBeenCalled());
    const data = submittedForm(updateDepartmentAction);
    expect(data.get("departmentId")).toBe("dep-1");
    expect(data.get("organizationId")).toBe("1");
    expect(createDepartmentAction).not.toHaveBeenCalled();
  });
});
