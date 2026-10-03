import { TenantRow } from "@/types/types";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

const TenantsTable = ({ tenants }: { tenants: TenantRow[] }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="grid grid-cols-[2fr_1fr_24px] bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
        <span>Name</span>
        <span>Organizations</span>
      </div>
      {tenants.map((tenant) => (
        <Link
          key={tenant.tenantId}
          href={`/tenants/${tenant.tenantId}`}
          className="group grid grid-cols-[2fr_1fr_24px] items-center border-t border-slate-100 px-4 py-3 text-sm text-navy-900 hover:bg-navy-500/10"
        >
          <span className="group-hover:text-navy-500 group-hover:underline">
            {tenant.name}
          </span>
          <span className="text-slate-500">{tenant.organizationCount}</span>
          <IconChevronRight
            size={14}
            className="text-navy-500 opacity-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
};

export default TenantsTable;
