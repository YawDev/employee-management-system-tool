import { AxiosError, AxiosHeaders } from "axios";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createTenantAction,
  deleteTenantAction,
  updateTenantAction,
} from "@/app/(dashboard)/tenants/actions";
import { createTenant, deleteTenant, editTenant } from "@/lib/data/core/tenants";
import { getInitialUser } from "@/lib/data/identity/auth";

jest.mock("next/navigation", () => ({
  // redirect() throws in Next; mirror that so code after it never runs.
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/lib/data/core/tenants", () => ({
  createTenant: jest.fn(),
  editTenant: jest.fn(),
  deleteTenant: jest.fn(),
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

describe("createTenantAction", () => {
  it("redirects to /login when there's no sys-admin session", async () => {
    (getInitialUser as jest.Mock).mockResolvedValue(null);

    await expect(createTenantAction(initial, form({ name: "Acme" }))).rejects.toThrow("REDIRECT:/login");
    expect(createTenant).not.toHaveBeenCalled();
  });

  it("requires a name", async () => {
    expect(await createTenantAction(initial, form({ name: "  " }))).toEqual({ error: "Enter a tenant name." });
  });

  it("creates with an optional logo, then revalidates and redirects to the list", async () => {
    (createTenant as jest.Mock).mockResolvedValue({ isSaved: true });

    await expect(createTenantAction(initial, form({ name: " Acme ", logo: "" }))).rejects.toThrow("REDIRECT:/tenants");

    expect(createTenant).toHaveBeenCalledWith({ name: "Acme", logo: null });
    expect(revalidatePath).toHaveBeenCalledWith("/tenants");
  });

  it("shows the API's message for a 400 and keeps the typed name", async () => {
    (createTenant as jest.Mock).mockRejectedValue(apiError(400, "Tenant name already exists."));

    expect(await createTenantAction(initial, form({ name: "Acme" }))).toEqual({
      error: "Tenant name already exists.",
      name: "Acme",
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("shows a session message for a 401", async () => {
    (createTenant as jest.Mock).mockRejectedValue(apiError(401));

    const state = await createTenantAction(initial, form({ name: "Acme" }));

    expect(state.error).toMatch(/session has expired/);
  });

  it("falls back to a generic message for anything else", async () => {
    (createTenant as jest.Mock).mockRejectedValue(apiError(500));

    const state = await createTenantAction(initial, form({ name: "Acme" }));

    expect(state.error).toBe("An unexpected error occurred while creating the tenant. Try again.");
  });
});

describe("updateTenantAction", () => {
  it("saves and redirects to the tenant page", async () => {
    (editTenant as jest.Mock).mockResolvedValue({ isSaved: true });

    await expect(
      updateTenantAction(initial, form({ tenantId: "3", name: "Globex", logo: "globex.png" })),
    ).rejects.toThrow("REDIRECT:/tenants/3");

    expect(editTenant).toHaveBeenCalledWith({ tenantId: 3, name: "Globex", logo: "globex.png" });
    expect(revalidatePath).toHaveBeenCalledWith("/tenants/3");
  });

  it("says when the tenant no longer exists", async () => {
    (editTenant as jest.Mock).mockRejectedValue(apiError(404, "Tenant not found."));

    const state = await updateTenantAction(initial, form({ tenantId: "3", name: "Globex" }));

    expect(state.error).toBe("This tenant no longer exists.");
  });
});

describe("deleteTenantAction", () => {
  it("deletes and redirects to the list", async () => {
    (deleteTenant as jest.Mock).mockResolvedValue({ isDeleted: true });

    await expect(deleteTenantAction(initial, form({ tenantId: "3" }))).rejects.toThrow("REDIRECT:/tenants");
    expect(deleteTenant).toHaveBeenCalledWith(3);
  });

  it("returns an error when the API reports nothing was deleted", async () => {
    (deleteTenant as jest.Mock).mockResolvedValue({ isDeleted: false });

    expect(await deleteTenantAction(initial, form({ tenantId: "3" }))).toEqual({
      error: "Couldn't delete the tenant.",
    });
  });
});
