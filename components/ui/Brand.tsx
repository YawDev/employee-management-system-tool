import { IconShieldLock } from "@tabler/icons-react";

export default function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800">
        <IconShieldLock
          size={18}
          stroke={1.75}
          className="text-navy-300"
          aria-hidden="true"
        />
      </div>
      <span
        className={`text-[15px] font-medium ${dark ? "text-navy-900" : "text-white"}`}
      >
        EMT Admin
      </span>
    </div>
  );
}
