"use client";

import NumberedPagination from "@/components/ui/NumberedPagination";
import { usePagination } from "@/lib/usePagination";
import type { Department } from "@/types/types";

// No department detail page yet, so rows are plain text rather than links.
export default function OrganizationDepartments({
  departments,
}: {
  departments: Department[];
}) {
  const { currentPage, setCurrentPage, totalPages, pageItems } =
    usePagination(departments);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium text-navy-900">
            Departments{" "}
            <span className="font-normal text-slate-500">
              · {departments.length}
            </span>
          </h2>
        </div>

        {departments.length === 0 ? (
          <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            No departments yet.
          </p>
        ) : (
          pageItems.map((department) => (
            <div
              key={department.departmentId}
              className="border-t border-slate-100 px-4 py-3 text-sm"
            >
              <p className="text-navy-900">{department.name}</p>
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
}
