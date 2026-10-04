import AddTenantBtn from "@/components/ui/Tenants/AddTenantBtn";
import TenantsTable from "@/components/ui/Tenants/TenantsTable";
import { getTenantRows } from "@/lib/data/system/tenants";

export default async function TenantsPage() {
  const tenants = await getTenantRows();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-navy-900">Tenants</h1>
        <AddTenantBtn />
      </div>
      <TenantsTable tenants={tenants} />
    </div>
  );
}
