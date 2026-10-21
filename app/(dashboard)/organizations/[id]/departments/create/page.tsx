import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SaveDepartmentForm from "@/components/ui/Departments/SaveDepartmentForm";
import { getOrganizationById } from "@/lib/data/core/organizations";

const CreateDepartmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const organization = await getOrganizationById(Number(id));
  if (!organization) notFound();

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
          { label: "New department" },
        ]}
      />
      <h1 className="text-2xl font-medium text-navy-900">New department</h1>
      <SaveDepartmentForm organizationId={organization.organizationId} />
    </div>
  );
};

export default CreateDepartmentPage;
