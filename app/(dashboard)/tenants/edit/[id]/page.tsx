import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SaveTenantForm from "@/components/ui/Tenants/SaveTenantForm";
import { getTenant } from "@/lib/data/system/tenants";

const EditTenantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const tenant = await getTenant(Number(id));
  if (!tenant) notFound();

  return (
    <div className="max-w-xl space-y-5">
      <Breadcrumbs
        items={[
          { label: "Tenants", href: "/tenants" },
          { label: tenant.name, href: `/tenants/${tenant.tenantId}` },
          { label: "Edit" },
        ]}
      />
      <h1 className="text-2xl font-medium text-navy-900">Edit tenant</h1>
      <SaveTenantForm tenant={tenant} />
    </div>
  );
};

export default EditTenantPage;
