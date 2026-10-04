import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SaveTenantForm from "@/components/ui/Tenants/SaveTenantForm";

const CreateTenantPage = () => {
  return (
    <div className="max-w-xl space-y-5">
      <Breadcrumbs items={[{ label: "Tenants", href: "/tenants" }, { label: "New tenant" }]} />
      <h1 className="text-2xl font-medium text-navy-900">New tenant</h1>
      <SaveTenantForm />
    </div>
  );
};

export default CreateTenantPage;
