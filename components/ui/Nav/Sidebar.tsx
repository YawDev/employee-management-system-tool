"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBuilding,
  IconBuildingCommunity,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";
import Brand from "@/components/ui/Brand";
import { initials, type CurrentUser } from "@/lib/session";

const links = [
  { href: "/", label: "Overview", icon: IconLayoutDashboard },
  { href: "/tenants", label: "Tenants", icon: IconBuildingCommunity },
  { href: "/organizations", label: "Organizations", icon: IconBuilding },
];

export default function Sidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between bg-navy-900 px-3 py-5">
      <div>
        <div className="mb-6 px-2">
          <Brand />
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
                  active
                    ? "bg-navy-800 text-white"
                    : "text-navy-200 hover:bg-navy-800/50 hover:text-white"
                }`}
              >
                <link.icon size={18} stroke={1.75} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 border-t border-navy-800 px-2 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-medium text-white">
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-white">{user.name}</p>
          <p className="text-xs text-navy-400">System admin</p>
        </div>
        {/* TODO: call the BFF logout endpoint. */}
        <button
          type="button"
          aria-label="Sign out"
          className="text-navy-400 hover:text-white"
        >
          <IconLogout size={18} stroke={1.75} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
