"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Button, { buttonClasses } from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import type { Tenant } from "@/types/types";

const SaveTenantForm = ({ tenant }: { tenant?: Tenant }) => {
  const isEditMode = !!tenant;
  const fileInput = useRef<HTMLInputElement>(null);
  // Only the filename is kept for now; the file itself goes to storage later.
  const [logo, setLogo] = useState<string | null>(tenant?.logo ?? null);
  const [error, setError] = useState<string | null>(null);

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setLogo(file.name);
  }

  function removeLogo() {
    setLogo(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();

    if (!name) {
      setError("Enter a tenant name.");
      return;
    }

    // TODO: call the create-tenant / edit-tenant Server Action with { name, logo }.
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-slate-200 bg-white p-5"
    >
      <TextField
        id="name"
        name="name"
        label="Name"
        placeholder="Acme Corp"
        defaultValue={tenant?.name}
        onChange={() => setError(null)}
      />
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="mt-5">
        <p className="mb-1.5 text-xs font-medium text-slate-700">
          Logo <span className="font-normal text-slate-400">· optional</span>
        </p>
        <input
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
              <IconPhoto size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
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

      <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Link
          href={tenant ? `/tenants/${tenant.tenantId}` : "/tenants"}
          className={buttonClasses("secondary")}
        >
          Cancel
        </Link>
        <Button type="submit">{isEditMode ? "Save changes" : "Create tenant"}</Button>
      </div>
    </form>
  );
};

export default SaveTenantForm;
