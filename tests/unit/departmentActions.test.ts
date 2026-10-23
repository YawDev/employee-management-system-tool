import { AxiosError, AxiosHeaders } from "axios";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createDepartmentAction,
  deleteDepartmentAction,
  updateDepartmentAction,
} from "@/app/(dashboard)/organizations/[id]/departments/actions";
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
} from "@/lib/data/core/departments";
import { getInitialUser } from "@/lib/data/identity/auth";

jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/data/core/departments", () => ({
  createDepartment: jest.fn(),
  editDepartment: jest.fn(),
  deleteDepartment: jest.fn(),
}));
jest.mock("@/lib/data/identity/auth", () => ({ getInitialUser: jest.fn() }));

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => data.set(key, value));
  return data;
};

const apiError = (status: number, Message?: string) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: Message ? { StatusCode: status, Message } : {},
  });

const initial = { error: null };
const DEPT = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  (getInitialUser as jest.Mock).mockResolvedValue({ id: "admin" });
});

describe("createDepartmentAction", () => {
  it("redirects to /login without a sys-admin session", async () => {
    (getInitialUser as jest.Mock).mockResolvedValue(null);

    await expect(
      createDepartmentAction(initial, form({ organizationId: "1", name: "Engineering" })),
    ).rejects.toThrow("REDIRECT:/login");
    expect(createDepartment).not.toHaveBeenCalled();
  });

  it("requires a name", async () => {
    expect(await createDepartmentAction(initial, form({ organizationId: "1" }))).toEqual({
      error: "Enter a department name.",
    });
  });

  it("creates under the organization and returns to its page", async () => {
    (createDepartment as jest.Mock).mockResolvedValue({ isSaved: true });

    await expect(
      createDepartmentAction(
        initial,
        form({ organizationId: "1", name: " Engineering ", description: "" }),
      ),
    ).rejects.toThrow("REDIRECT:/organizations/1");

    expect(createDepartment).toHaveBeenCalledWith({
      organizationId: 1,
      name: "Engineering",
      description: null,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/organizations/1");
  });

  it("shows the API's message for a duplicate name", async () => {
    (createDepartment as jest.Mock).mockRejectedValue(
      apiError(400, "Department name already exists for this organization."),
    );

    expect(
      await createDepartmentAction(initial, form({ organizationId: "1", name: "Engineering" })),
    ).toEqual({
      error: "Department name already exists for this organization.",
      name: "Engineering",
    });
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("updateDepartmentAction", () => {
  it("saves and redirects to the nested department page", async () => {
    (editDepartment as jest.Mock).mockResolvedValue({ isSaved: true });

    await expect(
      updateDepartmentAction(
        initial,
        form({ organizationId: "1", departmentId: DEPT, name: "Platform", description: "Infra" }),
      ),
    ).rejects.toThrow(`REDIRECT:/organizations/1/departments/${DEPT}`);

    expect(editDepartment).toHaveBeenCalledWith({
      departmentId: DEPT,
      organizationId: 1,
      name: "Platform",
      description: "Infra",
    });
  });

  it("falls back to a generic message for a 404 without a body", async () => {
    (editDepartment as jest.Mock).mockRejectedValue(apiError(404));

    const state = await updateDepartmentAction(
      initial,
      form({ organizationId: "1", departmentId: DEPT, name: "Platform" }),
    );

    expect(state.error).toBe("This department no longer exists.");
  });
});

describe("deleteDepartmentAction", () => {
  it("deletes and returns to the organization page", async () => {
    (deleteDepartment as jest.Mock).mockResolvedValue({ isDeleted: true });

    await expect(
      deleteDepartmentAction(initial, form({ organizationId: "1", departmentId: DEPT })),
    ).rejects.toThrow("REDIRECT:/organizations/1");
    expect(deleteDepartment).toHaveBeenCalledWith(DEPT);
  });

  it("explains why a department with people can't be deleted", async () => {
    (deleteDepartment as jest.Mock).mockRejectedValue(
      apiError(400, "Department still has employees or managers. Reassign them first."),
    );

    const state = await deleteDepartmentAction(
      initial,
      form({ organizationId: "1", departmentId: DEPT }),
    );

    expect(state.error).toBe("Department still has employees or managers. Reassign them first.");
  });
});
