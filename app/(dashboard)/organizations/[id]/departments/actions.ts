"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
} from "@/lib/data/core/departments";
import { getInitialUser } from "@/lib/data/identity/auth";

// name is echoed back so the form keeps what the user typed after a failed save.
export type SaveDepartmentState = { error: string | null; name?: string };
export type DeleteDepartmentState = { error: string | null };

// Server Actions are public POST endpoints: re-check the session here, not only in the layout.
async function requireSysAdmin() {
  if (!(await getInitialUser())) redirect("/login");
}

// Departments always belong to the organization in the URL; the form sends its id as a hidden field.
function readDepartmentForm(formData: FormData) {
  return {
    organizationId: Number(formData.get("organizationId") ?? 0),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
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

    // e.g. "Department name already exists for this organization."
    if (status === 400 && apiMessage) return apiMessage;
    // A 404 can be the department *or* its organization, so prefer the API's wording.
    if (status === 404)
      return apiMessage ?? "This department no longer exists.";
    if (status === 401 || status === 403)
      return "Your session has expired or you're not authorized. Sign in again.";
  }
  return `An unexpected error occurred while ${operation} the department. Try again.`;
}

const organizationPath = (organizationId: number) =>
  `/organizations/${organizationId}`;

export async function createDepartmentAction(
  _prev: SaveDepartmentState,
  formData: FormData,
): Promise<SaveDepartmentState> {
  await requireSysAdmin();
  const { organizationId, name, description } = readDepartmentForm(formData);

  if (!organizationId) return { error: "Missing organization id.", name };
  if (!name) return { error: "Enter a department name." };

  try {
    const result = await createDepartment({
      organizationId,
      name,
      description,
    });
    if (!result.isSaved)
      return { error: `Couldn't save department ${name}.`, name };
  } catch (error) {
    logFailure("create department", error);
    return { error: toUserMessage(error, "creating"), name };
  }

  revalidatePath(organizationPath(organizationId));
  redirect(organizationPath(organizationId));
}

export async function updateDepartmentAction(
  _prev: SaveDepartmentState,
  formData: FormData,
): Promise<SaveDepartmentState> {
  await requireSysAdmin();
  const { organizationId, name, description } = readDepartmentForm(formData);
  const departmentId = String(formData.get("departmentId") ?? "").trim();

  if (!organizationId || !departmentId)
    return { error: "Missing department or organization id.", name };
  if (!name) return { error: "Enter a department name." };

  try {
    const result = await editDepartment({
      departmentId,
      organizationId,
      name,
      description,
    });
    if (!result.isSaved)
      return { error: `Couldn't update department ${name}.`, name };
  } catch (error) {
    logFailure("update department", error);
    return { error: toUserMessage(error, "updating"), name };
  }

  const departmentPath = `${organizationPath(organizationId)}/departments/${departmentId}`;
  revalidatePath(organizationPath(organizationId));
  revalidatePath(departmentPath);
  redirect(departmentPath);
}

export async function deleteDepartmentAction(
  _prev: DeleteDepartmentState,
  formData: FormData,
): Promise<DeleteDepartmentState> {
  await requireSysAdmin();
  const organizationId = Number(formData.get("organizationId") ?? 0);
  const departmentId = String(formData.get("departmentId") ?? "").trim();

  if (!organizationId || !departmentId)
    return { error: "Missing department or organization id." };

  try {
    const result = await deleteDepartment(departmentId);
    if (!result.isDeleted) return { error: "Couldn't delete the department." };
  } catch (error) {
    logFailure("delete department", error);
    return { error: toUserMessage(error, "deleting") };
  }

  revalidatePath(organizationPath(organizationId));
  redirect(organizationPath(organizationId));
}
