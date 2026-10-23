"use client";

import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import {
  createDepartmentAction,
  updateDepartmentAction,
  type SaveDepartmentState,
} from "@/app/(dashboard)/organizations/[id]/departments/actions";
import Button, { buttonClasses } from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import type { Department } from "@/types/types";

const initialState: SaveDepartmentState = { error: null };

// Nested under an organization: the org comes from the route and is never editable here.
const SaveDepartmentForm = ({
  organizationId,
  department,
}: {
  organizationId: number;
  department?: Department;
}) => {
  const isEditMode = !!department;
  const [clientError, setClientError] = useState<string | null>(null);

  // Mode is fixed for the life of the form, so picking the action here is safe.
  const [state, formAction, pending] = useActionState(
    isEditMode ? updateDepartmentAction : createDepartmentAction,
    initialState,
  );

  // Same as the login form: only block submission when the client check fails.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError(null);
    const name = String(
      new FormData(event.currentTarget).get("name") ?? "",
    ).trim();

    if (!name) {
      event.preventDefault();
      setClientError("Enter a department name.");
    }
  }

  const error = clientError ?? state.error;
  const cancelHref = isEditMode
    ? `/organizations/${organizationId}/departments/${department.departmentId}`
    : `/organizations/${organizationId}`;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-5"
    >
      <input type="hidden" name="organizationId" value={organizationId} />
      {isEditMode && (
        <input
          type="hidden"
          name="departmentId"
          value={department.departmentId}
        />
      )}

      <TextField
        id="departmentName"
        name="name"
        label="Name"
        placeholder="Engineering"
        defaultValue={state.name ?? department?.name}
        onChange={() => setClientError(null)}
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="description"
            className="text-xs font-medium text-slate-700"
          >
            Description
          </label>
          <span className="text-xs text-slate-400">optional</span>
        </div>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={department?.description ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Link href={cancelHref} className={buttonClasses("secondary")}>
          Cancel
        </Link>
        <Button
          type="submit"
          loading={pending}
          loadingText={isEditMode ? "Saving…" : "Creating…"}
        >
          {isEditMode ? "Save changes" : "Create department"}
        </Button>
      </div>
    </form>
  );
};

export default SaveDepartmentForm;
