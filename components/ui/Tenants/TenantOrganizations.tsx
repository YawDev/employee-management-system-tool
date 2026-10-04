import Link from "next/link";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import type { Organization } from "@/types/types";

export default function TenantOrganizations({
  tenantId,
  organizations,
}: {
  tenantId: number;
  organizations: Organization[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-medium text-navy-900">
          Organizations <span className="font-normal text-slate-500">· {organizations.length}</span>
        </h2>
        <Link
          href={`/organizations/create?tenantId=${tenantId}`}
          className="flex items-center gap-1 text-xs text-navy-500 hover:underline"
        >
          <IconPlus size={13} aria-hidden="true" />
          Add organization
        </Link>
      </div>

      {organizations.length === 0 ? (
        <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
          No organizations yet.
        </p>
      ) : (
        organizations.map((org) => (
          <Link
            key={org.organizationId}
            href={`/organizations/${org.organizationId}`}
            className="group flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-navy-900 hover:bg-navy-500/10"
          >
            <span className="group-hover:text-navy-500 group-hover:underline">{org.name}</span>
            <IconChevronRight
              size={14}
              className="text-navy-500 opacity-0 group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        ))
      )}
    </div>
  );
}
