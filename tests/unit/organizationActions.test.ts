import { AxiosError, AxiosHeaders } from "axios";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createOrganizationAction,
  deleteOrganizationAction,
  updateOrganizationAction,
} from "@/app/(dashboard)/organizations/actions";
import {
  createOrganization,
  deleteOrganization,
  editOrganization,
} from "@/lib/data/core/organizations";
import { getInitialUser } from "@/lib/data/identity/auth";

jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/data/core/organizations", () => ({
  createOrganization: jest.fn(),
  editOrganization: jest.fn(),
  deleteOrganization: jest.fn(),
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

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  (getInitialUser as jest.Mock).mockResolvedValue({ id: "admin" });
});

describe("createOrganizationAction", () => {
  it("redirects to /login without a sys-admin session", async () => {
    (getInitialUser as jest.Mock).mockResolvedValue(null);

    await expect(createOrganizationAction(initial, form({ name: "Acme Retail", tenantId: "1" }))).rejects.toThrow(
      "REDIRECT:/login",
    );
    expect(createOrganization).not.toHaveBeenCalled();
  });

  it("requires a name and a tenant", async () => {
    expect(await createOrganizationAction(initial, form({ tenantId: "1" }))).toEqual({
      error: "Enter an organization name.",
    });
    expect(await createOrganizationAction(initial, form({ name: "Acme Retail" }))).toEqual({
      error: "Choose a tenant.",
      name: "Acme Retail",
    });
  });

  it("creates with an optional industry, then refreshes tenant counts and redirects", async () => {
    (createOrganization as jest.Mock).mockResolvedValue({ isSaved: true });

    await expect(
      createOrganizationAction(initial, form({ name: " Acme Retail ", tenantId: "2", industry: "" })),
    ).rejects.toThrow("REDIRECT:/organizations");

    expect(createOrganization).toHaveBeenCalledWith({ name: "Acme Retail", tenantId: 2, industry: null });
    expect(revalidatePath).toHaveBeenCalledWith("/tenants");
    expect(revalidatePath).toHaveBeenCalledWith("/tenants/2");
  });

  it("shows the API's message for a duplicate name", async () => {
    (createOrganization as jest.Mock).mockRejectedValue(
      apiError(400, "Organization name already exists for this tenant."),
    );

    expect(await createOrganizationAction(initial, form({ name: "Acme Retail", tenantId: "1" }))).toEqual({
      error: "Organization name already exists for this tenant.",
      name: "Acme Retail",
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("shows the API's wording for a 404, e.g. a missing tenant", async () => {
    (createOrganization as jest.Mock).mockRejectedValue(apiError(404, "Tenant not found."));

    const state = await createOrganizationAction(initial, form({ name: "Acme Retail", tenantId: "9" }));

    expect(state.error).toBe("Tenant not found.");
  });
});

describe("updateOrganizationAction", () => {
  it("saves and redirects to the organization page, not the tenant id", async () => {
    (editOrganization as jest.Mock).mockResolvedValue({ isSaved: true });

    await expect(
      updateOrganizationAction(
        initial,
        form({ organizationId: "5", tenantId: "2", name: "Acme Labs", industry: "Research" }),
      ),
    ).rejects.toThrow("REDIRECT:/organizations/5");

    expect(editOrganization).toHaveBeenCalledWith({
      organizationId: 5,
      tenantId: 2,
      name: "Acme Labs",
      industry: "Research",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/organizations/5");
  });

  it("falls back to a generic message for a 404 without a body", async () => {
    (editOrganization as jest.Mock).mockRejectedValue(apiError(404));

    const state = await updateOrganizationAction(
      initial,
      form({ organizationId: "5", tenantId: "2", name: "Acme Labs" }),
    );

    expect(state.error).toBe("This organization no longer exists.");
  });
});

describe("deleteOrganizationAction", () => {
  it("deletes and redirects to the list", async () => {
    (deleteOrganization as jest.Mock).mockResolvedValue({ isDeleted: true });

    await expect(
      deleteOrganizationAction(initial, form({ organizationId: "5", tenantId: "2" })),
    ).rejects.toThrow("REDIRECT:/organizations");
    expect(deleteOrganization).toHaveBeenCalledWith(5);
    expect(revalidatePath).toHaveBeenCalledWith("/tenants/2");
  });

  it("explains why an organization with departments can't be deleted", async () => {
    (deleteOrganization as jest.Mock).mockRejectedValue(
      apiError(400, "Organization still has departments. Delete or move them first."),
    );

    const state = await deleteOrganizationAction(initial, form({ organizationId: "5", tenantId: "2" }));

    expect(state.error).toBe("Organization still has departments. Delete or move them first.");
  });
});
