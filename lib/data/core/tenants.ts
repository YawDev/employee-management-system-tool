import "server-only";
import { createHttpClient, getAuthHeaders } from "@/lib/data/client";
import type {
  Organization,
  SaveAction,
  Tenant,
  TenantRow,
  UpdateTenant,
  DeleteAction,
  CreateTenant,
} from "@/types/types";

export async function getTenants(): Promise<Tenant[]> {
  const response = await createHttpClient("emtCore").get<Tenant[]>(
    "/sys-api/get-all-tenants",
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function getTenantRows(): Promise<TenantRow[]> {
  const tenants = await getTenants();
  return tenants.map((tenant) => ({
    tenantId: tenant.tenantId,
    name: tenant.name,
    organizationCount: tenant.organizationCount,
  }));
}

export async function getTenant(id: number): Promise<Tenant | undefined> {
  const tenants = await getTenants();
  return tenants.find((tenant) => tenant.tenantId === id);
}

export async function getTenantOrganizations(
  tenantId: number,
): Promise<Organization[]> {
  const response = await createHttpClient("emtCore").get<{
    organizations: Organization[];
  }>(`/sys-api/get-all-organizations`, { headers: await getAuthHeaders() });
  const organizations = response.data.organizations;
  return organizations.filter((org) => org.tenantId === tenantId);
}

export async function editTenant(tenant: UpdateTenant): Promise<SaveAction> {
  const response = await createHttpClient("emtCore").put<SaveAction>(
    `/sys-api/edit-tenant/${tenant.tenantId}`,
    tenant,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function createTenant(tenant: CreateTenant): Promise<SaveAction> {
  const response = await createHttpClient("emtCore").post<SaveAction>(
    `/sys-api/create-tenant`,
    tenant,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function deleteTenant(tenantId: number): Promise<DeleteAction> {
  const response = await createHttpClient("emtCore").delete<DeleteAction>(
    `/sys-api/delete-tenant/${tenantId}`,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}
