export type TenantRow = {
  tenantId: number;
  name: string;
  organizationCount: number;
};

// CRUD (Create, Read, Update) operation models
export type CreateTenant = {
  name: string;
  logo: string | null;
};

export type UpdateTenant = {
  tenantId: number;
  name: string;
  logo: string | null;
};

export type CreateDepartment = {
  name: string;
  organizationId: number;
  description: string | null;
};

export type UpdateDepartment = {
  departmentId: string;
  name: string;
  description: string | null;
};

export type CreateOrganization = {
  name: string;
  tenantId: number;
  industry: string | null;
};

export type UpdateOrganization = {
  organizationId: number;
  name: string;
  tenantId: number;
  industry: string | null;
};

// Matches the microservice's TenantDto (camelCased by the JSON serializer).
export type Tenant = {
  tenantId: number;
  uid: string;
  name: string;
  logo: string | null;
  organizationCount: number;
};

export type Organization = {
  organizationId: number;
  name: string;
  tenantId: number;
  industry: string;
  tenantName: string;
};

export type Department = {
  departmentId: string; // Guid on the microservice
  name: string;
  organizationId: number;
  description: string | null;
};

// Represents the result of a save action (e.g., creating or updating an entity).
export type SaveAction = {
  isSaved: boolean;
};

// Represents the result of a delete action (e.g., deleting an entity).
export type DeleteAction = {
  isDeleted: boolean;
};

// get-organization-info returns the tenant nested (no flat tenantName) and its departments.
export type OrganizationDetails = {
  organizationId: number;
  name: string;
  industry: string | null;
  tenantId: number;
  tenant: Tenant;
  departments: Department[];
};

export type User = {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
};
