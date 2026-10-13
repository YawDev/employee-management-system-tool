export type TenantRow = {
  tenantId: number;
  name: string;
  organizationCount: number;
};

// Matches the microservice's TenantDto (camelCased by the JSON serializer).
export type Tenant = {
  tenantId: number;
  uid: string;
  name: string;
  logo: string | null;
};

export type Organization = {
  organizationId: number;
  name: string;
  tenantId: number;
  industry: string;
  tenantName: string;
};

export type Department = {
  departmentId: number;
  name: string;
  organizationId: number;
  description: string;
};

export type User = {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
};
