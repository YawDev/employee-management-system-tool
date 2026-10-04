import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-500">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1">
          {index > 0 && <IconChevronRight size={12} aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href} className="text-navy-500 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
