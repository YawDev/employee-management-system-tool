import "server-only";
import axios from "axios";
import { createHttpClient, getAuthHeaders } from "@/lib/data/client";
import type {
  Organization,
  OrganizationDetails,
  UpdateOrganization,
  CreateOrganization,
  DeleteAction,
  SaveAction,
} from "@/types/types";

export async function getOrganizations(): Promise<Organization[]> {
  const response = await createHttpClient("emtCore").get<{
    organizations: Organization[];
  }>(`/sys-api/get-all-organizations`, { headers: await getAuthHeaders() });
  return response.data.organizations;
}

// Returns undefined when the organization doesn't exist (the API answers 404), so the page can notFound().
export async function getOrganizationById(
  id: number,
): Promise<OrganizationDetails | undefined> {
  try {
    const response = await createHttpClient("emtCore").get<{
      organization: OrganizationDetails;
    }>(`/sys-api/get-organization-info/${id}`, {
      headers: await getAuthHeaders(),
    });
    return response.data.organization;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return undefined;
    throw error;
  }
}

export async function editOrganization(
  organization: UpdateOrganization,
): Promise<SaveAction> {
  const response = await createHttpClient("emtCore").put<SaveAction>(
    `/sys-api/edit-organization/${organization.organizationId}`,
    organization,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function createOrganization(
  organization: CreateOrganization,
): Promise<SaveAction> {
  const response = await createHttpClient("emtCore").post<SaveAction>(
    `/sys-api/create-organization`,
    organization,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function deleteOrganization(
  organizationId: number,
): Promise<DeleteAction> {
  const response = await createHttpClient("emtCore").delete<DeleteAction>(
    `/sys-api/delete-organization/${organizationId}`,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}
