import Link from "next/link";
import { notFound } from "next/navigation";
import { IconEdit } from "@tabler/icons-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/Button";
import DeleteDepartmentDialog from "@/components/ui/Departments/DeleteDepartmentDialog";
import { getDepartmentById } from "@/lib/data/core/departments";
import { getOrganizationById } from "@/lib/data/core/organizations";
import { initials } from "@/lib/session";

const DepartmentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string; departmentId: string }>;
}) => {
  const { id, departmentId } = await params;
  const [organization, department] = await Promise.all([
    getOrganizationById(Number(id)),
    getDepartmentById(departmentId),
  ]);
  // A department is only reachable under its own organization.
  if (
    !organization ||
    !department ||
    department.organizationId !== organization.organizationId
  )
    notFound();

  return (
    <div className="max-w-3xl space-y-5">
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
          { label: department.name },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-navy-500">
            {initials(department.name)}
          </div>
          <h1 className="text-2xl font-medium text-navy-900">
            {department.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <DeleteDepartmentDialog
            departmentId={department.departmentId}
            departmentName={department.name}
            organizationId={organization.organizationId}
          />
          <Link
            href={`/organizations/${organization.organizationId}/departments/${department.departmentId}/edit`}
            className={buttonClasses("primary")}
          >
            <IconEdit size={16} aria-hidden="true" />
            Edit department
          </Link>
        </div>
      </div>

      <dl className="grid grid-cols-[110px_1fr] gap-y-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm">
        <dt className="text-slate-500">Organization</dt>
        <dd>
          <Link
            href={`/organizations/${organization.organizationId}`}
            className="text-navy-500 hover:underline"
          >
            {organization.name}
          </Link>
        </dd>
        <dt className="text-slate-500">Description</dt>
        <dd
          className={
            department.description ? "text-slate-700" : "text-slate-400"
          }
        >
          {department.description || "Not set"}
        </dd>
        <dt className="text-slate-500">Managers</dt>
        <dd className="text-slate-700">{department.managers.length}</dd>
        <dt className="text-slate-500">Employees</dt>
        <dd className="text-slate-700">{department.employees.length}</dd>
      </dl>
    </div>
  );
};

export default DepartmentDetailsPage;
