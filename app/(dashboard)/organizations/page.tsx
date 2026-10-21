import OrganizationsTable from "@/components/ui/Organizations/OrganizationsTable";
import { getOrganizations } from "@/lib/data/core/organizations";

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium text-navy-900">Organizations</h1>
      <OrganizationsTable organizations={organizations} />
    </div>
  );
}
