"use client";

import { useActionState, useState } from "react";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import {
  deleteOrganizationAction,
  type DeleteOrganizationState,
} from "@/app/(dashboard)/organizations/actions";

const initialState: DeleteOrganizationState = { error: null };

export default function DeleteOrganizationDialog({
  organizationId,
  organizationName,
  tenantId,
}: {
  organizationId: number;
  organizationName: string;
  tenantId: number;
}) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  // On success the action redirects to /organizations, so only the error path comes back here.
  const [state, formAction, pending] = useActionState(
    deleteOrganizationAction,
    initialState,
  );

  function close() {
    setOpen(false);
    setConfirmation("");
  }

  return (
    <>
      <Button variant="dangerOutline" onClick={() => setOpen(true)}>
        <IconTrash size={16} aria-hidden="true" />
        Delete
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/55 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-organization-title"
            className="w-full max-w-md rounded-xl bg-white p-6"
          >
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                <IconAlertTriangle
                  size={18}
                  className="text-red-700"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2
                  id="delete-organization-title"
                  className="text-base font-medium text-navy-900"
                >
                  Delete {organizationName}?
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  This permanently deletes the organization. This can&apos;t be
                  undone.
                </p>
              </div>
            </div>

            <p className="my-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800">
              An organization that still has departments can&apos;t be deleted.
              Delete or move its departments first.
            </p>

            <form action={formAction}>
              <input
                type="hidden"
                name="organizationId"
                value={organizationId}
              />
              {/* Used to refresh the tenant's page after the delete. */}
              <input type="hidden" name="tenantId" value={tenantId} />
              <TextField
                id="delete-confirmation"
                label={`Type ${organizationName} to confirm`}
                autoComplete="off"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />

              {state.error && (
                <p
                  role="alert"
                  className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  {state.error}
                </p>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={close}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  disabled={confirmation !== organizationName}
                  loading={pending}
                  loadingText="Deleting…"
                >
                  Delete organization
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
