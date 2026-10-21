"use client";

import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import {
  createOrganizationAction,
  updateOrganizationAction,
  type SaveOrganizationState,
} from "@/app/(dashboard)/organizations/actions";
import Button, { buttonClasses } from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import type { OrganizationDetails, Tenant } from "@/types/types";

const initialState: SaveOrganizationState = { error: null };

// Create: pick the tenant (prefilled when coming from a tenant page).
// Edit: the tenant is fixed — moving an org would leave its people's accounts on the old tenant.
const SaveOrganizationForm = ({
  organization,
  tenants = [],
  defaultTenantId,
}: {
  organization?: OrganizationDetails;
  tenants?: Tenant[];
  defaultTenantId?: number;
}) => {
  const isEditMode = !!organization;
  const [clientError, setClientError] = useState<string | null>(null);

  // Mode is fixed for the life of the form, so picking the action here is safe.
  const [state, formAction, pending] = useActionState(
    isEditMode ? updateOrganizationAction : createOrganizationAction,
    initialState,
  );

  // Same as the login form: only block submission when the client check fails.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError(null);
    const form = new FormData(event.currentTarget);

    if (!String(form.get("name") ?? "").trim()) {
      event.preventDefault();
      setClientError("Enter an organization name.");
      return;
    }
    if (!Number(form.get("tenantId"))) {
      event.preventDefault();
      setClientError("Choose a tenant.");
    }
  }

  const error = clientError ?? state.error;
  const cancelHref = isEditMode
    ? `/organizations/${organization.organizationId}`
    : defaultTenantId
      ? `/tenants/${defaultTenantId}`
      : "/organizations";

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-5"
    >
      <TextField
        id="organizationName"
        name="name"
        label="Name"
        placeholder="Acme Retail"
        defaultValue={state.name ?? organization?.name}
        onChange={() => setClientError(null)}
      />

      <TextField
        id="industry"
        name="industry"
        label="Industry"
        labelAction={<span className="text-xs text-slate-400">optional</span>}
        placeholder="Retail"
        defaultValue={organization?.industry ?? ""}
      />

      {isEditMode ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-700">Tenant</p>
          <p className="text-sm text-navy-900">{organization.tenant.name}</p>
          <input type="hidden" name="tenantId" value={organization.tenantId} />
          <input
            type="hidden"
            name="organizationId"
            value={organization.organizationId}
          />
        </div>
      ) : (
        <div>
          <label
            htmlFor="tenantId"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Tenant
          </label>
          <select
            id="tenantId"
            name="tenantId"
            defaultValue={defaultTenantId ?? ""}
            onChange={() => setClientError(null)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
          >
            <option value="" disabled>
              Choose a tenant
            </option>
            {tenants.map((tenant) => (
              <option key={tenant.tenantId} value={tenant.tenantId}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
          {isEditMode ? "Save changes" : "Create organization"}
        </Button>
      </div>
    </form>
  );
};

export default SaveOrganizationForm;
