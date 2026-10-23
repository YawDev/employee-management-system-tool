"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createOrganization,
  deleteOrganization,
  editOrganization,
} from "@/lib/data/core/organizations";
import { getInitialUser } from "@/lib/data/identity/auth";

// name is echoed back so the form keeps what the user typed after a failed save.
export type SaveOrganizationState = { error: string | null; name?: string };
export type DeleteOrganizationState = { error: string | null };

// Server Actions are public POST endpoints: re-check the session here, not only in the layout.
// getInitialUser calls the sys-admin /me endpoint, so it's null for anyone who isn't a sys admin.
async function requireSysAdmin() {
  if (!(await getInitialUser())) redirect("/login");
}

function readOrganizationForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    tenantId: Number(formData.get("tenantId") ?? 0),
    industry: String(formData.get("industry") ?? "").trim() || null,
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

    // 400s carry user-facing messages, e.g. "Organization name already exists for this tenant."
    if (status === 400 && apiMessage) return apiMessage;
    // A 404 can be the organization *or* its tenant ("Tenant not found."), so prefer the API's wording.
    if (status === 404)
      return apiMessage ?? "This organization no longer exists.";
    if (status === 401 || status === 403)
      return "Your session has expired or you're not authorized. Sign in again.";
  }
  return `An unexpected error occurred while ${operation} the organization. Try again.`;
}

// Called by the create form through useActionState (previous state, submitted form data).
export async function createOrganizationAction(
  _prev: SaveOrganizationState,
  formData: FormData,
): Promise<SaveOrganizationState> {
  await requireSysAdmin();
  const { name, tenantId, industry } = readOrganizationForm(formData);

  // The form checks these too, but that check can be bypassed.
  if (!name) return { error: "Enter an organization name." };
  if (!tenantId) return { error: "Choose a tenant.", name };

  try {
    const result = await createOrganization({
      name,
      tenantId,
      industry,
    });
    if (!result.isSaved)
      return {
        error: `Couldn't save organization ${name}.`,
        name,
      };
  } catch (error) {
    logFailure("create organization", error);
    return {
      error: toUserMessage(error, "creating"),
      name,
    };
  }

  revalidatePath("/organizations");
  revalidatePath("/tenants"); // organization counts
  revalidatePath(`/tenants/${tenantId}`);
  redirect("/organizations");
}

export async function updateOrganizationAction(
  _prev: SaveOrganizationState,
  formData: FormData,
): Promise<SaveOrganizationState> {
  await requireSysAdmin();
  const { name, tenantId, industry } = readOrganizationForm(formData);
  const organizationId = Number(formData.get("organizationId") ?? 0);

  if (!tenantId) return { error: "Missing organization tenant id.", name };
  if (!organizationId) return { error: "Missing organization ID.", name };

  if (!name) return { error: "Enter an organization name." };

  try {
    const result = await editOrganization({
      tenantId,
      name,
      industry,
      organizationId,
    });
    if (!result.isSaved)
      return { error: `Couldn't update organization ${name}.`, name };
  } catch (error) {
    logFailure("update organization", error);
    return { error: toUserMessage(error, "updating"), name };
  }

  revalidatePath("/organizations");
  revalidatePath(`/organizations/${organizationId}`);
  revalidatePath(`/tenants/${tenantId}`);
  redirect(`/organizations/${organizationId}`);
}

export async function deleteOrganizationAction(
  _prev: DeleteOrganizationState,
  formData: FormData,
): Promise<DeleteOrganizationState> {
  await requireSysAdmin();
  const tenantId = Number(formData.get("tenantId"));
  const organizationId = Number(formData.get("organizationId"));

  if (!tenantId) return { error: "Missing tenant id." };
  if (!organizationId) return { error: "Missing organization id." };

  try {
    const result = await deleteOrganization(organizationId);
    if (!result.isDeleted)
      return { error: "Couldn't delete the organization." };
  } catch (error) {
    logFailure("delete organization", error);
    return { error: toUserMessage(error, "deleting") };
  }

  revalidatePath("/organizations");
  revalidatePath("/tenants"); // organization counts
  revalidatePath(`/tenants/${tenantId}`);
  redirect("/organizations");
}
