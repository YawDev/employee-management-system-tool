import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "dangerOutline";

const variants: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800",
  secondary: "border border-slate-300 bg-white text-navy-900 hover:bg-slate-50",
  danger: "bg-red-700 text-white hover:bg-red-800",
  dangerOutline: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
};

// Also used to style <Link>s that should look like buttons.
export function buttonClasses(variant: Variant = "primary") {
  return `inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
};

export default function Button({
  variant = "primary",
  loading = false,
  loadingText,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`${buttonClasses(variant)} ${className}`}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
