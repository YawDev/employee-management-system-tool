"use client";

import Link from "next/link";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import NumberedPagination from "@/components/ui/NumberedPagination";
import { usePagination } from "@/lib/usePagination";
import type { Department } from "@/types/types";

export default function OrganizationDepartments({
  organizationId,
  departments,
}: {
  organizationId: number;
  departments: Department[];
}) {
  const { currentPage, setCurrentPage, totalPages, pageItems } =
    usePagination(departments);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-sm font-medium text-navy-900">
            Departments{" "}
            <span className="font-normal text-slate-500">
              · {departments.length}
            </span>
          </h2>
          <Link
            href={`/organizations/${organizationId}/departments/create`}
            className="flex items-center gap-1 text-xs text-navy-500 hover:underline"
          >
            <IconPlus size={13} aria-hidden="true" />
            Add department
          </Link>
        </div>

        {departments.length === 0 ? (
          <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            No departments yet.
          </p>
        ) : (
          pageItems.map((department) => (
            <Link
              key={department.departmentId}
              href={`/organizations/${organizationId}/departments/${department.departmentId}`}
              className="group flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-navy-900 hover:bg-navy-500/10"
            >
              <span className="group-hover:text-navy-500 group-hover:underline">
                {department.name}
              </span>
              <IconChevronRight
                size={14}
                className="text-navy-500 opacity-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
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
}
