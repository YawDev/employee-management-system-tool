import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SaveDepartmentForm from "@/components/ui/Departments/SaveDepartmentForm";
import { getDepartmentById } from "@/lib/data/core/departments";
import { getOrganizationById } from "@/lib/data/core/organizations";

const EditDepartmentPage = async ({
  params,
}: {
  params: Promise<{ id: string; departmentId: string }>;
}) => {
  const { id, departmentId } = await params;
  const [organization, department] = await Promise.all([
    getOrganizationById(Number(id)),
    getDepartmentById(departmentId),
  ]);
  if (
    !organization ||
    !department ||
    department.organizationId !== organization.organizationId
  )
    notFound();

  const departmentHref = `/organizations/${organization.organizationId}/departments/${department.departmentId}`;

  return (
    <div className="max-w-xl space-y-5">
      <Breadcrumbs
        items={[
          { label: "Tenants", href: "/tenants" },
          {
            label: organization.tenant.name,
            href: `/tenants/${organization.tenantId}`,
          },
          {
            label: organization.name,
            href: `/organizations/${organization.organizationId}`,
          },
          { label: department.name, href: departmentHref },
          { label: "Edit" },
        ]}
      />
      <h1 className="text-2xl font-medium text-navy-900">Edit department</h1>
      <SaveDepartmentForm
        organizationId={organization.organizationId}
        department={department}
      />
    </div>
  );
};

export default EditDepartmentPage;
