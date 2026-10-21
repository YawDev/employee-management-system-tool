"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import NumberedPagination from "@/components/ui/NumberedPagination";
import TextField from "@/components/ui/TextField";
import { usePagination } from "@/lib/usePagination";
import type { Organization } from "@/types/types";

// Cross-tenant lookup: find an org without knowing its tenant. Rows hold two links
// (org, tenant), so the row itself isn't a link — nested <a> is invalid HTML.
const OrganizationsTable = ({
  organizations,
}: {
  organizations: Organization[];
}) => {
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const visible = term
    ? organizations.filter(
        (org) =>
          org.name.toLowerCase().includes(term) ||
          org.tenantName?.toLowerCase().includes(term),
      )
    : organizations;
  const { currentPage, setCurrentPage, totalPages, pageItems } =
    usePagination(visible);

  return (
    <div className="space-y-4">
      <TextField
        id="org-search"
        type="search"
        label="Search"
        placeholder="Organization or tenant name"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setCurrentPage(1); // new results start at the first page
        }}
        className="max-w-sm"
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_24px] bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          <span>Name</span>
          <span>Tenant</span>
          <span>Industry</span>
        </div>

        {visible.length === 0 ? (
          <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            {organizations.length === 0
              ? "No organizations yet."
              : `No organizations match "${query.trim()}".`}
          </p>
        ) : (
          pageItems.map((org) => (
            <div
              key={org.organizationId}
              className="group grid grid-cols-[2fr_1.5fr_1fr_24px] items-center border-t border-slate-100 px-4 py-3 text-sm text-navy-900 hover:bg-navy-500/10"
            >
              <Link
                href={`/organizations/${org.organizationId}`}
                className="hover:text-navy-500 hover:underline"
              >
                {org.name}
              </Link>
              <Link
                href={`/tenants/${org.tenantId}`}
                className="text-slate-500 hover:text-navy-500 hover:underline"
              >
                {org.tenantName}
              </Link>
              <span className="text-slate-500">{org.industry || "—"}</span>
              <IconChevronRight
                size={14}
                className="text-navy-500 opacity-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
          ))
        )}
      </div>

      <NumberedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default OrganizationsTable;
