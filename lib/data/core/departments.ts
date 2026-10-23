import "server-only";
import axios from "axios";
import { createHttpClient, getAuthHeaders } from "@/lib/data/client";
import type {
  CreateDepartment,
  DeleteAction,
  DepartmentDetails,
  SaveAction,
  UpdateDepartment,
} from "@/types/types";

// Returns undefined when the department doesn't exist (the API answers 404), so the page can notFound().
export async function getDepartmentById(
  departmentId: string,
): Promise<DepartmentDetails | undefined> {
  try {
    const response = await createHttpClient("emtCore").get<DepartmentDetails>(
      `/sys-api/get-department-info/${encodeURIComponent(departmentId)}`,
      { headers: await getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return undefined;
    throw error;
  }
}

export async function createDepartment(
  department: CreateDepartment,
): Promise<SaveAction> {
  const response = await createHttpClient("emtCore").post<SaveAction>(
    "/sys-api/create-department",
    department,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function editDepartment(
  department: UpdateDepartment,
): Promise<SaveAction> {
  const response = await createHttpClient("emtCore").put<SaveAction>(
    `/sys-api/edit-department/${encodeURIComponent(department.departmentId)}`,
    department,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function deleteDepartment(
  departmentId: string,
): Promise<DeleteAction> {
  const response = await createHttpClient("emtCore").delete<DeleteAction>(
    `/sys-api/delete-department/${encodeURIComponent(departmentId)}`,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}
