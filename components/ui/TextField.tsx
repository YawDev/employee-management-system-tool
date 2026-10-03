import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  labelAction?: ReactNode;
  trailing?: ReactNode;
};

export default function TextField({
  label,
  id,
  labelAction,
  trailing,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-slate-700">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="flex h-10 items-center rounded-lg border border-slate-300 bg-white transition-colors focus-within:border-navy-600 focus-within:ring-1 focus-within:ring-navy-600">
        <input
          id={id}
          className="h-full w-full rounded-lg bg-transparent px-3 text-sm text-navy-900 outline-none placeholder:text-slate-400"
          {...props}
        />
        {trailing}
      </div>
    </div>
  );
}
