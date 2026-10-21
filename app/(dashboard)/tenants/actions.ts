"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTenant,
  deleteTenant,
  editTenant,
} from "@/lib/data/core/tenants";
import { getInitialUser } from "@/lib/data/identity/auth";

// name is echoed back so the form keeps what the user typed after a failed save.
export type SaveTenantState = { error: string | null; name?: string };
export type DeleteTenantState = { error: string | null };

// Server Actions are public POST endpoints: re-check the session here, not only in the layout.
// getInitialUser calls the sys-admin /me endpoint, so it's null for anyone who isn't a sys admin.
async function requireSysAdmin() {
  if (!(await getInitialUser())) redirect("/login");
}

function readTenantForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    // Logo is optional; the form sends the filename only (file storage comes later).
    logo: String(formData.get("logo") ?? "").trim() || null,
  };
}

function logFailure(operation: string, error: unknown) {
  console.error(
    `${operation} failed`,
    axios.isAxiosError(error)
      ? {
          status: error.response?.status,
          code: error.code,
          message: error.message,
        }
      : error,
  );
}

// The microservice returns { StatusCode, Message } (PascalCase) for handled errors.
function toUserMessage(error: unknown, operation: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      { Message?: string; message?: string } | undefined;
    const apiMessage = data?.Message ?? data?.message;

    if (status === 400 && apiMessage) return apiMessage; // e.g. "Tenant name already exists."
    if (status === 404) return "This tenant no longer exists.";
    if (status === 401 || status === 403)
      return "Your session has expired or you're not authorized. Sign in again.";
  }
  return `An unexpected error occurred while ${operation} the tenant. Try again.`;
}

// Called by the create form through useActionState (previous state, submitted form data).
export async function createTenantAction(
  _prev: SaveTenantState,
  formData: FormData,
): Promise<SaveTenantState> {
  await requireSysAdmin();
  const { name, logo } = readTenantForm(formData);

  // The form checks this too, but that check can be bypassed.
  if (!name) return { error: "Enter a tenant name." };

  try {
    const result = await createTenant({ name, logo });
    if (!result.isSaved)
      return { error: `Couldn't save tenant ${name}.`, name };
  } catch (error) {
    logFailure("create tenant", error);
    return { error: toUserMessage(error, "creating"), name };
  }

  revalidatePath("/tenants");
  redirect("/tenants");
}

export async function updateTenantAction(
  _prev: SaveTenantState,
  formData: FormData,
): Promise<SaveTenantState> {
  await requireSysAdmin();
  const tenantId = Number(formData.get("tenantId"));
  const { name, logo } = readTenantForm(formData);

  if (!tenantId) return { error: "Missing tenant id.", name };
  if (!name) return { error: "Enter a tenant name." };

  try {
    const result = await editTenant({ tenantId, name, logo });
    if (!result.isSaved)
      return { error: `Couldn't save tenant ${name}.`, name };
  } catch (error) {
    logFailure("update tenant", error);
    return { error: toUserMessage(error, "updating"), name };
  }

  revalidatePath("/tenants");
  revalidatePath(`/tenants/${tenantId}`);
  redirect(`/tenants/${tenantId}`);
}

export async function deleteTenantAction(
  _prev: DeleteTenantState,
  formData: FormData,
): Promise<DeleteTenantState> {
  await requireSysAdmin();
  const tenantId = Number(formData.get("tenantId"));

  if (!tenantId) return { error: "Missing tenant id." };

  try {
    const result = await deleteTenant(tenantId);
    if (!result.isDeleted) return { error: "Couldn't delete the tenant." };
  } catch (error) {
    logFailure("delete tenant", error);
    return { error: toUserMessage(error, "deleting") };
  }

  revalidatePath("/tenants");
  redirect("/tenants");
}
