import { IconPlus } from "@tabler/icons-react";

export default function AddTenantBtn() {
  return (
    <button
      type="button"
      className="flex h-9 items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 text-sm font-medium text-white hover:bg-navy-800"
    >
      <IconPlus size={16} stroke={2} aria-hidden="true" />
      New tenant
    </button>
  );
}
