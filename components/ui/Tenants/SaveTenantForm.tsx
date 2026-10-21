"use client";

import Link from "next/link";
import {
  useActionState,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  createTenantAction,
  updateTenantAction,
  type SaveTenantState,
} from "@/app/(dashboard)/tenants/actions";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Button, { buttonClasses } from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import type { Tenant } from "@/types/types";

const SaveTenantForm = ({ tenant }: { tenant?: Tenant }) => {
  const isEditMode = !!tenant;
  const fileInput = useRef<HTMLInputElement>(null);
  // Only the filename is kept for now; the file itself goes to storage later.
  const [logo, setLogo] = useState<string | null>(tenant?.logo ?? null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setLogo(file.name);
  }

  function removeLogo() {
    setLogo(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  const initialState: SaveTenantState = { error: null };

  // Mode is fixed for the life of the form, so picking the action here is safe.
  const [state, formAction, pending] = useActionState(
    isEditMode ? updateTenantAction : createTenantAction,
    initialState,
  );

  // Same as the login form: only block submission when the client check fails;
  // otherwise let the form post to the Server Action.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError(null);
    const name = String(
      new FormData(event.currentTarget).get("name") ?? "",
    ).trim();

    if (!name) {
      event.preventDefault();
      setClientError("Enter a tenant name.");
    }
  }

  const error = clientError ?? state.error;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-slate-200 bg-white p-5"
    >
      <TextField
        id="tenantName"
        name="name"
        label="Name"
        placeholder="Acme Corp"
        defaultValue={state.name ?? tenant?.name}
        onChange={() => setClientError(null)}
      />
      {isEditMode && (
        <input type="hidden" name="tenantId" value={tenant.tenantId} />
      )}
      {/* The action receives the filename only; the file input itself isn't submitted. */}
      <input type="hidden" name="logo" value={logo ?? ""} />

      <div className="mt-5">
        <p className="mb-1.5 text-xs font-medium text-slate-700">
          Logo <span className="font-normal text-slate-400">· optional</span>
        </p>
        <input
          id="logo"
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          aria-label="Logo file"
          className="sr-only"
          onChange={handleLogoChange}
        />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInput.current?.click()}
          >
            <IconUpload size={16} aria-hidden="true" />
            {logo ? "Replace" : "Upload logo"}
          </Button>
          {logo ? (
            <span className="flex min-w-0 items-center gap-1.5 text-sm text-navy-900">
              <IconPhoto
                size={16}
                className="shrink-0 text-slate-500"
                aria-hidden="true"
              />
              <span className="truncate">{logo}</span>
              <button
                type="button"
                onClick={removeLogo}
                aria-label="Remove logo"
                className="text-slate-400 hover:text-navy-900"
              >
                <IconX size={14} aria-hidden="true" />
              </button>
            </span>
          ) : (
            <span className="text-sm text-slate-400">No file chosen</span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-slate-400">PNG, JPG or SVG</p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Link
          href={tenant ? `/tenants/${tenant.tenantId}` : "/tenants"}
          className={buttonClasses("secondary")}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          loading={pending}
          loadingText={isEditMode ? "Saving…" : "Creating…"}
        >
          {isEditMode ? "Save changes" : "Create tenant"}
        </Button>
      </div>
    </form>
  );
};

export default SaveTenantForm;
