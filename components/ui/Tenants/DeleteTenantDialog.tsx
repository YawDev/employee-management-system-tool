"use client";

import { useState } from "react";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function DeleteTenantDialog({ tenantName }: { tenantName: string }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  function close() {
    setOpen(false);
    setConfirmation("");
  }

  function handleDelete() {
    // TODO: call the delete-tenant Server Action, then redirect to /tenants.
    close();
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
            aria-labelledby="delete-tenant-title"
            className="w-full max-w-md rounded-xl bg-white p-6"
          >
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                <IconAlertTriangle size={18} className="text-red-700" aria-hidden="true" />
              </div>
              <div>
                <h2 id="delete-tenant-title" className="text-base font-medium text-navy-900">
                  Delete {tenantName}?
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  This permanently deletes the tenant and everything under it. This can&apos;t be undone.
                </p>
              </div>
            </div>

            <p className="my-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800">
              Also deletes all of its organizations, departments, managers and employees.
            </p>

            <TextField
              id="delete-confirmation"
              label={`Type ${tenantName} to confirm`}
              autoComplete="off"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={confirmation !== tenantName}
                onClick={handleDelete}
              >
                Delete tenant
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
