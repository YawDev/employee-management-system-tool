import type { Organization, Tenant, TenantRow } from "@/types/types";

// TODO: replace with /sys-api calls (get-all-tenants, get-tenant-info/{id},
// get-all-organizations) once the BFF is wired up.
const tenants: Tenant[] = [
  { tenantId: 1, uid: "3f9a2b10-7c4e-4d1a-9b55-0e8f1d2ac21e", name: "Acme Corp", logo: "acme-logo.png" },
  { tenantId: 2, uid: "8c1d4e22-1b6f-4a90-a3d7-52e9b0f7d114", name: "Globex", logo: null },
  { tenantId: 3, uid: "b27e9f51-3d8a-4c62-9e01-7fa4c6d2e893", name: "Initech", logo: null },
  { tenantId: 4, uid: "e5a03c78-9f2b-4b17-8d4e-1c6a9b3f0e27", name: "Umbrella", logo: null },
];

const organizations: Organization[] = [
  { organizationId: 1, name: "Acme Retail", tenantId: 1, industry: "Retail", tenantName: "Acme Corp" },
  { organizationId: 2, name: "Acme Logistics", tenantId: 1, industry: "Logistics", tenantName: "Acme Corp" },
  { organizationId: 3, name: "Acme Labs", tenantId: 1, industry: "Research", tenantName: "Acme Corp" },
  { organizationId: 4, name: "Globex Energy", tenantId: 2, industry: "Energy", tenantName: "Globex" },
  { organizationId: 5, name: "Initech Software", tenantId: 3, industry: "Software", tenantName: "Initech" },
  { organizationId: 6, name: "Initech Consulting", tenantId: 3, industry: "Consulting", tenantName: "Initech" },
];

export async function getTenantRows(): Promise<TenantRow[]> {
  return tenants.map((tenant) => ({
    tenantId: tenant.tenantId,
    name: tenant.name,
    organizationCount: organizations.filter((org) => org.tenantId === tenant.tenantId).length,
  }));
}

export async function getTenant(id: number): Promise<Tenant | undefined> {
  return tenants.find((tenant) => tenant.tenantId === id);
}

export async function getTenantOrganizations(tenantId: number): Promise<Organization[]> {
  return organizations.filter((org) => org.tenantId === tenantId);
}
