import Link from "next/link";
import { notFound } from "next/navigation";
import { IconEdit } from "@tabler/icons-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/Button";
import DeleteOrganizationDialog from "@/components/ui/Organizations/DeleteOrganizationDialog";
import OrganizationDepartments from "@/components/ui/Organizations/OrganizationDepartments";
import { getOrganizationById } from "@/lib/data/core/organizations";
import { initials } from "@/lib/session";

const OrganizationDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const organization = await getOrganizationById(Number(id));
  if (!organization) notFound();

  return (
    <div className="max-w-3xl space-y-5">
      {/* Same trail whether the user came from the tenant page or the all-organizations list. */}
      <Breadcrumbs
        items={[
          { label: "Tenants", href: "/tenants" },
          {
            label: organization.tenant.name,
            href: `/tenants/${organization.tenantId}`,
          },
          { label: organization.name },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-navy-500">
            {initials(organization.name)}
          </div>
          <h1 className="text-2xl font-medium text-navy-900">
            {organization.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <DeleteOrganizationDialog
            organizationId={organization.organizationId}
            organizationName={organization.name}
            tenantId={organization.tenantId}
          />
          <Link
            href={`/organizations/edit/${organization.organizationId}`}
            className={buttonClasses("primary")}
          >
            <IconEdit size={16} aria-hidden="true" />
            Edit organization
          </Link>
        </div>
      </div>

      <dl className="grid grid-cols-[110px_1fr] gap-y-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm">
        <dt className="text-slate-500">Organization ID</dt>
        <dd className="text-slate-700">{organization.organizationId}</dd>
        <dt className="text-slate-500">Tenant</dt>
        <dd>
          <Link
            href={`/tenants/${organization.tenantId}`}
            className="text-navy-500 hover:underline"
          >
            {organization.tenant.name}
          </Link>
        </dd>
        <dt className="text-slate-500">Industry</dt>
        <dd
          className={
            organization.industry ? "text-slate-700" : "text-slate-400"
          }
        >
          {organization.industry || "Not set"}
        </dd>
      </dl>

      <OrganizationDepartments
        organizationId={organization.organizationId}
        departments={organization.departments}
      />
    </div>
  );
};

export default OrganizationDetailsPage;
