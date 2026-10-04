import Link from "next/link";
import { notFound } from "next/navigation";
import { IconEdit } from "@tabler/icons-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/Button";
import DeleteTenantDialog from "@/components/ui/Tenants/DeleteTenantDialog";
import TenantOrganizations from "@/components/ui/Tenants/TenantOrganizations";
import { getTenant, getTenantOrganizations } from "@/lib/data/system/tenants";
import { initials } from "@/lib/session";

const TenantDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const tenant = await getTenant(Number(id));
  if (!tenant) notFound();

  const organizations = await getTenantOrganizations(tenant.tenantId);

  return (
    <div className="max-w-3xl space-y-5">
      <Breadcrumbs items={[{ label: "Tenants", href: "/tenants" }, { label: tenant.name }]} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-navy-500">
            {initials(tenant.name)}
          </div>
          <h1 className="text-2xl font-medium text-navy-900">{tenant.name}</h1>
        </div>
        <div className="flex gap-2">
          <DeleteTenantDialog tenantName={tenant.name} />
          <Link href={`/tenants/edit/${tenant.tenantId}`} className={buttonClasses("primary")}>
            <IconEdit size={16} aria-hidden="true" />
            Edit tenant
          </Link>
        </div>
      </div>

      <dl className="grid grid-cols-[110px_1fr] gap-y-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm">
        <dt className="text-slate-500">Tenant ID</dt>
        <dd className="text-slate-700">{tenant.tenantId}</dd>
        <dt className="text-slate-500">UID</dt>
        <dd className="font-mono text-xs leading-5 text-slate-700">{tenant.uid}</dd>
        <dt className="text-slate-500">Logo</dt>
        <dd className={tenant.logo ? "text-slate-700" : "text-slate-400"}>
          {tenant.logo ?? "Not set"}
        </dd>
      </dl>

      <TenantOrganizations tenantId={tenant.tenantId} organizations={organizations} />
    </div>
  );
};

export default TenantDetailsPage;
