import AddTenantBtn from "@/components/ui/Tenants/AddTenantBtn";
import TenantsTable from "@/components/ui/Tenants/TenantsTable";
import { TenantRow } from "@/types/types";

const tenants: TenantRow[] = [
  { tenantId: 1, name: "Acme Corp", organizationCount: 3 },
  { tenantId: 2, name: "Globex", organizationCount: 1 },
  { tenantId: 3, name: "Initech", organizationCount: 2 },
  { tenantId: 4, name: "Umbrella", organizationCount: 0 },
];

export default function TenantsPage() {
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
