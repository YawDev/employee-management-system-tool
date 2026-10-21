import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SaveOrganizationForm from "@/components/ui/Organizations/SaveOrganizationForm";
import { getTenants } from "@/lib/data/core/tenants";

// Reached from the organizations list (pick a tenant) or a tenant page (?tenantId=, prefilled).
const CreateOrganizationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) => {
  const { tenantId } = await searchParams;
  const tenants = await getTenants();
  const tenant = tenants.find((t) => t.tenantId === Number(tenantId));

  return (
    <div className="max-w-xl space-y-5">
      <Breadcrumbs
        items={
          tenant
            ? [
                { label: "Tenants", href: "/tenants" },
                { label: tenant.name, href: `/tenants/${tenant.tenantId}` },
                { label: "New organization" },
              ]
            : [
                { label: "Organizations", href: "/organizations" },
                { label: "New organization" },
              ]
        }
      />
      <h1 className="text-2xl font-medium text-navy-900">New organization</h1>
      <SaveOrganizationForm
        tenants={tenants}
        defaultTenantId={tenant?.tenantId}
      />
    </div>
  );
};

export default CreateOrganizationPage;
